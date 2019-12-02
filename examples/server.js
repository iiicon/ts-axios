const express = require('express')
const bodyParser = require('body-parser')
const webpack = require('webpack')
const webpackDevMiddleWare = require('webpack-dev-middleware')
const webpackHotMiddleWare = require('webpack-hot-middleware')
const WebpackConfig = require('./webpack.config')

const app = express()
const compiler = webpack(WebpackConfig)

app.use(webpackDevMiddleWare(compiler, {
  publicPath: '/__build__/',
  stats: {
    color: true,
    chunks: false
  }
}))

app.use(webpackHotMiddleWare(compiler))

app.use(express.static(__dirname))

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({ extend: true }))

const router = express.Router()

router.get('/simple/get', function(req, res) {
  res.json({
    msg: `hello world`
  })
})

app.use(router)

const port = process.PORT || 8888
module.exports = app.listen(port, ()=>{
  console.log(`server1 listen on ${port}`)
})
