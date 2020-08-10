const expectMatchup = ({ date, time, away, home }) => {
  cy.get('table tbody')
    .contains(date)
    .next().contains(time)
    .next().contains(away)
    .next().next().contains(home)
}

describe('schedule', () => {
  it('shows game', () => {
    cy.server()
    cy.route('http://localhost:8010/bypass/schedule', {
      1: { date: '19 Jul 2020', time: 'F', away: 'Ariyot', home: 'Bombers', awayColor: 'yellow', homeColor: 'dodgerblue' },
      2: { date: '22 Jul 2020', time: '2:30PM', away: 'Bombers', home: 'MBKI', awayColor: 'dodgerblue', homeColor: 'green' },
      3: { date: '26 Jul 2020', time: '2:30PM', away: 'MBKI', home: 'Ariyot', awayColor: 'green', homeColor: 'yellow' }
    }).as('schedule')

    cy.visit('/schedule')
    cy.wait('@schedule')

    expectMatchup({ date: '19 Jul 2020', time: 'F', away: 'Ariyot', home: 'Bombers' })
    expectMatchup({ date: '22 Jul 2020', time: '2:30PM', away: 'Bombers', home: 'MBKI' })
    expectMatchup({ date: '26 Jul 2020', time: '2:30PM', away: 'MBKI', home: 'Ariyot' })
  })
})