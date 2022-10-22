// Import Solana web3 functinalities
const {
	Connection,
	PublicKey,
	clusterApiUrl,
	Keypair,
	LAMPORTS_PER_SOL,
	Transaction,
	SystemProgram,
	sendAndConfirmRawTransaction,
	sendAndConfirmTransaction,
} = require("@solana/web3.js");

const transferSol = async () => {
	const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

	const from = new Keypair();

	// Other things to try:
	// 1) Form array from userSecretKey
	// const from = Keypair.fromSecretKey(Uint8Array.from(userSecretKey));
	// 2) Make a new Keypair (starts with 0 SOL)
	// const from = Keypair.generate();

	// Generate another Keypair (account we'll be sending to)
	const to = Keypair.generate();

	// Aidrop 2 SOL to Sender wallet
	console.log("Airdopping some SOL to Sender wallet!");
	const fromAirDropSignature = await connection.requestAirdrop(
		new PublicKey(from.publicKey),
		2 * LAMPORTS_PER_SOL
	);

	// Latest blockhash (unique identifer of the block) of the cluster
	let latestBlockHash = await connection.getLatestBlockhash();

	// Confirm transaction using the last valid block height (refers to its time)
	// to check for transaction expiration
	await connection.confirmTransaction({
		blockhash: latestBlockHash.blockhash,
		lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
		signature: fromAirDropSignature,
	});

	console.log("Airdrop completed for the Sender account");

	const curFromBalance = await connection.getBalance(
		new PublicKey(from.publicKey)
	);
	const curToBalance = await connection.getBalance(new PublicKey(to.publicKey));
	console.log(
		`From wallet balance is: ${parseInt(curFromBalance) / LAMPORTS_PER_SOL} SOL`
	);
	console.log(
		`To wallet balance is: ${parseInt(curToBalance) / LAMPORTS_PER_SOL} SOL`
	);
	console.log(
		"We are sending the half of your SOL to",
		to.publicKey.toString()
	);

	// Send money from "from" wallet and into "to" wallet
	var transaction = new Transaction().add(
		SystemProgram.transfer({
			fromPubkey: from.publicKey,
			toPubkey: to.publicKey,
			lamports: curFromBalance / 2,
		})
	);

	// Sign transaction
	var signature = await sendAndConfirmTransaction(connection, transaction, [
		from,
	]);
	console.log("Signature is ", signature);
	const newFromBalance = await connection.getBalance(
		new PublicKey(from.publicKey)
	);
	const newToBalance = await connection.getBalance(new PublicKey(to.publicKey));
	console.log(
		`After sending, From wallet balance is: ${
			parseInt(newFromBalance) / LAMPORTS_PER_SOL
		} SOL`
	);
	console.log(
		`After sending, To wallet balance is: ${
			parseInt(newToBalance) / LAMPORTS_PER_SOL
		} SOL`
	);
};

transferSol();
