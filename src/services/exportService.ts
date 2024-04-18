import { UserModel, RegionModel } from "../models/models";
import json2csv from "json2csv";

class ExportService {
  async exportUsers() {
    const users = await UserModel.find();

    const fields = [
      "_id",
      "name",
      "email",
      "address",
      "coordinates",
      "createdAt",
      "updatedAt",
    ];

    try {
      const csv = await json2csv.parseAsync(users, { fields });
      return csv;
    } catch (error) {
      console.log(error);
      throw new Error("Erro inesperado ao montar o arquivo");
    }
  }

  async exportRegions() {
    const regions = await RegionModel.find();

    const fields = [
      "_id",
      "name",
      "coordinates",
      "user",
      "createdAt",
      "updatedAt",
    ];
    try {
      const csv = await json2csv.parseAsync(regions, { fields });
      return csv;
    } catch (error) {
      throw new Error("Erro inesperado ao montar o arquivo");
    }
  }
}

export default ExportService;
