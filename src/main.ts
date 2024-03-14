import {server} from "./app/server";
import {logger} from "./app/logging";

server.listen(3000, () => {
    logger.info("app running on port 3000");
});