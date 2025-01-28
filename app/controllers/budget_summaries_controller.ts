import Expense from '#models/expense'
import Revenue from '#models/revenue'
import type { HttpContext } from '@adonisjs/core/http'

export default class BudgetSummariesController {
    async summary({response, params}:HttpContext){
        const { year, month } = params

        const queryExpensesByYearAndMonth = await Expense.query().whereRaw("TO_CHAR(expense_date, 'YYYY') = ?", [year]).whereRaw("TO_CHAR(expense_date, 'MM') = ?", [month])

        let totalExpense = 0

        for(let i = 0; i < queryExpensesByYearAndMonth.length; i++){
            totalExpense += parseFloat(queryExpensesByYearAndMonth[i].amount.toString())
        }

        const queryRevenuesByYearAndMonth = await Revenue.query().whereRaw("TO_CHAR(revenue_date, 'YYYY') = ?", [year]).whereRaw("TO_CHAR(revenue_date, 'MM') = ?", [month])

        let totalRevenue = 0

        for(let i = 0; i < queryRevenuesByYearAndMonth.length; i++){
            totalRevenue += parseFloat(queryRevenuesByYearAndMonth[i].amount.toString())
        }

        const finalBudget = totalRevenue - totalExpense

        return response.status(200).json({ totalExpense : totalExpense, totalRevenue : totalRevenue, finalBudget : finalBudget })
    }
}