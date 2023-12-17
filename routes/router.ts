import express from 'express';
import clientRouter from './client';
import serverRouter from './server';

const router = express.Router();

router.use('/syc/client', clientRouter);
router.use('/syc/server', serverRouter);


router.get('/', (req, res) => {
    res.send('hello world');
});



export default router;