import express, { Request, Response } from "express";
import { UserController } from "../controllers/userController";
import { UserService } from "../services/userService";

const router = express.Router();
const userService = new UserService();
const userController = new UserController(userService);

router.post("/", async (req: Request, res: Response) => {
  await userController.createUser(req, res);
});

router.get("/:id", async (req: Request, res: Response) => {
  await userController.getUserById(req, res);
});

router.get("/", async (req: Request, res: Response) => {
  await userController.getUsers(req, res);
});

router.put("/:id", async (req: Request, res: Response) => {
  await userController.updateUser(req, res);
});

router.delete("/:id", async (req: Request, res: Response) => {
  await userController.deleteUser(req, res);
});

export default router;
