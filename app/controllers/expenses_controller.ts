import Expense from '#models/expense'
import type { HttpContext } from '@adonisjs/core/http'

export default class ExpensesController {
    async index({response}:HttpContext){
        const expenses = await Expense.query()
        return response.status(200).json(expenses)
    }

    async store({response, request}:HttpContext){
        const data = request.only([
            'descricao',
            'valor'
        ])

        const newExpense = await Expense.create(data)
        return response.status(200).json(newExpense)
    }
}