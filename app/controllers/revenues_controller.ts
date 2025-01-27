import Revenue from '#models/revenue'
import { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'

export default class RevenuesController {
    async index({response}:HttpContext){
        const revenues = await Revenue.query()

        return response.status(200).json(revenues)
    }

    async store({response, request}:HttpContext){
        const data = request.only([
            'description',
            'amount',
            'revenue_date'
        ])

        const queryRevenueDescriptions = Revenue.query().where("description", data.description).whereRaw("TO_CHAR(revenue_date, 'MM') = ?", [DateTime.fromFormat(data.revenue_date, "MM-dd-yyyy").toFormat('MM')])
        
        const revenueDescriptions = await queryRevenueDescriptions

        if(revenueDescriptions.length > 0){
            return response.status(409).json({ message : "This description is invalid because there is already a revenue with identical description registered this month." })
        }

        else{
            const newRevenue = await Revenue.create(data)

            return response.status(200).json(newRevenue)
        }
    }

    async show({response, params}:HttpContext){
        const revenueId = params.id

        const revenue = await Revenue.findOrFail(revenueId)

        if(!revenue){
            return response.status(404).json({ message : "Revenue not found" })
        }

        else{
            return response.status(200).json(revenue)
        }
    }

    async update({response, request, params}:HttpContext){
        const revenueId = params.id

        const revenueToUpdate = await Revenue.findOrFail(revenueId)

        const data = request.only([
            "description",
            "amount",
            "revenue_date"
        ])

        const queryRevenueDescriptions = Revenue.query().where("description", data.description ?? revenueToUpdate.description).whereRaw("TO_CHAR(revenue_date, 'MM') = ?", [data.revenue_date ? DateTime.fromFormat(data.revenue_date, "MM-dd-yyyy").toFormat('MM') : DateTime.fromISO(revenueToUpdate.revenue_date.toISOString()).toFormat("MM")])
        
        const revenueDescriptions = await queryRevenueDescriptions

        if(revenueDescriptions.length > 0){
            return response.status(409).json("The update can not be completed because there is already a revenue with identical description registered this month.")
        }

        else{
            const updatedRevenue = await revenueToUpdate.merge({ description : data.description ?? revenueToUpdate.description, amount : data.amount ?? revenueToUpdate.amount, revenue_date : data.revenue_date ?? revenueToUpdate.revenue_date }).save()

            return response.status(200).json(updatedRevenue)
        }
    }

    async destroy({response, params}:HttpContext){
        const revenueId = params.id
        
        const revenueToDelete = await Revenue.findOrFail(revenueId)

        await revenueToDelete.delete()

        return response.status(200).json({ message : "The revenue was successfully deleted." })
    }
}