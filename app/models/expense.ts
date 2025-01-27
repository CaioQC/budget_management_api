import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import * as relations  from '@adonisjs/lucid/types/relations'
import ExpensesCategory from './expenses_category.js'

export default class Expense extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare descricao: string

  @column()
  declare valor: number

  @column()
  declare data_da_despesa: Date

  @column()
  declare expense_category_id: number

  @belongsTo(()=>ExpensesCategory, {foreignKey: "expense_category_id"})
  declare category:relations.BelongsTo<typeof ExpensesCategory>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}