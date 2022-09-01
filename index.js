const connectToMongo = require('./db');
const express = require('express')
var cors = require('cors')

connectToMongo()

const app = express()
const port = process.env.PORT || 8000

app.use(cors())

app.use(express.json())

//Available Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/posts', require('./routes/posts'))
app.use('/api/messages', require('./routes/messages'))


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/api/v1/login', (req, res) => {
    res.send('login')
})

app.get('/api/v1/signup', (req, res) => {
    res.send('signup')
})

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`)
})

