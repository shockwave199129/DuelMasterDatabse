"use client"
import useForm from "@/form/useForm"
import validate from "@/form/LoginFormValidationRules"
import Api from "@/shared/api";

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import Cookies from "universal-cookie";
import Swal from "sweetalert2";

export default function Login(porps) {

    const {
        handleChange,
        handleSubmit,
        values,
        errors,
    } = useForm(submitLoginForm, validate, {
        'email': '',
        'password': '',
        'remember': true
    })

    const { push } = useRouter();

    const cookies = new Cookies();

    async function submitLoginForm(values) {
        const loginData = await Api().validatePost('login', values);
        if (loginData) {
            const currentDate = new Date();
            const futureDate = new Date();
            futureDate.setDate(currentDate.getDate() + 8);

            cookies.set('dm_a_token', loginData.access_token, { expires: futureDate })
            Swal.fire({
                text: 'Login done',
                confirmButtonText: 'OK',
            }).then(() => {
                push('/');
            });
        }
    }

    const [showPass, setShowPass] = useState(false)

    return (
        <>
            <div className="tab-pane fade show active">
                <form style={{ fontSize: "14px" }} onSubmit={e => { handleSubmit(e) }}>
                    <div className="form-outline mb-2">
                        <label className="form-label" htmlFor="loginName">Email</label>
                        <input type="text" name="email" onChange={e => { handleChange(e) }}
                            defaultValue={values.email} className="form-control" />
                        {errors.email && (
                            <p className="small text-danger mb-1">{errors.email}</p>
                        )}
                    </div>
                    <div className="form-outline mb-2">
                        <label className="form-label" htmlFor="loginPassword">Password</label>
                        <input type={showPass ? 'text' : 'password'} autoComplete="false"
                            defaultValue={values.password} name="password" onChange={e => { handleChange(e) }} className="form-control" />
                        {errors.password && (
                            <p className="small text-danger mb-1">{errors.password}</p>
                        )}
                    </div>

                    <div className="row mb-2">
                        <div className="col-md-12 d-flex justify-content-around">
                            <div className="form-check mb-3 mb-md-0">
                                <input className="form-check-input" type="checkbox" value="" onChange={e => { setShowPass(!showPass) }} name="showPass" />
                                <label className="form-check-label" htmlFor="loginCheck"> Show Password </label>
                            </div>
                            <div className="form-check mb-3 mb-md-0">
                                <input className="form-check-input" type="checkbox" value={true} onChange={e => { handleChange(e) }}
                                    name="remember" defaultChecked />
                                <label className="form-check-label" htmlFor="loginCheck"> Remember me </label>
                            </div>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary btn-block mb-2">Sign in</button>

                    <div className="text-center">
                        <p>Not a member? <a href="" onClick={e => { e.preventDefault(), porps.tabfunc('register') }}>Register</a></p>
                    </div>
                </form>
            </div>
        </>
    )
}