import { prisma } from "@/connection/prisma";
import { FastifyReply } from "fastify";

export async function GetUserById(id: string, reply: FastifyReply) {

     const user = await prisma.users.findUnique({ where: { id } })

     if (!user) {
          return reply.status(400).send({
               Message: "User not fund"
          })
     }

     return user
}