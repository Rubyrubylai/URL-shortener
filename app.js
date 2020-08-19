const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const session = require('express-session')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const URL = require('./models/URL')
const flash = require('connect-flash')

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

app.use(session({ secret: 'your secret key', resave: 'false', saveUninitialized: 'true' }))
app.use(flash())

app.get('/', (req, res) => {
    return res.render('index')
})

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    next()
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
            var ShortenURL = 'https://sheltered-beyond-20769.herokuapp.com/' + word
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

app.get('/success', (req, res) => {
    return res.render('success')
})

app.post('/success', (req, res) => {
    req.flash('success_msg', '你已成功複製')
    return res.redirect('/success')
})

app.get('/:id', (req, res) => {
    let reqURL = 'https://sheltered-beyond-20769.herokuapp.com/' + req.params.id
    URL.findOne({ ShortenURL: reqURL }).then(url => {
        if (url) {
            let LastURL = url.OriginalURL
            return res.redirect(LastURL)
        } else {
            return res.redirect('/')
        }  
    })
    .catch(err => console.error(err) )
})

app.listen(process.env.PORT || 3000, () => {
    console.log('app is running.')
})