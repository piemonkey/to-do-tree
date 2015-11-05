Tasks = new Mongo.Collection("tasks");

if (Meteor.isServer) {
  Meteor.publish("tasks", function(owner) {
    var ownerId = Meteor.users.findOne({ username : owner}, { _id : 1 })._id;
    return Tasks.find({
      $and: [
        { owner: ownerId },
        { $or: [
          { public: true },
          { owner: this.userId }
        ]}
      ]
    });
  })
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
  setPublic: function(taskId, setToPublic) {
    var task = Tasks.findOne(taskId);
    checkAuthorised(task);
    Tasks.update(taskId, { $set: {public: setToPublic} });
  }
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
