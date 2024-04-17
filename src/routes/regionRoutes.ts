import express, { Request, Response } from "express";
import { RegionController } from "../controllers/regionController";
import { RegionService } from "../services/regionService";

const router = express.Router();
const regionService = new RegionService();
const regionController = new RegionController(regionService);

router.post("/", async (req: Request, res: Response) => {
  await regionController.createRegion(req, res);
});

router.get("/", async (req: Request, res: Response) => {
  await regionController.getRegions(req, res);
});

router.get("/:id", async (req: Request, res: Response) => {
  await regionController.getRegionById(req, res);
});

router.put("/:id", async (req: Request, res: Response) => {
  await regionController.updateRegion(req, res);
});

router.delete("/:id", async (req: Request, res: Response) => {
  await regionController.deleteRegion(req, res);
});

router.get("/containing/point", async (req: Request, res: Response) => {
  await regionController.getRegionsContainingPoint(req, res);
});

router.get("/within/distance", async (req: Request, res: Response) => {
  await regionController.getRegionsWithinDistance(req, res);
});

export default router;
