FlowRouter.route('/', {
  name: 'home',
  action: function() {
    todoRoute(['root'])
  }
})

FlowRouter.route("/:breadcrumbs", {
  name:'task',
  action: function(params, queryParams) {
    todoRoute(params.breadcrumbs.split('-'))
  }
});

var todoRoute = function(breadcrumbs) {
  var loginRedirect = Deps.autorun(function() {
    if (Meteor.user()) {
      // loginRedirect.stop() TODO uncomment when removed session user
      Meteor.subscribe("tasks", Meteor.userId())
      Session.set('user', Meteor.user().username)
      Session.set('breadcrumbs', breadcrumbs)
    }
  })
}
