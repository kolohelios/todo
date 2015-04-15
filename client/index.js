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
  tasks.on('child_removed', taskRemoved);
  $('#todos').on('click', '.delete', deleteTask);
  $('#todos').on('change', 'input[type="checkbox"]', toggleComplete);
  tasks.on('child_changed', taskChanged);
}

function taskChanged(snapshot){
  var key = snapshot.key();
  var task = snapshot.val();
  var $tr = $('tr[data-key=' + key + ']');
  var checked = task.isComplete ? 'checked' : '""';
  $tr.removeClass().addClass(checked);
  $tr.find('input[type=checkout]').attr('checked', !!checked);
}

function toggleComplete(){
  var key = $(this).closest('tr').data('key');
  var unchecked = !!$(this).attr('checked');
  // if (!unchecked){
  //   $(this).prop('checked', true);
  //   $(this).parent().parent().addClass('checked');
  // }
  // else{
  //   $(this).prop('checked', false);
  //   $(this).parent().parent().removeClass('checked');
  // }
  tasks.child(key).update({isComplete: !unchecked});
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
  var checked = (task.isComplete) ? 'checked' : '""';
  var tr = '<tr class=' + checked + ' data-key=' + key + '><td><button class="delete">&times;</button></td><td><input type="checkbox" ' + checked + '></td><td>' + task.title + '</td><td>' + moment(task.dueDate).format('YYYY-MM-DD') + '</td><td>' + task.priority + '</td><td>' + moment(task.createdAt).format('YYYY-MM-DD') + '</td></tr>';
  $('#todos > tbody').append(tr);
}

function deleteTask(){
  var key = $(this).closest('tr').data('key');
  var task = tasks.child(key);
  task.remove();
}

function taskRemoved(snapshot){
  var key = snapshot.key();
  $('tr[data-key=' + key + ']').remove();
}
