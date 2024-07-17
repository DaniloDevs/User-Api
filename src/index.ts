import fastifyCookie from "@fastify/cookie";
import fastifyJwt from "@fastify/jwt";
import fastify from "fastify";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { Routes } from "./application/server";


export const server = fastify()


try {
     server.register(Routes)

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
