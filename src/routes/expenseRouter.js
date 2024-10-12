import { Router } from "express";
const expenseRouter = Router();
import { addExpensecontroller } from "../controller/expenseController.js";
import verifyToken from "../utils/verif_Token.js";


expenseRouter.post('/addExpense',verifyToken,addExpensecontroller);

export default expenseRouter;