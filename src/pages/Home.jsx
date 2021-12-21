import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import SearchIcon from '@mui/icons-material/Search';
import Tooltip from '@mui/material/Tooltip';
import Skeleton from '@mui/material/Skeleton';
import { auth, onAuthStateChanged, signOut, db, getDocs, collection, query, where } from '../config/firebase';
import LogoutIcon from '@mui/icons-material/Logout';
import swal from 'sweetalert';
import Barcode from 'react-barcode';

const Home = () => {

    const [openPT, setOpenPT] = React.useState(false);
    const [openAsin, setOpenAsin] = React.useState(false);
    const [loader, setLoader] = React.useState(false);
    const [inpSearch, setInpSearch] = React.useState("");
    const [form, setForm] = React.useState(false);
    const [searchRecord, setSearchRecord] = React.useState([]);
    const navigate = useNavigate();


    const handleTooltipPTClose = () => {
        setOpenPT(false);
    };

    const handleTooltipPTOpen = (i) => {
        setOpenPT(true);
        navigator.clipboard.writeText(searchRecord[i].title);
    };

    const handleTooltipAsinClose = () => {
        setOpenAsin(false);

    };

    const handleTooltipAsinOpen = (i) => {
        navigator.clipboard.writeText(searchRecord[i].asin);
        setOpenAsin(true);
    };

    const handleChange = async (e) => {

        setInpSearch(e.target.value);
        setLoader(true);

        setSearchRecord([]);

        const q = query(collection(db, "products"), where("trackingNumber", "==", e.target.value));

        const querySnapshot = await getDocs(q);

        querySnapshot.forEach(async (doc) => {

            const q2 = query(collection(db, "sku"), where("msku", "==", doc.data().sku))

            const querySnapshot2 = await getDocs(q2);

            querySnapshot2.forEach(records => {
                setSearchRecord(pre => [
                    ...pre,
                    records.data(),
                ])
            })

        });

        setLoader(false);
        setForm(true);
    }

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // ...
            } else {
                navigate('/login');
            }
        });
    }, [])

    const onLogout = () => {
        swal("Warning", "Do you want to continue", "warning")
            .then((value) => {
                if (value === true) {
                    signOut(auth)
                        .then(() => {
                            navigate('./login');
                        }).catch((error) => {
                            // An error happened.
                        });
                }
            });
    }

    const gotoUpload = () => {
        navigate('/upload');
    }

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between mb-3">
                <Button variant="contained" onClick={gotoUpload} color="primary">
                    Upload CSV
                </Button>
                <Button variant="contained" onClick={onLogout} color="error" startIcon={<LogoutIcon />}>
                    Logout
                </Button>
            </div>

            <div className="d-flex TextField-without-border-radius">
                <TextField
                    label="Search"
                    variant="outlined"
                    className="form-control"
                    type="search"
                    value={inpSearch}
                    onChange={handleChange}
                    style={{ borderTopRightRadius: "0px", borderBottomRightRadius: "0px" }}
                />
            </div>

            <div className="mt-5">


                {form ? searchRecord.length == 0 ? <p className='text-center my-5'>No record found</p> : searchRecord.map((v, i) => {
                    { var url = `https://www.amazon.com/dp/${v.asin}` }

                    return <div key={i} className="mb-5">

                        <div className="row mb-3">
                            <div className="col-lg-4 col-md-4 col-sm-12 col-12 mb-lg-0 mb-md-0 mb-sm-3 mb-3">
                                <p className="result-p">{v.msku}</p>
                            </div>
                            <div className="col-lg-4 col-md-4 col-sm-12 col-12 mb-lg-0 mb-md-0 mb-sm-3 mb-3">
                                <p className="result-p">{v.fnsku}</p>
                            </div>
                            <div className="col-lg-4 col-md-4 col-sm-12 col-12">
                                <p className="result-p">{v.title}</p>
                                <div className="text-end">
                                    <Tooltip
                                        PopperProps={{
                                            disablePortal: true,
                                        }}
                                        onClose={handleTooltipPTClose}
                                        open={openPT}

                                        disableTouchListener
                                        title="Copied"
                                    >

                                        <IconButton aria-label="filecopy" onClick={() => handleTooltipPTOpen(i)}>
                                            <FileCopyIcon />
                                        </IconButton>
                                    </Tooltip>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-6 col-md-6 col-sm-12 mb-ld-0 mb-md-0 mb-sm-3 mb-0">
                                <p className="result-p">{v.asin}</p>
                                <div className="text-end">
                                    <Tooltip
                                        PopperProps={{
                                            disablePortal: true,
                                        }}
                                        onClose={handleTooltipAsinClose}
                                        open={openAsin}

                                        disableTouchListener
                                        title="Copied"
                                    >
                                        <IconButton aria-label="filecopy" onClick={() => handleTooltipAsinOpen(i)}>
                                            <FileCopyIcon />
                                        </IconButton>
                                    </Tooltip>
                                </div>
                                <div className="mt-3">
                                    <Barcode value={v.asin} style={{ width: '100px' }} />
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12 mb-ld-0 mb-md-0 mb-sm-3 mb-0 p-5">
                                <img src={v.imageUrl} alt="product" className="img-fluid" />
                            </div>
                        </div>

                        <div className="text-center">
                            <a href={url} target="_blank">Click here to redirect Amazon</a>
                        </div>
                        <div className='text-end'>
                            <Button variant="contained" color="primary">
                                Item Loaded
                            </Button>
                        </div>
                    </div>
                }) : null}

                {loader ? <>
                    <div className="row mb-3">
                        <div className="col-lg-4 col-md-4 col-sm-12 col-12 mb-lg-0 mb-md-0 mb-sm-3 mb-3">
                            <Skeleton variant="rectangular" width="100%" style={{ borderRadius: '20px' }} height={90} />
                        </div>
                        <div className="col-lg-4 col-md-4 col-sm-12 col-12 mb-lg-0 mb-md-0 mb-sm-3 mb-3">
                            <Skeleton variant="rectangular" width="100%" style={{ borderRadius: '20px' }} height={90} />
                        </div>
                        <div className="col-lg-4 col-md-4 col-sm-12 col-12">
                            <Skeleton variant="rectangular" width="100%" style={{ borderRadius: '20px' }} height={90} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-6 col-md-6 col-sm-12 mb-ld-0 mb-md-0 mb-sm-3 mb-0">

                            <Skeleton variant="rectangular" width="100%" style={{ borderRadius: '20px' }} height={90} />


                            <div className="mt-5">
                                <Skeleton variant="rectangular" width="60%" style={{ borderRadius: '20px' }} height={90} />

                            </div>

                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-12 mb-ld-0 mb-md-0 mb-sm-3 mb-0 p-5">
                            <Skeleton variant="rectangular" width="100%" style={{ borderRadius: '20px' }} height={200} />

                        </div>
                    </div>

                    <div className="text-center">
                        <Skeleton variant="text" width="60%" className="mx-auto" />
                    </div>
                </> : null}

            </div>

        </div >
    )
}

export default Home;
