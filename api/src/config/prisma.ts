import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
    log: ["query", "info", "warn", "error"],
});

// TODO: types
prisma.$use(async (params: any, next: any) => {
    // Add any query logging or modifications here
    return next(params);
});

export default prisma;