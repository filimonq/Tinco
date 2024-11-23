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
                    <Link to="/login">Login</Link>
                    <Link to="/register">Singin</Link>
                    <Link to="/profile">Личный кабинет</Link>
                </div>
                <div className={styles.personal}>
                </div>
            </div>
        </div>
        <Outlet/>
    </>
  )
}

export default Header
