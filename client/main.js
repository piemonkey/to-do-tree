FlowRouter.route('/', {
  name: 'landing',
  action: function() {
    if (Meteor.user()) {
      FlowRouter.go('user-home', Meteor.userId());
    }
  }
})

FlowRouter.route('/user/:userId', {
  name: 'user-home',
  action: function(params, queryParams) {
    Session.set('userId', params.userId);
    Session.set('breadcrumbs', ['root']);
  }
});

FlowRouter.route("/user/:userId/:breadcrumbs", {
  name:'user-task',
  action: function(params, queryParams) {
    Session.set('userId', params.userId);
    var breadcrumbs = params.breadcrumbs.split('-');
    // breadcrumbs.unshift('root');
    Session.set('breadcrumbs', breadcrumbs);
  }
});
