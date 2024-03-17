const hre = require("hardhat");

async function main() {
  const Upload = await hre.ethers.deployContract("Fake");

  await Upload.waitForDeployment();

  console.log("Library deployed to:", Upload.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

//    function isFake(uint256 prd_id_or_zero, string memory qrCode_or_empty)
//     external
//     view
//     returns (bool)
// {
//     if (prd_id_or_zero != 0) {
//         return products[prd_id_or_zero].prd_id != prd_id_or_zero;
//     } else if (bytes(qrCode_or_empty).length > 0) {
//         for (uint256 i = 1; i <= length; i++) {
//             if (keccak256(abi.encodePacked(products[i].qrCode)) == keccak256(abi.encodePacked(qrCode_or_empty))) {
//                 return true;
//             }
//         }
//         return false; 
//     } else {
//         return true;
//     }
// }
