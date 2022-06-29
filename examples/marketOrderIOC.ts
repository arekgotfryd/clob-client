import { ethers } from "ethers";
import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";
import { ApiKeyCreds, ClobClient, Side } from "../src";

dotenvConfig({ path: resolve(__dirname, "../.env") });

async function main() {
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    const pk = new ethers.Wallet(`${process.env.PK}`);
    const wallet = pk.connect(provider);
    console.log(`Address: ${await wallet.getAddress()}`);

    const host = process.env.CLOB_API_URL || "http://localhost:8080";
    const creds: ApiKeyCreds = {
        key: `${process.env.CLOB_API_KEY}`,
        secret: `${process.env.CLOB_SECRET}`,
        passphrase: `${process.env.CLOB_PASS_PHRASE}`,
    };
    const clobClient = new ClobClient(host, wallet, creds);

    const NO_TOKEN = "1343197538147866997676250008839231694243646439454152539053893078719042421992"

    await clobClient.postOrder(await clobClient.createLimitOrder({
        tokenID: NO_TOKEN,
        price: 0.4,
        side: Side.BUY,
        size: 200,
    }));
    await clobClient.postOrder(await clobClient.createLimitOrder({
        tokenID: NO_TOKEN,
        price: 0.45,
        side: Side.BUY,
        size: 250,
    }));

    // Create a IOC market sell that will match
    const ioc_order = await clobClient.createMarketOrder({
        tokenID: NO_TOKEN,
        side: Side.SELL,
        size: 500,
        worstPrice: 0.45,
        timeInForce: "IOC"
    });
    console.log(`IOC market order: `);
    console.log(ioc_order);

    console.log(await clobClient.postOrder(ioc_order));
}

main();