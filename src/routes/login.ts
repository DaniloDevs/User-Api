import { prisma } from "connection/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";



export async function Login(server: FastifyInstance) {
     server
          .withTypeProvider<ZodTypeProvider>()
          .post("/login", {
               schema: {
                    body: z.object({
                         email: z.string().email(),
                         password: z.string()
                    })
               }
          }, async (request, reply) => {
               const { email, password } = request.body

               const user = prisma.users.findUnique({ where: { email } })

               if (!user) {
                    return reply.status(400).send({
                         Message: "User not found!"
                    })
               }

               return reply.status(201).send()
          })
}