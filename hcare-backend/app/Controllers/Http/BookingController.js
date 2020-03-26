"use strict";
const ServiceType = use("App/Models/ServiceType");
const Booking = use("App/Models/Booking");
const Account = use("App/Models/Account");
const Database = use("Database");
const Mail = use("Mail");
const Hash = use("Hash");

class BookingController {
  async showType({ request, response }) {
    try {
      console.log("------------------------------------------------------");
      // let types = await ServiceType.all(); // fatch all record from types table
      // console.log(types);
      // let typeJSON = types.toJSON(); // parse to json
      let types = await Database.from("servicetypes");
      const returnType = []; // return to fontend type_id and type_name only
      for (let index = 0; index < types.length; index++) {
        returnType[index] = {
          type_id: types[index].type_id,
          type_name: types[index].type_name
        };
      }
      return returnType;
    } catch (error) {
      return response.status(error.status).send(error);
    }
  }

  async showDate({ request, response, params }) {
    try {
      let allBooking = await Database.table("bookings")
        .select("type_id", "date")
        .distinct("date")
        .select(Database.raw('DATE_FORMAT(date, "%Y-%m-%d") as date'))
        .innerJoin("work_times", "bookings.working_id", "work_times.working_id")
        .where({ type_id: params.type_id });
      return allBooking;
    } catch (error) {
      return error;
    }
  }

  async showTime({ request, response, params }) {
    let data = request.all("time");
    try {
      let allTime = await Database.table("bookings")
        .select("booking_id", "type_id", "time_in", "status")
        .innerJoin("work_times", "bookings.working_id", "work_times.working_id")
        .where({ date: data.time, type_id: params.type_id });
      return allTime;
    } catch (error) {
      return error;
    }
  }

  async submitBooking({ request, response }) {
    try {
      const dataFromBooking = request.only([
        "booking_id",
        "account_id",
        "symptom"
      ]);
      console.log(dataFromBooking);

      //find account from hn_number
      const userAccount = await Database.select(
        "account_id",
        "email",
        "first_name",
        "last_name"
      )
        .from("accounts")
        .where("account_id", dataFromBooking.account_id)
        .first();

      console.log("************************");

      // find booking slot from bookingID that get from request to find in DB
      const findBooking = await Database.select(
        "booking_id",
        "type_name",
        "time_in",
        "time_out",
        "date",
        "status"
      )
        .select(Database.raw('DATE_FORMAT(date, "%d-%m-%Y") as date'))
        .from("bookings")
        .innerJoin("work_times", "bookings.working_id", "work_times.working_id")
        .innerJoin("servicetypes", "work_times.type_id", "servicetypes.type_id")
        .where("bookings.booking_id", dataFromBooking.booking_id)
        .first();

      console.log(findBooking);

      if (userAccount) {
        // check account not null
        console.log("+++++++++++++++++++++++++++++");
        if (!findBooking.status) {
          // check booking status available

          const tokenNoHash = `${Date.now()}${
            findBooking.booking_id
          }${Date.now()}`;
          const token = await Hash.make(tokenNoHash);

          console.log(token);

          const dataForSendEmail = {
            account: userAccount,
            bookingSlot: findBooking,
            token
          };

          console.log(dataForSendEmail);

          const subject =
            "Submit Booking From Health Care" +
            dataForSendEmail.bookingSlot.type_name.toString();

          await Mail.send("email", dataForSendEmail, message => {
            message
              .to(userAccount.email)
              .from("Mail from healthcare")
              .subject(subject);
          });

          console.log(
            "000000000000000000000000000000000000000000000000000000000"
          );

          await Database.table("bookings")
            .where("booking_id", dataFromBooking.booking_id)
            .update({
              account_id_from_user: dataForSendEmail.account.account_id,
              status: "waitting confirm",
              comment_from_user: dataFromBooking.symptom,
              token_booking_confirm: token
            });

          return "send mail success";

          // let bookingSuccess = await Booking.find(dataFromBooking.booking_id);
          // console.log(bookingSuccess);
          // return bookingSuccess;
        }
        return response.status(400).send("This booking unavailable");
      }
    } catch (error) {
      return response.status(500).send(error);
    }
  }

  async showBookingForHCARE({ request, response, params }) {
    try {
      console.log(params.type + " " + params.date);
      let userBooking2 = await Database.select(
        "accounts.hn_number",
        "first_name",
        "last_name",
        "time_in"
      )
        .from("users")
        .innerJoin("accounts", "users.user_id", "accounts.user_id")
        .innerJoin("bookings", "accounts.hn_number", "bookings.hn_number")
        .where({ type_id: params.type, date: params.date });
      console.log("--------------------------------------------------");
      console.log(userBooking2);
      return userBooking2;
    } catch (error) {
      return response.status(500).send(error);
    }
  }

  async showBookingForHCAREDefault({ request, response }) {
    try {
      let userBooking = await Database.select(
        "accounts.hn_number",
        "first_name",
        "last_name",
        "time_in"
      )
        .from("users")
        .innerJoin("accounts", "users.user_id", "accounts.user_id")
        .innerJoin("bookings", "accounts.hn_number", "bookings.hn_number");
      console.log("--------------------------------------------------");
      console.log(userBooking);
      return userBooking;
    } catch (error) {
      return response.status(500).send(error);
    }
  }

  // async showBookingForUser({ request, response, params }) {
  //   try {
  //     let showbook = await Database.select("*")
  //       .from("bookings")
  //       .where({ booking_agent: params.user_id, status:  });
  //     return showbook;
  //   } catch (error) {
  //     response.status(500).send(error);
  //   }
  // }

  async confirmBooking({ request, response }) {
    const query = request.get();

    if (query.token) {
      const booking = await Booking.findBy(
        "token_booking_confirm",
        query.token
      );

      console.log("---------------------------------------------");

      if (booking) {
        await Booking.query()
          .where("booking_id", booking.booking_id)
          .update({
            status: "confirm successful",
            token_booking_confirm: null
          });

        const bookingNew = await Booking.find(booking.booking_id);

        return response.json({
          message: "booking confirm successful!",
          booking: bookingNew
        });
      }
    } else {
      return response.json({
        message: "token not exist"
      });
    }
  }
}

module.exports = BookingController;
