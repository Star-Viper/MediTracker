require("@nomicfoundation/hardhat-toolbox");

require("dotenv").config();
/** @type import('hardhat/config').HardhatUserConfig */

const PRIVATE_KEY = process.env.PRIVATE_KEY;
module.exports = {
  solidity: "0.8.17",
  networks: {
    localhost: {
      url: "HTTP://127.0.0.1:7545", 
      accounts: [PRIVATE_KEY],
    },
  },
};