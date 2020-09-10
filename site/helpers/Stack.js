import React from 'react'

const Stack = {
  Small: ({children}) => {
    return (
      <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
        {children}
      </div>
    )
  },

  Medium: ({children}) => {
    return (
      <div style={{ marginTop: '2rem', marginBottom: '2rem' }}>
        {children}
      </div>
    )
  },

  Large: ({children}) => {
    return (
      <div style={{ marginTop: '3rem', marginBottom: '3rem' }}>
        {children}
      </div>
    )
  }
}

export default Stack