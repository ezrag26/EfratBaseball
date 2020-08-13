import React from 'react'
import Button from './Button'
import { randomBits } from './helpers/unique'

const Header = ({ logo, nav, account }) => {
  return (
    <header>
      <div>
        <a href={logo.href}><img src={logo.url} alt={logo.alt} style={{ width: '50px' }}/></a>
        <div>
          { nav.map(navItem => <Button key={randomBits()} text={navItem.text} href={navItem.href}/>) }
        </div>
        <div>
          { account.map(accountItem => <Button key={randomBits()} text={accountItem.text} href={accountItem.href}/>) }
        </div>
      </div>
    </header>
  )
}

export default Header