import pool from "../db/dbconnection.js";

export const addExpensecontroller = (req, res)=>{
    const user = req.user;
    const {title, type, category, description, expense_amount} = req.body;
    let sql = "INSERT INTO expense";
    pool.query()
}