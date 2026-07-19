require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20", // (Keep whatever version is already here)
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545"
    }
  }
};