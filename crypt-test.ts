import nacl_factory from "js-nacl";

async function main() {
    const nacl = await nacl_factory.instantiate(()=>0);

    const aliceKeypair = nacl.crypto_box_keypair();
    const bobKeypair = nacl.crypto_box_keypair();

    const message = "Hello, world! w";
    // console.log("Message: " + message);
    const utf8Message = nacl.encode_utf8(message);

    //const onetime = nacl.crypto_box_random_nonce();
    // const ts = nacl.encode_utf8(Date.now().toString());

    // const packet = nacl.crypto_box(utf8Message, onetime, bobKeypair.boxPk, aliceKeypair.boxSk);
    // const strPacket = nacl.to_hex(packet);

    // console.log("Encrypted: " + strPacket);

    // const decrypted = nacl.crypto_box_open(packet, onetime, aliceKeypair.boxPk, bobKeypair.boxSk);

    // console.log("Decrypt: " + nacl.decode_utf8(decrypted));

    try {
        const ephKeypair = nacl.crypto_box_keypair();
        const onetime = nacl.encode_utf8('aaaaaaaaaaaaaaaaaaaaaaaa');

        const packet = nacl.crypto_box(utf8Message, onetime, bobKeypair.boxPk, ephKeypair.boxSk);

        const decrypted = nacl.crypto_box_open(packet, onetime, ephKeypair.boxPk, bobKeypair.boxSk);
        console.log('Decrypt: ', nacl.decode_utf8(decrypted));
    } catch (e) {
        console.log(e);
    }

    


}
main();


async function genKeys() {
    const nacl = await nacl_factory.instantiate(()=>0);
    const sk = nacl.random_bytes(32);
    const keypair = nacl.crypto_box_keypair_from_raw_sk(sk);
    console.log('BOX KEYPAIR', nacl.to_hex(keypair.boxPk), nacl.to_hex(keypair.boxSk));
    

    const signKeypair = nacl.crypto_sign_keypair();
    console.log('SIGN KEYPAIR', nacl.to_hex(signKeypair.signPk), nacl.to_hex(signKeypair.signSk));
}

//genKeys();