import { toNodeHandler } from "better-auth/node";
import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import path from "path";
import { auth } from "./app/lib/auth";
import { globarErrorHandler } from "./app/middleware/globar-error-handler";
import { notFound } from "./app/middleware/not-found";
import router from "./app/router/router";
import { config } from "./app/config/config";
import cors from "cors";


const app: Application = express();

// app.set("query parser", (str: string) => qs.parse(str));

app.set("view engine", "ejs");
app.set("views", path.resolve(process.cwd(), `src/app/templates`));

app.use(cors({
    origin : [config.FRONTEND_URL, config.BETTER_AUTH_URL, "http://localhost:3000", "http://localhost:5000"],
    credentials : true,
    methods : ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders : ["Content-Type", "Authorization"]
}))

//! Mount the auth routes using better-auth's toNodeHandler
app.use("/api/auth", toNodeHandler(auth));

//! Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));

//! Middleware to parse JSON bodies
app.use(express.json());
app.use(cookieParser());

// ! all routes with version
app.use("/api/v1", router);

//! Basic route
app.get("/", async (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "helth-care server is working",
  });
});

app.use(globarErrorHandler);
app.use(notFound);

export default app;
