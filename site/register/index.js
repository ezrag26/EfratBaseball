import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import NonAdminHeader from "../NonAdminHeader";
import { FormRow, Input, DropDown } from '../helpers/form'
import { XMLHttpRequestAsPromise, fetchPostJson } from '../helpers/request'
import validator from 'validator';

const send = ({ body }) => {
  return fetchPostJson({
    url: '/register',
    body
  })
    // return XMLHttpRequestAsPromise({
    //   method: 'POST',
    //   url: '/register',
    //   options: {
    //     body: {
    //       "first-name": first,
    //       "last-name": last,
    //       email,
    //       carrier,
    //       phone,
    //       password
    //     },
    //     contentType: "application/json",
    //     responseType: 'json'
    //   }
    // })
}

const Register = () => {
  const [first, setFirst] = useState('')
  const [last, setLast] = useState('')
  const [email, setEmail] = useState('')
  const [carrier, setCarrier] = useState('050')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [processed, setProcessed] = useState(false)

  const validForm = () => {
    return first &&
    last &&
    email && validator.isEmail(email) &&
    carrier &&
    phone &&
    password && password.length >= 5 && confirmPassword === password
  }

  const onSubmit = e => {
    e.preventDefault()

    // if (!validForm()) return

    return send({
      body: {
        "first-name": first,
        "last-name": last,
        email,
        carrier,
        phone,
        password
      }
    })
      .then(res => {
        console.log('here')
        setProcessed(true)
      })
      .catch(err => {
      })
  }

  const keyPress = e => {
    if (e.code === 'Enter') return onSubmit(e)
  }

  const registerMessage = () => {
    return (
      <>
        <p>Your information has been successfully received.</p>
        <p>Please follow the instructions in the email that we have sent to <span style={{ fontWeight: 'bold' }}>{email}</span> in order to complete your registration</p>
      </>
    )
  }

  return processed ? registerMessage() : (
    <>
      <NonAdminHeader />
      <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '2em' }}>
        <form onSubmit={onSubmit} onKeyPress={keyPress}>
          <h1 style={{ textAlign: 'center' }}>Register</h1>

          <FormRow>
            <Input type={'text'} name={'first-name'} placeHolder={'First Name'} value={first} onChange={setFirst}/>
            <Input type={'text'} name={'last-name'} placeHolder={'Last Name'} value={last} onChange={setLast}/>
          </FormRow>

          <FormRow>
            <Input type={'text'} name={'email'} placeHolder={'Email'} value={email} onChange={setEmail}/>
          </FormRow>

          <FormRow>
            <DropDown items={['050', '051', '052', '053', '054', '055', '058']} value={carrier} onChange={setCarrier}/>
            <Input type={'text'} name={'phone'} placeHolder={'Phone Number'} value={phone} onChange={setPhone}/>
          </FormRow>

          <FormRow>
            <Input type={'password'} name={'password'} placeHolder={'Password'} value={password} onChange={setPassword}/>
            <Input type={'password'} name={'confirm-password'} placeHolder={'Confirm Password'} value={confirmPassword} onChange={setConfirmPassword}/>
          </FormRow>

          <input className={`form-button ${!validForm() ? 'invalid-form' : ''}`} type={'submit'} value={'Register'} disabled={!validForm()}/>
          <p>Already have an account? <a href={'/login'}>Login</a></p>
        </form>
      </div>
    </>
  )
}

ReactDOM.render(<Register />, document.querySelector('#root'))