var express = require("express");
var router = express.Router();
var models = require("./../models");
var User = models.User;
var Calendar = models.Calendar;
var Event = models.Event;
var sequelize = models.sequelize;

// ----------------------------------------
// Index
// ----------------------------------------

router.get("/events", (req, res) => {
  //Event Name>Date<Start Time<End Time</Calendar Name</Username</Email</UserId<CalendarId
  let cals;
  Calendar.findAll({ order: '"name"' })
    .then(calendars => {
      cals = calendars;
      let usersProm = [];
      cals.forEach(calendar => {
        usersProm.push(User.findById(calendar.userId));
      });
      return Promise.all(usersProm);
    })
    .then(users => {
      let calsInfo = [];
      for (let i = 0; i < cals.length; i++) {
        calsInfo[i] = {
          name: cals[i].name,
          calendarId: cals[i].id,
          userId: users[i].id,
          username: users[i].username,
          email: users[i].email
        };
      }
      res.render("calendars/index", { calsInfo });
    })
    .catch(e => res.status(500).send(e.stack));
});