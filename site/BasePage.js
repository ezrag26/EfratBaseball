import React from 'react'

import BasePageHeader from './BasePageHeader'

const BasePage = ({ children, title }) => {
  return (
    <div style={{ margin: '2rem auto', width: '70%' }}>
    {title && <BasePageHeader title={title}/>}
    {
      children
    }
    </div>
  )
}

export default BasePage
