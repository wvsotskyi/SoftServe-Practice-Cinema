import { PrismaClient } from "../../generated/prisma/default.js"

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})

prisma.$use(async (params: any, next: any) => {
  return next(params)
})

export default prisma