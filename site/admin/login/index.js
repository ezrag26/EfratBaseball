import React from 'react'
import ReactDOM from 'react-dom'
import LoginForm from '../../login'
import Header from "../../Header";

const Login = () => {

  return (
    <>
      <Header />
      <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '2rem' }}>
        <LoginForm options={{ passwordReset: true, noAccount: false }}/>
      </div>
    </>
  )
}

ReactDOM.render(<Login />, document.querySelector('#root'))