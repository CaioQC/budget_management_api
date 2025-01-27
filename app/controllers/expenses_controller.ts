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
            'data_da_despesa',
            'expense_category_id'
        ])

        const queryExpenseDescriptions = Expense.query().where("descricao", data.descricao).whereRaw("TO_CHAR(data_da_despesa, 'MM') = ?", [DateTime.fromFormat(data.data_da_despesa, "MM-dd-yyyy").toFormat('MM')])

        const expenseDescriptions = await queryExpenseDescriptions

        if(expenseDescriptions.length > 0){
            return response.status(409).json({ message : "A descrição é inválida, pois ela já foi registrada esse mês" })
        }

        else{
            const {expense_category_id, ...data_without_category} = data

            const newExpense = await Expense.create(
                expense_category_id ? data : {...data_without_category, expense_category_id : 8}
            )
            await newExpense.load('category')

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

    async update({response, request, params}:HttpContext){
        const expenseId = params.id

        const expenseToUpdate = await Expense.findOrFail(expenseId)

        const data = request.only([
            "descricao",
            "valor",
            "data_da_despesa",
            "expense_category_id"
        ])

        const queryExpenseDescriptions = Expense.query().where("descricao", data.descricao ?? expenseToUpdate.descricao).whereRaw("TO_CHAR(data_da_despesa, 'MM') = ?", [data.data_da_despesa ? DateTime.fromFormat(data.data_da_despesa, "MM-dd-yyyy").toFormat('MM') : DateTime.fromISO(expenseToUpdate.data_da_despesa.toISOString()).toFormat("MM")])

        const expenseDescriptions = await queryExpenseDescriptions

        if(expenseDescriptions.length > 0){
            return response.status(409).json({ message : "A descrição é inválida, pois ela já foi registrada esse mês" })
        }

        else{
            const updatedExpense = await expenseToUpdate.merge({ descricao : data.descricao ?? expenseToUpdate.descricao, valor : data.valor ?? expenseToUpdate.valor, data_da_despesa : data.data_da_despesa ?? expenseToUpdate.data_da_despesa, expense_category_id : data.expense_category_id ?? expenseToUpdate.expense_category_id }).save()

            return response.status(200).json(updatedExpense)
        }
    }

    async destroy({response, params}:HttpContext){
        const expenseId = params.id
        
        const expenseToDelete = await Expense.findOrFail(expenseId)

        await expenseToDelete.delete()

        return response.status(200).json({ message : "The expense was successfully deleted." })
    }
}