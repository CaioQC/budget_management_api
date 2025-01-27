import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'expenses'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable().unique()
      table.string("descricao").notNullable()
      table.decimal("valor").notNullable()
      table.date("data_da_despesa").notNullable()
      table.integer("expense_category_id").unsigned().references("id").inTable("expenses_categories").onDelete("CASCADE")
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}