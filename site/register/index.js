import React from 'react'
import ReactDOM from 'react-dom'
import Header from "../Header";
import { onBlur, onClick } from '../helpers/form'
import { randomBits } from '../helpers/unique'

const DropDown = ({ items }) => {
  return (
    <select name={'carrier'} id={'carrier'} style={{ backgroundColor: 'white', fontSize: '1.5rem', width: 'auto', height: 'auto', margin: 'auto 10px 2px auto' }}>
      { items.map(item => <option key={randomBits()} value={item}>{item}</option>) }
    </select>
  )
}

const Register = () => {
  return (
    <>
      <Header />
      <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '2em' }}>
        <form>
          <div className={'input'}>
            <input type={'text'} name={'first-name'} onBlur={onBlur}/>
            <label className={'label'} htmlFor={'first-name'} onClick={onClick}>First Name</label>
          </div>

          <div className={'input'}>
            <input type={'text'} name={'last-name'} onBlur={onBlur}/>
            <label className={'label'} htmlFor={'last-name'} onClick={onClick}>Last Name</label>
          </div>

          <div className={'input'}>
            <input type={'email'} name={'email'} onBlur={onBlur}/>
            <label className={'label'} htmlFor={'email'} onClick={onClick}>Email</label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <DropDown items={['050', '051', '052', '053', '054', '055', '058']}/>

            <div className={'input'} style={{ width: '100%' }}>
              <input type={'number'} name={'phone'} onBlur={onBlur} min={'0'} max={'9999999'}/>
              <label className={'label'} htmlFor={'phone'} onClick={onClick}>Phone Number</label>
            </div>
          </div>

          <div className={'input'}>
            <input type={'password'} name={'password'} onBlur={onBlur}/>
            <label className={'label'} htmlFor={'password'} onClick={onClick}>Password</label>
          </div>

          <input className={'form-button'} type={'submit'} value={'Register'}/>
          <p>Already have an account? <a href={'/login'}>Login</a></p>
        </form>
      </div>
    </>
  )
}

ReactDOM.render(<Register />, document.querySelector('#root'))