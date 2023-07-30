"use client"
import { useState, useEffect } from "react";

import Login from "./login";
import Register from "./register";
import TopNav from "@/shared/topNav";
import Footers from "@/shared/footer";

export default function LoginAndRegister() {

    const [formView, setformView] = useState('login');


    return (
        <>
            <TopNav />
            <section className="inner-page" style={{ paddingTop: "71px", minHeight: "calc(100vh - 81px)" }}>
                <div className="container">
                    <div className="d-flex justify-content-center pt-4">
                        <div className="col-md-5 col-10">
                            <div className="card">
                                <div className="card-body">
                                    <div className="card-title">
                                        <ul className="nav nav-pills nav-justified mb-3" id="ex1" role="tablist">
                                            <li className="nav-item" role="presentation">
                                                <a className={`nav-link ${formView == 'login' ? 'active' : ''}`}
                                                    onClick={e => { e.preventDefault(), setformView('login') }} href="">Login</a>
                                            </li>
                                            <li className="nav-item" role="presentation">
                                                <a className={`nav-link ${formView == 'register' ? 'active' : ''}`}
                                                    onClick={e => { e.preventDefault(), setformView('register') }} href="">Register</a>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="tab-content">
                                        {formView == 'login' && <Login tabfunc={setformView}/>}
                                        {formView == 'register' && <Register tabfunc={setformView}/>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footers />
        </>
    )

}