import sinon from "sinon";
import sinonChai from "sinon-chai";
import chai, { expect } from "chai";
import { faker } from "@faker-js/faker";
import mongoose from "mongoose";
import supertest from "supertest";
import { RegionModel, UserModel } from "../models/models";
import geoLibIntegration from "../services/libService";
import server from "../server";
import "../database";

chai.use(sinonChai);

describe("User Route", function () {
  let user;
  let region;
  let session;
  const request = supertest(server);
  const geoLibStub: Partial<typeof geoLibIntegration> = {};

  before(async () => {
    geoLibStub.getAddressFromCoordinates = sinon
      .stub(geoLibIntegration, "getAddressFromCoordinates")
      .resolves(faker.location.streetAddress({ useFullAddress: true }));
    geoLibStub.getCoordinatesFromAddress = sinon
      .stub(geoLibIntegration, "getCoordinatesFromAddress")
      .resolves([faker.location.latitude(), faker.location.longitude()]);

    session = await mongoose.startSession();
    user = await UserModel.create({
      name: faker.person.firstName(),
      email: faker.internet.email(),
      address: faker.location.streetAddress({ useFullAddress: true }),
    });
    console.log(user);
    region = await RegionModel.create({
      name: faker.string.alpha(),
      user: user._id,
      coordinates: [faker.location.longitude(), faker.location.latitude()],
    });
  });

  after(() => {
    sinon.restore();
    session.endSession();
  });

  beforeEach(() => {
    session.startTransaction();
  });

  afterEach(() => {
    session.commitTransaction();
  });

  describe("POST /users", function () {
    it("should create a new user", async function () {
      const user = MOCKS.user1;
      const response = await request.post("/users").send(user);
      expect(response.status).to.equal(201);
      expect(response.body).to.have.property("name", user.name);
      expect(response.body).to.have.property("email", user.email);
      expect(response.body).to.have.property("address");
      expect(response.body).to.have.property("coordinates").to.be.an("array");
    });
  });

  describe("PUT /users/:id", function () {
    it("Should update a user", async function () {
      const response = await request.put(`/users/${user._id}`).send({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        coordinates: [faker.location.latitude(), faker.location.longitude()],
      });

      expect(response).to.have.property("status", 201);
    });
  });

  describe("GET /users", function () {
    it("Should return a list of users", async function () {
      const response = await request.get("/users");

      expect(response).to.have.property("status", 200);
      expect(response.body).to.be.an("array");
    });
  });

  describe("GET /users/:id", function () {
    it("Should return the correct info of the desired user", async function () {
      const response = await request.get(`/users/${user._id}`);

      expect(response).to.have.property("status", 200);
      expect(response.body).to.be.an("object");
      expect(response.body).to.have.property("_id");
    });
  });

  describe("DELETE /users/:id", function () {
    it("Should delete the desired user", async function () {
      const response = await request.delete(`/users/${user._id}`);

      expect(response).to.have.property("status", 204);
    });
  });
});

const MOCKS = {
  user1: {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    coordinates: [faker.location.latitude(), faker.location.longitude()],
  },
  user2: {
    _id: faker.database.mongodbObjectId(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    address: faker.location.streetAddress(),
    coordinates: [faker.location.latitude(), faker.location.longitude()],
  },
  region1: {
    _id: faker.database.mongodbObjectId(),
    name: "Test Region",
    coordinates: [faker.location.latitude(), faker.location.longitude()],
    user: faker.database.mongodbObjectId(),
  },
  region2: {
    _id: faker.database.mongodbObjectId(),
    name: "Test Region 2",
    coordinates: [faker.location.latitude(), faker.location.longitude()],
    user: faker.database.mongodbObjectId(),
  },
};
