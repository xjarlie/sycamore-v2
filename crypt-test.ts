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
//main();


async function genKeys() {
    const nacl = await nacl_factory.instantiate(()=>0);
    const sk = nacl.random_bytes(32);
    const keypair = nacl.crypto_box_keypair_from_raw_sk(sk);
    console.log('BOX KEYPAIR', nacl.to_hex(keypair.boxPk), nacl.to_hex(keypair.boxSk));
    

    //const signKeypair = nacl.crypto_sign_keypair();
    //console.log('SIGN KEYPAIR', nacl.to_hex(signKeypair.signPk), nacl.to_hex(signKeypair.signSk));
}

//genKeys();


async function decrypt() {
    const nacl = await nacl_factory.instantiate(()=>0);

    try {
        const pk = nacl.from_hex('390034542201ad77e3c20f7360d484e55bae068edc9e579dcb19cc535ed0361c');
        const sk = nacl.from_hex('86d0cefa0a7164aad4573420ae82d86f1be5cec1ed1c233c4d1d4a531ee1ef7e');

        const packetStr = '7d3d019aec15ad7d95b5f23c38ca283cde8a48bda2488baacfe213b3c97fbe0e1f688633137b3dac4b165052b98e0a525403c4ab6366728e71b631a2cf878d338030da998aac6500a76263a3cfb8ba6c';
        const packet = nacl.from_hex(packetStr);
        const decr = nacl.crypto_box_seal_open(packet, pk, sk);
        console.log(decr);
        const decrStr = nacl.to_hex(decr);
        console.log(decrStr);
    } catch (e) {
        console.log(e);
    }

    

}
decrypt();