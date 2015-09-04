FlowRouter.route('/', {
  name: 'landing',
  action: function() {
    var loginRedirect = Deps.autorun( function() {
      if (Meteor.user()) {
        loginRedirect.stop();
        FlowRouter.go('user-home', {user: Meteor.user().username});
      }
    })
  }
})

FlowRouter.route('/user/:user', {
  name: 'user-home',
  action: function(params, queryParams) {
    todoRoute(params.user, ['root']);
  }
});

FlowRouter.route("/user/:user/:breadcrumbs", {
  name:'user-task',
  action: function(params, queryParams) {
    todoRoute(params.user, params.breadcrumbs.split('-'));
  }
});

var todoRoute = function(user, breadcrumbs) {
  Meteor.subscribe("tasks", user);
  Session.set('user', user);
  Session.set('breadcrumbs', breadcrumbs);
}
