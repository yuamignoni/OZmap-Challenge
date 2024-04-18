import { expect } from "chai";
import { SinonStub, stub } from "sinon";
import { faker } from "@faker-js/faker";
import { RegionService } from "./regionService";
import { IRegion } from "../interfaces/regionInterface";
import { RegionModel } from "../models/models";
import { UserModel } from "../models/models";
import { Types } from "mongoose";
import sinon from "sinon";

describe("Region Service", () => {
  let regionService: RegionService;
  let regionModelStub: SinonStub;
  let userModelStub: SinonStub;

  let regionMock = {
    _id: faker.database.mongodbObjectId(),
    name: faker.location.county(),
    coordinates: [faker.location.longitude(), faker.location.latitude()],
    user: faker.database.mongodbObjectId(),
  };

  beforeEach(() => {
    regionService = new RegionService();
    regionModelStub = stub(RegionModel, "findOne");
    userModelStub = stub(UserModel, "findById");
  });

  afterEach(() => {
    regionModelStub.restore();
    userModelStub.restore();
  });

  describe("createRegion", () => {
    it("should create a region with provided data", async () => {
      userModelStub
        .withArgs(regionMock.user)
        .resolves({ _id: regionMock.user });
      regionModelStub.resolves(null);
      sinon.stub(regionService, "createRegion").resolves(regionMock as IRegion);

      const region = await regionService.createRegion(
        regionMock.name,
        regionMock.coordinates as [number, number],
        regionMock.user as unknown as Types.ObjectId
      );

      expect(region).to.deep.include(regionMock);
    });
  });
  describe("getRegionById", () => {
    it("should return a region with the provided ID", async () => {
      const regionId = regionMock._id;
      sinon
        .stub(regionService, "getRegionById")
        .withArgs(regionId)
        .resolves(regionMock as IRegion);

      const region = await regionService.getRegionById(regionId);

      expect(region).to.deep.equal(regionMock);
    });

    it("should return null if no region was found with the given ID", async () => {
      const regionId = faker.database.mongodbObjectId();
      sinon
        .stub(regionService, "getRegionById")
        .withArgs(regionId)
        .resolves(null);

      const region = await regionService.getRegionById(regionId);

      expect(region).to.be.null;
    });

    it("should return null if an error occurs during fetching region by ID", async () => {
      const regionId = faker.database.mongodbObjectId();
      sinon
        .stub(regionService, "getRegionById")
        .withArgs(regionId)
        .resolves(null);

      const region = await regionService.getRegionById(regionId);

      expect(region).to.be.null;
    });
  });

  describe("updateRegion", () => {
    it("should update a region with the provided data", async () => {
      userModelStub
        .withArgs(regionMock.user)
        .resolves({ _id: regionMock.user });
      regionModelStub.resolves(null);
      sinon.stub(regionService, "updateRegion").resolves(regionMock as IRegion);

      const region = await regionService.updateRegion(
        regionMock._id,
        regionMock.name,
        regionMock.coordinates as [number, number],
        regionMock.user as unknown as Types.ObjectId
      );

      expect(region).to.deep.include(regionMock);
    });
    it("should return null if no region was found with the given ID", async () => {
      const regionId = faker.database.mongodbObjectId();
      sinon
        .stub(regionService, "updateRegion")
        .withArgs(regionId)
        .resolves(null);

      const region = await regionService.updateRegion(
        regionId,
        regionMock.name,
        regionMock.coordinates as [number, number],
        regionMock.user as unknown as Types.ObjectId
      );

      expect(region).to.be.null;
    });
  });
  describe("getRegionsContainingPoint", () => {
    it("should return regions containing the provided point", async () => {
      const [latitude, longitude] = regionMock.coordinates;
      sinon
        .stub(regionService, "getRegionsContainingPoint")
        .withArgs(latitude, longitude)
        .resolves([regionMock as IRegion]);

      const regions = await regionService.getRegionsContainingPoint(
        latitude,
        longitude
      );

      expect(regions).to.deep.include(regionMock);
    });
  });
  describe("getRegionsWithinDistance", () => {
    it("should return regions within the provided distance", async () => {
      const [latitude, longitude] = regionMock.coordinates;
      const maxDistance = faker.number.int();
      sinon
        .stub(regionService, "getRegionsWithinDistance")
        .withArgs(latitude, longitude, maxDistance)
        .resolves([regionMock as IRegion]);

      const regions = await regionService.getRegionsWithinDistance(
        latitude,
        longitude,
        maxDistance
      );

      expect(regions).to.deep.include(regionMock);
    });
  });
  describe("deleteRegion", () => {
    it("should delete a region with the provided ID", async () => {
      sinon
        .stub(regionService, "deleteRegion")
        .withArgs(regionMock._id)
        .resolves(true);

      const result = await regionService.deleteRegion(regionMock._id);

      expect(result).to.be.true;
    });

    it("should return false if no region was found with the given ID", async () => {
      const regionId = faker.database.mongodbObjectId();
      sinon
        .stub(regionService, "deleteRegion")
        .withArgs(regionId)
        .resolves(false);

      const result = await regionService.deleteRegion(regionId);

      expect(result).to.be.false;
    });
  });
});
