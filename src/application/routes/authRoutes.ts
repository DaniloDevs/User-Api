import { prisma } from "@/connection/prisma"
import { FastifyInstance } from "fastify"
import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import bycrypt from "bcrypt"

export async function AuthRoutes(server: FastifyInstance) {
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
                    password: bycrypt.hashSync(password, 10)
                }
            })

            return reply.status(201).send({
                user_Id: user.id
            })
        })

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

            const user = await prisma.users.findUnique({ where: { email } })

            if (!user) {
                return reply.status(400).send({
                    Message: "User not found!"
                })
            }

            if (bycrypt.compareSync(password, user.password)) {
                const token = server.jwt.sign({ id: user.id })

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

        })
}