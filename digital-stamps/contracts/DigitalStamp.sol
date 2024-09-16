// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract DigitalStamp is ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    struct Stamp {
        string name;
        uint256 yearOfIssue;
        string country;
        uint8 rarityScore;
        uint8 historicalSignificance;
        string imageURI;
    }

    mapping(uint256 => Stamp) public stamps;

    event StampMinted(uint256 indexed tokenId, address indexed to, string name);
    event StampDetailsUpdated(uint256 indexed tokenId, string name, uint256 yearOfIssue, string country, uint8 rarityScore, uint8 historicalSignificance, string imageURI);

    constructor() ERC721("DigitalStamp", "DSTMP") {}

    function mint(
        address to,
        string memory name,
        uint256 yearOfIssue,
        string memory country,
        uint8 rarityScore,
        uint8 historicalSignificance,
        string memory imageURI
    ) external onlyOwner {
        require(rarityScore <= 10, "Rarity score must be between 0 and 10");
        require(historicalSignificance <= 10, "Historical significance must be between 0 and 10");

        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        _safeMint(to, newTokenId);

        stamps[newTokenId] = Stamp(name, yearOfIssue, country, rarityScore, historicalSignificance, imageURI);

        emit StampMinted(newTokenId, to, name);
    }

    function getStamp(uint256 tokenId) external view returns (Stamp memory) {
        require(_exists(tokenId), "Stamp does not exist");
        return stamps[tokenId];
    }

    function updateStampDetails(
        uint256 tokenId,
        string memory name,
        uint256 yearOfIssue,
        string memory country,
        uint8 rarityScore,
        uint8 historicalSignificance,
        string memory imageURI
    ) external onlyOwner {
        require(_exists(tokenId), "Stamp does not exist");
        require(rarityScore <= 10, "Rarity score must be between 0 and 10");
        require(historicalSignificance <= 10, "Historical significance must be between 0 and 10");

        Stamp storage stamp = stamps[tokenId];
        stamp.name = name;
        stamp.yearOfIssue = yearOfIssue;
        stamp.country = country;
        stamp.rarityScore = rarityScore;
        stamp.historicalSignificance = historicalSignificance;
        stamp.imageURI = imageURI;

        emit StampDetailsUpdated(tokenId, name, yearOfIssue, country, rarityScore, historicalSignificance, imageURI);
    }

    function tokensOfOwner(address owner) external view returns (uint256[] memory) {
        uint256 tokenCount = balanceOf(owner);
        uint256[] memory tokenIds = new uint256[](tokenCount);
        for (uint256 i = 0; i < tokenCount; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(owner, i);
        }
        return tokenIds;
    }
}