const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

require('dotenv').load();

var client = require('twilio')(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
   );
   

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('views', './views');

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    const data = {
        person: {
            firstName: "Preston",
            lastName: "Hill",
        }
    }

    res.render('index', data);
});

app.get('/contact', (req,res) => {
    res.render('contact');
});



app.post('/thanks', (req,res) => {
    console.log(req.body);
    client.messages.create({
        from: process.env.TWILIO_PHONE_NUMBER,
        to: process.env.CELL_PHONE_NUMBER,
        body: req.body.firstName + " " +  req.body.lastName + " requested to contact you! His email address is " + req.body.email,
       });
     
    res.render('thanks', { contact: req.body });
    
});

app.use(express.static(__dirname + "/styles"));

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log('listening at localhost:8080');
});

module.exports = app;





