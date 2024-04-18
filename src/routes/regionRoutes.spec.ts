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

describe("Regions Route", function () {
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

  describe("POST /regions", function () {
    it("should create a new region", async function () {
      const region = { ...MOCKS.region1, user: user._id };
      const response = await request.post("/regions").send(region);

      expect(response.status).to.equal(201);
      expect(response).to.be.an("object");
      expect(response.body).to.have.property("name", region.name);
      expect(response.body).to.have.property("coordinates").to.be.an("array");
    });
  });

  describe("GET /regions/:id", function () {
    it("Should return the correct info of the desired user", async function () {
      const response = await request.get(`/regions/${region._id}`);

      expect(response).to.have.property("status", 200);
      expect(response.body).to.be.an("object");
      expect(response.body).to.have.property("_id", region._id);
      expect(response.body).to.have.property("name", region.name);
    });
  });

  describe("PUT /regions/:id", function () {
    it("Should update a user", async function () {
      const response = await request.put(`/regions/${region._id}`).send({
        name: faker.string.alpha(),
        coordinates: [faker.location.latitude(), faker.location.longitude()],
      });

      expect(response).to.have.property("status", 201);
      expect(response.body).to.have.property("_id", region._id);
    });
  });

  describe("GET /regions", function () {
    it("Should return a list of regions", async function () {
      const response = await request.get("/regions");

      expect(response).to.have.property("status", 200);
      expect(response.body).to.be.an("array");
    });
  });

  describe("DELETE /regions/:id", function () {
    it("Should delete the desired user", async function () {
      const response = await request.delete(`/regions/${region._id}`);

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
    name: "Test Region",
    coordinates: [faker.location.latitude(), faker.location.longitude()],
  },
  region2: {
    _id: faker.database.mongodbObjectId(),
    name: "Test Region 2",
    coordinates: [faker.location.latitude(), faker.location.longitude()],
    user: faker.database.mongodbObjectId(),
  },
};
