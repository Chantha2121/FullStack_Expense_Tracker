import jwt from 'jsonwebtoken';
import { config } from 'dotenv';

config();

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader){
        return res.status(500).json({
            messsage: 'Invalid authorization'
        })
    }
    const token = authHeader.split(" ")[1]
    jwt.verify(token, process.env.secret_key,(err, result)=>{
        if(err){
            return res.status(500).json({
                messsage: "Token is not verified"
            })
        }
        req.user = result.username;
        next();
    })
}

export default verifyToken;