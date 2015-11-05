FlowRouter.route('/', {
  name: 'home',
  action: function() {
    var loginRedirect = Deps.autorun( function() {
      if (Meteor.user()) {
        todoRoute(Meteor.user().username, ['root'])
      }
    })
  }
})

FlowRouter.route("/:breadcrumbs", {
  name:'user-task',
  action: function(params, queryParams) {
    if (Meteor.user()) {
      todoRoute(Meteor.user().username, params.breadcrumbs.split('-'))
    }
  }
});

var todoRoute = function(user, breadcrumbs) {
  Meteor.subscribe("tasks", user)
  Session.set('user', user)
  Session.set('breadcrumbs', breadcrumbs)
}
