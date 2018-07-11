const express = require('express')
const bodyParser = require('body-parser')
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

// var send = require('gmail-send')({
//     user: 'popfever.contact@gmail.com',
//     pass: 'popfever123'
// })

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

    if (!Object.keys(req.body).length || !req.body.mail_to) return res.end('failed')

    const mailOptions = {
        from: credentials.user, // sender address
        to: req.body.mail_to, // list of receivers
        subject: req.body.subject || 'Influencer', // Subject line
        html: req.body.message || 'No message' // plain text body
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if(err)
          console.log(err)
        else
          console.log(info);
     });

    // send({
    //     to: req.body.mail_to,
    //     subject: req.body.subject || 'Influencer',
    //     html: req.body.message || 'No message'
    // })

    res.writeHead(200)
    res.end('good')
})

const port = process.env.PORT || 5555
app.listen(port, () => console.log(`Server is running on port ${port}`))