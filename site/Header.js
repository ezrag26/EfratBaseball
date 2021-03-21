import React from 'react'
import Button from './Button'
import { randomBits } from './helpers/unique'

const Header = ({ logo, nav, current, account }) => {
  return (
    <header>
      <div>
        { logo && <a href={logo.href}><img src={logo.url} alt={logo.alt} style={{ width: '50px' }}/></a> }
        <div>
          { nav && nav.map(navItem => <Button key={randomBits()} current={current} text={navItem.text} href={navItem.href}/>) }
        </div>
        <div>
          { account && account.map(accountItem => <Button key={randomBits()} text={accountItem.text} href={accountItem.href}/>) }
        </div>
      </div>
    </header>
  )
}

export default Header
