import { expect } from "chai";
import { ethers } from "hardhat";

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

    it("Should emit LandRegistered event", async function () {
      await expect(landRegistry.registerLand("Test Location", "Test Owner", 1000, 100))
        .to.emit(landRegistry, "LandRegistered")
        .withArgs(1, "Test Location", "Test Owner");
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

    it("Should emit OwnershipTransferred event", async function () {
      await expect(landRegistry.transferOwnership(1, addr1.address, "New Owner"))
        .to.emit(landRegistry, "OwnershipTransferred")
        .withArgs(1, owner.address, addr1.address, "New Owner");
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

    it("Should emit LandForSale event", async function () {
      await expect(landRegistry.toggleForSale(1, 200))
        .to.emit(landRegistry, "LandForSale")
        .withArgs(1, 200);
    });
  });

  describe("Buying Land", function () {
    beforeEach(async function () {
      // Register a land and put it for sale
      await landRegistry.registerLand("Test Location", "Owner", 1000, 100);
      await landRegistry.toggleForSale(1, 100);
    });

    it("Should allow buying land with correct value", async function () {
      await expect(
        landRegistry.connect(addr1).buyLand(1, "New Owner", { value: 100 })
      ).to.changeEtherBalances(
        [addr1, owner],
        [-100, 100]
      );

      const land = await landRegistry.lands(1);
      expect(land.currentOwner).to.equal(addr1.address);
      expect(land.ownerName).to.equal("New Owner");
      expect(land.isForSale).to.equal(false);
    });

    it("Should emit LandSold event", async function () {
      await expect(
        landRegistry.connect(addr1).buyLand(1, "New Owner", { value: 100 })
      )
        .to.emit(landRegistry, "LandSold")
        .withArgs(1, owner.address, addr1.address, 100);
    });
  });
});
