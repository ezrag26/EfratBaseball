const months = {
	1: 'Jan',
	2: 'Feb',
	3: 'Mar',
	4: 'Apr',
	5: 'May',
	6: 'Jun',
	7: 'Jul',
	8: 'Aug',
	9: 'Sep',
	10: 'Oct',
	11: 'Nov',
	12: 'Dec'
}

const getAbbreviatedMonth = ({ month }) => months[month] || ''

const getDaysInMonth = ({ year, month }) => {
	return new Date(year, month, 0).getDate()
}

const getDayOfWeekOfFirstDay = ({ year, month }) => {
	return new Date(year, month - 1, 1).getDay()
}

const formatYYYY_MMM_DD = ({ year, month, date = '' }) => {
	return `${year}-${getAbbreviatedMonth({ month })}-${date}`
}

const formatYYYY_MM_DD_to_YYYY_MMM_DD = (yyyy_mm_dd) => {
	const [year, month, date] = yyyy_mm_dd.split('-')

	return formatYYYY_MMM_DD({ year, month: Number(month), date })
}

export { getAbbreviatedMonth, getDaysInMonth, getDayOfWeekOfFirstDay, formatYYYY_MMM_DD, formatYYYY_MM_DD_to_YYYY_MMM_DD }
