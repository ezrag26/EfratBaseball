import React, { useState, useEffect } from 'react'
import Header from "../Header";
import { fetchGetJson } from "../helpers/request";
import { baseUrl } from '../helpers/api'

const AdminHeader = ({ current }) => {
  const [user, setUser] = useState()

  useEffect(() => {
    fetch(`${baseUrl}/me`)
      .then(res => {
        if (401 === res.status) {
          if (!window.location.pathname.includes('login')) {
            window.location.replace(`/admin/login`)
          }

          return Promise.reject()
        }

        return res
      })
      .then(res => res.json())
      .then(user => {
        if (user.role !== 'superadmin') {
          window.location.replace(`/`)
          return Promise.reject()
        }

        return user
      })
      .then(setUser)
      .catch(() => setUser(undefined))
  }, [])

  return (
    <Header
      logo={{ href: user ? '/admin' : '/admin/login', alt: 'admin-homepage' }}
      nav={user ? [
        { text: 'Schedule', href: '/admin/schedule' },
        { text: 'Teams', href: '/admin/teams' },
        { text: 'Leagues', href: '/admin/leagues' },
        { text: 'Gallery', href: '/admin/gallery' }
      ] : []}
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
