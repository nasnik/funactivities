import dotenv from "dotenv";
dotenv.config();

import "express-async-errors";
import helmet from "helmet";
import cors from "cors";
import xss from "xss-clean";
import rateLimiter from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";

//const __filename = fileURLToPath(import.meta.url);
//const __dirname = path.dirname(__filename);
import swaggerUI from "swagger-ui-express";
import YAML from "yamljs";
import express, { Request, Response, NextFunction } from "express";

import connectDB from "./db/connect";
import authenticateUser from "./middleware/authentication";

// Routers
import authRouter from "./routes/auth";
import activitiesRouter from "./routes/activities";
import usersRouter from "./routes/users";
import providerRoutes from "./routes/provider";
import bookingsRouter from "./routes/booking";

// Middleware
import notFoundMiddleware from "./middleware/not-found";
import errorHandlerMiddleware from "./middleware/error-handler";


// Load Swagger Documentation
// const swaggerDocument = YAML.load("./swagger.yaml");

const app = express();

app.set("trust proxy", 1);
app.use(
    rateLimiter({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // limit each IP to 100 requests per windowMS
    })
);

app.use(express.json());
app.use(helmet());
app.use(
    cors({
        origin: "http://localhost:5173", // Allow requests from frontend
        credentials: true, // Allow credentials (cookies, authorization headers, etc.)
        methods: "GET,POST,PUT,DELETE,PATCH", // Allow specific HTTP methods
        allowedHeaders: "Content-Type,Authorization", // Allow required headers
    })
);
app.use(xss());



// Swagger Documentation
// app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// Serve static files from the upload directory
//app.use("/upload", express.static(path.join(__dirname, "../upload")));
// Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/provider", providerRoutes);
app.use("/api/v1/activities", authenticateUser, activitiesRouter);
app.use("/api/v1/users", authenticateUser, usersRouter); 
app.use("/api/v1/booking", authenticateUser, bookingsRouter);


// Error Handling
app.use(notFoundMiddleware);
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    errorHandlerMiddleware(err, req, res, next);
});

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Start Server
const start = async (): Promise<void> => {
    try {
        await connectDB(process.env.MONGO_URI as string);
        app.listen(port, () => console.log(`Server is listening on port ${port}...`));
    } catch (error) {
        console.error("Error starting server:", error);
    }
};

start();
