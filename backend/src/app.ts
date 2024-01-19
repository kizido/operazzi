import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import productsRoutes from "./routes/productsRoutes";
import userRoutes from "./routes/usersRoutes";
import productCategoriesRoutes from "./routes/productCategoriesRoutes";
import productBrandsRoutes from "./routes/productBrandsRoutes";
import productPackageTypesRoutes from "./routes/productPackageTypesRoutes";
import productImagesRoutes from "./routes/productImagesRoutes";
import productCustomsRoutes from "./routes/productCustomsRoutes";
import morgan from "morgan";
import createHttpError, { isHttpError } from "http-errors";
import session from "express-session";
import env from "./util/validateEnv";
import MongoStore from "connect-mongo";
import { requiresAuth } from "./middleware/auth";

const app = express();

app.use(morgan("dev"));

app.use(express.json());

app.use(session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60 * 60 * 1000,
    },
    rolling: true,
    store: MongoStore.create({
        mongoUrl: env.MONGO_CONNECTION_STRING,
    }),
}));

app.use("/api/users", userRoutes);
app.use("/api/products", requiresAuth, productsRoutes);
app.use("/api/productCategories", requiresAuth, productCategoriesRoutes);
app.use("/api/productBrands", requiresAuth, productBrandsRoutes);
app.use("/api/productPackageTypes", requiresAuth, productPackageTypesRoutes);
app.use("/api/productImages", requiresAuth, productImagesRoutes);
app.use("/api/productCustoms", requiresAuth, productCustomsRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to my backend server!');
});
app.use((req, res, next) => {
    next(createHttpError(404, "Endpoint not found"));
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
    console.error(error);
    let errorMessage = "An unknown error occurred";
    let statusCode = 500;
    if (isHttpError(error)) {
        statusCode = error.status;
        errorMessage = error.message;
    }
    res.status(statusCode).json({ error: errorMessage });
});

export default app;