import { prisma } from "@/connection/prisma";
import { GetUserByToken } from "@/lib/GetUserByToken";
import { VerifyToken } from "@/lib/verifyToken";
import { Users } from "@prisma/client";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";


export async function UserRoutes(server: FastifyInstance) {
    server
        .withTypeProvider<ZodTypeProvider>()
        .get("/users/:userId", {
            schema: {
                params: z.object({
                    userId: z.string().uuid()
                })
            }
        }, async (request, reply) => {
            await VerifyToken(request, reply, server)

            const user = await GetUserByToken(request, reply, server)

            return reply.status(200).send({
                Name: user.name,
                Email: user.email,
            })
        })

    server
        .withTypeProvider<ZodTypeProvider>()
        .put("/users/:userId/update", {
            schema: {
                params: z.object({
                    userId: z.string().uuid()
                }),
                body: z.object({
                    name: z.string().min(3).optional(),
                    email: z.string().email().optional(),
                    password: z.string().min(4).max(12).optional()
                })
            }
        }, async (request, reply) => {
            await VerifyToken(request, reply, server)

            const user = await GetUserByToken(request, reply, server)

            const { name, email, password } = request.body

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
                where: { id: user?.id },
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

        })

    server
        .withTypeProvider<ZodTypeProvider>()
        .put("/users/:userId/delete", {
            schema: {
                params: z.object({
                    userId: z.string().uuid()
                }),
            }
        }, async (request, reply) => {
            await VerifyToken(request, reply, server)

            const user = await GetUserByToken(request, reply, server)

            await prisma.users.delete({ where: { id: user.id } })
            return reply.status(200).send({
                Message: 'The user has been deleted'
            })

        })

}