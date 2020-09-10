const expectTeamData = ({ name, wins, losses, ties, rs, ra }) => {
  cy.get('table tbody')
    .contains(name)
    .next().contains(wins)
    .next().contains(losses)
    .next().contains(ties)
    .next().contains(wins / (wins + losses + ties))
    .next()
    .next().contains(rs)
    .next().contains(ra)
    .next().contains(rs - ra)
}

describe('standings', () => {
  beforeEach(() => {
    // cy.server()
    cy.route2(/\/leagues\?sort=name\/?/, [
        { id: 'league1Id', name: 'League 1' },
        { id: 'league2Id', name: 'League 2' }
    ]).as('leagues')

    cy.route2(/\/leagues\/.+\/teams\/?/, {
      "Bronx Bombers":    { name: 'Yankees',   color: '#1c2841' },
      "RedBirds":         { name: 'Cardinals', color: '#C41E3A' },
      "Patches OHulihan": { name: 'Pirates',   color: '#FDB827' }
    }).as('teams')

  })
  it('shows the standings', () => {
    // cy.server()
    cy.route2(/\/leagues\/league1Id\/stats\/?/, {
      "Bronx Bombers":    { wins: 5, losses: 3, ties: 0, rs: 63, ra: 37 },
      "RedBirds":         { wins: 4, losses: 3, ties: 1, rs: 62, ra: 46 },
      "Patches OHulihan": { wins: 2, losses: 5, ties: 1, rs: 34, ra: 76 }
    }).as('standings')

    cy.visit('/standings')
    cy.wait('@leagues')
    cy.wait('@standings')

    expectTeamData({ name: 'Yankees', wins: 5, losses: 3, ties: 0, rs: 63, ra: 37 })
    expectTeamData({ name: 'Cardinals', wins: 4, losses: 3, ties: 1, rs: 62, ra: 46 })
    expectTeamData({ name: 'Pirates', wins: 2, losses: 5, ties: 1, rs: 34, ra: 76 })
  })

  it('displays winning percent as number in range [0, 1] with 3 decimal places', () => {
    // cy.server()
    cy.route2(/\/leagues\/.+\/stats\/?/, {
      "Bronx Bombers":    { wins: 5, losses: 0, ties: 0, rs: 63, ra: 37 },
      "RedBirds":         { wins: 1, losses: 15, ties: 0, rs: 62, ra: 46 },
      "Patches OHulihan": { wins: 0, losses: 5, ties: 1, rs: 34, ra: 76 }
    }).as('standings')

    cy.visit('/standings')
    cy.wait('@leagues')
    cy.wait('@standings')

    cy.contains('Yankees').parent().contains(/^1.000$/)
    cy.contains('Cardinals').parent().contains(/^0.063$/)
    cy.contains('Pirates').parent().contains(/^0.000$/)
  })

  it(`displays games back with 1 decimal place and leader with 2 dashes (--)`, () => {
    // cy.server()
    cy.route2(/\/leagues\/.+\/stats\/?/, {
      "Bronx Bombers":    { wins: 5, losses: 3, ties: 0, rs: 63, ra: 37 },
      "RedBirds":         { wins: 4, losses: 3, ties: 1, rs: 62, ra: 46 },
      "Patches OHulihan": { wins: 2, losses: 4, ties: 1, rs: 34, ra: 76 }
    }).as('standings')

    cy.visit('/standings')
    cy.wait('@leagues')
    cy.wait('@standings')

    cy.contains('Yankees').parent().contains(/^--$/)
    cy.contains('Cardinals').parent().contains(/^0.5$/)
    cy.contains('Pirates').parent().contains(/^2.0$/)
  })
})