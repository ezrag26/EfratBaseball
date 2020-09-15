import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import AdminHeader from "../AdminHeader";
import { FormRow, Input } from "../../helpers/form"
import validator from "validator";
import { Center, Stack } from "../../helpers/Typography";

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const validForm = () => email && validator.isEmail(email) && password.length >= 5

  return (
    <>
      <AdminHeader />

      <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '2rem' }}>
        <form method={'POST'} action={'/admin/login'}>
          <Center>
            <Stack.Small>
              <h1>Admin Login</h1>
            </Stack.Small>
          </Center>

          <FormRow>
            <Input type={'email'} name={'email'} placeHolder={'Email'} value={email} onChange={setEmail} autofocus={true}/>
          </FormRow>
          <FormRow>
            <Input type={'password'} name={'password'} placeHolder={'Password'} value={password} onChange={setPassword}/>
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