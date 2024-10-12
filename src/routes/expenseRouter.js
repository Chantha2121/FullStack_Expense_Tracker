import { Router } from "express";
const expenseRouter = Router();
import { addExpensecontroller, getExpensecontroller } from "../controller/expenseController.js";
import verifyToken from "../utils/verif_Token.js";


expenseRouter.post('/addExpense',verifyToken,addExpensecontroller);
expenseRouter.get('/getExpense',verifyToken,getExpensecontroller);

export default expenseRouter;