import express from 'express';
import crypto from 'crypto';
import { SycIdentity, SycMessage } from '../lib/types';
import db from '../lib/conn';
import { sycError } from '../lib/error';
import { encodeIdentity } from '../lib/identity';
import { serverInfo } from '../lib/serverInfo';
import { nacl } from '../lib/crypt';
import { BoxPublicKey } from 'js-nacl';

const router = express.Router();

// Authentication

router.post('/createidentity', async (req, res) => {
    const pseudonym: string = req.body.pseudonym; // Proposed pseudonym
    const pkey: string = req.body.pkey; // Client-generated public encryption key
    const skey: string = req.body.skey; // Client-generated private encryption key (encrypted by client)

    // PSEUDONYM VALIDATION
    if (pseudonym.length < 3 || pseudonym.length > 32) return sycError(res, 'A004', 'Pseudonym out of bounds');
    if (pseudonym.includes('~') || pseudonym.includes('@') || pseudonym.includes(',') || pseudonym.includes(':') || pseudonym.includes('=')) return sycError(res, 'A004', 'Pseudonym includes illegal characters');
    if (await db.get(`/users/${pseudonym}`)) return sycError(res, 'A002');

    // KEYPAIR VALIDATION
    // ...

    // CREATE IDENTITY
    await db.set(`/users/${pseudonym}`, {
        pseudonym,
        pkey,
        skey
    });

    res.status(200).json({
        success: true,
        identity: encodeIdentity({
            pseudonym,
            origin: serverInfo.address
        })
    });
});

const authStrings = new Map();

// TODO; fix this 'crypto_box_seal expected 32-byte pk but got length 64'
router.post('/requestauth', async (req, res) => {
    const pseudonym: string = req.body.pseudonym;

    // PSEUDONYM VALIDATION
    // ...

    // GET KEYS
    const identity = await db.get(`/users/${pseudonym}`);
    if (!identity) return sycError(res, 'A001');

    const pkey: string = identity.pkey;
    const arrPkey: BoxPublicKey = nacl.encode_utf8(pkey);
    const skey: string = identity.skey;
    
    try {
        const randomArr = nacl.random_bytes(64);
        const encryptedRandomString = nacl.crypto_box_seal(randomArr, arrPkey);

        res.status(200).json({
            str: encryptedRandomString
        });
    } catch (e) {
        console.log(e);
    }
    

});


// Messaging
router.post('/sendmessage', (req, res) => {
    const message = req.body.message as SycMessage;

});



export default router;