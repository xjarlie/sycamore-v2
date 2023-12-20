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
    

    const signKeypair = nacl.crypto_sign_keypair();
    console.log('SIGN KEYPAIR', nacl.to_hex(signKeypair.signPk), nacl.to_hex(signKeypair.signSk));
}

//genKeys();


async function decrypt() {
    const nacl = await nacl_factory.instantiate(()=>0);

    try {
        const pk = nacl.from_hex('2981f739e053a295d8adde574ecb669775c6a557704137961760aec5b73f407a');
        const sk = nacl.from_hex('c484066fa34d380d2a6ce8b960323dd89afe8cf929dd7aa8370dd432596ee3b5');

        const packetStr = '99709571e87ab2a0c840b9a628037151631b6923f24372a34409accdb34f17129733aa80d38f8b039e793b9dc73c56b2858b0c745cf6d082a44dcaab69f887eb8259562303cef25abdf665a0aaf4baf2';
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