import app from "./app";
import { config } from "./app/config/config";
import { seedSuperAdmin } from "./app/utils/seed";

const server = async () => {
  try {
    await seedSuperAdmin();
    app.listen(config.PORT, () => {
      console.log(`Server is running on http://localhost:${config.PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};

server();
