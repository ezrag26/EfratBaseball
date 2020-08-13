import React from 'react'
import Header from "./Header";

const NonAdminHeader = () => {
  return (
    <Header
      logo={{ href: '/', url: '/images/baseball.png', alt: 'logo' }}
      nav={[
        { text: 'Schedule', href: '/schedule' },
        { text: 'Standings', href: '/standings' },
        { text: 'Gallery', href: '/gallery' }
      ]}
      account={[
        { text: 'Login', href: '/login' },
        { text: 'Register', href: '/register' }
      ]}
    />
  )
}

export default NonAdminHeader