import express from 'express';
import { config } from 'dotenv';
import pool from './src/db/dbconnection.js';
import authRouter from './src/routes/authenticationRoute.js';
import verifyToken from './src/utils/verif_Token.js';
import userRoute from './src/routes/userRouter.js';
config();

const app = express();
const port = process.env.port;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

pool.getConnection((err,connent)=>{
    if (err) {
        throw err;
    }
    console.log(`Database is connected`)
    connent.release();
})

app.use('/auth', authRouter);
app.use('/user', userRoute)

app.get('/',verifyToken,(req, res)=>{
    res.send("Hello Your Page");
})

app.listen(port,()=>{
    console.log(`Server is running on http://localhost:${port}`);
})


