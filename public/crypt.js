let NACL;
async function main() {
    NACL = await nacl_factory.instantiate(()=>0);
}
main();

// Symmetrically encrypts (with AES-CBC) a string using a CryptoKey and returns the ciphertext as well as the onetime needed for decryption
async function symEncrypt(str, key) {
    const encoded = (new TextEncoder()).encode(str);

    const onetime = window.crypto.getRandomValues(new Uint8Array(16));

    const ciphertext = await window.crypto.subtle.encrypt(
        {
            name: 'AES-CBC'
        },
        key,
        encoded
    );

    return { ciphertext: (new TextDecoder()).decode(ciphertext), onetime }
}

async function symDecrypt(cipher, key, onetime) {
    const encoded = (new TextEncoder()).encode(cipher);
    
    return await window.crypto.subtle.decrypt(
        { name: 'AES-CBC' },
        key,
        encoded
    );
}

async function deriveKeyFromPassword(password) {

    const encoded = (new TextEncoder()).encode(password);

    const keyMaterial = window.crypto.subtle.importKey(
        "raw",
        encoded,
        "PBKDF2",
        false,
        ["deriveBits", "deriveKey"]
    );

    return await window.crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: "SALT",
            iterations: 100000,
            hash: "SHA-256"
        },
        keyMaterial,
        { name: 'AES-CBC', length: 256 },
        true,
        ["encrypt", "decrypt"]
    )
}

