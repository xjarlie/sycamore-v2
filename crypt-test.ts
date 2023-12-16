import nacl_factory from "js-nacl";

async function main() {
    const nacl = await nacl_factory.instantiate(()=>0);

    const aliceKeypair = nacl.crypto_box_keypair();
    const bobKeypair = nacl.crypto_box_keypair();

    const message = "Hello, world!";
    console.log("Message: " + message);

    const nonce = nacl.crypto_box_random_nonce();
    const ts = nacl.encode_utf8(Date.now().toString());

    const packet = nacl.crypto_box(nacl.encode_utf8(message), ts, bobKeypair.boxPk, aliceKeypair.boxSk);

    console.log("Encrypted: " + packet);

    const decrypted = nacl.crypto_box_open(packet, ts, aliceKeypair.boxPk, bobKeypair.boxSk);

    console.log("Decrypt: " + nacl.decode_utf8(decrypted));
}

main();