const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const path = require('path')
const nodemailer = require('nodemailer');

const credentials = {
    user: 'popfever.contact@gmail.com',
    pass: 'popfever123'
}

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: credentials.user,
        pass: credentials.pass
    }
});


const requiredFields = ['email', 'mail_to', 'name', 'username', 'role']

const app = express()

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(bodyParser.raw())

app.get('/', (req, res) => {
    res.end('good')
})

app.post('/send', bodyParser.json({ type: 'application/*+json' }), (req, res) => {
    console.log(req.body)


    if (!Object.keys(req.body).length) return res.end('failed')

    for (let r of requiredFields) {
        if (!(r in req.body) || req.body[r].length == 0) return res.end('failed')
    }

    ejs.renderFile(path.join(__dirname, 'index.ejs'), {data: req.body}, (err, str) => {

        if (err) {
            console.error(err)
            res.writeHead(500, 'Something went wrong!')
            return res.end('failed')
        }

        const mailOptions = {
            to: req.body.mail_to, // list of receivers
            from: req.body.email || credentials.user, // sender address
            subject: req.body.subject || 'Influencer', // Subject line
            html: str || 'No message' // plain text body
        };
    
        transporter.sendMail(mailOptions, (err, info) => {
            if(err) {
                res.end('failed')
                console.log(err)
            } else {
                console.log(info)
            }
        });

         
        res.writeHead(200)
        res.end('good')
    })
})

const port = process.env.PORT || 5555
app.listen(port, () => console.log(`Server is running on port ${port}`))