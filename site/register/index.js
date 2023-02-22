import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import BasePageHeader from '../BasePageHeader'
import NonAdminHeader from "../NonAdminHeader";
import {FormRow, Input, DropDownMenu} from '../helpers/form'
import { fetchPostJson } from '../helpers/request'
import { baseUrl } from '../helpers/api'
import validator from 'validator';
import { Stack, Center } from "../helpers/Typography";

const HYPHEN = '-'

const validNumber = new RegExp(/^\d{3}[^\d]?\d{4}$/)

const send = ({ body }) => {
  return fetchPostJson({
    url: `${baseUrl}/register`,
    body
  })
}

const useFormInput = (initialState) => {
  const [state, setState] = useState(initialState)
  const [error, setError] = useState()

  const setStateAndError = (newState, newError) => {
    setState(newState)
    setError(newError && 'Error: ' + newError)
  }

  return [state, error, (newState, newError = '') => setStateAndError(newState, newError)]
}

const carriers = ['050', '051', '052', '053', '054', '055', '058'].map(num => ({ name: num }))

const Register = () => {
  const [first, setFirst] = useState('')
  const [last, setLast] = useState('')
  const [email, emailError, setEmail] = useFormInput('')
  const [carrier, setCarrier] = useState(carriers[0])
  const [phone, setPhone] = useState('')
  const [password, passwordError, setPassword] = useFormInput('')
  const [confirmPassword, confirmPasswordError, setConfirmPassword] = useFormInput('')
  const [processed, setProcessed] = useState(false)

  const validForm = () => {
    return first &&
    last &&
    email && validator.isEmail(email) &&
    carrier.name &&
    phone && validNumber.test(phone) &&
    password && password.length >= 5 && confirmPassword === password
  }

  const onSubmit = e => {
    e.preventDefault()

    // if (!validForm()) return

    return send({
      body: {
        "first-name": first,
        "last-name": last,
        email,
        carrier: carrier.name,
        phone: phone.replace(/[^\d]/, ''),
        password
      }
    })
      .then(res => setProcessed(true))
      .catch(err => {
      })
  }

  const keyPress = e => {
    if (e.code === 'Enter') return onSubmit(e)
  }

  const registerMessage = () => {
    return (
      <>
        <Center>
          <p>Your information has been successfully received.</p>
        </Center>
        <Center>
          <p>Please follow the instructions in the email that we have sent to <span style={{ fontWeight: 'bold' }}>{email}</span> in order to complete your registration</p>
        </Center>
      </>
    )
  }

  const maskPhone = v => {
    const str = v.replace(/[^\d]/g, '')

    const length = str.length < 8 ? str.length : 7

    setPhone(length <= 3 ? str : str.substr(0, 3).concat(HYPHEN).concat(str.substr(3, length - 3)))
  }

  return processed ? registerMessage() : (
    <>
      <NonAdminHeader />
      <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '2em' }}>
        <form onSubmit={onSubmit} onKeyPress={keyPress}>
          <BasePageHeader title={'Register'} />

          <FormRow>
            <Input type={'text'} name={'first-name'} placeholder={'First Name'} value={first} required={true} onChange={setFirst} autofocus={true}/>
          </FormRow>

          <FormRow>
            <Input type={'text'} name={'last-name'} placeholder={'Last Name'} value={last} required={true} onChange={setLast}/>
          </FormRow>

          <FormRow>
            <div style={{ margin: 'auto 0' }}>
              <DropDownMenu items={carriers} selection={carrier} setSelection={setCarrier} form={true}/>
            </div>
            <Input type={'text'} name={'phone'} placeholder={'Phone Number'} value={phone} required={true} onChange={maskPhone} helpText={'Phone Number must be 7 numbers in the format xxx-xxxx'}/>
          </FormRow>

          <FormRow>
            <Input type={'text'} name={'email'} placeholder={'Email'} value={email} required={true} onChange={setEmail} onBlur={v => {
              if (v && !validator.isEmail(v)) return setEmail(prev => prev, 'Invalid Email')
            }} error={emailError}/>
          </FormRow>

          <FormRow>
            <Input type={'password'} name={'password'} placeholder={'Password'} value={password} required={true} onChange={setPassword}/>
          </FormRow>

          <FormRow>
            <Input type={'password'} name={'confirm-password'} placeholder={'Confirm Password'} value={confirmPassword} required={true} onChange={v => {
              if (v !== password.substr(0, v.length)) return setConfirmPassword(v, 'Passwords do not match to this point')
              setConfirmPassword(v)
            }} error={confirmPasswordError}/>
          </FormRow>

          <Stack.Medium>
            <input className={`form-button ${!validForm() ? 'invalid-form' : ''}`} type={'submit'} value={'Register'} disabled={!validForm()}/>
          </Stack.Medium>
          <p>Already have an account? <a href={'/login'}>Login</a></p>
        </form>
      </div>
    </>
  )
}

ReactDOM.render(<Register />, document.querySelector('#root'))
