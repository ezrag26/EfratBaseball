import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'

import NonAdminHeader from "../NonAdminHeader";
import { DropDownMenu } from "../helpers/form";
import { Center, Stack } from "../helpers/Typography";

import { fetchLeagues, fetchStats, fetchTeams } from '../helpers/api'
import { randomBits } from '../helpers/unique'

const Standings = () => {
  const [leagues, setLeagues] = useState([])
  const [league, setLeague] = useState({})
  const [teams, setTeams] = useState({})
  const [stats, setStats] = useState({})

  const calcWinPercentage = ({ wins, losses, ties }) => (wins / (wins + losses + ties)) || 0

  const calcGamesBack = ({ WLDiffLeader, teamStats }) => {
    // Doesn't take into account ties because GB can't really be calculated with ties
    const gamesBack = (((WLDiffLeader.wins - WLDiffLeader.losses) - (teamStats.wins - teamStats.losses)) / 2)
    return gamesBack ? gamesBack.toFixed(1) : '--'
  }

  const winDiff = ({ wins, losses, ties }) => wins - (losses + ties)

  const runDiff = ({ rs, ra }) => rs - ra

  const sortByWinDifferential = (stats) => {
    return Object.keys(stats).sort((aId, bId) => {
      const a = stats[aId]
      const b = stats[bId]

      return winDiff({ wins: b.wins, losses: b.losses, ties: b.ties }) - winDiff({ wins: a.wins, losses: a.losses, ties: a.ties }) ||
        runDiff({ rs: b.rs, ra: b.ra }) - runDiff({ rs: a.rs, ra: a.ra }) // tie-break
    })
      .reduce((reduced, id) => ({ ...reduced, [id]: stats[id] }), {})
  }

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
      fetchStats({ leagueId: league.id })
    ])
      .then(([teams, stats]) => {
        ReactDOM.unstable_batchedUpdates(() => {
          setTeams(teams)
          setStats(sortByWinDifferential(stats))
        })
    })
  }, [league])

  return (
    <>
      <NonAdminHeader current={'Standings'}/>
      <Center>
        <Stack.Small>
          <DropDownMenu items={leagues} selection={league} setSelection={setLeague}/>
        </Stack.Small>
      </Center>

      <Center>
        <Stack.Small>
          <h1>Standings</h1>
        </Stack.Small>
      </Center>

      <Center>
        {
          Object.keys(stats).length ?
          <table className={'table standings wide center'} style={{ minWidth: '80%' }}>
            <thead>
              <tr className={'tr bg-primary color-secondary'}>
                {
                  ['', 'W', 'L', 'T', 'W%', 'GB', 'RS', 'RA', 'RD'].map(column =>
                    <td key={randomBits()}>{column}</td>
                  )
                }
              </tr>
            </thead>
            <tbody>
            {
              Object.keys(stats).map(teamId => {
                const { wins, losses, ties, rs, ra } = stats[teamId]
                const { name, color } = teams[teamId]
                return (
                  <tr key={randomBits()} className={'tr bg-secondary'}>
                    <td style={{ borderLeft: `solid .5rem ${color}` }}>{name}</td>
                    <td>{wins}</td>
                    <td>{losses}</td>
                    <td>{ties}</td>
                    <td>{calcWinPercentage({ wins, losses, ties }).toFixed(3)}</td>
                    <td>{calcGamesBack({ WLDiffLeader: Object.values(stats)[0], teamStats: { wins, losses } })}</td>
                    <td>{rs}</td>
                    <td>{ra}</td>
                    <td style={{ borderRight: `solid .5rem ${color}` }}>{rs - ra}</td>
                  </tr>
                )
              })
            }
            </tbody>
          </table> :
          <div>There are no standings for this league</div>
        }
      </Center>
    </>
  )
}

ReactDOM.render(<Standings />, document.querySelector('#root'))
