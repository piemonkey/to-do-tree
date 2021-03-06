Tasks = new Mongo.Collection("tasks");

if (Meteor.isServer) {
  Meteor.publish("tasks", function() {
    return Tasks.find({ owner: this.userId })
  })
}

if (Meteor.isClient) {
  Meteor.subscribe("tasks")
}

Meteor.methods({
  addTask: function(text, parentId) {
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorised");
    }
    checkParentValid(parentId);

    var highestSortOrder = 0
    Tasks.find({
      $and: [
        { owner: Meteor.userId() },
        { parent: parentId }
      ]
    }, { fields: {sortOrder: 1}}).forEach(function(task) {
      if (highestSortOrder < task.sortOrder) {
        (highestSortOrder = task.sortOrder);
      }
    });

    Tasks.insert({
      text: text,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username,
      parent: parentId,
      sortOrder: highestSortOrder + 10
    });
  },
  updateTask: function(task, updates) {
    checkAuthorised(task);
    checkParentValid(task.parent);

    Tasks.update({_id: task._id}, {$set: updates});
  },
  deleteTask: function(taskId) {
    var task = Tasks.findOne(taskId);
    checkAuthorised(task);
    Tasks.remove(taskId);
  },
  setComplete: function(taskId, setComplete) {
    var task = Tasks.findOne(taskId);
    checkAuthorised(task);
    Tasks.update(taskId, { $set: {complete: setComplete} });
  },
});

function checkParentValid(parentId) {
  var parent;
  if (parentId != 'root') {
    parent = Tasks.findOne(parentId);
    if (! parent) {
      new Meteor.Error('Parent task ' + parentId + ' does not exist');
    }
    checkAuthorised(parent);
  }
}

function checkAuthorised(task) {
  if (task.owner !== Meteor.userId()) {
    throw new Meteor.Error("not-authorised");
  }
}
