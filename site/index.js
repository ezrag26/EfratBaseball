import React from 'react'
import ReactDOM from 'react-dom'

import Header from "./Header";

const Index = () => {

  return (
    <>
      <Header />
      <h1>Efrat Baseball</h1>
    </>
  )
}

ReactDOM.render(<Index />, document.querySelector('#root'))