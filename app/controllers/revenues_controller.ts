import Revenue from '#models/revenue'
import type { HttpContext } from '@adonisjs/core/http'
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

        const query = Revenue.query().where("descricao", data.descricao).whereRaw("TO_CHAR(data_da_receita, 'MM') = ?", [DateTime.fromFormat(data.data_da_receita, "MM-dd-yyyy").toFormat('MM')])
        
        const queryRevenue = await query

        if(queryRevenue.length > 0){
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
}