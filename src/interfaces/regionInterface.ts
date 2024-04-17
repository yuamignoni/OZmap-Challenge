import { Document, Types } from "mongoose";
import { IUser } from "../models/models";

export interface IRegion extends Document {
  _id?: Types.ObjectId | string;
  name: string;
  user?: Types.ObjectId | IUser | string;
  coordinates: [number, number];
}
