import express from "express";
import userRoutes from "./routes/userRoutes";
import regionRoutes from "./routes/regionRoutes";
import loggerMiddleware from "./middleware/loggerMididleware";
import exportRoutes from "./routes/exportRoutes";
const app = express();

app.use(loggerMiddleware);
app.use(express.json());

app.use("/users", userRoutes);
app.use("/regions", regionRoutes);
app.use("/exports", exportRoutes);
export default app;
