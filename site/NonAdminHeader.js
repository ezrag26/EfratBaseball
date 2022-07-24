import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import Header from "./Header";
import { fetchGetJson } from './helpers/request'

const NonAdminHeader = ({ current }) => {
  const [loggedIn, setLoggedIn] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    Promise.all([
      fetchGetJson({ url: '/me' }).then(res => Promise.resolve(res.ok) ),
      fetchGetJson({ url: '/admin/me' }).then(res => Promise.resolve(res.ok))
    ])
      .then(([loggedIn, isAdmin]) => {
        ReactDOM.unstable_batchedUpdates(() => {
          setLoggedIn(loggedIn)
          setIsAdmin(isAdmin)
        })
      })
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
        !loggedIn ? [
          { text: 'Login', href: '/login' },
          { text: 'Register', href: '/register' }
        ] : [
					isAdmin && { text: 'Admin', href: '/admin' },
          { text: 'Logout', href: '/logout' }
        ]
      }
    />
  )
}

export default NonAdminHeader
