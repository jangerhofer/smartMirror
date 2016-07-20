if (Meteor.isClient) {

  Template.time.helpers({
      time: function() {
        return ({
          hourMin : Chronos.liveMoment().format("hh:mm"),
          secs : Chronos.liveMoment().format("ss")
      })
    }
    });


}
