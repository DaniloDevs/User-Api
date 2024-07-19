import { FastifyReply, FastifyRequest } from "fastify";
import { server } from "../..";
import { prisma } from "@/connection/prisma";
import bycrypt from "bcrypt";

interface IAuthController {
     login(request: FastifyRequest, reply: FastifyReply): Promise<void>
     register(request: FastifyRequest, reply: FastifyReply): Promise<void>
     logout(request: FastifyRequest, reply: FastifyReply): Promise<void>
}

export class AuthController implements IAuthController {
     async login(request: FastifyRequest, reply: FastifyReply): Promise<void> {
          const { name, email, password } = request.body as User

          const user = await prisma.users.create({
               data: {
                    name,
                    email,
                    password: bycrypt.hashSync(password, 10)
               }
          })

          return reply.status(201).send({
               user_Id: user.id
          })

     }

     async register(request: FastifyRequest, reply: FastifyReply): Promise<void> {
          const { email, password } = request.body as User

          const user = await prisma.users.findUnique({ where: { email } })

          if (!user) {
               return reply.status(400).send({
                    Message: "User not found!"
               })
          }

          if (bycrypt.compareSync(password, user.password)) {
               const token = server.jwt.sign({ id: crypto.randomUUID() })

               reply.setCookie("token", token, {
                    httpOnly: false,
                    path: "/",
                    maxAge: 60 * 60 * 24 * 14,
               })

               return reply.status(202).send({
                    Code: "Authorized Access",
                    Access_Time: 60 * 60 * 24,
                    User_Id: user.id
               })
          } else {
               return reply.status(401).send({
                    Code: "Unauthorized Access"
               })
          }
     }

     async logout(request: FastifyRequest, reply: FastifyReply): Promise<void> {
          reply.clearCookie("token")

          return reply.status(200).send({
               message: "logout successfully!"
          })
     }

}

interface User {
     name: string
     email: string
     password: string
}