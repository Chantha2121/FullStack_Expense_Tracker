import e from "express";
import pool from "../db/dbconnection.js";

export const addExpensecontroller = (req, res)=>{
    const user = req.user;
    const {title, type, category, description, expense_amount} = req.body;
    let sql1 = "SELECT id FROM user WHERE username = ?";
    pool.query(sql1, [user] ,(err, row)=>{
        if(err){
            return res.status(500).json({
                message: 'Database Error'
            })
        }
        if(!title && !type && !category && !description && !expense_amount){
            return res.status(400).json({
                message: 'Invalid data'
            })
        }
        let insertSql = "INSERT INTO expense (title, type, category, description, expense_amount, user_id) VALUES (?, ?, ?, ?, ?, ?)";
        const insertValue = [title, type, category, description, expense_amount, row[0].id];
        pool.query(insertSql, insertValue, (err, result) => {
            if (err){
                return res.status(500).json({
                    message: 'Database error',
                })
            }
            if(type.toLowerCase() === 'income'){
                let editBalance = "UPDATE user SET balance = balance + ? WHERE id = ?";
                pool.query(editBalance, [expense_amount, row[0].id], (error, result) => {
                    if (error) {
                        return res.status(500).json({
                            message: 'Database error'
                        })
                    }
                    res.status(200).json({
                        message: 'Edit Balance is Successfully',
                        result
                    })
                })
            }
            else{
                let sqleditBalance = "UPDATE user SET balance = balance - ? WHERE id = ?";
                pool.query(sqleditBalance, [expense_amount, row[0].id], (error, result) => {
                    if (error) {
                        return res.status(500).json({
                            message: 'Database error'
                        })
                    }
                    res.status(200).json({
                        message: 'Edit Balance is Successfully',
                        result
                    })
                })
            }
        })
    })
}

export const getExpensecontroller = (req, res) => {
    const authenticationUser = req.user;
    let sql = "SELECT e.* FROM user u INNER JOIN expense e ON u.id = e.user_id WHERE username = ?";
    pool.query(sql,[authenticationUser], (error, row)=>{
        if(error){
            return res.status(500).json({
                message: 'Database Error',
            })
        }
        res.status(200).json({
            message: 'Get Expense is successfully',
            data: row
        })
    })
}