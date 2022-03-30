const opensea = require("opensea-js");
const OpenSeaPort = opensea.OpenSeaPort;
const Network = opensea.Network;
const MnemonicWalletSubprovider =
  require("@0x/subproviders").MnemonicWalletSubprovider;
const RPCSubprovider = require("web3-provider-engine/subproviders/rpc");
const Web3ProviderEngine = require("web3-provider-engine");

require("dotenv").config();

const MNEMONIC = process.env.MNEMONIC;
const NFT_CONTRACT_ADDRESS = process.env.NFT_CONTRACT_ADDRESS;
const OWNER_ADDRESS = process.env.OWNER_ADDRESS;
API_KEY = "";

const infuraRpcSubprovider = new RPCSubprovider({
  rpcUrl: "https://rinkeby.infura.io/v3/397f64f599374e6d896109afa781e6bf",
});

const BASE_DERIVATION_PATH = `44'/60'/0'/0`;

const mnemonicWalletSubprovider = new MnemonicWalletSubprovider({
  mnemonic: MNEMONIC,
  baseDerivationPath: BASE_DERIVATION_PATH,
  chainId: 4,
});

const providerEngine = new Web3ProviderEngine();
providerEngine.addProvider(mnemonicWalletSubprovider);
providerEngine.addProvider(infuraRpcSubprovider);
providerEngine.start();

const seaport = new OpenSeaPort(
  providerEngine,
  {
    networkName: Network.Rinkeby,
    apiKey: API_KEY,
  },
  (arg) => console.log(arg)
);

async function main() {
  try {
    console.log("Auctioning an item for a fixed price...");
    const fixedPriceSellOrder = await seaport.createSellOrder({
      asset: {
        tokenId: "3",
        tokenAddress: NFT_CONTRACT_ADDRESS,
      },
      startAmount: 0.05,
      expirationTime: 0,
      accountAddress: 0x909a1228ec026e3100fc700921dca1c67ea93d63,
    });
    console.log("fixedPriceSellOrder");
  } catch (error) {
    console.log("You get Error Oh No :(");
    console.log(error.message);
  }
}

main();
