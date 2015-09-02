FlowRouter.route('/', {
  name: 'landing',
  action: function() {
    if (Meteor.userId()) {
      FlowRouter.go('user-home', {userId: Meteor.userId()});
    } else {
      var loginRedirect = Accounts.onLogin(function() {
         FlowRouter.go('user-home', {userId: Meteor.userId()});
         loginRedirect.stop();
      });
    }
  }
})

FlowRouter.route('/user/:userId', {
  name: 'user-home',
  action: function(params, queryParams) {
    todoRoute(params.userId, ['root']);
  }
});

FlowRouter.route("/user/:userId/:breadcrumbs", {
  name:'user-task',
  action: function(params, queryParams) {
    todoRoute(params.userId, params.breadcrumbs.split('-'));
  }
});

var todoRoute = function(userId, breadcrumbs) {
  Meteor.subscribe("tasks", userId);
  Session.set('userId', userId);
  Session.set('breadcrumbs', breadcrumbs);
}
