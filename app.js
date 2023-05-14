const express = require('express')
const Datastore = require('nedb')
const app = express()
const port = process.env.PORT || 5000

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

app.use(express.static('public'))
app.use(express.json())

const database = new Datastore('orders.db')
database.loadDatabase()

app.post('/api', (req, res) => {
    let request = req.body
    console.log(request)

    database.insert(request)
  
    res.json({ message: 'Order sent' })
})