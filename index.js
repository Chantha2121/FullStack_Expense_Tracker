import express from 'express';
import { config } from 'dotenv';
import pool from './src/db/dbconnection.js';
import authRouter from './src/routes/authenticationRoute.js';
import verifyToken from './src/utils/verif_Token.js';
import userRoute from './src/routes/userRouter.js';
import expenseRouter from './src/routes/expenseRouter.js';
import cors from 'cors';
import { name } from 'ejs';

config();

const app = express();
const port = process.env.port;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

pool.getConnection((err,connent)=>{
    if (err) {
        throw err;
    }
    console.log(`Database is connected`)
    connent.release();
})

app.use('/auth', authRouter);
app.use('/user', userRoute);
app.use('/expense',expenseRouter)

const mokeData = [
    {
        id: 1001,
        name: "Moke",
    },
    {
        id: 1002,
        name: 'Chantha'
    }
]

app.get('/public',(req, res)=>{
    res.status(200).json({
        data: mokeData
    })
})

app.listen(port,()=>{
    console.log(`Server is running on http://localhost:${port}`);
})


