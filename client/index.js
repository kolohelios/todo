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
  tasks.on('child_added', taskAdded);
  $('#todos').on('click', '.delete', deleteTask);
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

function taskAdded(snapshot){
  var task = snapshot.val();
  var key = snapshot.key();
  console.log(key);
  var tr = '<tr data-key' + key + '><td><button class="delete">&times;</button></td><td><input type="checkbox" '+ ((task.isComplete) ? "checked" : "") + '></td><td>' + task.title + '</td><td>' + moment(task.dueDate).format('YYYY-MM-DD') + '</td><td>' + task.priority + '</td><td>' + moment(task.createdAt).format('YYYY-MM-DD') + '</td></tr>';
  $('#todos > tbody').append(tr);
}

function deleteTask(){
  
}
