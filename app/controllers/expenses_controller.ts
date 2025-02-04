import Expense from '#models/expense'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'

export default class ExpensesController {
    async index({response, request}:HttpContext){
        try{
            const queryExpenses = Expense.query()
    
            const { description } = request.qs()
    
            if(description){
                queryExpenses.whereLike("description", "%" + description + "%")
            }
    
            const expenses = await queryExpenses
    
            return response.status(200).json(expenses)
        }

        catch(error){
            return response.status(500).json({ message : error.message })
        }
    }

    async store({response, request}:HttpContext){
        try{
            const data = request.only([
                'description',
                'amount',
                'expense_date',
                'expense_category_id'
            ])
    
            const queryExpenseDescriptions = Expense.query().where("description", data.description).whereRaw("TO_CHAR(expense_date, 'MM') = ?", [DateTime.fromFormat(data.expense_date, "MM-dd-yyyy").toFormat('MM')])
    
            const expenseDescriptions = await queryExpenseDescriptions
    
            if(expenseDescriptions.length > 0){
                return response.status(409).json({ message : "This description is invalid because there is already a expense with identical description registered this month." })
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

        catch(error){
            return response.status(500).json({ message : error.message })
        }
    }

    async show({response, params}:HttpContext){
        try{
            const expenseId = params.id
    
            const expense = await Expense.findOrFail(expenseId)
    
            if(!expense){
                return response.status(404).json({ message : "Expense not found" })
            }
    
            else{
                return response.status(200).json(expense)
            }
        }

        catch(error){
            return response.status(500).json({ message : error.message })
        }
    }

    async update({response, request, params}:HttpContext){
        try{
            const expenseId = params.id
    
            const expenseToUpdate = await Expense.findOrFail(expenseId)
    
            const data = request.only([
                "description",
                "amount",
                "expense_date",
                "expense_category_id"
            ])
    
            const queryExpenseDescriptions = Expense.query().where("description", data.description ?? expenseToUpdate.description).whereRaw("TO_CHAR(expense_date, 'MM') = ?", [data.expense_date ? DateTime.fromFormat(data.expense_date, "MM-dd-yyyy").toFormat('MM') : DateTime.fromISO(expenseToUpdate.expense_date.toISOString()).toFormat("MM")])
    
            const expenseDescriptions = await queryExpenseDescriptions
    
            if(expenseDescriptions.length > 0){
                return response.status(409).json({ message : "The update can not be completed because there is already a expense with identical description registered this month." })
            }
    
            else{
                const updatedExpense = await expenseToUpdate.merge({ description : data.description ?? expenseToUpdate.description, amount : data.amount ?? expenseToUpdate.amount, expense_date : data.expense_date ?? expenseToUpdate.expense_date, expense_category_id : data.expense_category_id ?? expenseToUpdate.expense_category_id }).save()
    
                await updatedExpense.load("category")
                return response.status(200).json(updatedExpense)
            }
        }

        catch(error){
            return response.status(500).json({ message : error.message })
        }
    }

    async destroy({response, params}:HttpContext){
        try{
            const expenseId = params.id
            
            const expenseToDelete = await Expense.findOrFail(expenseId)
    
            await expenseToDelete.delete()
    
            return response.status(200).json({ message : "The expense was successfully deleted." })
        }

        catch(error){
            return response.status(500).json({ message : error.message })
        }
    }

    async getYearAndMonth({response, params}:HttpContext){
        try{
            const { year, month } = params
    
            const queryExpensesByYearAndMonth = await Expense.query().whereRaw("TO_CHAR(expense_date, 'YYYY') = ?", [year]).whereRaw("TO_CHAR(expense_date, 'MM') = ?", [month])
    
            return response.status(200).json(queryExpensesByYearAndMonth)   
        }
        
        catch(error){
            return response.status(500).json({ message : error.message })
        }
    }
}