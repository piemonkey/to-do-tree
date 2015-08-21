var Tasks = new Mongo.Collection("tasks");

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

  Template.head.helpers({
    isOwner: function() {
      return Session.get('userId') === Meteor.userId();
    },
    hideCompleted: function () {
      return Session.get("hideCompleted");
    }
  })

  Template.head.events({
    "submit .new-task": function(event) {
      event.preventDefault();
      var text = event.target.text.value;

      Meteor.call("addTask", text);

      event.target.text.value = "";
    },
    "change .hide-completed input": function (event) {
      Session.set("hideCompleted", event.target.checked);
    }
  });

  Template.todo.helpers({
    tasks: function() {
      if (Session.get("hideCompleted")) {
        // If hide completed is checked, filter tasks
        return Tasks.find({checked: {$ne: true}}, {sort: {createdAt: -1}});
      } else {
        // Otherwise, return all of the tasks
        return Tasks.find({}, {sort: {createdAt: -1}});
      }
    }
  });

  Template.task.helpers({
    isOwner: function() {
      return Session.get('userId') === Meteor.userId();
    }
  });

  Template.task.events({
    "click .toggle-checked": function () {
      // Set the checked property to the opposite of its current value
      Meteor.call("setChecked", this._id, !this.checked);
    },
    "click .delete": function () {
      Meteor.call("deleteTask", this._id);
    },
    "click .toggle-private": function() {
      Meteor.call("setPrivate", this._id, !this.private);
    }
  });

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });
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
