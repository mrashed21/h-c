import app from "./app";
import { config } from "./config/config";

const server = () => {
  try {
    app.listen(config.PORT, () => {
      console.log(
        `Server is running on http://localhost:${config.PORT}`,
      );
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};

server();
