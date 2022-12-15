module.exports = function (router, database) {
  router.get("/properties", (req, res) => {
    database
      .getAllProperties(req.query, 20)
      .then((properties) => res.send({ properties }))
      .catch((e) => {
        console.error(e);
        res.send(e);
      });
  });

  router.get("/reservations", (req, res) => {
    const userId = req.session.userId;
    if (!userId) {
      res.error("💩");
      return;
    }
    database
      .getAllReservations(userId)
      .then((reservations) => res.send({ reservations }))
      .catch((e) => {
        console.error(e);
        res.send(e);
      });
  });

  // Make new reservation
  router.post("/reservations/", (req, res) => {
    console.log("Body", req.body); // start and end date and property ID
    console.log("User ID", req.session.userId); // find user id

    // call helper function
    database
      .createReservation(req.body, req.session.userId)
      .then((property) => {
        console.log("Property ", property);
        res.send("Reservation Complete ID=" + property.id + ` <a href="/">Click here</a>`);
      })
      .catch((e) => {
        console.error(e);
        res.send(e);
      })

    //
  });

  router.post("/properties", (req, res) => {
    const userId = req.session.userId;
    database
      .addProperty({ ...req.body, owner_id: userId })
      .then((property) => {
        res.send(property);
      })
      .catch((e) => {
        console.error(e);
        res.send(e);
      });
  });

  return router;
};
