import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { auth, createUserWithEmailAndPassword, db, doc, setDoc, } from '../config/firebase';
import swal from 'sweetalert';

const Signup = () => {

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch
    } = useForm();
    const navigate = useNavigate();

    const password = useRef({});
    password.current = watch("password", "");

    const onSubmit = (data) => {

        createUserWithEmailAndPassword(auth, data.email, data.password)
            .then((userCredential) => {

                var userId = userCredential.user.uid;

                setDoc(doc(db, "users", userId), {
                    username: data.fullname,
                    email: data.email
                })
                    .then(() => {
                        navigate('/');
                    })

            })
            .catch(err => {
                swal("Error!", err.code + "!", "error");
            })
    }

    return (
        <div className="container">
            <div className="row" style={{ marginTop: '100px' }}>
                <div className="col-lg-6 col-md-8 col-sm-10 col-10 mx-auto border rounded shadow p-4">
                    <h2 className="text-center fw-bold">Signup</h2>
                    <form className="mt-5" onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-3">
                            <TextField
                                label="Full Name"
                                variant="outlined"
                                className="form-control"
                                error={errors.fullname}
                                {...register('fullname',
                                    {
                                        required: {
                                            value: true,
                                            message: "Full Name is required"
                                        },
                                    })}
                            />
                            {errors.fullname && <p className="small text-danger">{errors.fullname.message}</p>}

                        </div>
                        <div className="mb-3">
                            <TextField
                                label="Email"
                                variant="outlined"
                                className="form-control"
                                error={errors.email}
                                {...register('email',
                                    {
                                        required: {
                                            value: true,
                                            message: "Email Address is required"
                                        },
                                        pattern: {
                                            value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                                            message: "Invalid Email Address"
                                        }
                                    })}
                            />
                            {errors.email && <p className="small text-danger">{errors.email.message}</p>}
                        </div>
                        <div className="mb-3">
                            <TextField
                                label="Password"
                                variant="outlined"
                                className="form-control"
                                type="password"
                                error={errors.password}
                                {...register('password',
                                    {
                                        required: {
                                            value: true,
                                            message: "Password is required"
                                        }
                                    })
                                }
                            />
                            {errors.password && <p className="small text-danger">{errors.password.message}</p>}

                        </div>
                        <div className="mb-3">
                            <TextField
                                label="Confirm Password"
                                variant="outlined"
                                className="form-control"
                                type="password"
                                error={errors.confirmPassword}
                                {...register('confirmPassword', {
                                    required: {
                                        value: true,
                                        message: "Confirm Password in required"
                                    },
                                    validate: value =>
                                        value === password.current || "The passwords do not match"
                                })}
                            />
                            {errors.confirmPassword && <p className="small text-danger">{errors.confirmPassword.message}</p>}
                        </div>
                        <Button size="large" type="submit" fullWidth variant="contained">Signup</Button>
                        <p className="text-end my-3">Already have an account? <Link to="/login">login here!</Link></p>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Signup;
