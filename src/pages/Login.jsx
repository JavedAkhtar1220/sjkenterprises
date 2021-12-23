import React from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom'
import { auth, signInWithEmailAndPassword } from '../config/firebase';
import swal from 'sweetalert';

import '../App.css';

const Login = () => {

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const [btnDis, setBtnDis] = React.useState(false);
    const navigate = useNavigate();

    const onSubmit = (data) => {
        setBtnDis(true);
        signInWithEmailAndPassword(auth, data.email, data.password)
            .then(() => {
                navigate('/');
            })
            .catch(err => {
                setBtnDis(false);
                swal("Error!", err.code + "!", "error");
            })
    }

    return (
        <div className="container-sm">
            <div className="row" style={{ marginTop: '100px' }}>
                <div className="col-lg-6 col-md-8 col-sm-10 col-10 mx-auto border rounded shadow p-4">
                    <h2 className="text-center fw-bold">Login</h2>
                    <form className="mt-5" onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-3">
                            <TextField
                                label="Email"
                                variant="outlined"
                                className="form-control"
                                error={errors.email}
                                {...register('email', { required: true })}
                            />
                            {errors.email && <p className="small text-danger">Email address is required.</p>}
                        </div>
                        <div className="mb-3">
                            <TextField
                                label="Password"
                                variant="outlined"
                                className="form-control"
                                type="password"
                                error={errors.password}
                                {...register('password', { required: true })}
                            />
                            {errors.password && <p className="small text-danger">Password is required.</p>}
                        </div>

                        {btnDis ? <LoadingButton loading fullWidth loadingIndicator="Loging..." variant="outlined">
                            Fetch data
                        </LoadingButton> : <Button size="large" type="submit" fullWidth variant="contained">Login</Button>}

                        <p className="text-end my-3">Don't have account? <Link to="/signup">Sign up here!</Link></p>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login;
