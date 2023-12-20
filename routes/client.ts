import express from 'express';
import crypto from 'crypto';
import { SycIdentity, SycMessage } from '../lib/types';
import db from '../lib/conn';
import { sycError } from '../lib/error';
import { encodeIdentity } from '../lib/identity';
import { serverInfo } from '../lib/serverInfo';
import { nacl } from '../lib/crypt';
import { BoxPublicKey } from 'js-nacl';
import { genAndStoreToken } from '../lib/authTokens';

const router = express.Router();

// AUTHENTICATION
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

router.post('/requestauth', async (req, res) => {
    const pseudonym: string = req.body.pseudonym;

    // GET KEYS
    const identity = await db.get(`/users/${pseudonym}`);
    if (!identity) return sycError(res, 'A001');

    const pkey: string = identity.pkey;
    const pkeyBytes: BoxPublicKey = nacl.from_hex(pkey);
    const skey: string = identity.skey;

    const random = nacl.random_bytes(32);
    console.log('RAND_STRING', nacl.to_hex(random));
    
    try {

        const encryptedRandomString = nacl.to_hex(nacl.crypto_box_seal(random, pkeyBytes));

        authStrings.set(pseudonym, nacl.to_hex(random));

        res.status(200).json({
            rand_string: encryptedRandomString,
            skey
        });
    } catch (e) {
        console.log(e);
        res.json({
            success: false,
            error: {
                code: 'A000',
                message: e
            }
        });
    }
});

const authAttempts = new Map();

router.post('/verifyauth', async (req, res) => {
    const pseudonym: string = req.body.pseudonym;
    const decryptString: string = req.body.decrypt_string;

    // Rate limit verification attempts to slow brute forces
    const attempts: {
        lastAttempt: number,
        numAttempts: number
    } = authAttempts.get(pseudonym);
    if (attempts) {
        // New attempt
        authAttempts.set(pseudonym, {
            lastAttempt: Date.now(),
            numAttempts: attempts.numAttempts + 1
        });


        // Rate limit
        if (attempts.numAttempts <= 5 && Date.now() < attempts.lastAttempt + 10000 /* 10sec */) {
            return sycError(res, 'A006', 'Wait 10 seconds');
        } else if (attempts.numAttempts > 5 && Date.now() < attempts.lastAttempt + 3000000 /* 30min */) {
            return sycError(res, 'A006', 'Wait 30 minutes');
        }

        
    } else {
        // First attempt
        authAttempts.set(pseudonym, {
            lastAttempt: Date.now(),
            numAttempts: 1
        });
    }

    const originalString = authStrings.get(pseudonym);
    if (!originalString) return sycError(res, 'A004'); // Pseudonym invalid

    authStrings.delete(pseudonym); // Clear to avoid brute force attacks

    if (originalString !== decryptString) return sycError(res, 'A003'); // Verification failed

    // Attempt succeeded
    authAttempts.set(pseudonym, {
        lastAttempt: Date.now(),
        numAttempts: 0
    });

    // Generate auth token
    const token = await genAndStoreToken(pseudonym);

    res.status(200).json({
        success: true,
        auth_token: token.token
    });

});


// KEY MANAGEMENT
router.post('/getkeys', async (req, res) => {
    const includeSkey: boolean = req.body.skey as boolean || false;
    const pseudonym: string = req.body.pseudonym;

    const identity = await db.get(`/users/${pseudonym}`);
    const pkey = identity.pkey;
    if (!pkey) return sycError(res, 'A005'); // Invalid keypair
    
    res.status(200).json({
        success: true,
        pkey: identity.pkey,
        skey: includeSkey ? identity.skey : null
    });
});

router.post('/updatekeys', async (req, res) => {
    const skey: string = req.body.skey;
    const pkey: string = req.body.pkey;
    const pseudonym: string = req.body.pseudonym;

    if (!(skey && pkey)) return sycError(res, 'A005'); // Invalid keypair

    await db.set(`/users/${pseudonym}/skey`, skey);
    await db.set(`/users/${pseudonym}/pkey`, pkey);

    res.status(200).json({
        success: true
    });
});


// CHAT MANAGEMENT
router.post('/createchat', async (req, res) => {
    const chatID: string = req.body.id;
    const members: string[] = req.body.members;
    const ckey: string = req.body.ckey;

    if (!(chatID && members && ckey)) return sycError(res, 'B003');

    // Test whether chat ID already exists

    // Test whether members list contains creator

    // Store chat metadata in /chats/:chatID
    // Store skey in /users/:pseudonym/chatKeys/:chatID
    // Add first message to chat, like ':pseudonym just created the chat!' or something
    // And send the first message to all members
});


// MESSAGING
router.post('/sendmessage', (req, res) => {
    const message = req.body.message as SycMessage;

});

router.post('/', (req, res) => {
    res.send('Hello world');
});



export default router;