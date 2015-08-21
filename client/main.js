FlowRouter.route('/', {
  name: 'landing',
  action: function() {
    if (Meteor.user()) {
      FlowRouter.go('user-home', Meteor.userId());
    } else {
      
    }
  }
})

FlowRouter.route('/user/:userId', {
  name: 'user-home',
  action: function(params, queryParams) {
    Session.set('userId', params.userId);
  }
});
