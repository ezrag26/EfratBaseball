import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'

import BasePage from './BasePage'
import BasePageHeader from './BasePageHeader'
import NonAdminHeader from "./NonAdminHeader";
import Banner from './components/banner'
import Lorem from './components/lorem'

const Index = () => {

  return (
    <>
      <NonAdminHeader />
      <BasePage title={'Israel Sports Center'}>
        <Banner style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto' }} src={'/'} refresh={0}/>
        <div style={{ marginTop: '2rem' }}>
          <Lorem numParagraphs={4}/>
        </div>
      </BasePage>
    </>
  )
}

ReactDOM.render(<Index />, document.querySelector('#root'))
