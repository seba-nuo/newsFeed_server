import express from 'express'
var session = require('express-session')
require('dotenv').config()
var cors = require('cors')
var bodyParser = require('body-parser')
import { saveUser, getUser } from './utils/Users'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const app = express()

var jsonParser = bodyParser.json()

app.use(cors())
app.use(jsonParser);
const port = 3000

async function main() {

  app.get('/users', (req: express.Request, res: express.Response) => {
    res.send('Got a GET request')
  })
  app.post('/signup', async (req: express.Request, res: express.Response) => {
    const status = await saveUser(req.body.user)
    res.json({ status })
  })

  app.post('/login', async (req: express.Request, res: express.Response) => {
    const [user, status] = await getUser(req.body)
    
    res.json({ user, status })
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