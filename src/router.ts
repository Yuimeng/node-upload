import Router from 'koa-router'
import {Files} from 'formidable'
import path from 'path'
import fs from 'fs'

const router = new Router()

router.post('/upload', async (ctx, next) => {
  await next()
  const {file} = ctx.request.files as Files

  const base = path.resolve('images')// 存放的文件夹
  if(!fs.existsSync(base)) { // 文件夹不存在 则创建
    fs.mkdirSync(base)
  }

  const parseName = path.parse(file.name)
  const ext = parseName.ext

  const name = path.join(base, `${parseName.name}-${+new Date()}${ext}`)

  const reader = fs.createReadStream(file.path)
  const isExist = fs.existsSync(name)
  if (isExist) {
    ctx.body = {
      message: 'file is exist',
    }
  } else {
    const write = fs.createWriteStream(name, {})
    reader.pipe(write)
    ctx.body = {
      message: 'ok',
    }
  }
})

router.get('/upload-list', async (ctx, next) => {
  await next()
  const base = path.resolve('images')
  const dirs: string[] = fs.readdirSync(path.resolve('images'))
  ctx.body = {
    list: dirs.map(item => ({
      name: item,
      path: path.join(item),
    })),
  }
})

export default router
