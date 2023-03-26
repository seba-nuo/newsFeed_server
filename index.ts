import express from 'express'
import session from 'express-session'
import dotenv from 'dotenv'
import cors from 'cors'
import bodyParser from 'body-parser'

import { saveUser, getUser } from './utils/Users'

import { PrismaClient } from '@prisma/client'
import { Status } from './types'

dotenv.config()
const SESSION_SECRET = "IGeIDH2oP" // it's better to store it on .env

const prisma = new PrismaClient()
const app = express()

app.use(
  cors({
    origin: "http://localhost:4200",
  })
)
const jsonParser = bodyParser.json()
app.use(jsonParser);

app.use(
  session({
    name: "_id",
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: "auto",
      maxAge: 1000 * 60 * 60 * 24 * 7, //  7 days
    }
  })
)
const port = 3000

async function main() {

  app.get('/session', (req: express.Request, res: express.Response) => {
    let status: Status = "success"
    if (!req.session?.user_name || !req.session?.user_email) {
      status = "error"
    }
    res.json({
      name: req.session.user_name,
      email: req.session.user_email,
      status
    })
  })

  app.post('/signup', async (req: express.Request, res: express.Response) => {
    const status = await saveUser(req.body)
    res.json({ status })
  })

  app.post('/login', async (req: express.Request, res: express.Response) => {

    const { user, status } = await getUser(req.body)
    if (status === "success") {
      req.session.user_name = user.name
      req.session.user_email = user.email
      req.session.save()
      console.log("🤖 ~ file: index.ts:67 ~ app.post ~ req.session:", req.session);
      }
    res.json({ user, status })
  })

  app.get("/logout", (req: express.Request, res: express.Response) => {
    req.session.user_name = ""
    req.session.user_email = ""
    req.session.save()
    res.json({ status: "sucess" })
  })

  app.listen(port, () => {
    console.log(`app listening on port ${port}`)
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