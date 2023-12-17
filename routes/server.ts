import express from 'express';
import { serverInfo } from '../lib/serverInfo';

const router = express.Router();

router.get('/serverinfo', (req, res) => {
    res.json({...serverInfo, success: true});
})

router.get('/', (req, res) => {
    res.send('hello world');
});



export default router;