import http from 'http'
import path from 'path'
import Koa from 'koa'
import Static from 'koa-static'
import KoaBody from 'koa-body'
import router from './router'

const app = new Koa()

app.use(Static(path.resolve('public')))
app.use(Static(path.resolve('images')))

app.use(async (ctx, next) => {
  return await next().catch(e => {
    ctx.statusCode = 500
    ctx.body = {
      message: e.message
    }
  })
})

app.use(KoaBody({
  multipart: true,
  formidable: {
    maxFileSize: 2 * 1024 * 1024
  },
}))

app.use(router.routes()).use(router.allowedMethods())

const server = http.createServer(app.callback())
const port = process.env.PORT || 9000

const startServer = (port: number | string) => {
  server.listen(port, () => {
    console.log(`server listen: http://localhost:${port}`)
  })
}

startServer(port)
