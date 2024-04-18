import chai, { expect } from "chai";
import { SinonStub, stub } from "sinon";
import { Request, Response } from "express";
import { UserController } from "./userController";
import { UserService } from "../services/userService";
import sinonChai from "sinon-chai";
import { IUser } from "../models/models";
import { faker } from "@faker-js/faker";

chai.use(sinonChai);

describe("User Controller", () => {
  let userService: UserService;
  let userController: UserController;
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    userService = new UserService();
    userController = new UserController(userService);
    req = {};
    res = {
      status: stub().returnsThis(),
      json: stub().returnsThis(),
      end: stub().returnsThis(),
    };
  });

  describe("createUser", () => {
    it("should create a user with a 201 status code", async () => {
      const createUserStub: SinonStub = stub(
        userService,
        "createUser"
      ).resolves({} as IUser);
      req.body = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        address: faker.location.streetAddress(),
      };

      await userController.createUser(req as Request, res as Response);

      expect(createUserStub.calledOnce).to.be.true;
      expect(res.status).to.be.calledWith(201);
      expect(res.json).to.be.calledOnce;
      createUserStub.restore();
    });

    it("should return 400 status code when user creation fails", async () => {
      const createUserStub: SinonStub = stub(userService, "createUser").throws(
        new Error("Failed to create user")
      );
      req.body = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        address: faker.location.streetAddress(),
      };
      await userController.createUser(req as Request, res as Response);

      expect(createUserStub.calledOnceWith(req.body)).to.be.true;
      expect(res.status).to.be.calledWith(400);
      expect(res.json).to.be.calledOnce;
      expect(res.json).to.be.calledWith({ error: "Failed to create user" });
      createUserStub.restore();
    });
  });

  describe("getUserById", () => {
    it("should return user by id with a 200 status code", async () => {
      const userId = faker.database.mongodbObjectId();
      const user = {
        _id: userId,
        name: "Test User",
        email: "test@gmail.com",
        address: "Rua teste 123, São Paulo - SP, 01234-567",
      };
      const getUserByIdStub: SinonStub = stub(
        userService,
        "getUserById"
      ).resolves(user as IUser);
      req.params = { id: userId };

      await userController.getUserById(req as Request, res as Response);

      expect(getUserByIdStub.calledOnceWith(userId)).to.be.true;
      expect(res.status).to.be.calledWith(200);
      expect(res.json).to.be.calledOnce;
      expect(res.json).to.be.calledWith(user);
      getUserByIdStub.restore();
    });

    it("should return 404 status code when user not found", async () => {
      const userId = faker.database.mongodbObjectId();
      const getUserByIdStub: SinonStub = stub(
        userService,
        "getUserById"
      ).resolves(null);
      req.params = { id: userId };

      await userController.getUserById(req as Request, res as Response);

      expect(getUserByIdStub.calledOnceWith(userId)).to.be.true;
      expect(res.status).to.be.calledWith(404);
      expect(res.json).to.be.calledOnce;
      expect(res.json).to.be.calledWith({ error: "User not found" });
      getUserByIdStub.restore();
    });

    it("should return 500 status code when an error occurs", async () => {
      const userId = faker.database.mongodbObjectId();
      const getUserByIdStub: SinonStub = stub(
        userService,
        "getUserById"
      ).throws(new Error("Internal server error"));
      req.params = { id: userId };

      await userController.getUserById(req as Request, res as Response);

      expect(getUserByIdStub.calledOnceWith(userId)).to.be.true;
      expect(res.status).to.be.calledWith(500);
      expect(res.json).to.be.calledWith({ error: "Internal server error" });
      getUserByIdStub.restore();
    });
  });

  describe("updateUser", () => {
    it("should update an user", async () => {
      const userId = faker.database.mongodbObjectId();
      const userData = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        address: faker.location.streetAddress(),
      };
      const updateUserStub: SinonStub = stub(
        userService,
        "updateUser"
      ).resolves({ _id: userId, ...userData } as IUser);
      req.params = { id: userId };
      req.body = userData;

      await userController.updateUser(req as Request, res as Response);

      expect(updateUserStub.calledOnceWith(userId, userData)).to.be.true;
      expect(res.status).to.be.calledWith(201);
      expect(res.json).to.be.calledWith({ _id: userId, ...userData });
      updateUserStub.restore();
    });

    it("should return 404 status code when a user is not found", async () => {
      const userId = faker.database.mongodbObjectId();
      const userData = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        address: faker.location.streetAddress(),
      };
      const updateUserStub: SinonStub = stub(
        userService,
        "updateUser"
      ).resolves(null);
      req.params = { id: userId };
      req.body = userData;

      await userController.updateUser(req as Request, res as Response);

      expect(updateUserStub.calledOnceWith(userId, userData)).to.be.true;
      expect(res.status).to.be.calledWith(404);
      expect(res.json).to.be.calledWith({ error: "User not found" });
      updateUserStub.restore();
    });

    it("should return 400 status code when update fails", async () => {
      const userId = faker.database.mongodbObjectId();
      const userData = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        address: faker.location.streetAddress(),
      };
      const updateUserStub: SinonStub = stub(userService, "updateUser").throws(
        new Error("Failed to update user")
      );
      req.params = { id: userId };
      req.body = userData;

      await userController.updateUser(req as Request, res as Response);

      expect(updateUserStub.calledOnceWith(userId, userData)).to.be.true;
      expect(res.status).to.be.calledWith(400);
      expect(res.json).to.be.calledWith({
        error: "Failed to update user",
      });
      updateUserStub.restore();
    });
  });

  describe("deleteUser", () => {
    it("should delete user and return 204 status code", async () => {
      const userId = faker.database.mongodbObjectId();
      const deleteUserStub: SinonStub = stub(
        userService,
        "deleteUser"
      ).resolves(true);
      req.params = { id: userId };

      await userController.deleteUser(req as Request, res as Response);

      expect(deleteUserStub.calledOnceWith(userId)).to.be.true;
      expect(res.status).to.be.calledWith(204);
      expect(res.end).to.be.calledOnce;
      deleteUserStub.restore();
    });

    it("should return 404 status code when user not found", async () => {
      const userId = faker.database.mongodbObjectId();
      const deleteUserStub: SinonStub = stub(
        userService,
        "deleteUser"
      ).resolves(false);
      req.params = { id: userId };

      await userController.deleteUser(req as Request, res as Response);

      expect(deleteUserStub.calledOnceWith(userId)).to.be.true;
      expect(res.status).to.be.calledWith(404);
      expect(res.json).to.be.calledWith({ error: "User not found" });
      deleteUserStub.restore();
    });

    it("should return 500 status code when an error occurs", async () => {
      const userId = faker.database.mongodbObjectId();
      const deleteUserStub: SinonStub = stub(userService, "deleteUser").throws(
        new Error("Internal server error")
      );
      req.params = { id: userId };

      await userController.deleteUser(req as Request, res as Response);

      expect(deleteUserStub.calledOnceWith(userId)).to.be.true;
      expect(res.status).to.be.calledWith(500);
      expect(res.json).to.be.calledWith({ error: "Internal server error" });
      deleteUserStub.restore();
    });
  });

  describe("getUsers", () => {
    it("should get users and return 200 status code", async () => {
      const users = [
        { _id: "user1", name: "User 1" },
        { _id: "user2", name: "User 2" },
      ];
      const getUsersStub: SinonStub = stub(userService, "getUsers").resolves(
        users as IUser[]
      );

      await userController.getUsers(req as Request, res as Response);

      expect(getUsersStub.calledOnce).to.be.true;
      expect(res.status).to.be.calledWith(200);
      expect(res.json).to.be.calledWith(users);
      getUsersStub.restore();
    });

    it("should return 500 status code when an error occurs", async () => {
      const getUsersStub: SinonStub = stub(userService, "getUsers").throws(
        new Error("Internal server error")
      );

      await userController.getUsers(req as Request, res as Response);

      expect(getUsersStub.calledOnce).to.be.true;
      expect(res.status).to.be.calledWith(500);
      expect(res.json).to.be.calledWith({ error: "Internal server error" });
      getUsersStub.restore();
    });
  });
});
