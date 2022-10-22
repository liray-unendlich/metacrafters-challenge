// Import Solana web3 functinalities
const {
	Connection,
	PublicKey,
	clusterApiUrl,
	LAMPORTS_PER_SOL,
} = require("@solana/web3.js");

var pubKey = process.argv.slice(2)[0];
console.log("Public Key of the entered keypair", pubKey);

// Get the wallet balance from a given public key
const getWalletBalance = async (pubKey) => {
	try {
		// Connect to the Devnet
		const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
		console.log(connection);
		// get its balance
		const walletBalance = await connection.getBalance(new PublicKey(pubKey));
		console.log(
			`Wallet balance: ${parseInt(walletBalance) / LAMPORTS_PER_SOL} SOL`
		);
	} catch (err) {
		console.log(err);
	}
};

const airDropSol = async (pubKey) => {
	try {
		// Connect to the Devnet and make a wallet from privateKey
		const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

		// Request airdrop of 2 SOL to the wallet
		console.log("Airdropping some SOL to", pubKey);
		const fromAirDropSignature = await connection.requestAirdrop(
			new PublicKey(pubKey),
			2 * LAMPORTS_PER_SOL
		);
		await connection.confirmTransaction(fromAirDropSignature);
	} catch (err) {
		console.log(err);
	}
};

// Show the wallet balance before and after airdropping SOL
const mainFunction = async (pubKey) => {
	await getWalletBalance(pubKey);
	await airDropSol(pubKey);
	await getWalletBalance(pubKey);
};

mainFunction(pubKey);
