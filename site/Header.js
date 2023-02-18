import React, { useState, useEffect, useRef } from 'react'
import DropDownMenu from './DropDownMenu'
import DropDownMenuItem from './DropDownMenuItem'
import { randomBits } from './helpers/unique'

const NavItem = ({ current, text, href }) => {
  return (
    <>
    {
      href ?
      <a className={`nav-item ${current ? 'current' : ''}`} href={href}>{text}</a> :
      <a className={`nav-item ${current ? 'current' : ''}`}>{text}</a>
    }
    </>

  )
}

const Header = ({ logo, nav, current, account, user }) => {
	const [showProfile, setShowProfile] = useState(false)
	const ref = useRef(null)

	useEffect(() => {
		if (showProfile) ref.current.focus()
		else ref.current.blur()
	}, [showProfile])

  return (
    <header>
      <div>
        {
          logo.url ?
          <a href={logo.href}><img src={logo.url} alt={logo.alt} style={{ width: '40px', marginRight: '1rem' }}/></a>:
          <a href={logo.href} style={{ color: 'white' }}>
          <i class="fa-regular fa-baseball fa-2x" style={{ marginRight: '1rem' }}></i>
          {/*<div style={{ fontSize: '1.3rem' }}>Israel Sports Center</div>*/}
          </a>
        }
        <div>
          { nav && nav.map(navItem => <NavItem key={randomBits()} current={current === navItem.text} text={navItem.text} href={navItem.href}/>) }
        </div>
      </div>
      <div>
        <p style={{ marginRight: '4px' }}>{user && (user.firstName || user.email || 'User')}</p>
        <i
          className={'fa-regular fa-user icon'}
          onClick={() => setShowProfile(!showProfile)}
          onBlur={() => setShowProfile(false)}
          ref={ref}
          tabIndex={0}
          style={{ position: 'relative' }}
        >
          <DropDownMenu style={{ display: showProfile ? '' : 'none', backgroundColor: 'var(--secondary-dark)', color: 'black' }}>
          { account && account.filter(item => item).map(accountItem => {
              return (
                <DropDownMenuItem style={{ cursor: 'pointer' }} key={accountItem.text} href={accountItem.href}>{accountItem.text}</DropDownMenuItem>
              )
            })
          }
          </DropDownMenu>
        </i>
      </div>
    </header>
  )
}

export default Header
