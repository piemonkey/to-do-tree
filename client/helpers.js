Template.body.helpers({
  showLanding: function() {
    return (! Session.get('userId')) || Session.get('userId') === '';
  }
})

Template.head.helpers({
  isOwner: function() {
    return Session.get('userId') === Meteor.userId();
  },
  hideCompleted: function () {
    return Session.get("hideCompleted");
  }
})

Template.lists.helpers({
  breadcrumbs: function() {
    return Session.get('breadcrumbs');
  },
  tasks: function(superTask) {
    var constraints = {};
    if(superTask) {
      constraints.parent = superTask;
    }
    if (Session.get("hideCompleted")) {
      constraints.checked = {$ne: true};
    }
    return Tasks.find(constraints, {sort: {createdAt: -1}});
  }
});

Template.task.helpers({
  childpath: function(task) {
    var newBreadcrumb = Session.get('breadcrumbs')
    newBreadcrumb.push(task._id);
    return FlowRouter.path('user-task', {
      userId: Session.get('userId'),
      breadcrumbs: newBreadcrumb.join('-')
    });
  },
  isOwner: function() {
    return Session.get('userId') === Meteor.userId();
  }
});