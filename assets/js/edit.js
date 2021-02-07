//UI variables 
const form = document.querySelector('#task-form'); //The form at the top
const taskInput = document.querySelector('#task'); //the task input text field

//read from q string 
const urlParams = new URLSearchParams(window.location.search);
const id = Number(urlParams.get('id'));
//DB
var DB;

// Add Event Listener [on Load]
document.addEventListener('DOMContentLoaded', () => {
    // create the database
    let TasksDB = indexedDB.open('tasks', 1);

    // if there's an error
    TasksDB.onerror = function() {
            console.log('There was an error');
        }
        // if everything is fine, assign the result to the instance
    TasksDB.onsuccess = function() {
        // console.log('Database Ready');

        // save the result
        DB = TasksDB.result;

        // display the Task 
        displayTask();
    }


    function displayTask() {

        var transaction = DB.transaction(['tasks']);
        var objectStore = transaction.objectStore('tasks');
        var request = objectStore.get(id);

        request.onsuccess = function(event) {
            if (request.result) {
                taskInput.value = request.result.taskname;

            } else {
                console.log('No data record');
            }
        };

        request.onerror = function(event) {
            console.log('Transaction failed');
        };



    }


    form.addEventListener('submit', updateTask);

    function updateTask(e) {
        e.preventDefault();
        // Check empty entry
        if (taskInput.value === '') {
            taskInput.style.borderColor = "red";

            return;
        }

        /* 
        Instruction set to handle Update

        1. Declare the transaction and object store objects 
        2. Use the id on put method of index db
        
        */
        let transaction = DB.transaction('tasks', 'readwrite');
        let objectStore = transaction.objectStore('tasks');
        let req = objectStore.openCursor()
        req.onerror = function (e) {
            console.log("Transaction Failed");
        };


        req.onsuccess = function (e) {
            let cursor = e.target.result;
            let newTask = {
                taskname: taskInput.value,
                date: Date.now(),
                id: id
            }

            if (cursor) {
                
                if(cursor.value.id == id){
                    
                
                var res = cursor.update(newTask);
                res.onsuccess = function (e) {
                    console.log("update success!!");
                }
                res.onerror = function (e) {
                    console.log("update failed!!");
                }

            }
            cursor.continue();
        }
        else {
            console.log("No recorded data");
        }
        
        history.back();
    }

    }


});