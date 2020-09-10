import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'

import NonAdminHeader from "../NonAdminHeader";
import { fetchLeagues, fetchStats, fetchTeams } from '../helpers/api'
import { DropDownMenu } from "../helpers/form";
import Stack from "../helpers/Stack";
import { randomBits } from '../helpers/unique'

const Standings = () => {
  const [leagues, setLeagues] = useState([])
  const [league, setLeague] = useState({})
  const [teams, setTeams] = useState({})
  const [stats, setStats] = useState({})

  const calcWinPercentage = ({ team }) => (team.wins / (team.wins + team.losses + team.ties)) || 0

  const calcGamesBack = ({ winLossDiffLeader, team }) => {
    // Doesn't take into account ties because GB can't really be calculated with ties
    const gamesBack = (((winLossDiffLeader.wins - winLossDiffLeader.losses) - (team.wins - team.losses)) / 2)
    return gamesBack ? gamesBack.toFixed(1) : '--'
  }

  const sortByWinDifferential = (stats) => {
    return Object.keys(stats).sort((aId, bId) => {
      const a = stats[aId]
      const b = stats[bId]
      const aWinDiff = a.wins - (a.losses + a.ties)
      const bWinDiff = b.wins - (b.losses + b.ties)
      const diff = bWinDiff - aWinDiff

      return diff ? diff : (b.rs - b.ra) - (a.rs - a.ra) // tie-break
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
        setTeams(teams)
        setStats(sortByWinDifferential(stats))
    })
  }, [league])

  return (
    <>
      <NonAdminHeader />
      <Stack.Small>
        <DropDownMenu items={leagues} selection={league} setSelection={setLeague}/>
      </Stack.Small>
      <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '2rem' }}>
        <table className={'standings'} style={{ minWidth: '80%' }}>
          <thead>
            <tr>
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
              const team = stats[teamId]
              return (
                <tr key={randomBits()}>
                  <td style={{backgroundColor: '#f2f2f2'}}>{teams[teamId] && teams[teamId].name}</td>
                  <td>{team.wins}</td>
                  <td>{team.losses}</td>
                  <td>{team.ties}</td>
                  <td>{calcWinPercentage({team}).toFixed(3)}</td>
                  <td>{calcGamesBack({winLossDiffLeader: Object.values(stats)[0], team })}</td>
                  <td>{team.rs}</td>
                  <td>{team.ra}</td>
                  <td>{team.rs - team.ra}</td>
                </tr>
              )
            })
          }
          </tbody>
        </table>
      </div>
    </>
  )
}

ReactDOM.render(<Standings />, document.querySelector('#root'))