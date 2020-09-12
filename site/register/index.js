import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import NonAdminHeader from "../NonAdminHeader";
import {FormRow, Input, DropDownMenu} from '../helpers/form'
import { fetchPostJson } from '../helpers/request'
import validator from 'validator';
import { Stack, Center } from "../helpers/Typography";

const HYPHEN = '-'

const beg3 = new RegExp(/^\d{0,3}$/)
const full = new RegExp(/^\d{3}.?\d{0,4}$/)
const onlyNumbers = new RegExp(/^\d{4,7}$/)
const validNumber = new RegExp(/^\d{3}.?\d{4}$/)

const send = ({ body }) => {
  return fetchPostJson({
    url: '/register',
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

const carriers = [
  { name: '050' },
  { name: '051' },
  { name: '052' },
  { name: '053' },
  { name: '054' },
  { name: '055' },
  { name: '058' }
]

const Register = () => {
  const [first, setFirst] = useState('')
  const [last, setLast] = useState('')
  const [email, emailError, setEmail] = useFormInput('')
  const [carrier, setCarrier] = useState(carriers[0])
  const [phone, phoneError, setPhone] = useFormInput('')
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
    const length = v.length

    if ((length <= 3 && !beg3.test(v)) || (length > 3 && length <= 8 && !full.test(v))) {
      return setPhone(prev => prev, 'Phone Number must be in format ###-####')
    }

    setPhone(prev => {
      if (length > 8) return prev // too many numbers, or trying to change hyphen

      if (length > 3) {
        if (onlyNumbers.test(v)) return v.substr(0, 3).concat(HYPHEN).concat(v.substr(3, length))

        return v.replace(/[^\d]/, HYPHEN)
      }

      if (length === 3) {
        if (prev.length > 4) return v.substr(0, 3).concat(HYPHEN)
        if (prev.length === 4 && prev.substr(0, 3) === v) return v.substr(0, 2) // delete 3rd number => delete the hyphen
        return v.concat(HYPHEN) // added 3rd number => add hyphen
      }

      return v
    }, '')
  }

  return processed ? registerMessage() : (
    <>
      <NonAdminHeader />
      <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '2em' }}>
        <form onSubmit={onSubmit} onKeyPress={keyPress}>
          <Center>
            <Stack.Small>
              <h1>Register</h1>
            </Stack.Small>
          </Center>

          <FormRow>
            <Input type={'text'} name={'first-name'} placeHolder={'First Name'} value={first} onChange={setFirst}/>
            <Input type={'text'} name={'last-name'} placeHolder={'Last Name'} value={last} onChange={setLast}/>
          </FormRow>

          <FormRow>
            <div style={{ margin: 'auto 0 0' }}>
              <DropDownMenu items={carriers} selection={carrier} setSelection={setCarrier}/>
            </div>
            <Input type={'text'} name={'phone'} placeHolder={'Phone Number'} value={phone} onChange={maskPhone} error={phoneError}/>
          </FormRow>

          <FormRow>
            <Input type={'text'} name={'email'} placeHolder={'Email'} value={email} onChange={setEmail}/>
          </FormRow>

          <FormRow>
            <Input type={'password'} name={'password'} placeHolder={'Password'} value={password} onChange={setPassword}/>
            <Input type={'password'} name={'confirm-password'} placeHolder={'Confirm Password'} value={confirmPassword} onChange={v => {
              if (v.length >= password.length && v !== password) return setConfirmPassword(v, 'Passwords do not match')
              setConfirmPassword(v)
            }} error={confirmPasswordError}/>
          </FormRow>

          <input className={`form-button ${!validForm() ? 'invalid-form' : ''}`} type={'submit'} value={'Register'} disabled={!validForm()}/>
          <p>Already have an account? <a href={'/login'}>Login</a></p>
        </form>
      </div>
    </>
  )
}

ReactDOM.render(<Register />, document.querySelector('#root'))