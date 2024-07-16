import { prisma } from "connection/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";



export async function GetUserById(server: FastifyInstance) {
     server
          .withTypeProvider<ZodTypeProvider>()
          .post("/users/:userId", {
               schema: {
                    params: z.object({
                         userId: z.string().uuid()
                    })
               }
          }, async (request, reply) => {
               const { userId } = request.params

               const user = await prisma.users.findUnique({ where: { id: userId } })

               if(!user) {
                    return reply.status(400).send({
                         Message: "User not found!"
                    })
               }

               return reply.status(201).send({
                    user_Id: user.id
               })
          })
}