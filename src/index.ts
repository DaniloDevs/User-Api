import fastifyCookie from "@fastify/cookie";
import fastifyJwt from "@fastify/jwt";
import fastify from "fastify";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { GetUserById } from "routes/getUserById";
import { Login } from "routes/login";
import { Register } from "routes/register";

export const server = fastify()


// ROTAS
server.get("/", () => "Server Running!!")
server.register(Register)
server.register(Login)
server.register(GetUserById)


try {
     server.setValidatorCompiler(validatorCompiler);
     server.setSerializerCompiler(serializerCompiler);
     
     server.register(fastifyJwt, {
          secret: "SECRET CABULOSO",
     })

     server.register(fastifyCookie, {
          secret: "SECRET CABULOSO",
          hook: "onRequest",
     })

     server.listen({
          port: 3031
     }).then(() => console.log("Server Running!!!"))
} catch (error) {
     server.log.error(error)
     process.exit(1)
}
