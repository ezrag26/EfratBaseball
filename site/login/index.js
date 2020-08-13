import React from 'react'
import ReactDOM from 'react-dom'
import Header from "../Header";
import { onBlur, onClick } from '../helpers/form'

const Login = () => {
  return (
    <>
      <Header />
      <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '2em' }}>
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
          <p><a href={'/reset-password'}>Forgot password?</a></p>
          <p>Don't have an account? <a href={'/register'}>Register</a></p>
        </form>
      </div>
    </>
  )
}

ReactDOM.render(<Login />, document.querySelector('#root'))