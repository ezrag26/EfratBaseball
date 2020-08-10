import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import Header from "../Header";
const request = new XMLHttpRequest()

const sortStandings = (standings) => {
  return Object.values(standings).sort((a, b) => {
    const aWinDiff = a.wins - (a.loses + a.ties)
    const bWinDiff = b.wins - (b.loses + b.ties)

    if (aWinDiff > bWinDiff) return -1
    if (aWinDiff < bWinDiff) return 1
    return (b.RS - b.RA) - (a.RS - a.RA)
  })
}

const fetchStandings = ({ setStandings, leagueId = 'bypass' }) => {
  request.onload = () => {
    setStandings(sortStandings(request.response))
  }
  request.open('GET', `http://localhost:8010/${leagueId}/standings`)
  request.responseType = "json"
  request.send()
}

const randomBits = () => Math.random().toString(36).slice(2)

const Standings = () => {
  const [standings, setStandings] = useState([])

  const calcWinPercentage = ({ team }) => team.wins / (team.wins + team.loses + team.ties)

  const calcGamesBack = ({ winLossDiffLeader, team }) => {
    return (((winLossDiffLeader.wins - winLossDiffLeader.loses) - (team.wins - team.loses)) / 2)
  }

  useEffect(() => {
    fetchStandings({ setStandings })
  }, [])

  return (
    <>
      <Header />
      <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '2rem' }}>
        <table>
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
            standings.map(team =>
              <tr key={randomBits()}>
                <td>{team.name}</td>
                <td>{team.wins}</td>
                <td>{team.loses}</td>
                <td>{team.ties}</td>
                <td>{calcWinPercentage({ team })}</td>
                <td>{calcGamesBack({ winLossDiffLeader: standings[0], team })}</td>
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