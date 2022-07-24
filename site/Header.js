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

const Header = ({ logo, nav, current, account }) => {
	const [showProfile, setShowProfile] = useState(false)
	const ref = useRef(null)

	useEffect(() => {
		if (showProfile) ref.current.focus()
		else ref.current.blur()
	}, [showProfile])

  return (
    <header>
      <div>
        { logo && <a href={logo.href}><img src={logo.url} alt={logo.alt} style={{ width: '40px', marginRight: '1rem' }}/></a> }
        <div>
          { nav && nav.map(navItem => <NavItem key={randomBits()} current={current === navItem.text} text={navItem.text} href={navItem.href}/>) }
        </div>
			</div>
			<div>
				<i
					className={'fa-regular fa-user icon'}
					onClick={() => setShowProfile(!showProfile)}
					onBlur={() => setShowProfile(false)}
					ref={ref}
					tabIndex={0}
					style={{ position: 'relative' }}
				>
					<DropDownMenu style={{ display: showProfile ? '' : 'none', backgroundColor: 'var(--secondary-dark)', color: 'black' }}>
					{ account && account.map(accountItem => {
							return (
								<DropDownMenuItem key={accountItem.text} href={accountItem.href}>{accountItem.text}</DropDownMenuItem>
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
