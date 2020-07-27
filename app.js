const express = require('express')
const app = express()
const exphbs = require('express-handlebars')

app.engine('handlebars', exphbs())
app.set('view engine', 'handlebars')

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/success', (req, res) => {
    res.render('success')
})

app.listen('3000', () => {
    console.log('app is running.')
})