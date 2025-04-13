
const path = require("path");
const express = require('express');
const logger = require('morgan'); // для логирования кто к нам по какому запросу стучался
const cors = require('cors');
const app = express();

app.use(logger('dev'));
app.use(cors());
app.use(express.urlencoded({ extended: true })); //сериализация на уровне экспресса для того чтобы бэк понял пост запрос
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.send('OK!');
});


app.use('/', require('./app/store/routes/routes'));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
