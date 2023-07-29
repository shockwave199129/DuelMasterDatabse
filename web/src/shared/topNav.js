"use client"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react";

export default function TopNav() {
    const { push } = useRouter();
    const pathName = usePathname();

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

        document.querySelectorAll('.navbar .dropdown > a').forEach(e => e.addEventListener('click', () => {
            if (document.querySelector('#navbar').classList.contains('navbar-mobile')) {
                e.preventDefault()
                this.nextElementSibling.classList.toggle('dropdown-active')
            }
        }))
    }, []);

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
                            <li className={`dropdown${pathName == '/user' ? 'active' : ''}`}><a href="/user"><span>User</span> <i className="bi bi-chevron-down"></i></a>
                                <ul>
                                    <li><a href="#">Log In</a></li>
                                    <li><a href="#">Log Out</a></li>
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