const test = require('ava')

const { randomString } = require('./helpers/unique')

const { register } = require('./helpers/test/register')

test('registering requires first, last, email, carrier, phone, and password', t => {
  const first = randomString()
  const last = randomString()
  const email = `${randomString()}@${randomString()}.com`
  const carrier = '050'
  const phone = 5151551
  const password = randomString()

  return Promise.all(
    [
      // valid
      register({ first, last, email, carrier, phone, password }).catch(err => err),
      // invalid
      register({ last, email,carrier, phone, password }).catch(err => err),
      register({ first, email,carrier, phone, password }).catch(err => err),
      register({ first, last,carrier, phone, password }).catch(err => err),
      register({ first, last, email, phone, password }).catch(err => err),
      register({ first, last, email, carrier, password }).catch(err => err),
      register({ first, last, email, carrier, phone }).catch(err => err),
    ]
  )
    .then(([valid, ...rest]) => {
      t.assert(valid.statusCode === 200)
      rest.map(invalidForm => t.assert(invalidForm.statusCode === 400))
    })
})

test('registering with email that already exists responds with 200', t => {
  const email = `${randomString()}@${randomString()}.com`
  return register({ first: 'First', last: "Last", email, carrier: '054', phone: 5155555, password: 'password' })
    .then(() =>
      register({ first: `Doesn't matter`, last: `Nor does this`, email, carrier: '054', phone: 1111111, password: 'also does not matter' })
        .then(res => t.assert(res.statusCode === 200))
    )
})