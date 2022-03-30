const opensea = require("opensea-js");
const { WyvernSchemaName } = require("opensea-js/lib/types");
const OpenSeaPort = opensea.OpenSeaPort;
const Network = opensea.Network;
const MnemonicWalletSubprovider =
  require("@0x/subproviders").MnemonicWalletSubprovider;
const RPCSubprovider = require("web3-provider-engine/subproviders/rpc");
const Web3ProviderEngine = require("web3-provider-engine");

require("dotenv").config();

const MNEMONIC = process.env.MNEMONIC;
const NODE_API_KEY = process.env.INFURA_KEY || process.env.ALCHEMY_KEY;
const isInfura = !!process.env.INFURA_KEY;
const FACTORY_CONTRACT_ADDRESS = process.env.FACTORY_CONTRACT_ADDRESS;
const NFT_CONTRACT_ADDRESS = process.env.NFT_CONTRACT_ADDRESS;
const OWNER_ADDRESS = process.env.OWNER_ADDRESS;
const NETWORK = process.env.NETWORK;
const API_KEY = process.env.API_KEY || ""; // API key is optional but useful if you're doing a high volume of requests.

const FIXED_PRICE_OPTION_ID = "3";
const FIXED_PRICE = 0.05;
const NUM_FIXED_PRICE_AUCTIONS = 10;

if (!MNEMONIC || !NODE_API_KEY || !NETWORK || !OWNER_ADDRESS) {
  console.error(
    "Please set a mnemonic, Alchemy/Infura key, owner, network, API key, nft contract, and factory contract address."
  );
}

if (!FACTORY_CONTRACT_ADDRESS && !NFT_CONTRACT_ADDRESS) {
  console.error("Please either set a factory or NFT contract address.");
}

const BASE_DERIVATION_PATH = `44'/60'/0'/0`;

const mnemonicWalletSubprovider = new MnemonicWalletSubprovider({
  mnemonic: MNEMONIC,
  baseDerivationPath: BASE_DERIVATION_PATH,
});
const network =
  NETWORK === "mainnet" || NETWORK === "live" ? "mainnet" : "rinkeby";

// https://mainnet.infura.io/v3/db9c55d5ca3249a3be6f063ec26d53db
// https://rinkeby.infura.io/v3/db9c55d5ca3249a3be6f063ec26d53db
const infuraRpcSubprovider = new RPCSubprovider({
  rpcUrl: isInfura
    ? "https://" + network + ".infura.io/v3/" + NODE_API_KEY
    : "https://eth-" + network + ".alchemyapi.io/v2/" + NODE_API_KEY,
});

const providerEngine = new Web3ProviderEngine();
providerEngine.addProvider(mnemonicWalletSubprovider);
providerEngine.addProvider(infuraRpcSubprovider);
providerEngine.start();

const seaport = new OpenSeaPort(
  providerEngine,
  {
    networkName:
      NETWORK === "mainnet" || NETWORK === "live"
        ? Network.Main
        : Network.Rinkeby,
    apiKey: API_KEY,
  },
  (arg) => console.log(arg)
);

async function main() {
  try {
    // Example: many fixed price auctions for a factory option.
    console.log("Creating fixed price auctions...");
    const fixedPriceSellOrder = await seaport.createSellOrder({
      asset: {
        tokenId: FIXED_PRICE_OPTION_ID,
        tokenAddress: FACTORY_CONTRACT_ADDRESS,
      },
      startAmount: FIXED_PRICE,
      accountAddress: OWNER_ADDRESS,
    });
    console.log(
      `Successfully made ${fixedPriceSellOrder.length} fixed-price sell orders! ${fixedPriceSellOrder[0].asset.openseaLink}\n`
    );
  } catch (error) {
    console.log("Error :(");
    console.log(error);
  }
}

main();
