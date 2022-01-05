# Polymarket CLOB Client

Typescript client for the Polymarket CLOB

### Usage

```ts
const host = "http://localhost:8080";
const signer = new ethers.Wallet(`${process.env.PK}`);
const creds: ApiKeyCreds = {
    key: `${process.env.CLOB_API_KEY}`,
    secret: `${process.env.CLOB_SECRET}`,
    passphrase: `${process.env.CLOB_PASS_PHRASE}`,
}

// Initialize the clob client
// Note that the signer must be approved on the LimitOrderProtocol and OrderExecutor contracts
const clobClient = new ClobClient(host, signer, creds);

// Create a limit buy order for 100 YES for 0.50c
const order = await clobClient.createLimitOrder({
    asset: { 
        address: "0xadbeD21409324e0fcB80AE8b5e662B0C857D85ed",
        condition: "YES",
    },
    price: 0.5,
    side: Side.Buy,
    size: 100,
});

// Send it to the server
const resp = await clobClient.postOrder(order);

// Init a market sell of 100 YES tokens
const marketSell = await clobClient.createMarketOrder({
    asset: { 
        address: "0xadbeD21409324e0fcB80AE8b5e662B0C857D85ed",
        condition: "YES",
    },
    side: Side.Sell,
    size: 100,
});

await clobClient.postOrder(marketSell);
```

See [examples](examples/) for more information