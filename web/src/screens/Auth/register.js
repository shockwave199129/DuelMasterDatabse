"use client"
import useForm from "@/form/useForm"
import validate from "@/form/RegisterFormValidationRules"
import { useEffect, useState } from "react"
import Swal from "sweetalert2";

import Api from "@/shared/api";

export default function Register(porps) {
    const {
        handleChange,
        handleSubmit,
        values,
        errors,
    } = useForm(submitLoginForm, validate, {
        'user_name': "",
        'email': '',
        'password': '',
        'confime_password': ''
    })

    async function submitLoginForm(values) {
        debugger
        const registerData = await Api().validatePost('register', values);
        if (registerData) {
            Swal.fire({
                text: 'Register done',
                confirmButtonText: 'OK',
            }).then(() => {
                porps.tabfunc('login')
            });
        }
    }

    const [showPass, setShowPass] = useState(false)

    return (
        <>
            <div className="tab-pane fade show active">
                <form style={{ fontSize: "14px" }} onSubmit={e => { handleSubmit(e) }}>

                    <div className="form-outline mb-2">
                        <label className="form-label" htmlFor="loginName">Username</label>
                        <input type="text" name="user_name" onChange={e => { handleChange(e) }}
                            defaultValue={values.user_name} className="form-control" />
                        {errors.user_name && (
                            <p className="small text-danger mb-1">{errors.user_name}</p>
                        )}
                    </div>

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
                    <div className="form-outline mb-2">
                        <label className="form-label" htmlFor="loginPassword">Confirm Password</label>
                        <input type={showPass ? 'text' : 'password'} autoComplete="false"
                            defaultValue={values.confime_password} name="confime_password" onChange={e => { handleChange(e) }} className="form-control" />
                        {errors.confime_password && (
                            <p className="small text-danger mb-1">{errors.confime_password}</p>
                        )}
                    </div>

                    <div className="row mb-2">
                        <div className="col-md-12 d-flex justify-content-around">
                            <div className="form-check mb-3 mb-md-0">
                                <input className="form-check-input" type="checkbox" value="" onChange={e => { setShowPass(!showPass) }} name="showPass" />
                                <label className="form-check-label" htmlFor="loginCheck"> Show Password </label>
                            </div>
                            {/* <div className="form-check mb-3 mb-md-0">
                                <input className="form-check-input" type="checkbox" value={true} onChange={e => { handleChange(e) }}
                                    name="remember" defaultChecked />
                                <label className="form-check-label" htmlFor="loginCheck"> Remember me </label>
                            </div> */}
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary btn-block mb-2">Register</button>

                    <div className="text-center">
                        <p>Already have account? <a href="" onClick={e => { e.preventDefault(), porps.tabfunc('login') }}>Login</a></p>
                    </div>
                </form>
            </div>
        </>
    )
}