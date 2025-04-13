
const path = require("path");
const express=require('express')
const logger=require('morgan') // для логирования кто к нам по какому запросу стучался

const multer=require('multer') // для formdata

const app=express();
//middleware 1----
cors = require('cors')

app.use(logger('dev'));
app.use(cors());

app.use(express.urlencoded({ extended: true })); //сериализация   на уровне экспресса для того чтобы бэк понял пост запрос 
app.use(express.json())

// app.use(express.static(__dirname+'/public/cable'))

app.use(express.static(__dirname));





// app.get('/',(req,res)=>{
//     res.send('OK!')
// })

// app.post('/api',(req,res)=>{
//     console.log(req.body)
//     res.status(200).send('POST /api works | Success!')
// })

app.use(require('./app/store/routes/routes'))
// app.use(require('./app/region/routes'))
// app.use(require('./app/skills/routes'))
// app.use(require('./app/employment-type/routes'))
// app.use(require('./app/languages/routes'))
// app.use(require('./app/resume/routes'))
// app.use(require('./app/vacancy/routes'))
// app.use(require('./app/applies/routes'))


app.listen (8000,()=>{
    console.log('Server is listening on port 8000')
})
