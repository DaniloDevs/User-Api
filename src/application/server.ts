import { FastifyInstance } from "fastify"
import { AuthRoutes } from "@/routes/authRoutes"
import { UserRoutes } from "@/routes/userRoutes"



export async function Routes(server: FastifyInstance) {

    server.get("/", () => "Server Running!!")

    // ROTAS
    server.register(AuthRoutes)
    server.register(UserRoutes)

}