import logger from "./services/logger.mjs";
import app from "./app.mjs";

app.listen(4127, () => {
    logger.info("Server listening on port 4127");
});

const envDisplay = Object.entries(process.env).map(([key, value]) => `${key} = ${value}`).join("\n");

logger.info(`Starting server with environment variables:\n${envDisplay}`);
