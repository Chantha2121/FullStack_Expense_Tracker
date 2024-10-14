import bcrypt from 'bcrypt'
import { config } from 'dotenv';
import pool from '../db/dbconnection.js';
import { generate_tokens } from '../utils/generate_token.js';
import { isverify } from '../utils/verify_password.js';
config()
export const authsignUpRoute = async (req, res) => {
    const profile_image = req.file;
    const { name, email, password, balance } = req.body;
    console.log(profile_image.filename)

    if (!name || !email || !password || !balance) {
        return res.status(400).json({
            message: 'Invalid Data'
        });
    }

    try {
        const salt = await bcrypt.genSalt(parseInt(process.env.round_number));
        const hashpassword = await bcrypt.hash(password, salt);
        const sql = `INSERT INTO user (username, email, password, balance, profile_image) VALUES (?, ?, ?, ?, ?)`;

        pool.query(sql, [name, email, hashpassword, balance, profile_image.filename], (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Database error', error: err.message });
            }

            const token = generate_tokens({ username: name });
            res.status(200).json({
                token: token,
                message: 'Register is successfully'
            });
        });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};
// callback function Login 
export const authLoginRoute = (req, res) => {
    const {email, password} = req.body;
    if(!email || !password){
        return res.status(500).json({ message: 'Invalid email or password'})
    }
    try{
        let sql = `SELECT * FROM user WHERE email = ?`
        pool.query(sql,[email],async (err, result)=>{
            if(err){
                return res.status(500).json({ message:"Error Databas",error:err.message})
            }
            if(result.length === 0){
                return res.status(404).json({ message: 'Data invalid'})
            }
            const user = result[0];
            const ispassword = await isverify(password, user.password)
            if(!ispassword){
                return res.status(404).json({message: "invalid password or email"})
            }
            const token = generate_tokens({username: user.username})
            res.status(200).json({
                token: token,
                message: "Login successfully"
            })
        })
    }
    catch(err){
        console.log(err)
    }
}
