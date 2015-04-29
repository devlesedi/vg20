var feedSubscription;

// Handle for launch screen possibly dismissed from app-body.js
dataReadyHold = null;

// Global subscriptions
if (Meteor.isClient) {
  // Meteor.subscribe('news');
  // Meteor.subscribe('bookmarkCounts');
  // feedSubscription = Meteor.subscribe('feed');
}

Router.configure({
  layoutTemplate: 'appBody',
  notFoundTemplate: 'notFound'
});

if (Meteor.isClient) {
  // Keep showing the launch screen on mobile devices until we have loaded
  // the app's data
  dataReadyHold = LaunchScreen.hold();
}

HomeController = RouteController.extend({
  onBeforeAction: function() {
    Meteor.subscribe('latestActivity', function() {
      dataReadyHold.release();
    });
  }
});

Router.map(function() {
  this.route('home', {path: '/:slug?'});
});

//Router.onBeforeAction('dataNotFound', {only: 'recipe'});