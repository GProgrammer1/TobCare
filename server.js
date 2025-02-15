const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const doctorRouter = require('./Routers/doctorRouter');
const cityRouter = require('./Routers/cityRouter');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());
app.use('/cities', cityRouter);
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

app.set('view engine', 'ejs');
app.set('views', 'views');


app.use('/doctor', doctorRouter);
app.get('/', (req, res) => {
    res.render('login');
});

