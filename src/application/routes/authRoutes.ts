import { FastifyInstance } from "fastify"
import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { AuthController } from "../controller/authController"

export async function AuthRoutes(server: FastifyInstance) {
    const controller = new AuthController()

    server.withTypeProvider<ZodTypeProvider>()
        .post("/register", {
            schema: {
                body: z.object({
                    name: z.string().min(3),
                    email: z.string().email(),
                    password: z.string().min(4).max(12)
                })
            }
        }, controller.login.bind(controller))

        .post("/login", {
            schema: {
                body: z.object({
                    email: z.string().email(),
                    password: z.string()
                })
            }
        }, controller.register.bind(controller))

        .post("/logout", controller.logout.bind(controller))
}