const express = require('express');
var path = require('path');
const app = express();
const port = process.env.PORT || 8088;
const fetch_data = require('./testCall')
app.engine('pug', require('pug').__express)

app.set('view engine', 'pug');
app.get('/', (req, res) => {
    fetch_data.use_fetch()
    .then(response => {
            res.sendFile(path.join(__dirname, './views', 'dashboard.pug'));
            res.render('dashboard', {data: response});
        })
        .catch (error => {
            console.log("Error" - error);
        })
});

app.listen(port, () => console.log(port));