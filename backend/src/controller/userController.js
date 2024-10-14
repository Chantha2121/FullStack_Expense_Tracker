import pool from "../db/dbconnection.js";

export const getAllUser = (req, res) =>{
    const user = req.user;
    // console.log(user)
    let sql = 'SELECT * FROM user WHERE username = ?';
    pool.query(sql,[user],(error, row)=>{
        if (error){
            return res.status(500).json({
                message: 'Get User failed'
            })
        }
        res.status(200).json({
            message: "Get User is Successful",
            data: row
        })
    })
}

export const updateUser = (req, res) => {
    const user = req.user;
    const profile_image = req.file;
    const { name, balance } = req.body;
    console.log(user)
    let sql = "UPDATE user SET username = ? , balance = ? , profile_image = ? WHERE username = ?";
    if(! user){
        return res.status(404).json({ message: "Invalid username"})
    }
    const dataUpdate = [name, balance, profile_image.filename, user]
    pool.query(sql,dataUpdate, (err, result)=>{
        if(err){
            return res.status(500).json({ message: 'data update failed'})
        }
        res.status(200).json({
            message: 'data update successful',
            rows: result
        })
    })
}

export const deleteUser = (req, res) => {
    const user = req.user;
    let sql = 'DELETE FROM user WHERE username = ?';
    pool.query(sql, [user], (err, result)=>{
        if (err){
            return res.status(500)
        }
        res.status(200).json({
            message: 'User has been deleted successfully',
            user: result
        })
    })
}