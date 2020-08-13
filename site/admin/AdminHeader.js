import React from 'react'
import Button from '../Button'
import Header from "../Header";

const AdminHeader = () => {
  return (
    <Header logo={{ href: '/', url: '/images/baseball.png', alt: 'admin-homepage' }}
            nav={[
              { text: 'Schedule', href: '/admin/schedule' },
              { text: 'Standings', href: '/admin/standings' },
              { text: 'Gallery', href: '/admin/gallery' }
            ]}
    />
  )
}

export default AdminHeader