import React from 'react'

import { Center, Stack } from "./helpers/Typography";

const BasePageHeader = ({ children, title }) => {
	return (
		<Center>
			<Stack.Small>
				{title && <h1>{title}</h1>}
				{children && children}
			</Stack.Small>
		</Center>
	)
}

export default BasePageHeader
