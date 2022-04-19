
const express = require('express')
const app = express()
const {test, PORT} = require('./library/constant')
console.log(PORT, test)
app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
  })