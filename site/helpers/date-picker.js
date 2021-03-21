import React, { useState, useEffect, useRef } from 'react'

const getDaysInMonth = ({ year, month }) => {
	return new Date(year, month, 0).getDate()
}

const getDayOfWeekOfFirstDay = ({ year, month }) => {
	return new Date(year, month - 1, 1).getDay()
}

const months = {
	1: 'JAN',
	2: 'FEB',
	3: 'MAR',
	4: 'APR',
	5: 'MAY',
	6: 'JUN',
	7: 'JUL',
	8: 'AUG',
	9: 'SEP',
	10: 'OCT',
	11: 'NOV',
	12: 'DEC'
}

const DatePicker = ({ value, onChange = () => {} }) => {
	const [year, setYear] = useState()
	const [month, setMonth] = useState()
	const [selection, setSelection] = useState({ year: '', month: '', date: '' })
	const [picker, setPicker] = useState(false)
	const ref = useRef(null)

	useEffect(() => {
		const date = value ? new Date(value) : new Date()
		setYear(date.getFullYear())
		setMonth(date.getMonth() + 1)

		setSelection({ year: date.getFullYear(), month: date.getMonth() + 1, date: date.getDate()})
	}, [])

	useEffect(() => {
		if (picker) ref.current.focus()
		else ref.current.blur()
	}, [picker])

	const prevMonth = () => {
		if (month === 1) {
			setYear(prev => prev - 1)
			setMonth(12)
		} else {
			setMonth(prev => prev - 1)
		}
	}

	const nextMonth = () => {
		if (month === 12) {
			setYear(prev => prev + 1)
			setMonth(1)
		} else {
			setMonth(prev => prev + 1)
		}
	}

	const goToToday = () => {
		const now = new Date()
		setYear(now.getFullYear())
		setMonth(now.getMonth() + 1)
	}

	const calcLength = () => {
		const daysInMonth = getDaysInMonth({ year, month })
		const dayOfWeekOfFirstDay = getDayOfWeekOfFirstDay({ year, month })
		return ((7 - ((daysInMonth + dayOfWeekOfFirstDay) % 7)) % 7) + daysInMonth + dayOfWeekOfFirstDay
	}

	const selectedDate = ({ date }) => {
		return year === selection.year && month === selection.month && date === selection.date
	}

	const setElementOffset = e => {
		const offset = e.parentElement.getBoundingClientRect()
		const calendar = e.parentElement.nextElementSibling

		if (offset.top > window.innerHeight / 2) {
			calendar.style.top = 'initial'
			calendar.style.bottom = '100%'
		} else {
			calendar.style.top = '100%'
			calendar.style.bottom = 'initial'
		}
	}

	return (
		<div className={'picker'} style={{ position: 'relative' }}>
			<div style={{ display: 'flex' }} onClick={e => {
				setElementOffset(e.target)
				setPicker(prev => !prev)
			}}>
				<input style={{ backgroundColor: 'inherit', border: 'none', borderRight: 'solid 1px var(--primary)', padding: '1em' }} value={selection.date ? `${selection.year}-${months[selection.month]}-${selection.date}` : ''} readOnly />
				<button>Edit</button>
			</div>
			<div className={`calendar ${picker ? '' : 'hidden'}`} ref={ref} onBlur={() => setPicker(false)} tabIndex={-1}>
				<div className={'nav'} style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', marginBottom: '.5rem', gridColumn: '1 / span 7', gridRow: '1 / span 2' }}>
					<button className={'month prev'} onClick={prevMonth}></button>
					<h3>{months[month]} {year}</h3>
					<button className={'month next'} onClick={nextMonth}></button>
					{/*<div style={{ display: 'flex', justifyContent: 'center' }}>
						<button onClick={goToToday}>Today</button>
					</div>*/}
				</div>
				{
					['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => {
						return <div key={i} className={'days-of-week'} style={{ gridColumn: `${i + 1} / span 1`, gridRow: `3 / span 1` }}>{day}</div>
					})
				}
				{
					Array.from({ length: calcLength() }).fill(0).map((e, i) => {
						const firstday = getDayOfWeekOfFirstDay({ year, month })
						const date = i - firstday + 1
						return i < firstday || date > getDaysInMonth({ year, month }) ?
						<div key={i} className={'date disabled'} style={{ gridColumn: `${(i % 7) + 1} / span 1`, gridRow: `${(i / 7) + 4} / span 1` }}>&nbsp;</div> :
						<div
							key={i}
							className={`date ${selectedDate({ date }) ? 'selected' : ''}`}
							style={{ gridColumn: `${(i % 7) + 1} / span 1`, gridRow: `${(i / 7) + 4} / span 1` }}
							onClick={() => {
								setSelection({ year, month, date })
								setPicker(false)
								onChange(`${year}-${month < 10 ? '0' + month : month}-${date < 10 ? '0' + date : date}`)
							}}>{date}
						</div>
					})
				}
			</div>

		</div>
	)
}

export { DatePicker }
