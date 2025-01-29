import ExpensesCategory from '#models/expenses_category';
import Revenue from '#models/revenue'
import type { HttpContext } from '@adonisjs/core/http'

export default class BudgetSummariesController {
    async summary({response, params}:HttpContext){
        const { year, month } = params
        const categoriesQuery = await ExpensesCategory.query().preload('expenses', (query) => {
            query
                .whereRaw("TO_CHAR(expense_date, 'YYYY') = ?", [year])
                .whereRaw("TO_CHAR(expense_date, 'MM') = ?", [month]);
        });

        const categories = categoriesQuery.map(category=>{
            let categoryExpense = 0

            for(let j = 0; j < category.expenses.length; j++){
                    categoryExpense += parseFloat(category.expenses[j].amount.toString())
            }
            
            return {
                category: category.name,
                expense: categoryExpense
            }
        })
        
        let expensesTotalAmount = 0

        for(let i = 0; i < categories.length; i++){
            expensesTotalAmount += parseFloat(categories[i].expense.toString())
        }

        const revenues = await Revenue.query()

        let revenuesTotalAmount = 0

        for(let i =0; i < revenues.length; i++){
            revenuesTotalAmount += parseFloat(revenues[i].amount.toString())
        }

        const finalBudget = revenuesTotalAmount - expensesTotalAmount 

        return response.status(200).json({
            revenuesTotalAmount : revenuesTotalAmount,
            expensesTotalAmount : expensesTotalAmount,
            expensesByCategories : categories,
            finalBudget : finalBudget
        })
    }
}