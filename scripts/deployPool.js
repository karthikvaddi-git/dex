// Token addresses

shoaibAddress= '0x43cA9bAe8dF108684E5EAaA720C25e1b32B0A075';
rayyanAddrss= '0x9D3DA37d36BB0B825CD319ed129c2872b893f538';
popUpAddress= '0x59C4e2c6a6dC27c259D6d067a039c831e1ff4947';
// Uniswap contract address



wethAddress= '0x9d136eEa063eDE5418A6BC7bEafF009bBb6CFa70';
factoryAddress= '0x687bB6c57915aa2529EfC7D2a26668855e022fAE';
swapRouterAddress= '0x49149a233de6E4cD6835971506F47EE5862289c1';      
nftDescriptorAddress= '0xAe2563b4315469bF6bdD41A6ea26157dE57Ed94e';   
positionDescriptorAddress= '0x30426D33a78afdb8788597D5BFaBdADc3Be95698';
positionManagerAddress= '0x85495222Fd7069B987Ca38C2142732EbBFb7175D';


const artifacts = {
    UniswapV3Factory: require("@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json"),
    NonfungiblePositionManager: require("@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json"),
};

const { waffle } = require("hardhat");
const { Contract, BigNumber } = require("ethers");
const bn = require("bignumber.js");
const Web3Modal = require("web3modal");
bn.config({ EXPONENTIAL_AT: 999999, DECIMAL_PLACES: 40 });

const MAINNET_URL ="https://eth-mainnet.g.alchemy.com/v2/KNwhHlTDLdxzv-oLZbHE2jTVpqLsFGNQ";

const provider = new ethers.providers.JsonRpcProvider(MAINNET_URL);

// const provider = waffle.provider;

function encodePriceSqrt(reserve1, reserve0) {
    return BigNumber.from(
      new bn(reserve1.toString())
        .div(reserve0.toString())
        .sqrt()
        .multipliedBy(new bn(2).pow(96))
        .integerValue(3)
        .toString()
    );
}

const nonfungiblePositionManager = new Contract(
    positionManagerAddress,
    artifacts.NonfungiblePositionManager.abi,
    provider
);

const factory = new Contract(
    factoryAddress,
    artifacts.UniswapV3Factory.abi,
    provider
);

async function deployPool(token0, token1, fee, price) {
    const [owner] = await ethers.getSigners();
    await nonfungiblePositionManager
        .connect(owner)
        .createAndInitializePoolIfNecessary(token0, token1, fee, price, {
            gasLimit: 5000000,
        });
    const poolAddress = await factory.connect(owner).getPool(token0, token1, fee);
    return poolAddress;
}
  
async function main() {
    const shoRay = await deployPool(
      shoaibAddress,
      rayyanAddrss,
      500,
      encodePriceSqrt(1, 1)
    );
  
    console.log("SHO_RAY=", `'${shoRay}'`);
}

/*
  npx hardhat run --network localhost scripts/deployPool.js
*/

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});
