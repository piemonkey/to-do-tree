FlowRouter.route('/user/:userId', {
  name: 'user-home',
  action: function(params, queryParams) {
    Session.set('userId', params.userId);
  }
});
