if (Meteor.isClient) {

  Template.time.helpers({
      time: function() {
        return ({
          hourMin : Chronos.liveMoment().format("HH:MM"),
          secs : Chronos.liveMoment().format("ss")
      })
    }
    });


}
