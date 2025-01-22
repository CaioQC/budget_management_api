import Revenue from '#models/revenue'
import type { HttpContext } from '@adonisjs/core/http'

export default class RevenuesController {
    async index({response}:HttpContext){
        const revenues = await Revenue.query()
        return response.status(200).json(revenues)
    }

    async store({response, request}:HttpContext){
        const data = request.only([
            'descricao',
            'valor'
        ])
        
        const newRevenue = await Revenue.create(data)
        return response.status(200).json(newRevenue)
    }
}