import ExportService from "../services/exportService";
import { Request, Response } from "express";

class ExportController {
  private exportService: ExportService;

  constructor() {
    this.exportService = new ExportService();
  }

  async exportUsers(req: Request, res: Response) {
    try {
      const data = await this.exportService.exportUsers();
      const filename = `users_${new Date().getTime()}.csv`;
      res.attachment(filename);
      res.status(200).send(data);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  }

  async exportRegions(req: Request, res: Response) {
    try {
      const data = await this.exportService.exportUsers();
      const filename = `regions_${new Date().getTime()}.csv`;
      res.attachment(filename);
      res.status(200).send(data);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  }
}

export default ExportController;
