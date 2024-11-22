import { useState } from 'react'
import styles from "./styles.module.scss";
import Header from '../../providers/layout/header.jsx';

import { Formik, Form, Field, ErrorMessage } from 'formik';


function Register() {
  return (
    <>
    <Header />
    <div className={styles.container}>
        <div className={styles.formField}>
            <div className={styles.header}>
                <h1>TINCO</h1>
                <h4>АВТОРИЗАЦИЯ</h4>
            </div>

            <Formik
       initialValues={{ email: '', password: '' }}
       validate={values => {
         const errors = {};
         if (!values.email) {
           errors.email = 'Required';
         } else if (
           !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
         ) {
           errors.email = 'Invalid email address';
         }
         return errors;
       }}
       onSubmit={(values, { setSubmitting }) => {
         setTimeout(() => {
           alert(JSON.stringify(values, null, 2));
           setSubmitting(false);
         }, 400);
       }}
     >
       {({ isSubmitting }) => (
         <Form className={styles.form}>
           <Field type="email" name="email" placeholder="Email" className={styles.input}/>
           <ErrorMessage name="email" component="div" className={styles.inputError}/>
           <Field type="password" name="password" placeholder="Password" className={styles.input}/>
           <ErrorMessage name="password" component="div" className={styles.inputError}/>
           <button type="submit" disabled={isSubmitting} className={styles.formSubmit}>
             Submit
           </button>
         </Form>
       )}
     </Formik>
        </div>
    </div>
  </>
  )
}

export default Register
