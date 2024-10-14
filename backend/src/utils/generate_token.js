import jwt from 'jsonwebtoken';
import {config} from 'dotenv';
config();
export const generate_tokens = name =>{
    return jwt.sign(
        name,
        process.env.secret_key,
        {
            expiresIn: process.env.secret_expired
        }
    )
}