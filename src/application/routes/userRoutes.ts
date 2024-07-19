import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { UserController } from "../controller/userController";


export async function UserRoutes(server: FastifyInstance) {
    const controller = new UserController()

    server
        .withTypeProvider<ZodTypeProvider>()
        .get("/users/:userId", {
            schema: {
                params: z.object({
                    userId: z.string().uuid()
                })
            }
        }, controller.getUser.bind(controller))

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
        }, controller.updateUser.bind(controller))

    server
        .withTypeProvider<ZodTypeProvider>()
        .put("/users/:userId/delete", {
            schema: {
                params: z.object({
                    userId: z.string().uuid()
                }),
            }
        }, controller.deleteUser.bind(controller))

}