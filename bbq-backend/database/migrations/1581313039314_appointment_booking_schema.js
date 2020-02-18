'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AppointmentBookingSchema extends Schema {
  up () {
    this.create('appointment_bookings', (table) => {
      table.increments('appointment_id', 100).primary() //[PK]
      table.integer('patient_id')  //[FK]
      table.integer('docter_id') //[FK]
      table.string('symptoms', 255)
      table.text('feedback_from_doctor')
      table.boolean('check').defaultTo(false) // [Boolean]
      table.string('booking_id', 100).notNullable() // [FK]

      table.timestamps()
    })
  }

  down () {
    this.drop('appointment_bookings')
  }
}

module.exports = AppointmentBookingSchema
