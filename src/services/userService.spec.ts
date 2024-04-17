import { expect } from "chai";
import { SinonStub, stub } from "sinon";
import { UserService } from "./userService";
import { IUser } from "../interfaces/userInterface";
import { UserModel } from "../models/models";
import GeoLib from "../services/libService";
import { faker } from "@faker-js/faker";
import sinonChai from "sinon-chai";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import sinon from "sinon";

chai.use(sinonChai);
chai.use(chaiAsPromised);

describe("User Service", () => {
  let userService: UserService;
  let userModelStub: SinonStub;
  let updateUserStub;

  beforeEach(() => {
    userService = new UserService();
    userModelStub = stub(UserModel, "create");
    updateUserStub = sinon.stub(UserModel, "findByIdAndUpdate");
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("createUser", () => {
    it("should create a user with provided data", async () => {
      const latitude = faker.location.latitude();
      const longitude = faker.location.longitude();
      const userData: Partial<IUser> = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        coordinates: [latitude, longitude],
      };

      sinon
        .stub(GeoLib, "getAddressFromCoordinates")
        .resolves([latitude, longitude] as any);
      userModelStub.resolves(userData as IUser);
      const createdUser = await userService.createUser(userData);

      expect(createdUser).to.be.an("object");
      expect(createdUser).to.have.property("name", userData.name);
      expect(createdUser).to.have.property("email", userData.email);
      expect(createdUser).to.have.property("coordinates").to.be.an("array");
    });

    it("should throw an error if both address and coordinates are provided", async () => {
      const userData: Partial<IUser> = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        address: faker.location.streetAddress(),
        coordinates: [faker.location.latitude(), faker.location.longitude()],
      };

      await expect(userService.createUser(userData)).to.be.rejectedWith(
        "You must provide either address or coordinates, but not both or none."
      );
    });
  });

  describe("updateUser", () => {
    it("should throw an error if both address and coordinates are provided", async () => {
      const userData: Partial<IUser> = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        address: faker.location.streetAddress(),
        coordinates: [faker.location.latitude(), faker.location.longitude()],
      };

      await expect(userService.createUser(userData)).to.be.rejectedWith(
        "You must provide either address or coordinates, but not both or none."
      );
    });
  });

  describe("getUserById", () => {
    it("should return the user with the given ID", async () => {
      const userId = faker.database.mongodbObjectId();
      const userData: Partial<IUser> = {
        _id: userId,
        name: faker.person.fullName(),
        email: faker.internet.email(),
        address: faker.location.streetAddress(),
        coordinates: [faker.location.latitude(), faker.location.longitude()],
      };
      sinon
        .mock(UserModel)
        .expects("findOne")
        .returns(userData as IUser);

      const user = await userService.getUserById(userId);
      expect(user).to.deep.equal(userData);
    });

    it("should return null if no user found with the given ID", async () => {
      const userId = faker.database.mongodbObjectId();
      sinon.mock(UserModel).expects("findOne").returns(null);

      const user = await userService.getUserById(userId);

      expect(user).to.be.null;
    });
  });
  describe("deleteUser", () => {
    it("should return true if user is deleted successfully", async () => {
      const userId = faker.database.mongodbObjectId();
      sinon.stub(UserModel, "findByIdAndDelete").resolves({ _id: userId });

      const result = await userService.deleteUser(userId);

      expect(result).to.be.true;
    });

    it("should return false if no user found with the given ID", async () => {
      const userId = faker.database.mongodbObjectId();
      sinon.stub(UserModel, "findByIdAndDelete").resolves(null);

      const result = await userService.deleteUser(userId);

      expect(result).to.be.false;
    });

    it("should return false if an error occurs during deletion", async () => {
      const userId = faker.database.mongodbObjectId();
      const errorMessage = "Error deleting user";
      sinon.stub(UserModel, "findByIdAndDelete").resolves(false);

      const result = await userService.deleteUser(userId);

      expect(result).to.be.false;
    });
  });

  describe("getUsers", () => {
    it("should return an array of users", async () => {
      const mockUsers = [
        {
          _id: faker.database.mongodbObjectId(),
          name: faker.person.fullName(),
          email: faker.internet.email(),
          address: faker.location.streetAddress(),
          coordinates: [faker.location.longitude(), faker.location.latitude()],
        },
        {
          _id: faker.database.mongodbObjectId(),
          name: faker.person.fullName(),
          email: faker.internet.email(),
          address: faker.location.streetAddress(),
          coordinates: [faker.location.longitude(), faker.location.latitude()],
        },
      ];
      sinon.mock(UserModel).expects("find").returns(mockUsers);

      const users = await userService.getUsers();

      expect(users).to.deep.equal(mockUsers);
    });

    it("should return an empty array if no users found", async () => {
      sinon.mock(UserModel).expects("find").returns([]);

      const users = await userService.getUsers();

      expect(users).to.deep.equal([]);
    });

    it("should return null if an error occurs during fetching users", async () => {
      sinon.mock(UserModel).expects("find").resolves(null);

      const users = await userService.getUsers();

      expect(users).to.be.null;
    });
  });
});
