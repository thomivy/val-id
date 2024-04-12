# Validator Identity Scraper
This is a Node.js script that retrieves validator identities from different Polkadot-based networks and exports the data to CSV files. It also logs any errors encountered during the scraping process to separate error log files.

## Features
- Retrieves validator identities from Polkadot and Tangle Mainnet networks
- Exports the validator identities to indendent and dated CSV files
- Handles timeouts gracefully

## Prerequisites
Before running the script, ensure that you have the following:

- Node.js (version 12 or above)
- npm (Node Package Manager)

## Installation
- Clone the repository or download the script files.
- Open a terminal and navigate to the project directory.

- Install the required dependencies by running the following command:

`npm install`

## Configuration
The script uses predefined WebSocket endpoint URLs for the Polkadot and Tangle Mainnet networks. If you want to use different endpoints, modify the following constants in the script:

```
const POLKADOT_WS_URL = "wss://rpc.polkadot.io";
const TANGLE_MAINNET_WS_URL = "wss://rpc1.tangle.tools";
const TANGLE_TESTNET_WS_URL = "wss://testnet-rpc1.tangle.tools";
```

Replace the URLs with the desired WebSocket endpoints.

### Usage
To run the script, execute the following command in the terminal:
`node validator-identities.js`
The script will start scraping the validator identities from the configured networks. It will display progress and error messages in the console.

Once the scraping process is complete, the script will generate the following files:

- ValidatorIdentities_Polkadot_<currentDate>.csv: CSV file containing the validator identities for the Polkadot network.
- ValidatorIdentities_Tangle_Mainnet_<currentDate>.csv: CSV file containing the validator identities for the Tangle Mainnet network.

The <currentDate> placeholder in the file names will be replaced with the current date in the format YYYY-MM-DD.


Dependencies
The script relies on the following dependencies:

- @polkadot/api: A library for interacting with Polkadot-based networks.
- fs: A built-in Node.js module for file system operations.

These dependencies are automatically installed when running the npm install command.
