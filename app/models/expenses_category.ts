import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import * as relations  from '@adonisjs/lucid/types/relations'
import Expense from './expense.js'

export default class ExpensesCategory extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @hasMany(()=>Expense,{foreignKey:'id'})
  declare expenses : relations.HasMany<typeof Expense>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}