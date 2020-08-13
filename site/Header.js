import React from 'react'

const Button = ({ text, path }) => {
  return (
    <a className={'header-button'} href={`${path}`}>{text}</a>
  )
}

const Header = () => {
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

export default Header