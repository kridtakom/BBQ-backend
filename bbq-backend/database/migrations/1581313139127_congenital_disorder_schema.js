'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CongenitalDisorderSchema extends Schema {
  up () {
    this.create('congenital_disorders', (table) => {
      table.increments('congenital_disorder_id').primary() //PK
      table.text('symtoms')
      table.integer('user_id') //FK

      table.timestamps()
    })
  }

  down () {
    this.drop('congenital_disorders')
  }
}

module.exports = CongenitalDisorderSchema
