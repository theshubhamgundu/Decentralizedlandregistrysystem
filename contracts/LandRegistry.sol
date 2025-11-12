// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";

contract LandRegistry is Ownable {
    struct Land {
        string location;
        string ownerName;
        uint256 area;
        uint256 price;
        bool isForSale;
        address currentOwner;
    }

    mapping(uint256 => Land) public lands;
    uint256 public landCount;

    event LandRegistered(uint256 landId, string location, string ownerName, uint256 area);
    event OwnershipTransferred(uint256 landId, address from, address to, string newOwnerName);
    event LandForSale(uint256 landId, uint256 price);
    event LandSold(uint256 landId, address from, address to, uint256 price);

    function registerLand(
        string memory _location,
        string memory _ownerName,
        uint256 _area,
        uint256 _price
    ) public {
        landCount++;
        lands[landCount] = Land({
            location: _location,
            ownerName: _ownerName,
            area: _area,
            price: _price,
            isForSale: false,
            currentOwner: msg.sender
        });
        
        emit LandRegistered(landCount, _location, _ownerName, _area);
    }

    function transferOwnership(
        uint256 _landId,
        address _to,
        string memory _newOwnerName
    ) public {
        require(lands[_landId].currentOwner == msg.sender, "You are not the owner");
        require(_to != address(0), "Invalid address");
        
        lands[_landId].currentOwner = _to;
        lands[_landId].ownerName = _newOwnerName;
        lands[_landId].isForSale = false;
        
        emit OwnershipTransferred(_landId, msg.sender, _to, _newOwnerName);
    }

    function toggleForSale(uint256 _landId, uint256 _price) public {
        require(lands[_landId].currentOwner == msg.sender, "You are not the owner");
        bool wasForSale = lands[_landId].isForSale;
        lands[_landId].isForSale = !wasForSale;
        lands[_landId].price = _price;
        
        if (lands[_landId].isForSale) {
            emit LandForSale(_landId, _price);
        }
    }

    function buyLand(uint256 _landId, string memory _newOwnerName) public payable {
        Land storage land = lands[_landId];
        require(land.isForSale, "Land is not for sale");
        require(msg.value >= land.price, "Insufficient payment");
        require(land.currentOwner != msg.sender, "You already own this land");
        
        // Transfer the payment to the current owner
        (bool sent, ) = payable(land.currentOwner).call{value: msg.value}("");
        require(sent, "Failed to send payment");
        
        // Transfer ownership
        address previousOwner = land.currentOwner;
        land.currentOwner = msg.sender;
        land.ownerName = _newOwnerName;
        land.isForSale = false;
        
        emit LandSold(_landId, previousOwner, msg.sender, msg.value);
        emit OwnershipTransferred(_landId, previousOwner, msg.sender, _newOwnerName);
    }

    function getLandDetails(uint256 _landId) public view returns (
        string memory,
        string memory,
        uint256,
        uint256,
        bool,
        address
    ) {
        Land memory land = lands[_landId];
        return (
            land.location,
            land.ownerName,
            land.area,
            land.price,
            land.isForSale,
            land.currentOwner
        );
    }

    function getLandsByOwner(address _owner) public view returns (uint256[] memory) {
        uint256[] memory result = new uint256[](landCount);
        uint256 counter = 0;
        
        for (uint256 i = 1; i <= landCount; i++) {
            if (lands[i].currentOwner == _owner) {
                result[counter] = i;
                counter++;
            }
        }
        
        // Resize the array to remove unused elements
        uint256[] memory trimmedResult = new uint256[](counter);
        for (uint256 i = 0; i < counter; i++) {
            trimmedResult[i] = result[i];
        }
        
        return trimmedResult;
    }
}
