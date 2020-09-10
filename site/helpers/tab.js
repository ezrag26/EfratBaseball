import React from 'react'

const Tab = ({ text, onClick, onMouseOut }) => {

  return (
    <li className={'tab'} onClick={onClick}>{text}</li>
  )
}

export { Tab }