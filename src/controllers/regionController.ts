import { Request, Response } from "express";
import { Types } from "mongoose";
import { RegionService } from "../services/regionService";

export class RegionController {
  private regionService: RegionService;

  constructor(regionService: RegionService) {
    this.regionService = regionService;
  }

  async createRegion(req: Request, res: Response): Promise<void> {
    try {
      const { name, coordinates, user } = req.body;
      const region = await this.regionService.createRegion(
        name,
        coordinates,
        user
      );
      res.status(201).json(region);
    } catch (error) {
      console.error("Error creating region:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getRegionById(req: Request, res: Response): Promise<void> {
    try {
      const regionId = req.params.id;
      const region = await this.regionService.getRegionById(regionId);
      if (region) {
        res.status(200).json(region);
      } else {
        res.status(404).json({ error: "Region not found" });
      }
    } catch (error) {
      console.error("Error fetching region by ID:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async updateRegion(req: Request, res: Response): Promise<void> {
    try {
      const regionId = req.params.id;
      const { name, coordinates, userId } = req.body;
      const region = await this.regionService.updateRegion(
        regionId,
        name,
        coordinates,
        userId
      );
      if (region) {
        res.status(200).json(region);
      } else {
        res.status(404).json({ error: "Region not found" });
      }
    } catch (error) {
      console.error("Error updating region:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async deleteRegion(req: Request, res: Response): Promise<void> {
    try {
      const regionId = req.params.id;
      const result = await this.regionService.deleteRegion(regionId);
      if (result) {
        res.status(204).end();
      } else {
        res.status(404).json({ error: "Region not found" });
      }
    } catch (error) {
      console.error("Error deleting region:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getRegionsContainingPoint(req: Request, res: Response): Promise<void> {
    try {
      const { latitude, longitude } = req.query;
      console.log(latitude, longitude);
      const regions = await this.regionService.getRegionsContainingPoint(
        parseFloat(latitude as string),
        parseFloat(longitude as string)
      );
      res.status(200).json(regions);
    } catch (error) {
      console.error("Error fetching regions containing point:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getRegionsWithinDistance(req: Request, res: Response): Promise<void> {
    try {
      const { latitude, longitude, maxDistance, userId } = req.query;
      console.log(latitude, longitude, maxDistance, userId);
      const regions = await this.regionService.getRegionsWithinDistance(
        parseFloat(latitude as string),
        parseFloat(longitude as string),
        parseInt(maxDistance as string),
        userId ? new Types.ObjectId(userId as string) : undefined
      );
      res.status(200).json(regions);
    } catch (error) {
      console.error("Error fetching regions within distance:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getRegions(req: Request, res: Response): Promise<void> {
    try {
      const regions = await this.regionService.getRegions();
      res.status(200).json(regions);
    } catch (error) {
      console.error("Error fetching regions:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
