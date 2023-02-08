import React, { useState, useEffect } from 'react'
import Header from "../Header";
import { fetchGetJson } from "../helpers/request";
import { baseUrl } from '../helpers/api'

const AdminHeader = ({ current }) => {
  const [user, setUser] = useState(false)

  useEffect(() => {
    fetch(`${baseUrl}/me`)
      .then(res => res.json())
      .then(setUser)
  }, [])

  return (
    <Header
      logo={{ href: '/admin', alt: 'admin-homepage' }}
      nav={[
        { text: 'Schedule', href: '/admin/schedule' },
        { text: 'Teams', href: '/admin/teams' },
        { text: 'Leagues', href: '/admin/leagues' },
        { text: 'Gallery', href: '/admin/gallery' }
      ]}
      current={current}
      account={
        !user ? [
          { text: 'Non-Admin', href: '/' },
          { text: 'Login', href: '/admin/login' }
        ] : [
          { text: 'Non-Admin', href: '/' },
          { text: 'Logout', href: `${baseUrl}/admin/logout` }
        ]
      }
    />
  )
}

export default AdminHeader
