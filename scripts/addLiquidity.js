// Token addresses
//Token addresses

shoaibAddress= '0x43cA9bAe8dF108684E5EAaA720C25e1b32B0A075';
rayyanAddrss= '0x9D3DA37d36BB0B825CD319ed129c2872b893f538';
popUpAddress= '0x59C4e2c6a6dC27c259D6d067a039c831e1ff4947';

SHO_RAY= '0x3342410229fc4591148Ee45c02De97fB02e5E3bd';

// Uniswap contract address

wethAddress= '0x9d136eEa063eDE5418A6BC7bEafF009bBb6CFa70';
factoryAddress= '0x687bB6c57915aa2529EfC7D2a26668855e022fAE';
swapRouterAddress= '0x49149a233de6E4cD6835971506F47EE5862289c1';      
nftDescriptorAddress= '0xAe2563b4315469bF6bdD41A6ea26157dE57Ed94e';   
positionDescriptorAddress= '0x30426D33a78afdb8788597D5BFaBdADc3Be95698';
positionManagerAddress= '0x85495222Fd7069B987Ca38C2142732EbBFb7175D';

const artifacts = {
    NonfungiblePositionManager: require("@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json"),
    Shoaib: require("../artifacts/contracts/Shoaib.sol/Shoaib.json"),
    Rayyan: require("../artifacts/contracts/Rayyan.sol/Rayyan.json"),
    UniswapV3Pool: require("@uniswap/v3-core/artifacts/contracts/UniswapV3Pool.sol/UniswapV3Pool.json"),
};

const { Contract } = require("ethers");
const { Token } = require("@uniswap/sdk-core");
const { Pool, Position, nearestUsableTick } = require("@uniswap/v3-sdk");

async function getPoolData(poolContract) {
    const [tickSpacing, fee, liquidity, slot0] = await Promise.all([
      poolContract.tickSpacing(),
      poolContract.fee(),
      poolContract.liquidity(),
      poolContract.slot0(),
    ]);
  
    // console.log(tickSpacing, fee, liquidity, slot0);
    return {
      tickSpacing: tickSpacing,
      fee: fee,
      liquidity: liquidity,
      sqrtPriceX96: slot0[0],
      tick: slot0[1],
    };
}

async function main(){
    const [owner, signer2] = await ethers.getSigners();
    const provider = waffle.provider;

    const ShoaibContract = new Contract(
        shoaibAddress,
        artifacts.Shoaib.abi,
        provider
    );
    const RayyanContract = new Contract(
        rayyanAddrss,
        artifacts.Rayyan.abi,
        provider
    );

    await ShoaibContract.connect(signer2).approve(
        positionManagerAddress,
        ethers.utils.parseEther("1000")
    );
    await RayyanContract.connect(signer2).approve(
        positionManagerAddress,
        ethers.utils.parseEther("1000")
    );
    
    const poolContract = new Contract(
        SHO_RAY,
        artifacts.UniswapV3Pool.abi,
        provider
    );
    
    const poolData = await getPoolData(poolContract);
    
    const ShoaibToken = new Token(31337, shoaibAddress, 18, "Shoaib", "Tether");
    const RayyanToken = new Token(31337, rayyanAddrss, 18, "Rayyan", "Rayyanoin");

    const pool = new Pool(
        ShoaibToken,
        RayyanToken,
        poolData.fee,
        poolData.sqrtPriceX96.toString(),
        poolData.liquidity.toString(),
        poolData.tick
    );

    const position = new Position({
        pool: pool,
        liquidity: ethers.utils.parseUnits("1"),
        tickLower:
          nearestUsableTick(poolData.tick, poolData.tickSpacing) -
          poolData.tickSpacing * 2,
        tickUpper:
          nearestUsableTick(poolData.tick, poolData.tickSpacing) +
          poolData.tickSpacing * 2,
    });
    
    // console.log(position);
    const { amount0: amount0Desired, amount1: amount1Desired } =
    position.mintAmounts;

    params = {
        token0: shoaibAddress,
        token1: rayyanAddrss,
        fee: poolData.fee,
        tickLower:
          nearestUsableTick(poolData.tick, poolData.tickSpacing) -
          poolData.tickSpacing * 2,
        tickUpper:
          nearestUsableTick(poolData.tick, poolData.tickSpacing) +
          poolData.tickSpacing * 2,
        amount0Desired: amount0Desired.toString(),
        amount1Desired: amount1Desired.toString(),
        amount0Min: 0,
        amount1Min: 0,
        recipient: signer2.address,
        deadline: Math.floor(Date.now() / 1000) + 60 * 10,
    };

    const nonfungiblePositionManager = new Contract(
        positionManagerAddress,
        artifacts.NonfungiblePositionManager.abi,
        provider
    );

    const tx = await nonfungiblePositionManager
        .connect(signer2)
        .mint(params, { gasLimit: "1000000" });
    const receipt = await tx.wait();
    console.log(receipt);
}

/*
  npx hardhat run --network localhost scripts/addLiquidity.js
  */

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});