import React from 'react'
import ReactDOM from 'react-dom'
import LoginForm from '../../login'
import AdminHeader from "../AdminHeader";

const Login = () => {

  return (
    <>
      <AdminHeader />
      <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '2rem' }}>
        <LoginForm options={{ passwordReset: true, noAccount: false }}/>
      </div>
    </>
  )
}

ReactDOM.render(<Login />, document.querySelector('#root'))