// Function to fetch the latest Bitcoin transactions
async function getLatestTransactions(): Promise<string[]> {
  const response = await fetch("https://blockchain.info/latestblock");
  const latestBlock = await response.json();
  const transactions = latestBlock.txIndexes;
  return transactions.map((tx) => `https://blockchain.info/tx/${tx}`);
}

// Function to fetch the latest Bitcoin blocks
async function getLatestBlocks(): Promise<string[]> {
  const response = await fetch("https://blockchain.info/blocks");
  const blocks = await response.json();
  return blocks.map((block) => `https://blockchain.info/block/${block.hash}`);
}

// Function to fetch the current Bitcoin price
async function getBitcoinPrice(): Promise<number> {
  const response = await fetch(
    "https://api.coindesk.com/v1/bpi/currentprice.json"
  );
  const priceData = await response.json();
  return priceData.bpi.USD.rate_float;
}

// Function to fetch the current Bitcoin block height
async function getBlockHeight(): Promise<number> {
  const response = await fetch("https://blockchain.info/q/getblockcount");
  const blockHeight = await response.text();
  return parseInt(blockHeight);
}

// Function to fetch the current Bitcoin block time
async function getBlockTime(): Promise<number> {
  const response = await fetch("https://blockchain.info/q/interval");
  const blockTime = await response.text();
  return parseInt(blockTime);
}

// Function to fetch the next Bitcoin halving time
async function getHalvingTime(): Promise<number> {
  const response = await fetch("https://blockchain.info/q/halving");
  const halvingTime = await response.text();
  return parseInt(halvingTime);
}

// Function to format the time as a string with minutes, seconds, and milliseconds
function formatTime(timeInMilliseconds: number): string {
  const minutes = Math.floor(timeInMilliseconds / 60000);
  const seconds = Math.floor((timeInMilliseconds % 60000) / 1000);
  const milliseconds = timeInMilliseconds % 1000;
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}.${milliseconds.toString().padStart(3, "0")}`;
}
// Function to calculate the next Bitcoin halving time based on the current block height
function calculateHalvingTime(blockHeight: number): Date {
  const blocksUntilHalving = 210000 - (blockHeight % 210000);
  const secondsUntilHalving = blocksUntilHalving * 10 * 60;
  const currentTime = new Date();
  const halvingTime = new Date(currentTime.getTime() + secondsUntilHalving * 1000);
  return halvingTime;
}

// Function to display the Bitcoin halving time
async function displayHalvingTime() {
  const response = await fetch("https://blockchain.info/latestblock");
  const latestBlock = await response.json();
  const blockHeight = latestBlock.height;
  const halvingTime = calculateHalvingTime(blockHeight);
  const halvingTimeElement = document.getElementById("halving-time");
  halvingTimeElement.textContent = halvingTime.toLocaleString();
}

// Function to update the Blockclock display with the latest transactions, latest blocks, and Bitcoin price
function updateClock() {
  const latestTransactionsElement = document.getElementById("latest-transactions");
  const latestBlocksElement = document.getElementById("latest-blocks");
  const bitcoinPriceElement = document.getElementById("bitcoin-price");
  getLatestTransactions().then((transactions) => {
    latestTransactionsElement.textContent = transactions
      .map((tx) => `<li><a href="${tx}" target="_blank">${tx}</a></li>`)
      .join("");
  });
  getLatestBlocks().then((blocks) => {
    latestBlocksElement.textContent = blocks
      .map((block) => `<li><a href="${block}" target="_blank">${block}</a></li>`)
      .join("");
  });
  getBitcoinPrice().then((price) => {
    bitcoinPriceElement.innerText = `$${price.toFixed(2)}`;
  });
  const blockHeightElement = document.getElementById("block-height");
  const blockTimeElement = document.getElementById("block-time");
  getBlockHeight().then((blockHeight) => {
    blockHeightElement.textContent = blockHeight.toLocaleString();
  });
  getBlockTime().then((blockTime) => {
    blockTimeElement.textContent = formatTime(blockTime);
  });
}

updateClock();
displayHalvingTime();
// Update the clock every 10 seconds
setInterval(updateClock,  60 * 1000);
setInterval(displayHalvingTime,  60 * 1000);
