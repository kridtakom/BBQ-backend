'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class StaffSchema extends Schema {
  up () {
    this.create('staff', (table) => {
      table.increments('staff_id').primary() //  [PK,FK]
      table.string('gender', 10).notNullable() //[CK]
      table.string('date_of_birth', 10).notNullable() //[NN]
      table.string('first_name', 80).notNullable() // [NN]
      table.string('last_name', 80).notNullable() // [NN]
      //table.increments('account_id').unique() // [FK.UQ]

      table.timestamps()
    })
  }

  down () {
    this.drop('staff')
  }
}

module.exports = StaffSchema
