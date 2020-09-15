import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { FormRow, Input } from '../helpers/form'
import NonAdminHeader from "../NonAdminHeader";
import validator from 'validator'
import { Center, Stack } from "../helpers/Typography";

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const validForm = () => validator.isEmail(email) && (password.length >= 5)

  return (
    <>
      <NonAdminHeader />
      <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '2em' }}>
        <form method={'POST'} action={'/login'}>
          <Center>
            <Stack.Small>
              <h1>Login</h1>
            </Stack.Small>
          </Center>

          <FormRow>
            <Input type={'text'} name={'email'} placeHolder={'Email'} value={email} onChange={setEmail} autofocus={true}/>
          </FormRow>
          <FormRow>
            <Input type={'password'} name={'password'} placeHolder={'Password'} value={password} onChange={setPassword}/>
          </FormRow>

          <Stack.Medium>
            <input className={`form-button ${!validForm() ? 'invalid-form' : ''}`} type={'submit'} value={'Login'} disabled={!validForm()}/>
          </Stack.Medium>

          <p><a href={'/reset-password'}>Forgot password?</a></p>
          <p>Don't have an account? <a href={'/register'}>Register</a></p>
        </form>
      </div>
    </>
  )
}

ReactDOM.render(<Login />, document.querySelector('#root'))