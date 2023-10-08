let addToTaskBtn = document.querySelector('#my_id');
var closeICon;
let count = 1
var checkbox;
let storedValueInLocal;
let inputValue;
let storedTodoList;
let getdata;
let myObject = {
    todos: []
};
getdata = [];
let  toFindDuplicates; 
let duplicateElementa;


addToTaskBtn.addEventListener('click', CreateLi);

document.getElementById('todoId').addEventListener('keypress',function(event){
        if(event.key === 'Enter'){
        CreateLi();
        }
    })


    // document.getElementById('myInput').addEventListener('keypress', function(event) {
    //     if (event.key === 'Enter') {
    //       // Handle Enter key press here
    //       console.log('Enter key pressed');
    //     }
    //   });



function todoinOnload() {
    storedTodoList = localStorage.getItem('storedValueInLocal');
    getdata = JSON.parse(storedTodoList);
    console.log('myvar is onload ', getdata);
    if (getdata.length >= 0 && getdata != 'null' && getdata != undefined && getdata != ' ') {
        console.log(getdata,'storedValueInLocal getdata')
        myObject.todos = getdata;
        console.log(myObject.todos,'storedValueInLocal todos')
        dynamicLI();
    } else {
        alert('data is not avilable');
    }
}
window.onload = todoinOnload;

function CreateLi() {

    inputValue = document.querySelector('#todoId').value;
    inputValue = inputValue.trim();

    const d = new Date();
    console.log(d,'date1111111');

    if (inputValue != '' & inputValue != undefined & inputValue != null) {
       // myObject.todos.push(inputValue);
       let xyz =  myObject.todos.filter(item =>item.Text == inputValue)
       if(xyz.length==0){
        myObject.todos.push({
            Text:inputValue,
            completed: false,
            currentDate:d
           })
       }
       else{
        alert('this value already exists')
       }
      
        // set data in localStorage
        //let a =  myObject.todos.filter((item, index) => arr.indexOf(item) === index);
        //removeDuplicates(myObject.todos)
        

        function removeDuplicates(arr) {
            return arr.filter((item,index) =>arr.indexOf(item) === index
            );
        }    

        // function removeDuplicates(arr) {
        //     return arr.filter((item,index) =>   {
        //             console.log('arrryyyINdexOF',arr.indexOf(item));
        //             console.log('arrryyyyIndex', index);
        //             console.log('arrryyyyresult',arr.indexOf(item) === index);
        //            return arr.indexOf(item) === index;
        //         }
        //     );
        // }    

        console.log(removeDuplicates(myObject.todos),'testing123');
            // {
            //     console.log('arrryyyy',arr.indexOf(item.Text) === index)
            // }
           // arr.indexOf(item.Text) === index;
           //console.log('arrryyyy',arr.indexOf(arr[index].Text) === index)
           //arr.indexOf(item.Text) == index
           

       

        localStorage.setItem('storedValueInLocal', JSON.stringify(myObject.todos));
        // retrive data in from localStorage 
        storedTodoList = localStorage.getItem('storedValueInLocal');
        // Convert the JSON string back to a JavaScript object
        getdata = JSON.parse(storedTodoList);
        dynamicLI()
        document.querySelector('#todoId').value = "";
   }
     else {
         alert('input field should not  be blank');
     }
}




function dynamicLI() {
    let todoList = document.querySelector("#todo-list");
    todoList.innerHTML = "";
    getdata.forEach((element, index) => {
        // console.log(myObject.todos,'element-----61');
        let newLi1 = document.createElement('li');
        let newLi2 = document.createElement('span');
        newLi1.innerHTML = element.Text;
        newLi2.innerHTML = element.currentDate;
        checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.name = "name";
        checkbox.checked = element.completed;
        checkbox.placeholder = 'Plese add your Task'
        checkbox.id = index;
        //isChecked = myObject.todos.indexOf(element) !== -1; // check if the item should be checked
        //console.log('isChecked------<<<',isChecked);
        //checkbox.checked = false; // set the checked property based on isChecked
        newLi1.insertAdjacentElement('afterbegin', checkbox);
        
        todoList.appendChild(newLi1);
        newLi1.appendChild(newLi2);
        
        checkbox.addEventListener('change', function (event) {
            // console.log(getdata[index].completed,'element-----76');
            if (this.checked) {
                getdata[index].completed =true;
               // newLi1.style.textDecoration= "line-through";
                localStorage.setItem('storedValueInLocal', JSON.stringify(myObject.todos));
                myObject.todos = getdata;
                console.log(myObject.todos,'element-----80');
              //  dynamicLI()
                creteDeleteicon(newLi1);
            } else {
                removeDeleteIcon(newLi1);
                getdata[index].completed =false;
                localStorage.setItem('storedValueInLocal', JSON.stringify(myObject.todos));
            }
        });

        if (getdata[index].completed == true) {
            console.log(this.checked,'this.checked');
            newLi1.style.textDecoration= "line-through";
            creteDeleteicon(newLi1);
        }
      
       
        

    });
}

// function dynamicCheckbox() {
//     checkbox.addEventListener('change', function (event) {
//         if (this.checked) {
//             let ele = event.target.closest('li')
//             console.log(ele,'ele--->>13')
//             creteDeleteicon(ele);
//         }
//         else {
//             let ele2 = event.target.closest('li').children
//             Array.from(ele2).forEach(el => {
//                 if (el.tagName === 'SPAN') {
//                     el.remove();
//                 }
//             });
//         }
//     })
// }

function creteDeleteicon(ele) {
    closeICon = `<i class="fa fa-close" onclick="deltIcon(this)"></i>`;
    const myspan = document.createElement('span');
    myspan.innerHTML = closeICon
    ele.appendChild(myspan);
    // document.getElementById("myElement").style.cssText = "display: block; position: absolute";
    // console.log(ele,'element-----76');
    ele.style.textDecoration= "line-through";
    
}

function removeDeleteIcon(ele) {
    console.log('newLi1',ele);
    ele.style.textDecoration= "unset";
    myvar = false;
    let ele2 = ele.closest('li').children
    Array.from(ele2).forEach(el => {
        if (el.tagName === 'SPAN') {
            el.remove();
        }
    });
}

function deltIcon(ele) {
    let indexid = ele.closest('li').querySelector('input').getAttribute('id');
    //myObject.todos.splice(indexid, 1);
    myObject.todos.splice(indexid, 1);
    localStorage.setItem('storedValueInLocal', JSON.stringify(myObject.todos));
    console.log(storedValueInLocal,'storedValueInLocal dlt icon')
    todoinOnload();
}









