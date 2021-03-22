import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'

import AdminHeader from "../AdminHeader";
import { FormRow, Input, DropDownMenu } from "../../helpers/form";
import { Center, Stack } from "../../helpers/Typography";
import { TableCell } from '../../helpers/table'
import {
	ContainedButton,
	SecondaryContainedButton,
	OutlineButton,
	TextButton,
	SubmitButton,
	FloatingActionButton,
	ActionButton
} from '../../helpers/button'
import { CHECKMARK , X, PLUS } from '../../helpers/constants'
import { DatePicker } from '../../helpers/date-picker'

import { fetchLeagues, fetchTeams, fetchSchedule, addGame, editGame } from '../../helpers/api'
import { randomBits } from '../../helpers/unique'
import { sortAscending } from '../../helpers/schedule'

const minsToHours = mins => ( mins / 60 )

const minsTo12HH_MM = mins => {
  const hoursMinutes = minsToHours(mins).toFixed(2).split('.')

  const hr = hoursMinutes[0]
  const min = ((hoursMinutes[1] / 100) * 60).toFixed(0)
  const [hrs, AM_PM] = (hr % 24) < 12 ? [hr % 24 || 12, 'AM'] : [hr % 12 || 12, 'PM']

  return `${hrs < 10 ? `0${hrs}` : hrs}:${min < 10 ? `0${min}` : min}${AM_PM}`
}

const formatDisplayTime = time => {
  return minsTo12HH_MM(time)
}

const _12HH_MM_ToMins = (time) => {
  const isAM = new RegExp(/[aA][mM]$/).test(time)
  const [hours, minutes] = time.substr(0, time.length - 2).split(':')

  const hrs = parseInt(hours)
  const mins = parseInt(minutes)

  if (isAM && hrs === 12) return mins
  if (!isAM && hrs !== 12) return ((hrs + 12) * 60) + mins
  return (hrs * 60) + mins
}

const formatTimeForRequest = time => {
  return _12HH_MM_ToMins(time)
}

const _12HH_MM_RE = new RegExp(/^(0?[1-9]|\d|1[0-2]):[0-5][0-9][aApP][mM]$/)

const YYYY_MM_DD_RE = new RegExp(/^\d{4}-(0?[1-9]|1[0-2])-(0?[1-9]|[12][0-9]|3[01])$/)

const isValidDate = (date) => {
	// console.error('Date must be a valid date in the format yyyy-MM-dd')
  // return YYYY_MM_DD_RE.test(date)
	return date != false
}

const isValidTime = (time) => {
	// console.error('Time must be a valid time in the format HH:MM and must be directly followed by AM or PM (no space in between)')
  return _12HH_MM_RE.test(time)
}

const Table = ({ items, teams, saveEdit, removeGame }) => {
  const [editingId, setEditingId] = useState('')
  const [edit, setEdit] = useState({})
  const [teamInfo, setTeamInfo] = useState()

  const editField = ({ setter, field, value }) => setter(prev => ({ ...prev, [field]: value }))

	const setEditField = ({ field, value }) => editField({ setter: setEdit, field, value })

  useEffect(() => {
    setEditingId('')
    setEdit({})

    setTeamInfo(Object.keys(teams).map(teamId => ({ id: teamId, name: teams[teamId].name })))
  }, [teams])

  const editRow = ({ game }) => {
    const { gameId, ...g } = game

    setEditingId(gameId)
    setEdit({
      ...g,
      time: formatDisplayTime(game.time),
      away: teamInfo.find(team => team.id === game.awayId),
      home: teamInfo.find(team => team.id === game.homeId)
    })
  }

  const isValidEdit = ({ edit }) => {
    const { gameId, date, time, awayId, homeId, awayRS, homeRS, isFinal } = edit
    const game = items.filter(game => gameId === game.gameId)[0] || undefined

    return date !== game.date ||
      time !== game.time ||
      awayId !== game.awayId ||
      homeId !== game.homeId ||
      (awayRS != game.awayRS && awayRS >= 0) ||
      (homeRS != game.homeRS && homeRS >= 0) ||
      isFinal !== game.isFinal
  }

	const formatEditForRequest = ({ gameId, edit }) => {
		const { date, time, away, home, awayRS, homeRS, isFinal } = edit
		return { gameId, date, time: formatTimeForRequest(time), awayId: away.id, homeId: home.id, awayRS: awayRS || 0, homeRS: homeRS || 0, isFinal }
	}

  const save = ({ gameId }) => {
    if (!isValidDate(edit.date) || !isValidTime(edit.time)) return

    const formattedEdit = formatEditForRequest({ gameId, edit })

    if (isValidEdit({ edit: formattedEdit })) {
      saveEdit({ edit: formattedEdit })
			// should check first to make sure the edit was successful...
      setEditingId('')
      setEdit({})
    }
  }

  const remove = ({ gameId }) => {

  }

  const cancel = ({ gameId }) => {
    setEditingId('')
    setEdit({})
  }

  return (
    <table className={'table wide center'}>
      <thead>
        <tr className={'tr bg-primary color-secondary'}>
          {['Date', 'Time', 'Away', 'Away RS', 'Home', 'Home RS', 'Final', ''].map(col =>
            <td key={randomBits()}>{col}</td>
          )}
        </tr>
      </thead>
      <tbody>
      {
				items.map(game => {
          const { date, gameId, time, awayId, awayRS, homeId, homeRS, isFinal } = game
          return editingId === gameId ? (
            <tr className={'tr edit'} key={gameId}>
						{
							[
								{ field: 'date', type: 'date' },
								{ field: 'time' },
								{ field: 'away', type: 'dropdown', dropDownItems: teamInfo, form: true },
								{ field: 'awayRS' },
								{ field: 'home', type: 'dropdown', dropDownItems: teamInfo, form: true },
								{ field: 'homeRS' },
								{ field: 'isFinal', type: 'checkbox' }
							].map(cell => {
								return <TableCell
									key={cell.field}
									type={cell.type}
									dropDownItems={cell.dropDownItems}
									form={cell.form}
									value={edit[cell.field]}
									onChange={value => setEditField({ field: cell.field, value })} />
							})
						}
              <td>
                <div style={{ display: 'flex' }}>
                  <ContainedButton onClick={e => save({ gameId })} display={CHECKMARK} disabled={!isValidEdit({ edit: formatEditForRequest({ gameId, edit }) })}/>
                  <OutlineButton onClick={e => cancel({ gameId })} display={X} />
                  {removeGame && <TextButton onClick={e => remove({ gameId })} display={'Remove'} />}
                </div>
              </td>
            </tr>
          ) : (
            <tr className={`tr disabled ${editingId ? 'fade' : ''} editable`} key={gameId}>
							{
								[
									{ value: date},
									{ value: formatDisplayTime(time) },
									{ value: teams[awayId].name },
									{ value: awayRS },
									{ value: teams[homeId].name },
									{ value: homeRS },
									{ value: isFinal ? 'Final' : '' }
								].map(cell => {
									return <TableCell key={randomBits()} type={cell.type} value={cell.value} disabled={true} />
								})
							}
              <td>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
										<ActionButton display={'•••'} onClick={e => editRow({ game: { ...game } })} />
                  </div>
              </td>
            </tr>
          )
        })
      }
      </tbody>
    </table>
  )
}

const Schedule = () => {
  const [leagues, setLeagues] = useState([])
  const [league, setLeague] = useState({})
  const [teams, setTeams] = useState({})
  const [schedule, setSchedule] = useState([])
	// const [edit, setEdit] = useState({})
	const [teamInfo, setTeamInfo] = useState()
	const [newGameModal, setNewGameModal] = useState()
	const [newGame, setNewGame] = useState({ date: '', time: '' })

  useEffect(() => {
    fetchLeagues()
      .then(leagues => {
        setLeagues(leagues)
        setLeague(leagues[0])
      })
  }, [])

  useEffect(() => {
    if (!league.id) return

    Promise.all([
      fetchTeams({ leagueId: league.id }),
      fetchSchedule({ leagueId: league.id })
    ])
      .then(([teams, schedule]) => {
        ReactDOM.unstable_batchedUpdates(() => { // need teams and schedule to update in same render, otherwise won't find teams in the schedule
          setTeams(teams)
          setSchedule(sortAscending({ schedule: Object.keys(schedule)
					.reduce((acc, date) => ([...acc, ...schedule[date].map(game => ({ date, ...game }))]), []) }))
        })
      })
  }, [league])

  useEffect(() => {
  },[teams, schedule])

	useEffect(() => {
    setTeamInfo(Object.keys(teams).map(teamId => ({ id: teamId, name: teams[teamId].name })))
  }, [teams])

	useEffect(() => {
		if (!newGameModal || !teamInfo) return

		const now = new Date()
		setNewGame({ date: now.toLocaleDateString(), time: minsTo12HH_MM(((now.getTime() / 1000) / 60) - now.getTimezoneOffset()) })
	}, [newGameModal])

	// const createEntries = () => {
	// 	return Object.keys(schedule).reduce((acc, date) => acc.concat(schedule[date].map(game => {
	// 		const { gameId, time, awayId, awayRS, homeId, homeRS, isFinal } = game
	// 		const cells = edit.id === gameId ? [
	// 			{ current: edit.date || date, set: value => setEdit(prev => ({ ...prev, 'date': value }))},
	// 			{ current: edit.time || time, set: value => setEdit(prev => ({ ...prev, 'time': value }))},
	// 			{ dropDownInfo: teamInfo, current: { id: edit.away?.id || awayId, name: edit.away?.name || teams[awayId].name }, set: value => setEdit(prev => ({ ...prev, 'away': value }))},
	// 			{ current: edit.awayRS || awayRS, set: value => setEdit(prev => ({ ...prev, 'awayRS': value }))},
	// 			{ dropDownInfo: teamInfo, current: { id: edit.home?.id || homeId, name: edit.home?.name || teams[homeId].name }, set: value => setEdit(prev => ({ ...prev, 'home': value }))},
	// 			{ current: edit.homeRS || homeRS, set: value => setEdit(prev => ({ ...prev, 'homeRS': value }))},
	// 			{ current: edit.isFinal || isFinal, set: value => setEdit(prev => ({ ...prev, 'isFinal': value }))}
	// 		] :
	// 		[
	// 			{ current: date, set: value => setEdit(prev => ({ ...prev, 'date': value }))},
	// 			{ current: time, set: value => setEdit(prev => ({ ...prev, 'time': value }))},
	// 			{ dropDownInfo: teamInfo, current: { id: awayId, name: teams[awayId].name }, set: value => setEdit(prev => ({ ...prev, 'away': value }))},
	// 			{ current: awayRS, set: value => setEdit(prev => ({ ...prev, 'awayRS': value }))},
	// 			{ dropDownInfo: teamInfo, current: { id: homeId, name: teams[homeId].name }, set: value => setEdit(prev => ({ ...prev, 'home': value }))},
	// 			{ current: homeRS, set: value => setEdit(prev => ({ ...prev, 'homeRS': value }))},
	// 			{ current: isFinal, set: value => setEdit(prev => ({ ...prev, 'isFinal': value }))}
	// 		]
	//
	// 		// console.log(cells);
	// 		return ({
	// 			id: gameId,
	// 			cells
	// 		})
	// 	})), [])
	// }

	const openNewGameModal = () => setNewGameModal(true)

	const closeNewGameModal = () => setNewGameModal(false)

  return (
    <>
      <AdminHeader current={'Schedule'}/>
      <Center>
        <Stack.Small>
          <DropDownMenu items={leagues} selection={league} setSelection={setLeague} placeholder={'Leagues'}/>
        </Stack.Small>
      </Center>

      <Center>
        <Stack.Small>
          <h1>Games</h1>
        </Stack.Small>
      </Center>

			{/*
				entries={[
					{ id: '', cells: [{ current: '', set: () => {} }] }
        ]}
			*/}

      {/*<Table
        cols={ ['Date', 'Time', 'Away', 'Away RS', 'Home', 'Home RS', 'Final', ''] }
				entries={createEntries()}
				edit={({ id }) => setEdit(prev => ({ ...prev, id }))}
				saveEdit={() => {
					const { id, ...rest } = edit
					editGame({ gameId: id, edit: rest })
            .then(({ date, ...editedGame }) => {
              setSchedule(prevSched => {
                const newSched = Object.keys(prevSched).reduce((reduced, date) => ({
                  ...reduced,
                  [date]: prevSched[date].filter(game => game.gameId !== editedGame.gameId)
                }), {})

                newSched[date] = newSched[date]?.concat(editedGame) || [editedGame]

                return sortAscending({ schedule: newSched })
              })
            })
				}}
      />*/}
      {
			schedule.length ?
      <Table
        items={schedule}
        teams={teams}
        saveEdit={({ edit: { gameId, ...edit } }) =>
          editGame({ gameId, edit })
            .then((editedGame) => {
              setSchedule(prevSched => {
                return prevSched.map(game => game.gameId !== editedGame.gameId ? game : editedGame)
              })
            })
        }
      /> :
			<Center>
        <Stack.Small>
          <h3>There are no games scheduled for this league</h3>
        </Stack.Small>
      </Center>
      }
			<FloatingActionButton onClick={openNewGameModal} display={PLUS}/>
			{
				newGameModal &&
				<form id={'new-game'} style={{ position: 'fixed', top: '200px', left: 'calc(50vw - calc(500px / 2))', backgroundColor: 'var(--secondary)' }} onSubmit={e => {
					e.preventDefault() // prevent page from refreshing

					// TODO: validate game

					// const isValidNewGame = () => {
					// 	return isValidDate(newItem.date) && isValidTime(newItem.time)
					// }

					// const { date, time, away, home } = newGame
					//
					// 	if (!isValidDate(date) || !isValidTime(time)) return
					//
					// 	e.target.value = 'Adding Game...'
					//
					// 	setTimeout(() => {
					// 		addGame({ date, time: formatTimeForRequest(time), awayId: away.id, homeId: home.id })
					// 		// TODO: check if add was successful...
					// 		setNewItem({ date: "", time: "", away: teamInfo[0], home: teamInfo[1] })
					// 	}, 1000)

					addGame({ date: newGame.date, time: formatTimeForRequest(newGame.time), awayId: newGame.away.id, homeId: newGame.home.id })
					.then((game) => {
						return setSchedule(prevSched => {
							return [...prevSched, game]
						})
					})
					.then(() => {
						closeNewGameModal()
					})
				}}>
					<h1>New Game</h1>
					<FormRow>
						<DatePicker onChange={value => setNewGame(prev => ({ ...prev, date: value }))} />
						<Input name={'new-time'} placeholder={'Time'} value={newGame.time} onChange={value => setNewGame(prev => ({ ...prev, time: value }))}/>
					</FormRow>
					<FormRow style={{ justifyContent: 'space-evenly' }}>
						<DropDownMenu items={teamInfo} selection={newGame.away} setSelection={value => setNewGame(prev => ({ ...prev, away: value }))} form={true} placeholder={'Away'}/>
						<DropDownMenu items={teamInfo} selection={newGame.home} setSelection={value => setNewGame(prev => ({ ...prev, home: value }))} form={true} placeholder={'Home'}/>
					</FormRow>
					<FormRow style={{ justifyContent: 'flex-end' }}>
						<SubmitButton display={'Add Game'} formId={'new-game'} disabled={false} />
						<TextButton onClick={closeNewGameModal} display={'Cancel'} />
					</FormRow>
				</form>
			}
    </>
  )
}

ReactDOM.render(<Schedule />, document.querySelector('#root'))
