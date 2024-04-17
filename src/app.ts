import express from "express";
import userRoutes from "./routes/userRoutes";
import regionRoutes from "./routes/regionRoutes";
const app = express();

app.use(express.json());

app.use("/users", userRoutes);
app.use("/regions", regionRoutes);
export default app;
