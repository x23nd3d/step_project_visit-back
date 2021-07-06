const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);
const registerRouter = require('./routes/register');
const cardRouter = require('./routes/card');
const MONGODB_URI = 'mongodb://localhost:27017/visit';
const middleware = require('./middleware/variables');
const userMiddleware = require('./middleware/user');
const morgan = require('morgan');


const app = express();
// app.use(morgan('dev'));

const store = new MongoStore({
    collection: 'sessions',
    uri: MONGODB_URI
});

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(session({
    secret: 'some secret value',
    resave: false,
    saveUninitialized: false,
    store
}));
app.use(middleware);
app.use(userMiddleware);


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed
    next();
})


app.use('/auth', registerRouter);
app.use('/cards', cardRouter);


const PORT = process.env.port || 3000;

async function start() {
    try {
        await mongoose.connect(MONGODB_URI, {  // before the server starts - it will try to connect to local mongodb server, "test" - is the DB name
            useNewUrlParser: true,  // params which should be included for proper mongodb connection
            useFindAndModify: false,  // params which should be included for proper mongodb connection
            useUnifiedTopology: true  // params which should be included for proper mongodb connection
        });

        app.listen(PORT, () => {
            console.log(`Server has started at port ${PORT}`)
        });
        console.log('MongoDB Started.');

    } catch (e) {
        console.log('Error', e);
    }


}

start();






