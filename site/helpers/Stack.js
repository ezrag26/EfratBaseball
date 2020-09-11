import React from 'react'

const Stack = {
  Small: ({ style, children }) => {
    return (
      <div style={{ ...style, marginTop: '1rem', marginBottom: '1rem' }}>
        {children}
      </div>
    )
  },

  Medium: ({ style, children }) => {
    return (
      <div style={{ ...style, marginTop: '2rem', marginBottom: '2rem' }}>
        {children}
      </div>
    )
  },

  Large: ({ style, children }) => {
    return (
      <div style={{ ...style, marginTop: '3rem', marginBottom: '3rem' }}>
        {children}
      </div>
    )
  }
}

export default Stack