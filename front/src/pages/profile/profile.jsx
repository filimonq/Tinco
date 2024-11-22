import { useState } from 'react'
import styles from "./styles.module.scss";
import Header from '../../providers/layout/header.jsx';

function Profile() {
  return (
    <>
      <Header/>
      <div className={styles.conteiner}>
        <button>help</button>
      </div>
    </>
  )
}
export default Profile
