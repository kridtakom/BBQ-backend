'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class DrugAllergySchema extends Schema {
  up () {
    this.create('drug_allergies', (table) => {
      table.increments('drugmedicine_id').primary() //PK
      table.string('medicine_name', 70)
      table.integer('user_id') // [FK]
      table.text('symtoms')

      table.timestamps()
    })
  }

  down () {
    this.drop('drug_allergies')
  }
}

module.exports = DrugAllergySchema
