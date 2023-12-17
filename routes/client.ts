import express from 'express';
import { SycMessage } from '../lib/types';

const router = express.Router();

// Authentication
router.post('/createidentity', (req, res) => {
    const pseudonym: string = req.body.pseudonym;
    const pkey: string = req.body.pkey;
    const skey: string = req.body.skey;

    
})


// Messaging
router.post('/sendmessage', (req, res) => {
    const message = req.body.message as SycMessage;

});



export default router;