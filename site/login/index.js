import React from 'react'
import ReactDOM from 'react-dom'
import Header from "../Header";

const Login = () => {
  return (
    <>
      <Header />
      <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '2em' }}>
        <form>
          <input type={'email'} name={'email'} placeholder={'Email'}/>
          <input type={'password'} name={'password'} placeholder={'Password'}/>
          <input className={'form-button'} type={'submit'} value={'Login'}/>
          <p>Don't have an account? <a href={'/register'}>Register</a></p>
        </form>
      </div>
    </>
  )
}

ReactDOM.render(<Login />, document.querySelector('#root'))