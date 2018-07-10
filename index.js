const express = require('express')
const bodyParser = require('body-parser')

var send = require('gmail-send')({
    user: 'popfever.contact@gmail.com',                // Your GMail account used to send emails
    pass: 'popfever123'
})

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(bodyParser.raw())

app.get('/', (req, res) => {
    res.end('good')
})

app.post('/send', bodyParser.json({ type: 'application/*+json' }), (req, res) => {
    console.log(req.body)

    if (!Object.keys(req.body).length || !req.body.mail_to) return res.end('failed')

    send({
        to: req.body.mail_to,
        subject: req.body.subject || 'Influencer',
        html: req.body.message || 'No message'
    })

    res.writeHead(200)
    res.end('good')
})

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Server is running on port ${port}`))