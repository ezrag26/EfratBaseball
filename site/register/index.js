import React from 'react'
import ReactDOM from 'react-dom'
import Header from "../Header";

const Register = () => {
  return (
    <>
      <Header />
      <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '2em' }}>
        <form>
          <input type={'text'} name={'first-name'} placeholder={'First Name'}/>
          <input type={'text'} name={'last-name'} placeholder={'Last Name'}/>
          <input type={'email'} name={'email'} placeholder={'Email'}/>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <select name={'carrier'} id={'carrier'} style={{ backgroundColor: 'white', fontSize: '1.5rem', width: 'auto', height: 'auto', marginBottom: 'auto', marginRight: '10px' }}>
              <option value={'050'}>050</option>
              <option value={'051'}>051</option>
              <option value={'052'}>052</option>
              <option value={'053'}>053</option>
              <option value={'054'}>054</option>
              <option value={'055'}>055</option>
              <option value={'058'}>058</option>
            </select>
            <input type={'number'} name={'phone'} placeholder={'5558184'} min={'0'} max={'9999999'} style={{ marginRight: 'auto', width: '100%' }}/>
          </div>
          <input type={'password'} name={'password'} placeholder={'Password'}/>
          <input className={'form-button'} type={'submit'} value={'Register'}/>
          <p>Already have an account? <a href={'/login'}>Login</a></p>
        </form>
      </div>
    </>
  )
}

ReactDOM.render(<Register />, document.querySelector('#root'))