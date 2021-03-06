Template.head.helpers({
  hideCompleted: function () {
    return Session.get("hideCompleted");
  }
})

Template.lists.helpers({
  breadcrumbs: function() {
    return Session.get('breadcrumbs');
  }
})

Template.list.helpers({
  tasks: function(superTask) {
    var all = Tasks.find();
    var counts = {};
    var currentList = [];
    all.forEach(function(task) {
      if (task.parent === superTask) {
        if (! (Session.get("hideCompleted") && task.complete) ) {
          currentList.push(task);
        }
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
    currentList.sort(function(a, b) {
      return a.sortOrder - b.sortOrder;
    })
    return currentList;
  }
});

Template.task.helpers({
  childpath: function() {
    var oldBreadcrumbs = Session.get('breadcrumbs');
    var breadcrumbStubIndex = oldBreadcrumbs.lastIndexOf(this.parent) + 1;
    var newBreadcrumbs = oldBreadcrumbs.slice(0, breadcrumbStubIndex);
    if (! (oldBreadcrumbs[breadcrumbStubIndex] === this._id)) {
      newBreadcrumbs.push(this._id);
    }
    return FlowRouter.path('task', {
      breadcrumbs: newBreadcrumbs.join('-'),
    });
  },
  expanded: function() {
    return Session.get('breadcrumbs').indexOf(this._id) !== -1;
  }
});
