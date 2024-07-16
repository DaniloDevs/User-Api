import { prisma } from "connection/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import bcrypt from "bcrypt"


export async function Register(server: FastifyInstance) {
     server
          .withTypeProvider<ZodTypeProvider>()
          .post("/register", {
               schema: {
                    body: z.object({
                         name: z.string().min(3),
                         email: z.string().email(),
                         password: z.string().min(4).max(12)
                    })
               }
          }, async (request, reply) => {
               const { name, email, password } = request.body


               const user = await prisma.users.create({
                    data: {
                         name,
                         email,
                         password: bcrypt.hashSync(password, 10)
                    }
               })

               return reply.status(201).send({
                    user_Id: user.id
               })
          })
}