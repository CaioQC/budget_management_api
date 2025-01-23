import Expense from '#models/expense'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'

export default class ExpensesController {
    async index({response}:HttpContext){
        const expenses = await Expense.query()
        return response.status(200).json(expenses)
    }

    async store({response, request}:HttpContext){
        const data = request.only([
            'descricao',
            'valor',
            'data_da_despesa'
        ])

        const query = Expense.query().where("descricao", data.descricao).whereRaw("TO_CHAR(data_da_receita, 'MM') = ?", [DateTime.fromFormat(data.data_da_despesa, "MM-dd-yyyy").toFormat('MM')])

        const queryExpense = await query

        if(queryExpense.length > 0){
            return response.status(409).json({ message : "A descrição é inválida, pois ela já foi registrada esse mês" })
        }

        else{  
            const newExpense = await Expense.create(data)
            return response.status(200).json(newExpense)
        }
    }

    async show({response, params}:HttpContext){
        const expenseId = params.id

        const expense = await Expense.findOrFail(expenseId)

        if(!expense){
            return response.status(404).json({ message : "Expense not found" })
        }

        else{
            return response.status(200).json(expense)
        }
    }
}