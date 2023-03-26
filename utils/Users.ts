
import bcrypt from 'bcrypt';
import { Status, User } from '../types'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function saveUser(userReq: User) {
  const saltRounds = 10;

  let status: Status = "success"
  const salt = await bcrypt.genSalt(saltRounds)
  const hash = await bcrypt.hash(userReq.password, salt)  
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
  let status: Status = "success"
  let user = await prisma.user.findFirst({
    where: {
      name: userReq.name,
      email: userReq.email
    }
  })
  if(user === null) {
    status = "error"
    return {user, status}
  }

  const result = await bcrypt.compare(userReq.password, user.password)
  if(!result) {
    status = "error" // this could handle as incorrect user
    user = null
    return {user, status}
  }

  return {user, status}
}