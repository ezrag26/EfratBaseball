import React from 'react'
import ReactDOM from 'react-dom'

import AdminHeader from "./AdminHeader";
import BasePage from '../BasePage'
import Banner from '../components/banner'
import Lorem from '../components/lorem'

const Index = () => {

  return (
    <>
      <AdminHeader />
      <BasePage title={'Israel Sports Center - Admin'}>
        <Banner style={{ marginLeft: 'auto', marginRight: 'auto', width: '100%' }} src={'/'}/>
        <div style={{ marginTop: '2rem' }}>
          <Lorem numParagraphs={4}/>
        </div>
      </BasePage>
    </>
  )
}

ReactDOM.render(<Index />, document.querySelector('#root'))
