Tasks = new Mongo.Collection("tasks");

if (Meteor.isServer) {
    Meteor.publish("tasks", function() {
      return Tasks.find({
        $or: [
          { private: {$ne: true}},
          { owner: this.userId }
        ]
      });
    })
}

if (Meteor.isClient) {
  Meteor.subscribe("tasks");
}

Meteor.methods({
  addTask: function(text) {
    if (!Meteor.userId()) {
      throw new Meteor.Error("not-authorised");
    }

    Tasks.insert({
      text: text,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username
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

    if (task.owner !== Meteor.userId()) {
      throw new Meteor.Error("not-authorised");
    }

    Tasks.update(taskId, { $set: {private: setToPrivate} });
  }
});

function checkAuthorised(task) {
  if (task.private && task.owner !== userId) {
    throw new Meteor.Error("not-authorised");
  }
}
