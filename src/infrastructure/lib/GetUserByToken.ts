import { prisma } from "@/connection/prisma";
import { Users } from "@prisma/client";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export async function GetUserByToken(request: FastifyRequest, reply: FastifyReply, server: FastifyInstance) {
     const { token } = request.cookies as { token: string }

     const decryptedToken = server.jwt.verify(token)

     const { id } = decryptedToken as { id: string }

     const user = await prisma.users.findUnique({ where: { id } })

     return user  as Users
}