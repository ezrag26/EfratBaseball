import React from "react";

const Button = ({ text, href }) => {
  return (
    <a className={'header-button'} href={`${href}`}>{text}</a>
  )
}

export default Button