import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'

import NonAdminHeader from "./NonAdminHeader";
import Banner from './components/banner'
import Lorem from './components/lorem'

const Index = () => {

  return (
    <>
      <NonAdminHeader />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '2rem auto', width: '70%' }}>
        <h1>Efrat Baseball</h1>
        <Banner src={'/'}/>
        <div style={{ marginTop: '2rem' }}>
          <Lorem numParagraphs={4}/>
        </div>
      </div>
    </>
  )
}

ReactDOM.render(<Index />, document.querySelector('#root'))
