'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class WorkTimeSchema extends Schema {
  up () {
    this.create('work_times', (table) => {
      table.increments('working_id').primary()
      table.integer('day_id') //.notNullable() [FK]
      table.integer('type_id') //.notNullable() [FK]

      table.timestamps()
    })
  }

  down () {
    this.drop('work_times')
  }
}

module.exports = WorkTimeSchema
