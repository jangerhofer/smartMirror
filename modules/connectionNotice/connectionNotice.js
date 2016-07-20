if (Meteor.isClient) {


  Template.connectionNotice.helpers({
    isDisconnected: function() {
      return !Meteor.status().connected
    }
  })


}
