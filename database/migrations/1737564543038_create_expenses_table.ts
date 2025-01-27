import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'expenses'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable().unique()
      table.string("description").notNullable()
      table.decimal("amount").notNullable()
      table.date("expense_date").notNullable()
      table.integer("expense_category_id").unsigned().references("id").inTable("expenses_categories").onDelete("CASCADE")
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}