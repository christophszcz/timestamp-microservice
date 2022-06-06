// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();
var moment = require('moment');

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

app.get("/api/hello", function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.get("/api/:date?", function(req, res, next) {
  next();
}, function(req, res) {
  const dateParam = new Date(req.params.date);
  const isValidMillisecondDate = moment(Number(req.params.date)).isValid();
  const isMillisecondNumber = typeof Number(req.params.date) === 'number';
  const isValidDate = moment(dateParam).isValid();
  const isProperDateFormat = moment(dateParam,'YYYY-MM-DD', true).isValid();

  if (!dateParam) {
    const currentDate = new Date();
    const currentDateTimeUTC = currentDate.toUTCString();
    const currentTimeMilliseconds = currentDate.getTime();
    res.json({ unix: currentTimeMilliseconds, utc: currentDateTimeUTC });
  } else if (isValidMillisecondDate && isMillisecondNumber) {
    const millisecondsValue = req.params.date;
    const utcConversion = new Date(Number(millisecondsValue)).toUTCString();
    res.json({ unix: millisecondsValue, utc: utcConversion });
  } else if (isValidDate && isProperDateFormat) {
    const inputDate = new Date(dateParam);
    const milliseconds = inputDate.getTime();
    const utcValue = inputDate.toUTCString();
    res.json({ unix: milliseconds, utc: utcValue });
  } else {
    res.json({ error : "Invalid Date" });
  }
});

// listen for requests
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is here: ' + `http://localhost:${listener.address().port}`);
});
