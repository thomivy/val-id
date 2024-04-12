const { ApiPromise, WsProvider } = require("@polkadot/api");
const fs = require("fs");

// Define the WebSocket endpoint URLs for different networks
const POLKADOT_WS_URL = "wss://rpc.polkadot.io";
const TANGLE_MAINNET_WS_URL = "wss://rpc1.tangle.tools";
const TANGLE_TESTNET_WS_URL = "wss://testnet-rpc1.tangle.tools";

async function main() {
  // Process Polkadot network
  await processNetwork(POLKADOT_WS_URL, "Polkadot");

  // Process Tangle Mainnet
  await processNetwork(TANGLE_MAINNET_WS_URL, "Tangle_Mainnet");

  // Process Tangle Mainnet
  await processNetwork(TANGLE_TESTNET_WS_URL, "Tangle_Testnet");
}

async function processNetwork(wsUrl, networkName) {
  const provider = new WsProvider(wsUrl);

  try {
    const api = await ApiPromise.create({
      provider,
      timeout: 120000, // Increase the timeout to 120 seconds (2 minutes)
    });

    // Retrieve the full list of validators (active and waiting)
    const validators = await api.query.staking.validators.entries();

    // Get the current date
    const currentDate = new Date().toISOString().split("T")[0];

    // Create a file path for the CSV output
    const csvFilePath = `ValidatorIdentities_${networkName}_${currentDate}.csv`;

    // Create an array to store the CSV rows
    const csvRows = [
      "Network,Authority ID,Account Address,Email,Twitter,Website,Riot",
    ];

    for (const [key, validator] of validators) {
      const authorityId = key.args[0].toString();

      try {
        // Retrieve the stash account address
        const stash = await api.query.staking.bonded(authorityId);
        const accountAddress = stash.toString();

        // Retrieve the identity information
        const identityOption = await api.query.identity.identityOf(authorityId);

        // If the identity is set, get the associated information
        if (identityOption.isSome) {
          const identity = identityOption.unwrap();
          const identityInfo = JSON.parse(
            JSON.stringify(identity, null, 2)
          ).info;

          let email = "";
          let twitter = "";
          let website = "";
          let riot = "";

          // Check if identityInfo exists before accessing its properties
          if (identityInfo) {
            // Parse email address if available
            if (identityInfo.email && identityInfo.email.raw) {
              const emailRaw = identityInfo.email.raw;
              email = Buffer.from(emailRaw.slice(2), "hex").toString("utf8");
            }

            // Parse Twitter account if available
            if (identityInfo.twitter && identityInfo.twitter.raw) {
              const twitterRaw = identityInfo.twitter.raw;
              twitter = Buffer.from(twitterRaw.slice(2), "hex").toString(
                "utf8"
              );
            }

            // Parse website if available
            if (identityInfo.web && identityInfo.web.raw) {
              const webRaw = identityInfo.web.raw;
              website = Buffer.from(webRaw.slice(2), "hex").toString("utf8");
            }

            // Parse Riot handle if available
            if (identityInfo.riot && identityInfo.riot.raw) {
              const riotRaw = identityInfo.riot.raw;
              riot = Buffer.from(riotRaw.slice(2), "hex").toString("utf8");
            }
          }

          // Construct the CSV row and add it to the array
          const csvRow = `${networkName},${authorityId},${accountAddress},${email},${twitter},${website},${riot}`;
          csvRows.push(csvRow);
        }
      } catch (error) {
        console.error(`Error processing validator ${authorityId}:`, error);
      }
    }

    // Write the CSV data to the file
    fs.writeFileSync(csvFilePath, csvRows.join("\n"));

    console.log(`CSV data for ${networkName} written to ${csvFilePath}`);
  } catch (error) {
    console.error(`Error connecting to ${networkName}:`, error);
  } finally {
    await provider.disconnect();
  }
}

main()
  .catch(console.error)
  .finally(() => process.exit());
