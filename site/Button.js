import React from "react";

const Button = ({ text, current, href }) => {
  return (
    <a className={`header-button ${current === text ? 'current' : ''}`} href={`${href}`}>{text}</a>
  )
}

export default Button
