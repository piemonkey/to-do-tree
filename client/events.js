Template.head.events({
  "change .hide-completed input": function (event) {
    Session.set("hideCompleted", event.target.checked);
  }
});

Template.lists.events({
  "submit .new-task": function(event) {
    event.preventDefault();
    var text = event.target.text.value;

    Meteor.call("addTask", text, this.valueOf());

    event.target.text.value = "";
  }
})

Template.task.events({
  "click .toggle-checked": function () {
    // Set the checked property to the opposite of its current value
    Meteor.call("setChecked", this._id, !this.checked);
  },
  "click .delete": function () {
    Meteor.call("deleteTask", this._id);
  },
  "click .toggle-public": function() {
    Meteor.call("setPublic", this._id, !this.public);
  },
});
