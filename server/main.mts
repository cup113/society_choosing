import express from "express";
import ViteExpress from "vite-express";
import logger from "./src/logger.mjs";
import app from "./app.mjs";

logger.info(`Starting server with environment variables:\n${JSON.stringify(process.env, null, 2)}`);
ViteExpress.config({
    inlineViteConfig: {
        base: '/',
        root: './client'
    },
    mode: process.env["NODE_ENV"]?.startsWith("production") ? "production" : "development",
})
ViteExpress.listen(app, 3000, () => logger.info("Server is listening..."));
