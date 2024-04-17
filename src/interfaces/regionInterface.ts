import { Document, Types } from "mongoose";
import { IUser } from "../models/models";

export interface IRegion extends Document {
  _id: string;
  name: string;
  owner?: Types.ObjectId | IUser;
  coordinates: [number, number];
}
