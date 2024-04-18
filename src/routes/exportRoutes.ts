import express from "express";
import ExportController from "../controllers/exportController";
const router = express.Router();

const exportController = new ExportController();

router.get("/users", exportController.exportUsers.bind(exportController));
router.get("/regions", exportController.exportRegions.bind(exportController));

export default router;
