import { RegionModel } from "../models/models";
import { IRegion } from "../interfaces/regionInterface";
import { UserModel } from "../models/models";

import { Types } from "mongoose";

export class RegionService {
  async createRegion(
    name: string,
    coordinates: [number, number],
    userId: Types.ObjectId
  ): Promise<IRegion> {
    const user = await UserModel.findById(userId);
    coordinates = [coordinates[1], coordinates[0]];
    if (!user) {
      throw new Error("User not found");
    }
    return await RegionModel.create({ name, coordinates, user: userId });
  }

  async getRegionById(regionId: string): Promise<IRegion | null> {
    return RegionModel.findById(regionId);
  }

  async updateRegion(
    regionId: string,
    name: string,
    coordinates: [number, number],
    userId: Types.ObjectId
  ): Promise<IRegion | null> {
    coordinates = [coordinates[1], coordinates[0]];
    return RegionModel.findByIdAndUpdate(
      regionId,
      { name, coordinates, user: userId },
      { new: true }
    );
  }

  async deleteRegion(regionId: string): Promise<boolean> {
    const result = await RegionModel.findByIdAndDelete(regionId);
    return !!result;
  }

  async getRegionsContainingPoint(
    latitude: number,
    longitude: number
  ): Promise<IRegion[]> {
    return RegionModel.find({
      coordinates: {
        $geoIntersects: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
        },
      },
    });
  }

  async getRegionsWithinDistance(
    latitude: number,
    longitude: number,
    maxDistance: number,
    userId?: Types.ObjectId
  ): Promise<IRegion[]> {
    const query: any = {
      coordinates: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
          $maxDistance: maxDistance,
        },
      },
    };

    if (userId) {
      query.user = userId;
    }

    return RegionModel.find(query);
  }

  async getRegions(): Promise<IRegion[]> {
    return RegionModel.find();
  }
}
