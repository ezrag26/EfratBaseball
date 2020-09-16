import React, { useState, useEffect } from 'react'
import Header from "../Header";
import { fetchGetJson } from "../helpers/request";

const AdminHeader = () => {
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    fetch('/admin/me')
      .then(res => setLoggedIn(res.ok))
  }, [])

  return (
    <Header logo={{ href: '/admin', url: '/images/baseball.png', alt: 'admin-homepage' }}
            nav={[
              { text: 'Schedule', href: '/admin/schedule' },
              { text: 'Leagues', href: '/admin/leagues' },
              { text: 'Teams', href: '/admin/teams' },
              { text: 'Gallery', href: '/admin/gallery' }
            ]}
            account={
              !loggedIn ? [
                { text: 'Login', href: '/admin/login' },
                { text: 'Non-Admin', href: '/' }
              ] : [
                { text: 'Logout', href: '/admin/logout' },
                { text: 'Non-Admin', href: '/' }
              ]
            }
    />
  )
}

export default AdminHeader