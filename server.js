const mongoose = require('mongoose')
const express = require('express')
const bodyParser = require('body-parser')
const logger = require('morgan') //express默认的日志中间件，可脱离express作为node.js的日志组件单独使用
const cors = require('cors')

const getSecret = require('./secret') //文件
const Data = require('./data')

const API_PORT = 3001
const app = express()
const router = express.Router()

mongoose.connect(getSecret('dbUri'), { 
  keepAlive: true,
  useNewUrlParser: true, //连接数据库, 添加新解析器true选项，确保提供对新解析器有效的连接字符串
  useCreateIndex: true,
  useFindAndModify: false,//版本更新问题
 }) 
// 1.3. 获取连接对象
let db = mongoose.connection


// conn.on('connected', () => {
//   console.log('db connect success!')
// })

db.on('error', console.error.bind('MongoDB 连接错误'))

app.use(cors())  //跨域 确保这个在设置路由之前运行此代码
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// app.use(logger('dev'))  //logger中间件 终端日志的输出，访问日志，错误日志

router.get('/', (req,res) => {
  res.json({ message: "Hello girl"})
})

router.get('/getData', (req, res) => {
  Data.find((err, data) => {
    if(err) return res.json({ success:false, error:err})
    return res.json({ success: true,data: data })
  })
})

router.post('/updateData', (req,res) => {
  const { id, update } = {...req.body}
  console.log('update',id,update,req.body)
  Data.findByIdAndUpdate(id, update, err => {
    if (err) return res.json({ success: false, error: err })
    return res.json({ success:true })
  })
})

router.delete("/deleteData", (req, res) => {
  debugger
  const id  = req.body
  console.log('delete', id,req.body)
  Data.findByIdAndRemove(req.body.id, err => {
    if(err) return res.send(err)
    return res.json({ success:true })
  })
})

router.post('/putData', (req,res) => {
  let data = new Data()  //创建数据库表实例
  console.log('put in server',req.body)
  const { id, message } = req.body

  if((!id && id !== 0) || !message) {
    return res.json({
      success: false,
      error: "INVALID INPUTS"
    })
  }
  data.message = message
  data.id = id
  data.save(err => {
    if(err) return res.json({ success:false, error: err})
    return res.json({ success: true })
  })
})

app.use('/api', router)

app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`))

