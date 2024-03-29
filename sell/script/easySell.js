const opensea = require("opensea-js");
const OpenSeaPort = opensea.OpenSeaPort;
const Network = opensea.Network;
const MnemonicWalletSubprovider =
  require("@0x/subproviders").MnemonicWalletSubprovider;
const RPCSubprovider = require("web3-provider-engine/subproviders/rpc");
const Web3ProviderEngine = require("web3-provider-engine");

require("dotenv").config();

const MNEMONIC = process.env.MNEMONIC;
const NODE_API_KEY = process.env.INFURA_KEY || process.env.ALCHEMY_KEY;
// const isInfura = !!process.env.INFURA_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const OWNER_ADDRESS = process.env.OWNER_ADDRESS;
const NETWORK = process.env.NETWORK;

if (!MNEMONIC || !NODE_API_KEY || !NETWORK || !OWNER_ADDRESS) {
  console.error(
    "Please set a mnemonic, Alchemy/Infura key, owner, network, API key, nft contract, and factory contract address."
  );
}

if (!CONTRACT_ADDRESS) {
  console.error("Please specify a factory contract address.");
}

const BASE_DERIVATION_PATH = `44'/60'/0'/0`;

const mnemonicWalletSubprovider = new MnemonicWalletSubprovider({
  mnemonic: MNEMONIC,
  baseDerivationPath: BASE_DERIVATION_PATH,
});

const infuraRpcSubprovider = new RPCSubprovider({
  rpcUrl: "https://" + NETWORK + ".infura.io/v3/" + NODE_API_KEY,
});

const providerEngine = new Web3ProviderEngine();
providerEngine.addProvider(mnemonicWalletSubprovider);
providerEngine.addProvider(infuraRpcSubprovider);
providerEngine.start();

const seaport = new OpenSeaPort(
  providerEngine,
  {
    networkName: Network.Rinkeby,
  },
  (arg) => console.log(arg)
);

async function sell() {
  // Example: many fixed price auctions for a factory option.
  console.log("Creating fixed price auctions...");

  const expirationTime = Math.round(Date.now() / 1000 + 60 * 60 * 24);
  const startAmount = 1;
  const endAmount = 1;

  const sellOrder = await seaport.createSellOrder({
    network: NETWORK,
    tokenAddress: CONTRACT_ADDRESS,
    tokenId: 6,
    tokenType: "ERC721",
    userAddress: OWNER_ADDRESS,
    startAmount: 1,
    endAmount: 1,
    expirationTime: startAmount > endAmount && expirationTime, // Only set if you startAmount > endAmount
  });

  console.log(`create Sell order Success ${sellOrder}`);
}

sell();
