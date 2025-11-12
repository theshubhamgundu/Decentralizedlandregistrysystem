const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("LandRegistry", function () {
  let LandRegistry, landRegistry, owner, addr1, addr2;

  beforeEach(async function () {
    // Deploy a new contract before each test
    LandRegistry = await ethers.getContractFactory("LandRegistry");
    [owner, addr1, addr2] = await ethers.getSigners();
    landRegistry = await LandRegistry.deploy();
    await landRegistry.deployed();
  });

  describe("Land Registration", function () {
    it("Should register a new land", async function () {
      await landRegistry.registerLand("Test Location", "Test Owner", 1000, 100);
      const land = await landRegistry.lands(1);
      expect(land.location).to.equal("Test Location");
      expect(land.ownerName).to.equal("Test Owner");
      expect(land.area).to.equal(1000);
      expect(land.price).to.equal(100);
      expect(land.isForSale).to.equal(false);
      expect(land.currentOwner).to.equal(owner.address);
    });
  });

  describe("Ownership Transfer", function () {
    beforeEach(async function () {
      // Register a land first
      await landRegistry.registerLand("Test Location", "Test Owner", 1000, 100);
    });

    it("Should transfer land ownership", async function () {
      await landRegistry.transferOwnership(1, addr1.address, "New Owner");
      const land = await landRegistry.lands(1);
      expect(land.ownerName).to.equal("New Owner");
      expect(land.currentOwner).to.equal(addr1.address);
    });
  });

  describe("Selling Land", function () {
    beforeEach(async function () {
      // Register a land first
      await landRegistry.registerLand("Test Location", "Test Owner", 1000, 100);
    });

    it("Should allow owner to put land for sale", async function () {
      await landRegistry.toggleForSale(1, 200);
      const land = await landRegistry.lands(1);
      expect(land.isForSale).to.equal(true);
      expect(land.price).to.equal(200);
    });
  });
});
