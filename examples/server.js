const express = require('express')
const bodyParser = require('body-parser')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const WebpackConfig = require('./webpack.config')
const cookieParse = require('cookie-parser')
const multipart = require('connect-multiparty')
const path = require('path')
const atob = require('atob')

const app = express()
const compiler = webpack(WebpackConfig)

require('./server2')

app.use(
  webpackDevMiddleware(compiler, {
    publicPath: '/__build__/',
    stats: {
      colors: true,
      chunks: false
    }
  })
)

app.use(webpackHotMiddleware(compiler))

app.use(express.static(__dirname, {
  setHeaders(res) {
    res.cookie('XSRF-TOKEN-D', 'thisiscookie')
  }
}))

app.use(bodyParser.json())

// app.use(bodyParser.text())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(cookieParse())

app.use(multipart({
  uploadDir: path.resolve(__dirname, 'upload-file')
}))

const router = express.Router()

registerSimpleRouter()

registerBaseGetRouter()

registerBasePostRouter()

registerErrorGetRouter()

registerErrorTimeoutRouter()

registerExtendRouter()

registerInterceptorsRoute()

registerConfigRoute()

registerCancelRoute()

registerMoreRouter()

app.use(router)

const port = process.env.PORT || 8888
module.exports = app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}, Ctrl+C to stop`)
})

function registerSimpleRouter() {
  router.get('/simple/get', function(req, res) {
    res.json({
      msg: `hello world`
    })
  })
}

function registerBaseGetRouter() {
  router.get('/base/get', function(req, res) {
    res.json(req.query)
  })
}

function registerBasePostRouter() {
  router.post('/base/post', function(req, res) {
    res.json(req.body)
  })
}

function registerErrorGetRouter() {
  router.get('/error/get', function(req, res) {
    if (Math.random() > 0.5) {
      res.json({
        msg: `hello world`
      })
    } else {
      res.status(500)
      res.end()
    }
  })
}

function registerErrorTimeoutRouter() {
  router.get('/error/timeout', function(req, res) {
    setTimeout(() => {
      res.json({
        msg: `hello world`
      })
    }, 3000)
  })
}

function registerExtendRouter() {
  router.get('/extend/get', function(req, res) {
    res.json({
      msg: 'hello world'
    })
  })

  router.options('/extend/options', function(req, res) {
    res.end()
  })

  router.delete('/extend/delete', function(req, res) {
    res.end()
  })

  router.head('/extend/head', function(req, res) {
    res.end()
  })

  router.post('/extend/post', function(req, res) {
    res.json(req.body)
  })

  router.put('/extend/put', function(req, res) {
    res.json(req.body)
  })

  router.patch('/extend/patch', function(req, res) {
    res.json(req.body)
  })

  router.get('/extend/user', function(req, res) {
    res.json({
      code: 0,
      message: 'ok',
      result: {
        name: 'jack',
        age: 18
      }
    })
  })
}

function registerInterceptorsRoute() {
  router.get('/interceptor/get', function(req, res) {
    res.json({
      code: 0,
      message: 'ok',
      result: {
        name: 'jack',
        age: 18
      }
    })
  })
}

function registerConfigRoute() {
  router.post('/config/post', function(req, res) {
    res.json({
      code: 0,
      message: 'ok',
      result: {
        name: 'jack',
        age: 18
      }
    })
  })
}

function registerCancelRoute() {
  router.get('/cancel/get', function(req, res) {
    setTimeout(() => {
      res.json('hello')
    }, 1000)
  })

  router.post('/cancel/post', function(req, res) {
    setTimeout(() => {
      res.json(req.body)
    }, 1000)
  })
}

function registerMoreRouter() {

  router.get('/more/304', function(req, res) {
    res.status(304)
    res.end('cache')
  })

  router.get('/more/304', function(req, res) {
    res.json(req.cookies)
  })

  router.post('/more/post', function(req, res) {
    console.log(req.body, req.files)
    res.end('upload success!')
  })

  router.post('/more/post2', function(req, res) {
    const auth = req.headers.authorization
    const [type, credentials] = auth.split(' ')
    const [username, password] = atob(credentials).split(':')

    if (type === 'Basic' && username === 'iiicon' && password === '123') {
      res.json(req.body)
    } else {
      res.status(401)
      res.end('UnAuthorization')
    }
  })
}
