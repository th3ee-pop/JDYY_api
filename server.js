var mongoose = require('mongoose');
    express = require('express');
    cors = require('cors');
    morgan = require('morgan');
    config = require('./config/database');
    passport = require('passport');
    routes = require('./routes/routes');
    bodyParser = require('body-parser');
    

mongoose.connect(config.database);

// mongoose.connection.on('open', function(){
//     console.log('Mongo is connected');
    var app = express();
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

app.use(morgan('dev'));
    app.use(cors());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());
    app.use(routes);
    app.use(passport.initialize());
    require('./config/passport')(passport);
    
    app.listen(3333, function(){
        console.log('server is running');
    })
// })

