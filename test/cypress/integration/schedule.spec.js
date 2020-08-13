const expectMatchup = ({ date, time, away, home }) => {
  cy.get('table tbody')
    .contains(date)
    .next().contains(time)
    .next().contains(away.name)
    .next().next().contains(home.name)
}

describe('schedule', () => {
  it('shows game', () => {
    cy.server()
    cy.route('/leagues/*/schedule', {
      "2020-07-19": { time: 'F', away: { name: 'Yankees', color: '#1c2841' }, home: { name: 'Cardinals', color: '#C41E3A' } },
      "2020-07-22": { time: '2:30PM', away: { name: 'Pirates', color: '#FDB827' }, home: { name: 'Yankees', color: '#1c2841' } },
      "2020-07-26": { time: '2:30PM', away: { name: 'Cardinals', color: '#C41E3A' }, home: { name: 'Pirates', color: '#FDB827' } }
    }).as('schedule')

    cy.visit('/schedule')
    cy.wait('@schedule')

    expectMatchup({ date: 'July 19, 2020', time: 'F', away: { name: 'Yankees', color: '#1c2841' }, home: { name: 'Cardinals', color: '#C41E3A' } })
    expectMatchup({ date: 'July 22, 2020', time: '2:30PM', away: { name: 'Pirates', color: '#FDB827' }, home: { name: 'Yankees', color: '#1c2841' } })
    expectMatchup({ date: 'July 26, 2020', time: '2:30PM', away: { name: 'Cardinals', color: '#C41E3A' }, home: { name: 'Pirates', color: '#FDB827' } })
  })

  it(`displays schedule for specific leagueId`, () => {
    cy.server()
    cy.route('/leagues/*/schedule', {
      "2020-07-19": { time: 'F', away: { name: 'Yankees', color: '#1c2841' }, home: { name: 'Cardinals', color: '#C41E3A' } },
      "2020-07-22": { time: '2:30PM', away: { name: 'Pirates', color: '#FDB827' }, home: { name: 'Yankees', color: '#1c2841' } },
    }).as('schedule')

    cy.visit('/schedule')
    cy.wait('@schedule')

    expectMatchup({ date: 'July 19, 2020', time: 'F', away: { name: 'Yankees', color: '#1c2841' }, home: { name: 'Cardinals', color: '#C41E3A' } })
    expectMatchup({ date: 'July 22, 2020', time: '2:30PM', away: { name: 'Pirates', color: '#FDB827' }, home: { name: 'Yankees', color: '#1c2841' } })

    cy.route('/leagues/*/schedule', {
      "2020-08-19": { date: '', time: '2:30PM', away: { name: 'Yankees', color: '#1c2841' }, home: { name: 'Cardinals', color: '#C41E3A' } },
      "2020-08-22": { date: '', time: 'F', away: { name: 'Cardinals', color: '#C41E3A' }, home: { name: 'Pirates', color: '#FDB827' } },
    }).as('schedule')

    cy.contains('League 2').click()
    cy.wait('@schedule')

    expectMatchup({ date: 'August 19, 2020', time: '2:30PM', away: { name: 'Yankees', color: '#1c2841' }, home: { name: 'Cardinals', color: '#C41E3A' } })
    expectMatchup({ date: 'August 22, 2020', time: 'F', away: { name: 'Cardinals', color: '#C41E3A' }, home: { name: 'Pirates', color: '#FDB827' } })
  })

  it('does not fetch schedule when clicking on league if already showing its schedule', () => {
    const requests = []
    cy.server()
    cy.route({
      method: 'GET',
      url: '/leagues/*/schedule',
      onRequest: (xhr) => {
        requests.push(xhr.url)
      },
      response: {
        "2020-07-19": {
          time: 'F',
          away: {name: 'Yankees', color: '#1c2841'},
          home: {name: 'Cardinals', color: '#C41E3A'}
        },
        "2020-07-22": {
          time: '2:30PM',
          away: {name: 'Pirates', color: '#FDB827'},
          home: {name: 'Yankees', color: '#1c2841'}
        }
      }
    }).as('schedule')

    cy.visit('/schedule') // should send request => requests.length === 1
    cy.wait('@schedule')

    cy.contains('League 1').click() // should not send request => requests.length === 1

    cy.contains('League 2').click() // should send request => requests.length === 2
      .then(() => {
        expect(requests.length).to.equal(2)
      })
  })
})