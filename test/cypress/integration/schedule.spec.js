const expectMatchup = ({ date, time, away, home }) => {
  cy.contains(date)
    .next().find('table tbody')
    .contains(away.name)
    .next().next().contains(home.name)
    .next().contains(time)
}

// { name: 'Yankees', color: '#1c2841' }
// { name: 'Pirates', color: '#FDB827' }
// { name: 'Cardinals', color: '#C41E3A' }

describe('schedule', () => {
  beforeEach(() => {
    // cy.server()
    cy.route2(/\/leagues\/?\?sort=name\/?/, [
        { id: 'league1Id', name: 'League 1' },
        { id: 'league2Id', name: 'League 2' }
    ]).as('leagues')

    cy.route2(/\/leagues\/.+\/teams\/?/, {
      "Bronx Bombers":    { name: 'Yankees',   color: '#1c2841' },
      "RedBirds":         { name: 'Cardinals', color: '#C41E3A' },
      "Patches OHulihan": { name: 'Pirates',   color: '#FDB827' }
    }).as('teams')

  })

  it('shows game', () => {
    // cy.server()

    cy.route2(/\/leagues\/.+\/schedule\/?/, {
      "2020-07-19": [{ time: 660,    awayId: 'Bronx Bombers',    homeId: 'RedBirds',         isFinal: true,  awayRS: 5, homeRS: 2 }],
      "2020-07-22": [{ time: 720,    awayId: 'Patches OHulihan', homeId: 'Bronx Bombers',    isFinal: false, awayRS: 0, homeRS: 3 }],
      "2020-07-24": [{ time: 724,    awayId: 'Patches OHulihan', homeId: 'Bronx Bombers',    isFinal: false, awayRS: 4, homeRS: 8 }],
      "2020-07-26": [{ time: 1440,   awayId: 'RedBirds',         homeId: 'Patches OHulihan', isFinal: false, awayRS: 5, homeRS: 1 }]
    }).as('schedule')

    cy.visit('/schedule')

    cy.wait('@leagues')
    cy.wait('@teams')
    cy.wait('@schedule')

    expectMatchup({ date: 'July 19, 2020', time: 'F',       away: { name: `Yankees 5`, color: '#1c2841' }, home: { name: 'Cardinals 2', color: '#C41E3A' } })
    expectMatchup({ date: 'July 22, 2020', time: '12:00PM', away: { name: 'Pirates',   color: '#FDB827' }, home: { name: 'Yankees',     color: '#1c2841' } })
    expectMatchup({ date: 'July 24, 2020', time: '12:04PM', away: { name: 'Pirates',   color: '#FDB827' }, home: { name: 'Yankees',     color: '#1c2841' } })
    expectMatchup({ date: 'July 26, 2020', time: '12:00AM', away: { name: 'Cardinals', color: '#C41E3A' }, home: { name: 'Pirates',     color: '#FDB827' } })
  })

  it(`displays schedule for specific leagueId`, () => {
    // cy.server()
    cy.route2(/\/leagues\/league1Id\/schedule\/?/, {
      "2020-07-19": [{ time: 660, awayId: 'Bronx Bombers',    homeId: 'RedBirds',      isFinal: true,  awayRS: 5, homeRS: 2 }],
      "2020-07-22": [{ time: 720, awayId: 'Patches OHulihan', homeId: 'Bronx Bombers', isFinal: false, awayRS: 0, homeRS: 3 }]
    }).as('schedule1')

    cy.visit('/schedule')
    cy.wait('@leagues')
    cy.wait('@teams')
    cy.wait('@schedule1')

    expectMatchup({ date: 'July 19, 2020', time: 'F',       away: { name: `Yankees 5`, color: '#1c2841' }, home: { name: 'Cardinals 2', color: '#C41E3A' } })
    expectMatchup({ date: 'July 22, 2020', time: '12:00PM', away: { name: 'Pirates',   color: '#FDB827' }, home: { name: 'Yankees',     color: '#1c2841' } })

    cy.route2(/\/leagues\/league2Id\/schedule\/?/, {
      "2020-07-24": [{ time: 724,  awayId: 'Patches OHulihan', homeId: 'Bronx Bombers',    isFinal: false, awayRS: 4, homeRS: 8 }],
      "2020-07-26": [{ time: 1440, awayId: 'RedBirds',         homeId: 'Patches OHulihan', isFinal: false, awayRS: 5, homeRS: 1 }]
    }).as('schedule2')

    cy.contains('League 1').click()
    cy.contains('League 2').click()
    cy.wait('@teams')
    cy.wait('@schedule2')

    expectMatchup({ date: 'July 24, 2020', time: '12:04PM', away: { name: 'Pirates',   color: '#FDB827' }, home: { name: 'Yankees',     color: '#1c2841' } })
    expectMatchup({ date: 'July 26, 2020', time: '12:00AM', away: { name: 'Cardinals', color: '#C41E3A' }, home: { name: 'Pirates',     color: '#FDB827' } })
  })

  it.skip('does not fetch schedule when clicking on league if already showing its schedule', () => {
    const requests = []
    // cy.server()
    cy.route2(/\/leagues\/.+\/schedule\/?/, {
      request: (xhr) => {
        requests.push(xhr.url)
      },
      body: {
        "2020-07-19": [{ time: 660,    awayId: 'Bronx Bombers',    homeId: 'RedBirds',         isFinal: true,  awayRS: 5, homeRS: 2 }],
        "2020-07-22": [{ time: 720,    awayId: 'Patches OHulihan', homeId: 'Bronx Bombers',    isFinal: false, awayRS: 0, homeRS: 3 }],
        "2020-07-24": [{ time: 724,    awayId: 'Patches OHulihan', homeId: 'Bronx Bombers',    isFinal: false, awayRS: 4, homeRS: 8 }],
        "2020-07-26": [{ time: 1440,   awayId: 'RedBirds',         homeId: 'Patches OHulihan', isFinal: false, awayRS: 5, homeRS: 1 }]
      }
    }).as('schedule')

    cy.visit('/schedule') // should send request => requests.length === 1
    cy.wait('@leagues')
    cy.wait('@teams')
    cy.wait('@schedule')

    cy.contains('League 1').click()
    cy.get('ul').contains('League 1').click() // should not send request => requests.length === 1

    cy.contains('League 1').click()
    cy.get('ul').contains('League 2').click() // should send request => requests.length === 2
      .then(() => {
        expect(requests.length).to.equal(2)
        expect(requests[0]).to.equal('http://localhost:8010/leagues/league1Id/schedule')
        expect(requests[1]).to.equal('http://localhost:8010/leagues/league2Id/schedule')
      })
  })
})