import { UserModel } from "../models/models";
import { IUser } from "../interfaces/userInterface";
import geolib from "../services/libService";

export interface UserServiceInterface {
  createUser(userData: Partial<IUser>): Promise<IUser>;
  getUserById(userId: string): Promise<IUser | null>;
  updateUser(userId: string, userData: Partial<IUser>): Promise<IUser | null>;
  deleteUser(userId: string): Promise<boolean>;
  getUsers(): Promise<IUser[]>;
}

export class UserService implements UserServiceInterface {
  async createUser(userData: Partial<IUser>): Promise<IUser> {
    this.validateUserData(userData);
    if (userData.address) {
      const resolvedCoordinates = await geolib.getCoordinatesFromAddress(
        userData.address
      );
      if (!resolvedCoordinates) {
        throw new Error(
          "Unable to resolve coordinates for the provided address."
        );
      }
      userData.coordinates = resolvedCoordinates;
    }
    if (userData.coordinates) {
      const resolvedAddress = await geolib.getAddressFromCoordinates(
        userData.coordinates
      );
      if (!resolvedAddress) {
        throw new Error(
          "Unable to resolve address for the provided coordinates."
        );
      }
      userData.address = resolvedAddress;
    }
    const user = await UserModel.create(userData);
    return user;
  }

  async updateUser(
    userId: string,
    userData: Partial<IUser>
  ): Promise<IUser | null> {
    if (userData.coordinates && userData.address) {
      throw new Error(
        "You can provide either address or coordinates, but not both."
      );
    }

    const user = await UserModel.findOne({ _id: userId });

    if (!user) {
      throw new Error("User not found");
    }

    if (userData.address) {
      const resolvedCoordinates = await geolib.getCoordinatesFromAddress(
        userData.address
      );
      if (!resolvedCoordinates) {
        throw new Error(
          "Unable to resolve coordinates for the provided address."
        );
      }
      userData.coordinates = resolvedCoordinates;
    }
    if (userData.coordinates) {
      const resolvedAddress = await geolib.getAddressFromCoordinates(
        userData.coordinates
      );
      if (!resolvedAddress) {
        throw new Error(
          "Unable to resolve address for the provided coordinates."
        );
      }
      userData.address = resolvedAddress;
    }

    return await UserModel.findByIdAndUpdate(userId, userData, { new: true });
  }

  async getUserById(userId: string): Promise<IUser | null> {
    return await UserModel.findOne({ _id: userId });
  }

  async deleteUser(userId: string): Promise<boolean> {
    const result = await UserModel.findByIdAndDelete(userId);
    return !!result;
  }

  async getUsers(): Promise<IUser[]> {
    return await UserModel.find();
  }

  private validateUserData(userData: Partial<IUser>): void {
    const { address, coordinates } = userData;

    if ((address && coordinates) || (!address && !coordinates)) {
      throw new Error(
        "You must provide either address or coordinates, but not both or none."
      );
    }
  }
}
