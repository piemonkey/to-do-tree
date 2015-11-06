FlowRouter.route('/', {
  name: 'home',
  action: function() {
    Session.set('breadcrumbs', ['root'])
  }
})

FlowRouter.route("/:breadcrumbs", {
  name:'task',
  action: function(params, queryParams) {
    Session.set('breadcrumbs', params.breadcrumbs.split('-'))
  }
})
