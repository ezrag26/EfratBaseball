import React from 'react'
import ReactDOM from 'react-dom'

import Header from "./Header";

const Index = () => {

  return (
    <>
      <Header />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '2rem auto', width: '70%' }}>
        <h1>Efrat Baseball</h1>
        <img alt={'homepage-image'} src={'/'} style={{ width: '70vw', height: '50vh', marginTop: '2rem' }}/>
        <div style={{ marginTop: '2rem' }}>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla tempor lobortis dapibus. Morbi tempus tortor diam, et molestie tellus pellentesque eget. Maecenas viverra metus in ante dignissim blandit. Curabitur egestas est at semper interdum. Donec scelerisque eu magna vel venenatis. Phasellus non pharetra metus. Nullam sit amet sagittis erat, nec vestibulum dui. Nulla bibendum vehicula tincidunt. Nullam maximus lobortis sem quis pharetra. Maecenas eu mauris molestie, lacinia lacus a, faucibus ligula. In posuere elit in elit blandit mollis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.</p>
          <p>Donec vel sagittis libero. Suspendisse potenti. Mauris posuere elementum enim vel placerat. Ut congue dolor nec mi malesuada, in sodales nulla ultricies. Cras magna neque, mattis id sollicitudin vitae, condimentum volutpat metus. Proin sapien libero, pretium quis quam sed, consectetur mattis augue. Mauris ut nisl erat.</p>
          <p>Donec enim purus, commodo vitae varius in, porta non ligula. Curabitur tempus eget ante eu tristique. Mauris ornare pulvinar orci, vel sodales urna placerat nec. Vivamus augue libero, pharetra non bibendum vitae, consectetur in est. Fusce ultrices ante a pharetra porta. Duis molestie condimentum fermentum. Interdum et malesuada fames ac ante ipsum primis in faucibus.</p>
        </div>
      </div>
    </>
  )
}

ReactDOM.render(<Index />, document.querySelector('#root'))