import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import Tooltip from '@mui/material/Tooltip';
import Skeleton from '@mui/material/Skeleton';
import { auth, onAuthStateChanged, signOut, db, addDoc, getDocs, collection, query, where } from '../config/firebase';
import LogoutIcon from '@mui/icons-material/Logout';
import swal from 'sweetalert';
import Barcode from 'react-barcode';
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

const Home = () => {

    const [userId, setUserId] = React.useState("");
    const [loadToday, setLoadToday] = React.useState(0);
    const [loadMonth, setLoadMonth] = React.useState(0);
    const [loadYear, setLoadYear] = React.useState(0);
    const [openPT, setOpenPT] = React.useState(false);
    const [openAsin, setOpenAsin] = React.useState(false);
    const [loader, setLoader] = React.useState(false);
    const [inpSearch, setInpSearch] = React.useState("");
    const [form, setForm] = React.useState(false);
    const [loading, setLoading] = React.useState(true);
    const [searchRecord, setSearchRecord] = React.useState([]);
    const [lastLoad, setLastLoad] = React.useState();
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

    const getRecord = async (data) => {

        const date = new Date();

        const year = date.getFullYear();

        const month = (date.getMonth() + 1) + '/' + year;

        const day = date.toLocaleDateString();

        const q1 = query(collection(db, "lots"), where("userId", "==", data), where("day", "==", day));

        const q2 = query(collection(db, "lots"), where("userId", "==", data), where("month", "==", month));

        const q3 = query(collection(db, "lots"), where("userId", "==", data), where("year", "==", year));

        const querySnapshot1 = await getDocs(q1);

        const querySnapshot2 = await getDocs(q2);

        const querySnapshot3 = await getDocs(q3);


        var count1 = 0;
        var count2 = 0;
        var count3 = 0;

        querySnapshot1.forEach(() => {
            count1++;
        })

        querySnapshot2.forEach(() => {
            count2++;
        })

        querySnapshot3.forEach((doc) => {
            setLastLoad(doc.data().time);
            count3++;
        })

        setLoadToday(count1);
        setLoadMonth(count2);
        setLoadYear(count3);

        setLoading(false);

    }

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {

                var promise = new Promise((resolve, reject) => {
                    setUserId(user.uid);
                    resolve(user.uid);
                })

                promise.then(data => {
                    getRecord(data);
                })

            } else {
                navigate('/login');
            }
        });
    }, [navigate])

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

    const BtnLoad = () => {

        const date = new Date();

        const date2 = new Date(2001, 10, 30);

        var milli = date.getTime() - date2.getTime();

        var y = milli / (1000 * 365 * 24 * 60 * 60);

        console.log(y);


        const time = date.toLocaleTimeString();

        const year = date.getFullYear();

        const month = (date.getMonth() + 1) + '/' + year;

        const day = date.toLocaleDateString();

        if (inpSearch === "") {
            alert("Please Search something to complete lot");
        }
        else if (searchRecord.length === 0) {
            alert("Please Search something to complete lot");
        } else {
            setLoading(true);

            addDoc(collection(db, 'lots'), {
                userId,
                time,
                month,
                day,
                year,
            })
                .then(() => {
                    setLoading(false);
                    setInpSearch("");
                    setForm(false);

                    setLoadToday(loadToday + 1);
                    setLoadMonth(loadMonth + 1);
                    setLoadYear(loadYear + 1);
                    setLastLoad(time);
                })
        }

    }

    return (
        <div className="container mt-5">

            {loading ? <div className='loader'>
                <Loader
                    type="ThreeDots"
                    color="#00BFFF"
                    height={100}
                    width={100}
                />
            </div>
                : null}



            <div className='row align-items-center'>
                <div className="col-lg-6 col-md-12 col-sm-12 col-12">
                    <p className='mb-0 small text-center'>LOTS TODAY</p>
                    <p className='result-box'>
                        {loadToday}
                    </p>
                </div>
                <div className="col-lg-2 col-md-4 col-sm-4 col-4">
                    <p className='mb-0 small text-center'>LOTS THIS MONTH</p>
                    <p className='result-box'>
                        {loadMonth}
                    </p>
                </div>
                <div className="col-lg-2 col-md-4 col-sm-4 col-4">
                    <p className='mb-0 small text-center'>LOTS THIS YEAR</p>
                    <p className='result-box'>
                        {loadYear}
                    </p>
                </div>
                <div className="col-lg-2 col-md-4 col-sm-4 col-4">
                    <Button variant="contained" color="primary" onClick={BtnLoad}>
                        lot Complete
                    </Button>
                </div>
            </div>
            <div>
                <p className='small'>Last Lot Complete: {lastLoad}</p>
            </div>
            <div className='mb-4'>
                <Button variant="contained" className='mx-2' onClick={gotoUpload} color="primary">
                    Upload CSV
                </Button>
                <Button variant="contained" className='mx-2' onClick={onLogout} color="error" startIcon={<LogoutIcon />}>
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


                {form ? searchRecord.length === 0 ? <p className='text-center my-5'>No record found</p> : searchRecord.map((v, i) => {

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
                            <a href={"https://www.amazon.com/dp/" + v.asin} rel="noreferrer" target="_blank">Click here to redirect Amazon</a>
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
