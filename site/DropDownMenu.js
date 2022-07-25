import React from "react";

const DropDownMenu = ({ children, style }) => {
  return (
		<ul
			className={'dropdown-menu'}
			style={{
				...style
			}}
		>
    {
			children
		}
		</ul>
  )
}

export default DropDownMenu
