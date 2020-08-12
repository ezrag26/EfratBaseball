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
      1: { date: '19 Jul 2020', time: 'F', away: { name: 'Yankees', color: '#1c2841' }, home: { name: 'Cardinals', color: '#C41E3A' } },
      2: { date: '22 Jul 2020', time: '2:30PM', away: { name: 'Pirates', color: '#FDB827' }, home: { name: 'Yankees', color: '#1c2841' } },
      3: { date: '26 Jul 2020', time: '2:30PM', away: { name: 'Cardinals', color: '#C41E3A' }, home: { name: 'Pirates', color: '#FDB827' } }
    }).as('schedule')

    cy.visit('/schedule')
    cy.wait('@schedule')

    expectMatchup({ date: '19 Jul 2020', time: 'F', away: { name: 'Yankees', color: '#1c2841' }, home: { name: 'Cardinals', color: '#C41E3A' } })
    expectMatchup({ date: '22 Jul 2020', time: '2:30PM', away: { name: 'Pirates', color: '#FDB827' }, home: { name: 'Yankees', color: '#1c2841' } })
    expectMatchup({ date: '26 Jul 2020', time: '2:30PM', away: { name: 'Cardinals', color: '#C41E3A' }, home: { name: 'Pirates', color: '#FDB827' } })
  })

  it(`displays schedule for specific leagueId's`, () => {
    cy.server()
    cy.route('/leagues/*/schedule', {
      1: { date: '19 Jul 2020', time: 'F', away: { name: 'Yankees', color: '#1c2841' }, home: { name: 'Cardinals', color: '#C41E3A' } },
      2: { date: '22 Jul 2020', time: '2:30PM', away: { name: 'Pirates', color: '#FDB827' }, home: { name: 'Yankees', color: '#1c2841' } },
    }).as('schedule')

    cy.visit('/schedule')
    cy.wait('@schedule')

    expectMatchup({ date: '19 Jul 2020', time: 'F', away: { name: 'Yankees', color: '#1c2841' }, home: { name: 'Cardinals', color: '#C41E3A' } })
    expectMatchup({ date: '22 Jul 2020', time: '2:30PM', away: { name: 'Pirates', color: '#FDB827' }, home: { name: 'Yankees', color: '#1c2841' } })

    cy.route('/leagues/*/schedule', {
      1: { date: '19 Aug 2020', time: '2:30PM', away: { name: 'Yankees', color: '#1c2841' }, home: { name: 'Cardinals', color: '#C41E3A' } },
      2: { date: '22 Aug 2020', time: 'F', away: { name: 'Cardinals', color: '#C41E3A' }, home: { name: 'Pirates', color: '#FDB827' } },
    }).as('schedule')

    cy.contains('League 2').click()
    cy.wait('@schedule')

    expectMatchup({ date: '19 Aug 2020', time: '2:30PM', away: { name: 'Yankees', color: '#1c2841' }, home: { name: 'Cardinals', color: '#C41E3A' } })
    expectMatchup({ date: '22 Aug 2020', time: 'F', away: { name: 'Cardinals', color: '#C41E3A' }, home: { name: 'Pirates', color: '#FDB827' } })
  })
})