'use strict';
/* global Firebase: true */

$(document).ready(init);

var root, user, tasks;

function init(){
  $('#set-name').click(setName);
  root = new Firebase('https://todo-kolohelios.firebaseio.com/');
  user = root.child('user');
  tasks = root.child('tasks');
  user.on('value', userChanged);
  $('#create-task').click(createTask);

}

function setName(){
  var name = $('#name').val();
  user.set(name);
  $('#name').val('');
}

function userChanged(snapshot){
  var name = snapshot.val();
  $('#header').text('Todo : ' + name);
}

function createTask(){
  var title = $('#title').val();
  var dueDate = $('#due-date').val();
  dueDate = new Date(dueDate);
  dueDate = dueDate.getTime();
  var priority = $('#priority').val();
  var isComplete = false;
  var createdAt = Firebase.ServerValue.TIMESTAMP;
  var task = {
    title: title,
    dueDate: dueDate,
    priority: priority,
    isComplete: isComplete,
    createdAt: createdAt
  };
  tasks.push(task);
}
