import { VerifyToken } from "@/lib/verifyToken";
import { FastifyReply, FastifyRequest } from "fastify";
import { server } from "../..";
import { prisma } from "@/connection/prisma";
import { GetUserById } from "@/lib/GetUserByToken";

interface IUserController {
     getUser(request: FastifyRequest, reply: FastifyReply): Promise<void>
     updateUser(request: FastifyRequest, reply: FastifyReply): Promise<void>
     deleteUser(request: FastifyRequest, reply: FastifyReply): Promise<void>
}

export class UserController implements IUserController {
     async getUser(request: FastifyRequest, reply: FastifyReply): Promise<void> {
          await VerifyToken(request, reply, server)

          const { userId } = request.params as { userId: string }

          const user = await GetUserById(userId, reply)

          return reply.status(200).send({
               Name: user.name,
               Email: user.email,
          })
     }

     async updateUser(request: FastifyRequest, reply: FastifyReply): Promise<void> {
          await VerifyToken(request, reply, server)

          const { userId } = request.body as { userId: string }

          const user = await GetUserById(userId, reply)

          const { name, email, password } = request.body as User

          if (
               user.name === name &&
               user.email === email &&
               user.password === password
          ) {
               return reply.status(400).send({
                    Message: "No changes were found"
               })
          }

          const newUser = await prisma.users.update({
               where: { id: user.id },
               data: {
                    name,
                    email,
                    password
               }
          })

          return reply.status(200).send({
               Message: "All information has been changed successfully",
               User: newUser
          })
     }

     async deleteUser(request: FastifyRequest, reply: FastifyReply): Promise<void> {
          await VerifyToken(request, reply, server)

          const { userId } = request.params as { userId: string }
          const user = await GetUserById(userId, reply)

          await prisma.users.delete({ where: { id: user.id } })

          return reply.status(200).send({
               Message: 'The user has been deleted'
          })
     }
}


interface User {
     name: string
     email: string
     password: string
}