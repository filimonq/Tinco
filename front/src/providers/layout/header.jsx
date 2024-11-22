import { useState } from 'react'
import { Link, Outlet } from "react-router-dom";

import styles from "./styles.module.scss";

import Logo from "../../assets/logo/Logo";

function Header() {
  return (
    <>
        <div className={styles.container}>
            <div className={styles.logo}>
                <Logo size="sm"/>
                <h1>Tinco</h1>
            </div>

            <div className={styles.content}>
                <div className={styles.menu}>
                    <Link to="/">Home</Link>
                    <Link to="/about">Login</Link>
                    <Link to="/register">BLYA YA HZ MB CHET ESHE</Link>
                </div>
                <div className={styles.personal}>
                    
                </div>
            </div>
        </div>
        <div className={styles.outlet}>
            <Outlet />
        </div>
    </>
  )
}

export default Header