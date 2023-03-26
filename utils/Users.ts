
import bcrypt from 'bcrypt';
import { User } from '../types'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function saveUser(user: User) {

  const saltRounds = 10;
  const myPlaintextPassword = 's0/\/\P4$$w0rD';

  let status = "approved"
  bcrypt.genSalt(saltRounds, function (_, salt) {
    bcrypt.hash(myPlaintextPassword, salt, async function (_, hash) {
      const userWithHashPass = {
        name: user.name,
        email: user.email,
        password: hash
      }
      await prisma.user.create({ data: userWithHashPass }).catch(() => status = "error")
    });
  });
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