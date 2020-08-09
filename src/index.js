const express = require('express')
const path = require('path')

require('dotenv').config()
const { PORT } = process.env

const app = express()

app.use(express.static(path.join(__dirname, "..", "public")))

app.get('/', (req, res) => {
  console.log('GET /')
  res.sendStatus(200)
})

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))