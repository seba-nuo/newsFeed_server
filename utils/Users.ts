
import bcrypt from 'bcrypt';
import { User } from '../types'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function saveUser(userReq: User) {
  const saltRounds = 10;
  const myPlaintextPassword = 's0/\/\P4$$w0rD';

  let status = "approved"
  const salt = await bcrypt.genSalt(saltRounds)
  const hash = await bcrypt.hash(myPlaintextPassword, salt)  
  const userWithHashPass = {
    name: userReq.name,
    email: userReq.email,
    password: hash
  }
  await prisma.user.create({ data: userWithHashPass })
    .catch(() => status = "error")

  return status
}

export async function getUser(userReq: User) {
  const user = await prisma.user.findFirst({
    where: {
      email: userReq.email,
      password: userReq.password
    }
  })
  let status = user === null ? "error" : "approved"

  return [user, status]
}