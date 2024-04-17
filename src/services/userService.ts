import { UserModel, IUser } from "../models/models";
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
    return UserModel.create(userData);
  }

  async updateUser(
    userId: string,
    userData: Partial<IUser>
  ): Promise<IUser | null> {
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

    return UserModel.findByIdAndUpdate(userId, userData, { new: true }).exec();
  }

  async getUserById(userId: string): Promise<IUser | null> {
    return UserModel.findById(userId).exec();
  }

  async deleteUser(userId: string): Promise<boolean> {
    const result = await UserModel.findByIdAndDelete(userId).exec();
    return !!result;
  }

  async getUsers(): Promise<IUser[]> {
    return UserModel.find().exec();
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
