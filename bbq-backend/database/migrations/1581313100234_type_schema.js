'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TypeSchema extends Schema {
  up () {
    this.create('types', (table) => {
      table.increments('type_id').primary() //PK
      table.string('type_name', 40)
      table.integer('time_slot').notNullable()
      table.time('start_time').notNullable()
      table.time('end_time').notNullable()
      
      table.timestamps()
    })
  }

  down () {
    this.drop('types')
  }
}

module.exports = TypeSchema
