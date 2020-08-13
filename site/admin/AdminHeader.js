import React from 'react'
import Button from '../Button'

const AdminHeader = () => {
  return (
    <header>
      <div>
        <a href={'/'}><img src={'/images/baseball.png'} style={{ width: '50px' }}/></a>
        <div>
          <Button text={'Schedule'} path={'/schedule'}/>
          <Button text={'Standings'} path={'/standings'}/>
          <Button text={'Gallery'} path={'/gallery'}/>
        </div>
        <div>
          <Button text={'Login'} path={'/login'}/>
          <Button text={'Register'} path={'/register'}/>
        </div>
      </div>
    </header>
  )
}

export default AdminHeader