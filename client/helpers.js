Template.body.helpers({
  showLanding: function() {
    return (! Session.get('user')) || Session.get('user') === '';
  }
})

Template.head.helpers({
  hideCompleted: function () {
    return Session.get("hideCompleted");
  }
})

Template.lists.helpers({
  isOwner: function() {
    var owner = false;
    if (Meteor.user()) {
      owner = Session.get('user') === Meteor.user().username;
    }
    return owner;
  },
  breadcrumbs: function() {
    return Session.get('breadcrumbs');
  },
  tasks: function(superTask) {
    var constraints = {};
    if (Session.get("hideCompleted")) {
      constraints.complete = {$ne: true};
    }
    var all = Tasks.find(constraints, {sort: {createdAt: -1}});
    var counts = {};
    var currentList = [];
    all.forEach(function(task) {
      if (task.parent === superTask) {
        currentList.push(task);
      } else {
        if (counts[task.parent]) {
          counts[task.parent].children++;
          task.complete || counts[task.parent].unfinishedChildren++;
        } else {
          counts[task.parent] = {};
          counts[task.parent].children = 1;
          counts[task.parent].unfinishedChildren = task.complete ? 0 : 1;
        }
      }
    });
    currentList.forEach(function (task) {
      if (counts[task._id]) {
        task.children = counts[task._id].children;
        task.unfinishedChildren = counts[task._id].unfinishedChildren;
      }
    });
    return currentList;
  }
});

Template.task.helpers({
  childpath: function() {
    var newBreadcrumb = Session.get('breadcrumbs');
    var breadcrumbStubIndex = newBreadcrumb.lastIndexOf(this.parent) + 1;
    newBreadcrumb = newBreadcrumb.slice(0, breadcrumbStubIndex);
    newBreadcrumb.push(this._id);
    return FlowRouter.path('user-task', {
      user: Session.get('user'),
      breadcrumbs: newBreadcrumb.join('-')
    });
  },
  isOwner: function() {
    return Session.get('user') === Meteor.user().username;
  },
  expanded: function() {
    return Session.get('breadcrumbs').indexOf(this._id) !== -1;
  }
});
