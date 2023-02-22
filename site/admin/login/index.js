import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import AdminHeader from "../AdminHeader";
import BasePageHeader from '../../BasePageHeader'
import { FormRow, Input } from "../../helpers/form"
import validator from "validator";
import { Center, Stack } from "../../helpers/Typography";
import { baseUrl } from '../../helpers/api'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const validForm = () => email && validator.isEmail(email) && password.length >= 5

  return (
    <>
      <AdminHeader />

      <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '2rem' }}>
        <form method={'POST'} action={`${baseUrl}/admin/login`}>
          <BasePageHeader title={'Admin Login'} />

          <FormRow>
            <Input type={'email'} name={'email'} placeholder={'Email'} value={email} onChange={setEmail} autofocus={true}/>
          </FormRow>
          <FormRow>
            <Input type={'password'} name={'password'} placeholder={'Password'} value={password} onChange={setPassword}/>
          </FormRow>

          <Stack.Medium>
            <input className={`form-button ${!validForm() ? 'invalid-form' : ''}`} type={'submit'} value={'Login'} disabled={!validForm()}/>
          </Stack.Medium>

          <p><a href={'/reset-password'}>Forgot password?</a></p>
        </form>
      </div>
    </>
  )
}

ReactDOM.render(<Login />, document.querySelector('#root'))
