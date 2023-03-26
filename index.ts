import express from 'express'
// var session = require('express-session')
require('dotenv').config()
var cors = require('cors')
var bodyParser = require('body-parser')

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const app = express()

var jsonParser = bodyParser.json()

app.use(cors())
app.use(jsonParser);
const port = 3000

async function main() {

  app.post('/signup', async (req: express.Request, res: express.Response) => {
    let status = "approved"
    await prisma.user.create({ data: req.body }).catch(() => status = "error")
    console.log("🤖 ~ file: index.ts:26 ~ app.post ~ status:", status);
    res.json({ status })
  })

  app.post('/login', async (req: express.Request, res: express.Response) => {
    
  })

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

