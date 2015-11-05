Template.list.rendered = function() {
  this.$('.todo-list').sortable({
    // config
    connectWith: '.todo-list',
    // events
    stop: function(event, ui) {
      var moved = ui.item.get(0);
      var before = ui.item.prev('li').get(0);
      var after = ui.item.next('li').get(0);
      var parent = ui.item.parent('ul').get(0);

      var updates = {};
      var task = Blaze.getData(moved);
      if (Session.get('breadcrumbs').indexOf(task._id) === -1) {
        updates.parent = Blaze.getData(parent);
        task.parentId = updates.parent;
      }
      var beforeOrder = before == null ? 0 : Blaze.getData(before).sortOrder;
      var afterOrder = after == null ? beforeOrder + 20 : Blaze.getData(after).sortOrder;
      updates.sortOrder = (afterOrder - beforeOrder) / 2 + beforeOrder;
      task.sortOrder = updates.sortOrder;

      if (Object.keys(updates).length != 0) {
        Meteor.call('updateTask', task, updates);
      }
    }
  })
}
