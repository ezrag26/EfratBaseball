import React from 'react'
import ReactDOM from 'react-dom'
import { onBlur, onClick } from '../helpers/form'
import NonAdminHeader from "../NonAdminHeader";

const LoginForm = ({ options }) => {
  return (
    <form>
      <div className={'input'}>
        <input type={'email'} name={'email'} onBlur={onBlur}/>
        <label className={'label'} htmlFor={'email'} onClick={onClick}>Email</label>
      </div>

      <div className={'input'}>
        <input type={'password'} name={'password'} onBlur={onBlur}/>
        <label className={'label'} htmlFor={'password'} onClick={onClick}>Password</label>
      </div>

      <input className={'form-button'} type={'submit'} value={'Login'}/>
      {options.passwordReset && <p><a href={'/reset-password'}>Forgot password?</a></p>}
      {options.noAccount && <p>Don't have an account? <a href={'/register'}>Register</a></p>}
    </form>
  )
}

const Login = () => {
  return (
    <>
      <NonAdminHeader />
      <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '2em' }}>
        <LoginForm options={{ passwordReset: true, noAccount: true }}/>
      </div>
    </>
  )
}

export default LoginForm

ReactDOM.render(<Login />, document.querySelector('#root'))