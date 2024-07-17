import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export async function VerifyToken(request: FastifyRequest, reply: FastifyReply, server: FastifyInstance) {
    const { token } = request.cookies

    if (!token) {
        return reply.status(401).send({ message: "Token não informado" })
    }

    const decryptedToken = server.jwt.verify(token)

    if (!decryptedToken) {
        return reply
            .status(401)
            .send({ message: "Token inválido ou expirado." })
    }
}