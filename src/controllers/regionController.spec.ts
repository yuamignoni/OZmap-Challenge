import chai, { expect } from "chai";
import { SinonStub, stub } from "sinon";
import { Request, Response } from "express";
import { RegionController } from "./regionController";
import { RegionService } from "../services/regionService";
import { faker } from "@faker-js/faker";
import sinonChai from "sinon-chai";
import { IRegion } from "../interfaces/regionInterface";

chai.use(sinonChai);

describe("Region Controller", () => {
  let regionService: RegionService;
  let regionController: RegionController;
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    regionService = new RegionService();
    regionController = new RegionController(regionService);
    req = {};
    res = {
      status: stub().returnsThis(),
      json: stub().returnsThis(),
      end: stub().returnsThis(),
    };
  });

  describe("createRegion", () => {
    it("should create a region and return 201 status code", async () => {
      const regionData = {
        _id: faker.database.mongodbObjectId(),
        name: "Test Region",
        coordinates: [faker.location.longitude(), faker.location.latitude()],
        user: faker.database.mongodbObjectId(),
      };
      const createRegionStub: SinonStub = stub(
        regionService,
        "createRegion"
      ).resolves(regionData as IRegion);
      req.body = regionData;

      await regionController.createRegion(req as Request, res as Response);

      expect(
        createRegionStub.calledOnceWith(
          regionData.name,
          regionData.coordinates,
          regionData.user
        )
      ).to.be.true;
      expect(res.status).to.be.calledWith(201);
      expect(res.json).to.be.calledOnce;
      expect(res.json).to.be.calledWith(regionData);

      createRegionStub.restore();
    });

    it("should return 500 status code when region creation fails", async () => {
      const regionData = {
        _id: faker.database.mongodbObjectId(),
        name: "Test Region",
        coordinates: [faker.location.longitude(), faker.location.latitude()],
        user: faker.database.mongodbObjectId(),
      };
      const errorMessage = "Failed to create region";
      const createRegionStub: SinonStub = stub(
        regionService,
        "createRegion"
      ).throws(new Error("Failed to create region"));
      req.body = regionData;

      await regionController.createRegion(req as Request, res as Response);

      expect(
        createRegionStub.calledOnceWith(
          regionData.name,
          regionData.coordinates,
          regionData.user
        )
      ).to.be.true;
      expect(res.status).to.be.calledWith(500);
      expect(res.json).to.be.calledOnce;
      expect(res.json).to.be.calledWith({ error: "Error creating region" });
      createRegionStub.restore();
    });
  });

  describe("getRegionById", () => {
    it("should return the region when a valid ID is provided", async () => {
      const regionId = "faker.database.mongodbObjectId()";
      const regionData = {
        _id: faker.database.mongodbObjectId(),
        name: "Test Region",
        coordinates: [faker.location.longitude(), faker.location.latitude()],
        user: faker.database.mongodbObjectId(),
      };
      const getRegionByIdStub: SinonStub = stub(
        regionService,
        "getRegionById"
      ).resolves(regionData as IRegion);
      req.params = { id: regionId };

      await regionController.getRegionById(req as Request, res as Response);

      expect(getRegionByIdStub.calledOnceWith(regionId)).to.be.true;
      expect(res.status).to.be.calledWith(200);
      expect(res.json).to.be.calledOnce;
      expect(res.json).to.be.calledWith(regionData);

      getRegionByIdStub.restore();
    });

    it("should return 404 status code when an invalid ID is provided", async () => {
      const invalidRegionId = "invalid_id";
      const getRegionByIdStub: SinonStub = stub(
        regionService,
        "getRegionById"
      ).resolves(null);
      req.params = { id: invalidRegionId };

      await regionController.getRegionById(req as Request, res as Response);

      expect(getRegionByIdStub.calledOnceWith(invalidRegionId)).to.be.true;
      expect(res.status).to.be.calledWith(404);
      expect(res.json).to.be.calledOnce;
      expect(res.json).to.be.calledWith({ error: "Region not found" });

      getRegionByIdStub.restore();
    });

    it("should return 500 status code when an error occurs", async () => {
      const errorMessage = "Internal server error";
      const getRegionByIdStub: SinonStub = stub(
        regionService,
        "getRegionById"
      ).throws(new Error(errorMessage));
      const regionId = "faker.database.mongodbObjectId()";
      req.params = { id: regionId };

      await regionController.getRegionById(req as Request, res as Response);

      expect(getRegionByIdStub.calledOnceWith(regionId)).to.be.true;
      expect(res.status).to.be.calledWith(500);
      expect(res.json).to.be.calledOnce;
      expect(res.json).to.be.calledWith({ error: "Internal server error" });

      getRegionByIdStub.restore();
    });
  });

  describe("updateRegion", () => {
    it("should update the region when a valid ID and data are provided", async () => {
      const regionId = faker.database.mongodbObjectId();
      const regionData = {
        name: "Test Region",
        coordinates: [faker.location.longitude(), faker.location.latitude()],
        user: faker.database.mongodbObjectId(),
      };
      const updateRegionStub: SinonStub = stub(
        regionService,
        "updateRegion"
      ).resolves(regionData as IRegion);
      req.params = { id: regionId };
      req.body = regionData;

      await regionController.updateRegion(req as Request, res as Response);

      expect(updateRegionStub.calledOnceWith(regionId)).to.be.true;
      expect(res.status).to.be.calledWith(201);
      expect(res.json).to.be.calledOnce;
      expect(res.json).to.be.calledWith(regionData);

      updateRegionStub.restore();
    });

    it("should return 404 status code when an invalid ID is provided", async () => {
      const invalidRegionId = "invalid id";
      const regionData = {
        name: "Test Region",
        coordinates: [faker.location.longitude(), faker.location.latitude()],
        user: faker.database.mongodbObjectId(),
      };
      const updateRegionStub: SinonStub = stub(
        regionService,
        "updateRegion"
      ).resolves(null);
      req.params = { id: invalidRegionId };
      req.body = regionData;

      await regionController.updateRegion(req as Request, res as Response);

      expect(updateRegionStub.calledOnceWith(invalidRegionId)).to.be.true;
      expect(res.status).to.be.calledWith(404);
      expect(res.json).to.be.calledOnce;
      expect(res.json).to.be.calledWith({ error: "Region not found" });

      updateRegionStub.restore();
    });

    it("should return 500 status code when an error occurs", async () => {
      const regionId = faker.database.mongodbObjectId();
      const regionData = {
        name: "Test Region",
        coordinates: [faker.location.longitude(), faker.location.latitude()],
        user: faker.database.mongodbObjectId(),
      };
      const updateRegionStub: SinonStub = stub(
        regionService,
        "updateRegion"
      ).throws(new Error("Error updating region"));
      req.params = { id: regionId };
      req.body = regionData;

      await regionController.updateRegion(req as Request, res as Response);

      expect(updateRegionStub.calledOnceWith(regionId)).to.be.true;
      expect(res.status).to.be.calledWith(500);
      expect(res.json).to.be.calledOnce;
      expect(res.json).to.be.calledWith({ error: "Error updating region" });

      updateRegionStub.restore();
    });
  });

  describe("deleteRegion", () => {
    it("should delete the region when a valid ID is provided", async () => {
      const regionId = "faker.database.mongodbObjectId()";
      const deleteRegionStub: SinonStub = stub(
        regionService,
        "deleteRegion"
      ).resolves(true);
      req.params = { id: regionId };

      await regionController.deleteRegion(req as Request, res as Response);

      expect(deleteRegionStub.calledOnceWith(regionId)).to.be.true;
      expect(res.status).to.be.calledWith(204);
      expect(res.end).to.be.calledOnce;

      deleteRegionStub.restore();
    });

    it("should return 404 status code when an invalid ID is provided", async () => {
      const invalidRegionId = "invalid id";
      const deleteRegionStub: SinonStub = stub(
        regionService,
        "deleteRegion"
      ).resolves(false);
      req.params = { id: invalidRegionId };

      await regionController.deleteRegion(req as Request, res as Response);

      expect(deleteRegionStub.calledOnceWith(invalidRegionId)).to.be.true;
      expect(res.status).to.be.calledWith(404);
      expect(res.json).to.be.calledWith({ error: "Region not found" });
      deleteRegionStub.restore();
    });

    it("should return 500 status code when an error occurs", async () => {
      const regionId = "faker.database.mongodbObjectId()";
      const deleteRegionStub: SinonStub = stub(
        regionService,
        "deleteRegion"
      ).throws(new Error("Failed to delete region"));
      req.params = { id: regionId };

      await regionController.deleteRegion(req as Request, res as Response);

      expect(deleteRegionStub.calledOnceWith(regionId)).to.be.true;
      expect(res.status).to.be.calledWith(500);
      expect(res.json).to.be.calledWith({ error: "Failed to delete region" });

      deleteRegionStub.restore();
    });
  });

  describe("getRegionsContainingPoint", () => {
    it("should return the regions containing a specific point", async () => {
      const latitude = "1";
      const longitude = "1";
      const regionData = [
        {
          _id: faker.database.mongodbObjectId(),
          name: "Test Region",
          coordinates: [1, 1],
          user: faker.database.mongodbObjectId(),
        },
        {
          _id: faker.database.mongodbObjectId(),
          name: "Test Region 2",
          coordinates: [faker.location.longitude(), faker.location.latitude()],
          user: faker.database.mongodbObjectId(),
        },
      ];
      const getRegionsContainingPointStub: SinonStub = stub(
        regionService,
        "getRegionsContainingPoint"
      ).resolves(regionData as IRegion[]);
      req.query = { latitude, longitude };

      await regionController.getRegionsContainingPoint(
        req as Request,
        res as Response
      );

      expect(res.status).to.be.calledWith(200);
      expect(res.json).to.be.calledWith(regionData);

      getRegionsContainingPointStub.restore();
    });

    it("should return 500 status code when an error occurs", async () => {
      const errorMessage = "Failed to fetch regions containing point";
      const latitude = "51.5074";
      const longitude = "0.1278";
      const getRegionsContainingPointStub: SinonStub = stub(
        regionService,
        "getRegionsContainingPoint"
      ).throws(new Error(errorMessage));
      req.query = { latitude, longitude };

      await regionController.getRegionsContainingPoint(
        req as Request,
        res as Response
      );

      expect(res.status).to.be.calledWith(500);
      expect(res.json).to.be.calledOnce;
      expect(res.json).to.be.calledWith({ error: errorMessage });

      getRegionsContainingPointStub.restore();
    });
  });

  describe("getRegionsWithinDistance", () => {
    it("should return the regions within a certain distance from a point", async () => {
      const latitude = "0";
      const longitude = "0";
      const maxDistance = "10";
      const regions = [
        {
          _id: faker.database.mongodbObjectId(),
          name: "Test Region",
          coordinates: [1, 1],
          user: faker.database.mongodbObjectId(),
        },
        {
          _id: faker.database.mongodbObjectId(),
          name: "Test Region 2",
          coordinates: [faker.location.longitude(), faker.location.latitude()],
          user: faker.database.mongodbObjectId(),
        },
      ];
      const getRegionsWithinDistanceStub: SinonStub = stub(
        regionService,
        "getRegionsWithinDistance"
      ).resolves(regions as IRegion[]);
      req.query = { latitude, longitude, maxDistance };

      await regionController.getRegionsWithinDistance(
        req as Request,
        res as Response
      );

      expect(res.status).to.be.calledWith(200);
      expect(res.json).to.be.calledOnce;
      expect(res.json).to.be.calledWith(regions);
      getRegionsWithinDistanceStub.restore();
    });

    it("should return 500 status code when an error occurs", async () => {
      const errorMessage = "Failed to fetch regions within distance";
      const latitude = "0";
      const longitude = "0";
      const maxDistance = "10";
      const getRegionsWithinDistanceStub: SinonStub = stub(
        regionService,
        "getRegionsWithinDistance"
      ).throws(new Error(errorMessage));
      req.query = { latitude, longitude, maxDistance };

      await regionController.getRegionsWithinDistance(
        req as Request,
        res as Response
      );

      expect(res.status).to.be.calledWith(500);
      expect(res.json).to.be.calledOnce;
      expect(res.json).to.be.calledWith({ error: errorMessage });

      getRegionsWithinDistanceStub.restore();
    });
  });

  describe("getRegions", () => {
    it("should return all regions", async () => {
      const regionData = [
        {
          _id: faker.database.mongodbObjectId(),
          name: "Test Region",
          coordinates: [faker.location.longitude(), faker.location.latitude()],
          user: faker.database.mongodbObjectId(),
        },
        {
          _id: faker.database.mongodbObjectId(),
          name: "Test Region 2",
          coordinates: [faker.location.longitude(), faker.location.latitude()],
          user: faker.database.mongodbObjectId(),
        },
      ];
      const getRegionsStub: SinonStub = stub(
        regionService,
        "getRegions"
      ).resolves(regionData as IRegion[]);

      await regionController.getRegions(req as Request, res as Response);

      expect(getRegionsStub.calledOnce).to.be.true;
      expect(res.status).to.be.calledWith(200);
      expect(res.json).to.be.calledOnce;
      expect(res.json).to.be.calledWith(regionData);

      getRegionsStub.restore();
    });

    it("should return 500 status code when an error occurs", async () => {
      const errorMessage = "Failed to fetch regions";
      const getRegionsStub: SinonStub = stub(
        regionService,
        "getRegions"
      ).throws(new Error(errorMessage));

      await regionController.getRegions(req as Request, res as Response);

      expect(getRegionsStub.calledOnce).to.be.true;
      expect(res.status).to.be.calledWith(500);
      expect(res.json).to.be.calledOnce;
      expect(res.json).to.be.calledWith({ error: errorMessage });

      getRegionsStub.restore();
    });
  });
});
