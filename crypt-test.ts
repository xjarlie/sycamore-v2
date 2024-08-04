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
        const pk = nacl.from_hex('e16c56306953681080aa35bd0ff39c7111b055af9d3cefefa9e83d830334d413');
        const sk = nacl.from_hex('2a3f42efa44e42ee394aae93030839a5cc53f2f3656316a18e47836c30dcd53e');

        const packetStr = 'b734a96ca1db3685c2d2e8fdaa268593c87562f51c5c5c49f1d743d80e405344d3f23bc4c43a81189d048cc89f20d05a086c07c9b641a1aab6128a00d63313da61d8bd32a25955a5e5a8243659d101ec';
        const packet = nacl.from_hex(packetStr);
        const decr = nacl.crypto_box_seal_open(packet, pk, sk);
        console.log(decr);
        const decrStr = nacl.to_hex(decr);
        console.log(decrStr);
    } catch (e) {
        console.log(e);
    }

    

}
//decrypt();

async function secretKey() {
    const nacl = await nacl_factory.instantiate(()=>0);

    try {

        const password = 'HELLO world';

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const hashedPwd = nacl.crypto_hash_string(password);

        console.log(nacl.to_hex(hashedPwd));

        const sk = nacl.from_hex('2a3f42efa44e42ee394aae93030839a5cc53f2f3656316a18e47836c30dcd53e');

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore

        const cipherSk = nacl.crypto_stream_xor(sk, nacl.crypto_stream_random_nonce(), hashedPwd);

        console.log(cipherSk);

    } catch (e) {
        console.log(e);
    }
}

secretKey();