import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Vote App API",
      description:
        "API documentation for the Vote App. This API allows users to register, authenticate, create polls, and vote.",
      version: "1.0.0",
      contact: {
        name: "Mehmet Hanifi ISIK",
        email: "mehmethanifiisik@yahoo.com",
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    servers: [
      {
        url:
          process.env.NODE_ENV === "production"
            ? `https://${process.env.HOST}:${process.env.PORT}`
            : `http://localhost:${process.env.PORT || 5000}`,
        description: "Server URL",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  basePath: "/api",
  apis: ["./server/routes/*.js", "./server/controllers/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

export default (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
