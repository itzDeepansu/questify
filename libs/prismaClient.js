import { PrismaClient } from "@/app/generated/prisma";

const client =  globalThis.prisma || new PrismaClient();
if (process.env.NODE_ENV === "production") globalThis.prisma = client;

export default client;