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
    cy.route('/leagues/*/standings', {
      2: { name: 'Yankees', wins: 5, loses: 3, ties: 0, RS: 63, RA: 37 },
      3: { name: 'Cardinals', wins: 4, loses: 3, ties: 1, RS: 62, RA: 46 },
      1: { name: 'Pirates', wins: 2, loses: 5, ties: 1, RS: 34, RA: 76 }
    }).as('standings')

    cy.visit('/standings')
    cy.wait('@standings')

    expectTeamData({ name: 'Yankees', wins: 5, loses: 3, ties: 0, RS: 63, RA: 37 })
    expectTeamData({ name: 'Cardinals', wins: 4, loses: 3, ties: 1, RS: 62, RA: 46 })
    expectTeamData({ name: 'Pirates', wins: 2, loses: 5, ties: 1, RS: 34, RA: 76 })
  })

  it('displays winning percent as number between 0 and 1 with 3 decimal places', () => {
    cy.server()
    cy.route('/leagues/*/standings', {
      2: { name: 'Yankees', wins: 5, loses: 0, ties: 0, RS: 63, RA: 37 },
      3: { name: 'Cardinals', wins: 1, loses: 15, ties: 0, RS: 62, RA: 46 },
      1: { name: 'Pirates', wins: 0, loses: 5, ties: 1, RS: 34, RA: 76 }
    }).as('standings')

    cy.visit('/standings')
    cy.wait('@standings')

    cy.contains('Yankees').parent().contains(/^1.000$/)
    cy.contains('Cardinals').parent().contains(/^0.063$/)
    cy.contains('Pirates').parent().contains(/^0.000$/)
  })

  it(`displays games back with 1 decimal place and leader with 2 dashes (--)`, () => {
    cy.server()
    cy.route('/leagues/*/standings', {
      2: { name: 'Yankees', wins: 5, loses: 3, ties: 0, RS: 63, RA: 37 },
      3: { name: 'Cardinals', wins: 4, loses: 3, ties: 1, RS: 62, RA: 46 },
      1: { name: 'Pirates', wins: 2, loses: 4, ties: 1, RS: 34, RA: 76 }
    }).as('standings')

    cy.visit('/standings')
    cy.wait('@standings')

    cy.contains('Yankees').parent().contains(/^--$/)
    cy.contains('Cardinals').parent().contains(/^0.5$/)
    cy.contains('Pirates').parent().contains(/^2.0$/)
  })
})