import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import Header from "../Header";
import { XMLHttpRequestAsPromise } from '../helpers/request'
import { randomBits } from '../helpers/unique'

const fetchStandings = ({ leagueId }) => {
  return XMLHttpRequestAsPromise({
    method: 'GET',
    url: `http://localhost:8010/leagues/${leagueId}/standings`,
    options: {
      responseType: 'json'
    }
  })
}

const Standings = () => {
  const [standings, setStandings] = useState({})

  const calcWinPercentage = ({ team }) => team.wins / (team.wins + team.loses + team.ties)

  const calcGamesBack = ({ winLossDiffLeader, team }) => {
    // Doesn't take into account ties because GB can't really be calculated with ties
    const gamesBack = (((winLossDiffLeader.wins - winLossDiffLeader.loses) - (team.wins - team.loses)) / 2)
    return gamesBack ? gamesBack.toFixed(1) : '--'
  }

  const sortByWinDifferential = () => {
    return Object.values(standings).sort((a, b) => {
      const aWinDiff = a.wins - (a.loses + a.ties)
      const bWinDiff = b.wins - (b.loses + b.ties)
      const diff = bWinDiff - aWinDiff

      return diff ? diff : (b.RS - b.RA) - (a.RS - a.RA)
    })
  }

  useEffect(() => {
    fetchStandings({ })
      .then(standings => setStandings(standings))
  }, [])

  const sorted = sortByWinDifferential()

  return (
    <>
      <Header />
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
            sorted.map(team =>
              <tr key={randomBits()}>
                <td style={{ backgroundColor: '#f2f2f2'}}>{team.name}</td>
                <td>{team.wins}</td>
                <td>{team.loses}</td>
                <td>{team.ties}</td>
                <td>{calcWinPercentage({ team }).toFixed(3)}</td>
                <td>{calcGamesBack({ winLossDiffLeader: sorted[0], team })}</td>
                <td>{team.RS}</td>
                <td>{team.RA}</td>
                <td>{team.RS - team.RA}</td>
              </tr>
            )
          }
          </tbody>
        </table>
      </div>
    </>
  )
}

ReactDOM.render(<Standings />, document.querySelector('#root'))