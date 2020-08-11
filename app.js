const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const URL = require('./models/URL')

if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/UrlShortener', { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('error', ()=>{
    console.log('mongodb error!')
})

db.once('open', ()=> {
    console.log('mongodb connected!')
})


app.engine('handlebars', exphbs())
app.set('view engine', 'handlebars')

app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.render('index')
})

app.post('/', (req, res) => {
    URL.findOne({ OriginalURL: req.body.URL }).then(url => {
        let errors = []
        if (!req.body.URL) {
            errors.push({ messages: '此欄位不可空白' })
        }
        if (url) {
            errors.push({ messages: `此連結已產生過為${url.ShortenURL}` })
        }
        if (errors.length > 0) {
            return res.render('index', { errors })
        }
        else {
            var word = Math.random().toString(36).slice(-5)
            var ShortenURL = 'http://localhost:3000/' + word
            var OriginalURL =  req.body.URL
            const url = new URL({
                OriginalURL: OriginalURL,
                ShortenURL: ShortenURL
            })
            url.save(err => {
                if (err) return console.error(err)
                return res.render('success', { ShortenURL, OriginalURL })
            })
        }
    })
    
})

app.listen(process.env.port || 3000, () => {
    console.log('app is running.')
})