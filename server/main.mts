import ViteExpress from "vite-express";
import logger from "./services/logger.mjs";
import app from "./app.mjs";

const isProduction = process.env["NODE_ENV"]?.startsWith("production") ? true : false;

logger.info(`Starting server with environment variables:\n${JSON.stringify(process.env, null, 2)}`);
ViteExpress.config({
    inlineViteConfig: {
        base: '/',
        root: './client'
    },
    mode: isProduction ? "production" : "development",
})
ViteExpress.listen(app, isProduction? 8080 : 3000, () => logger.info("Server is listening..."));
