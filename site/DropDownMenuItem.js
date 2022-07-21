import React from "react";

const DropDownMenuItem = ({ children, style, href }) => {
  return (
		<li
			className={'dropdown-menu__item'}
			style={{
				...style
			}}
			onClick={() => {
				if (href) window.location.href = href
			}}
		>
  	{
			children
		}
		</li>
  )
}

export default DropDownMenuItem
