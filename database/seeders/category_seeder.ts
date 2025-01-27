import ExpensesCategory from '#models/expenses_category'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await ExpensesCategory.createMany([
      {
        name : "Alimentação"
      },
      {
        name : "Saúde"
      },
      {
        name : "Moradia"
      },
      {
        name : "Transporte"
      },
      {
        name : "Educação"
      },
      {
        name : "Lazer"
      },
      {
        name : "Imprevistos"
      },
      {
        name : "Outros"
      }
    ])
  }
}