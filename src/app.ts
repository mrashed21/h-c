import express, { Application, Request, Response } from "express";
import router from "./app/router/router";
const app: Application = express();

// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());

app.use("/api/v1", router);

// Basic route
app.get("/", async (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "helth-care server is working",
  });
});

export default app;
