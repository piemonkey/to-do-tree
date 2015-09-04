Tasks = new Mongo.Collection("tasks");

if (Meteor.isServer) {
    Meteor.publish("tasks", function(userId) {
      return Tasks.find({
        $and: [
          { owner: userId },
          { $or: [
            { public: {$eq: true}},
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
  setPublic: function(taskId, setToPublic) {
    var task = Tasks.findOne(taskId);
    checkAuthorised(task);
    Tasks.update(taskId, { $set: {public: setToPublic} });
  }
});

function checkAuthorised(task) {
  if (task.owner !== Meteor.userId()) {
    throw new Meteor.Error("not-authorised");
  }
}
