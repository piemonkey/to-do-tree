Tasks = new Mongo.Collection("tasks");

if (Meteor.isServer) {
    Meteor.publish("tasks", function(userId) {
      return Tasks.find({
        $and: [
          { owner: userId },
          { $or: [
            { private: {$ne: true}},
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
    var parent;
    if (parentId != 'root') {
      parent = Tasks.findOne(parentId);
      if (! parent) {
        new Meteor.Error('Parent task ' + parentId + ' does not exist');
      }
      checkAuthorised(parent);
    }

    Tasks.insert({
      text: text,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username,
      parent: parentId
    });
  },
  deleteTask: function(taskId) {
    var task = Tasks.findOne(taskId);
    checkAuthorised(task);
    Tasks.remove(taskId);
  },
  setChecked: function(taskId, setChecked) {
    var task = Tasks.findOne(taskId);
    checkAuthorised(task);
    Tasks.update(taskId, { $set: {checked: setChecked} });
  },
  setPrivate: function(taskId, setToPrivate) {
    var task = Tasks.findOne(taskId);
    checkAuthorised(task);
    Tasks.update(taskId, { $set: {private: setToPrivate} });
  }
});

function checkAuthorised(task) {
  if (task.owner !== Meteor.userId()) {
    throw new Meteor.Error("not-authorised");
  }
}
