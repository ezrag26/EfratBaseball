const expectTeamData = ({ name, wins, loses, ties, RS, RA }) => {
  cy.get('table tbody')
    .contains(name)
    .next().contains(wins)
    .next().contains(loses)
    .next().contains(ties)
    .next().contains(wins / (wins + loses + ties))
    .next()
    .next().contains(RS)
    .next().contains(RA)
    .next().contains(RS - RA)
}

describe('standings', () => {
  it('shows the standings', () => {
    cy.server()
    cy.route('/bypass/standings', {
      2: { name: 'Ariyot', wins: 5, loses: 3, ties: 0, RS: 63, RA: 37 },
      3: { name: 'Bombers', wins: 4, loses: 3, ties: 1, RS: 62, RA: 46 },
      1: { name: 'MBKI', wins: 2, loses: 5, ties: 1, RS: 34, RA: 76 }
    }).as('standings')

    cy.visit('/standings')
    cy.wait('@standings')

    expectTeamData({ name: 'Ariyot', wins: 5, loses: 3, ties: 0, RS: 63, RA: 37 })
    expectTeamData({ name: 'Bombers', wins: 4, loses: 3, ties: 1, RS: 62, RA: 46 })
    expectTeamData({ name: 'MBKI', wins: 2, loses: 5, ties: 1, RS: 34, RA: 76 })
  })
})