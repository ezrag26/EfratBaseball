import React from 'react'
import ReactDOM from 'react-dom'

import AdminHeader from "./AdminHeader";
import Banner from '../components/banner'
import Lorem from '../components/lorem'

const Index = () => {

  return (
    <>
      <AdminHeader />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '2rem auto', width: '70%' }}>
        <h1>Efrat Baseball - Admin</h1>
        <Banner src={'/'}/>
        <div style={{ marginTop: '2rem' }}>
          <Lorem numParagraphs={4}/>
        </div>
      </div>
    </>
  )
}

ReactDOM.render(<Index />, document.querySelector('#root'))
