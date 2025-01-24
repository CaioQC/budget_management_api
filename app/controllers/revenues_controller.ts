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
            'descricao',
            'valor',
            'data_da_receita'
        ])

        const queryRevenueDescriptions = Revenue.query().where("descricao", data.descricao).whereRaw("TO_CHAR(data_da_receita, 'MM') = ?", [DateTime.fromFormat(data.data_da_receita, "MM-dd-yyyy").toFormat('MM')])
        
        const revenueDescriptions = await queryRevenueDescriptions

        if(revenueDescriptions.length > 0){
            return response.status(409).json({ message : "Essa descrição é inválida, pois já foi registrada esse mês." })
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
            "descricao",
            "valor",
            "data_da_receita"
        ])

        const queryRevenueDescriptions = Revenue.query().where("descricao", data.descricao ?? revenueToUpdate.descricao).whereRaw("TO_CHAR(data_da_receita, 'MM') = ?", [data.data_da_receita ? DateTime.fromFormat(data.data_da_receita, "MM-dd-yyyy").toFormat('MM') : DateTime.fromISO(revenueToUpdate.data_da_receita.toISOString()).toFormat("MM")])
        
        const revenueDescriptions = await queryRevenueDescriptions

        if(revenueDescriptions.length > 0){
            return response.status(409).json("The update can not be completed because there is already a revenue with identical description registered this month.")
        }

        else{
            const updatedRevenue = await revenueToUpdate.merge({ descricao : data.descricao ?? revenueToUpdate.descricao, valor : data.valor ?? revenueToUpdate.valor, data_da_receita : data.data_da_receita ?? revenueToUpdate.data_da_receita }).save()

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