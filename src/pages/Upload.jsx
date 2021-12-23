import React from 'react';
import { useNavigate } from 'react-router-dom';
// import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
// import { Link } from 'react-router-dom'
import { auth, onAuthStateChanged, db, addDoc, collection } from '../config/firebase';
import swal from 'sweetalert';
import LoadingButton from '@mui/lab/LoadingButton';
import papa from 'papaparse';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Upload = () => {

    const [disBtn, setDisBtn] = React.useState(false);

    const [data, setData] = React.useState([]);

    const navigate = useNavigate();

    const onSubmit = (e) => {

        e.preventDefault();

        setDisBtn(true);

        for (var a = 0; a < data.length; a++) {

            addDoc(collection(db, 'demo'), {
                carrier: data[a].carrier,
                disposition: data[a].disposition,
                fnsku: data[a].fnsku,
                orderId: data[a]["order-id"],
                removalOrderType: data[a]["removal-order-type"],
                requestDate: data[a]["request-date"],
                shipmentDate: data[a]["shipment-date"],
                shippedQuantity: data[a]["shipped-quantity"],
                sku: data[a].sku,
                trackingNumber: data[a]["tracking-number"],
            })
        }

        swal("Product Addedd Successfully");
        setDisBtn(false);



    }

    const handleFile = (e) => {

        const csvFilePath = e.target.files[0];

        papa.parse(csvFilePath, {
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true,
            complete(result) {
                // setData(result.data);

                console.log(data);
            }
        })

        if (e.target.files[0].type !== "application/vnd.ms-excel") {
            console.log("CSV file nae hai");
            alert("Select CSV file only");
        }
        else {

            const csvFilePath = e.target.files[0];

            papa.parse(csvFilePath, {
                header: true,
                dynamicTyping: true,
                skipEmptyLines: true,
                complete(result) {
                    setData(result.data);

                }
            })
        }
    }

    React.useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {

            } else {
                navigate('/login');
            }
        });
    })

    const gotoBack = () => {
        navigate('/')
    }

    return (
        <div className="container-sm">
            <div className="row" style={{ marginTop: '100px' }}>
                <div className="col-lg-8 col-md-8 col-sm-10 col-10 mx-auto border rounded shadow p-4">
                    <h2 className="text-center fw-bold">Add Item</h2>
                    <Button type="submit" onClick={gotoBack} startIcon={<ArrowBackIcon />} variant="contained">Back</Button>
                    <form className="mt-5" onSubmit={onSubmit}>

                        <div className="mb-3">
                            <input type="file" className='form-control' accept=".csv" onChange={handleFile} />
                        </div>
                        {disBtn ? <LoadingButton loading fullWidth loadingIndicator="Loading..." variant="outlined">
                            Fetch data
                        </LoadingButton> : <Button size="large" type="submit" fullWidth variant="contained">Add New Item</Button>}

                    </form>
                </div>
            </div>
        </div>
    )
}

export default Upload
