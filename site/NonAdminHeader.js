import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import Header from "./Header";
import { fetchGetJson } from './helpers/request'
import { baseUrl } from './helpers/api'

const NonAdminHeader = ({ current }) => {
  const [user, setUser] = useState()

  useEffect(() => {
    fetchGetJson({ url: `${baseUrl}/me` })
      .then(res => {
        if (401 === res.status) {
          return Promise.reject()
        }

        return res.json()
      })
      .then(setUser)
      .catch(() => setUser(undefined))
  }, [])

  return (
    <Header
      logo={{ href: '/', alt: 'logo' }}
      nav={[
        { text: 'Schedule', href: '/schedule' },
        { text: 'Standings', href: '/standings' },
        { text: 'Gallery', href: '/gallery' }
      ]}
			current={current}
      account={
        !user ? [
          { text: 'Login', href: '/login' },
          { text: 'Register', href: '/register' }
        ] : [
          user.role === 'superadmin' && { text: 'Admin', href: '/admin' },
          { text: 'Logout', href: `${baseUrl}/logout` }
        ]
      }
      user={user}
    />
  )
}

export default NonAdminHeader
