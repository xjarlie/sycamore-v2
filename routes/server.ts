import express from 'express';
import { serverInfo } from '../lib/serverInfo';
import { sycError } from '../lib/error';
import { SycMessage } from '../lib/types';
import { receiveMessage } from '../lib/messaging';

const router = express.Router();

router.get('/serverinfo', (req, res) => {
    res.json({...serverInfo, success: true});
})


router.post('/inbox', async (req, res) => {
    const message: SycMessage = req.body.message;

    if (!message) {
        return sycError(res, 'C001');
    }

    if (message.auxiliary === null || !message.to || !message.chat || !message.content || message.encrypted === null || !message.from || (message.encrypted && !message.onetime) || !message.sent_timestamp) {
        return sycError(res, 'C001');
    }

    const result = await receiveMessage(message);
    const receivedTimestamp = result.success ? Date.now() : null;

    res.status(200).json({
        ...result, 
        received_at: receivedTimestamp
    });

});


router.get('/', (req, res) => {
    res.send('hello world');
});



export default router;