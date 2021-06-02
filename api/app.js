require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')

const clientPath = path.join(__dirname, '../', 'client', 'build')

const apiRoutes = require('./routes')

const app = express()
app.use(express.static(clientPath))


app.use(cors())
app.use(bodyParser.json())

app.use('/api', apiRoutes)

app.get('/*', (req, res) => {
    res.sendFile(path.join(clientPath, 'index.html'))
})

app.use(express.static('./client/public/img'))

const PORT = process.env.API_PORT || 7001

app.listen(PORT, () => {
    console.log(`Starting server in PORT ${PORT}`)
})