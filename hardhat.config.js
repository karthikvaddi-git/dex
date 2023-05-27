// require("@nomicfoundation/hardhat-toolbox");

// /** @type import('hardhat/config').HardhatUserConfig */
// module.exports = {
//   solidity: {
//     compilers:[
//       {
//         version: "0.7.6",
//         settings: {
//           evmVersion: "istanbul",
//           optimizer: {
//             enabled: true,
//             runs: 1000,
//           },
//         },
//       },
//     ],
//   },
//   networks: {
//     hardhat: {
//       forking: {
//         url: "https://eth-mainnet.g.alchemy.com/v2/KNwhHlTDLdxzv-oLZbHE2jTVpqLsFGNQ",
//       },
//     },
//   }
// };


require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: {
    version: "0.7.6",
    settings: {
      optimizer: {
        enabled: true,
        runs: 5000,
        details: { yul: false },
      },
    },
  },
  networks: {
    hardhat: {
      forking: {
        url: "https://eth-mainnet.g.alchemy.com/v2/KNwhHlTDLdxzv-oLZbHE2jTVpqLsFGNQ",
        accounts: [`0x${"de9be858da4a475276426320d5e9262ecfc3ba460bfac56360bfa6c4c28b4ee0"}`],
      },
    },
  },
};