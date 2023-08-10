"use client"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react";
import Cookies from "universal-cookie";

import Api from "@/shared/api";

export default function TopNav() {
    const { push, refresh } = useRouter();
    const pathName = usePathname();
    const cookies = new Cookies();

    const [loginUser, setLoginUser] = useState('User');
    const [isUserPresent, setIsUserPresent] = useState(false);

    useEffect(() => {
        if (window.scrollY > 100) {
            document.querySelector('#header').classList.add('header-scrolled')
        } else {
            document.querySelector('#header').classList.remove('header-scrolled')
        }

        document.addEventListener("scroll", () => {
            if (window.scrollY > 100) {
                document.querySelector('#header').classList.add('header-scrolled')
            } else {
                document.querySelector('#header').classList.remove('header-scrolled')
            }
        });

        document.querySelector('.mobile-nav-toggle').addEventListener('click', () => {
            document.querySelector('#navbar').classList.toggle('navbar-mobile')
            document.querySelector('.mobile-nav-toggle').classList.toggle('bi-list')
            document.querySelector('.mobile-nav-toggle').classList.toggle('bi-x')
        })

        document.querySelectorAll('.navbar .dropdown > a').forEach(elm => elm.addEventListener('click', (e) => {
            if (document.querySelector('#navbar').classList.contains('navbar-mobile')) {
                e.preventDefault()
                elm.nextElementSibling.classList.toggle('dropdown-active')
            }
        }))

        var loginToken = cookies.get('dm_a_token');
        var userInfo = cookies.get('dm_users');
        if (typeof loginToken != 'undefined') {
            if (typeof userInfo == 'undefined') {
                saveUserData().then(() => {
                    userInfo = cookies.get('dm_users');
                    setLoginUser(userInfo.user_name);
                })
            } else {
                setLoginUser(userInfo.user_name);
            }
            setIsUserPresent(true);
        }
    }, []);

    async function saveUserData() {
        try {
            const userData = await Api().get('user-details');
            const currentDate = new Date();
            const futureDate = new Date();
            futureDate.setDate(currentDate.getDate() + 8);
            cookies.set('dm_users', userData.data, { expires: futureDate })
            return Promise.resolve();
        } catch (error) {
            console.error(error);
            return Promise.reject(error);
        }
    }

    function handelLogout(event) {
        event.preventDefault();
        cookies.remove('dm_a_token');
        cookies.remove('dm_users');
        location.reload()
    }

    return (
        <>
            <header id="header" className={`fixed-top ${pathName != '/' ? 'header-inner-pages' : ''}`} >
                <div className="container d-flex align-items-center">

                    <h1 className="logo me-auto"><a href="/">Duel Masters</a></h1>

                    <nav id="navbar" className="navbar">
                        <ul>
                            <li><a className={`nav-link scrollto ${pathName == '/' ? 'active' : ''}`} href="/">Home</a></li>
                            <li><a className={`nav-link scrollto ${pathName == '/search' ? 'active' : ''}`} href="/search">Search</a></li>
                            <li><a className={`nav-link scrollto ${pathName == '/decklist' ? 'active' : ''}`} href="/decklist">Deck List</a></li>
                            <li className={`nav-link scrollto dropdown ${pathName == '/user' ? 'active' : ''}`}><a><span>{loginUser}</span> <i className="bi bi-chevron-down"></i></a>
                                <ul>
                                    {isUserPresent &&
                                        <li><a href="#" onClick={e =>{handelLogout(e)}}>Log Out</a></li>
                                    }
                                    {!isUserPresent &&
                                        <li><a href="/auth">Log In</a></li>
                                    }
                                </ul>
                            </li>
                        </ul>
                        <i className="bi bi-list mobile-nav-toggle"></i>
                    </nav>
                </div>
            </header>
        </>
    )
}