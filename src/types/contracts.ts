import { Contract, ethers } from 'ethers';

export interface Land {
  id: string;
  location: string;
  ownerName: string;
  area: ethers.BigNumber;
  price: ethers.BigNumber;
  isForSale: boolean;
  currentOwner: string;
}

export interface LandRegistry extends Contract {
  landCount(): Promise<ethers.BigNumber>;
  lands(id: number): Promise<Land>;
  registerLand(
    location: string,
    ownerName: string,
    area: ethers.BigNumberish,
    price: ethers.BigNumberish,
    options?: { gasLimit?: ethers.BigNumberish }
  ): Promise<ethers.ContractTransaction>;
  transferOwnership(
    landId: number,
    newOwner: string,
    newOwnerName: string,
    options?: { gasLimit?: ethers.BigNumberish }
  ): Promise<ethers.ContractTransaction>;
  toggleForSale(
    landId: number,
    price: ethers.BigNumberish,
    options?: { gasLimit?: ethers.BigNumberish }
  ): Promise<ethers.ContractTransaction>;
  buyLand(
    landId: number,
    buyer: string,
    options?: { value?: ethers.BigNumberish; gasLimit?: ethers.BigNumberish }
  ): Promise<ethers.ContractTransaction>;
  
  // Events
  on(event: 'LandRegistered', listener: (
    landId: ethers.BigNumber,
    location: string,
    ownerName: string,
    area: ethers.BigNumber,
    price: ethers.BigNumber
  ) => void): this;
  
  on(event: 'OwnershipTransferred', listener: (
    landId: ethers.BigNumber,
    previousOwner: string,
    newOwner: string,
    newOwnerName: string
  ) => void): this;
  
  on(event: 'LandForSale', listener: (
    landId: ethers.BigNumber,
    price: ethers.BigNumber
  ) => void): this;
  
  on(event: 'LandSold', listener: (
    landId: ethers.BigNumber,
    seller: string,
    buyer: string,
    price: ethers.BigNumber
  ) => void): this;
}
