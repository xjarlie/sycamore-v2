import express from 'express';
import clientRouter from './client';
import serverRouter from './server';
import { verifyToken } from '../lib/authTokens';

const router = express.Router();

router.use('/syc/client', verifyToken, clientRouter);
router.use('/syc/server', serverRouter);

router.get('/signup', (req, res) => {
    res.render('signup');
})

router.get('/', (req, res) => {
    res.render('index');
});

export default router;