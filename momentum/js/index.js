const imgSrc = ['1.jpg', '2.jpg', '3.jpg', '4.jpg'];
const quotesList = [{
    quote: "The purpose of our lives is to be happy.",
    author: "Dalai Lama"
}, {
    quote: " Life is what happens when you're busy making other plans.",
    author: "John Lennon"
}, {
    quote: "Get busy living or get busy dying.",
    author: "Stephen King"
}, {
    quote: "You only live once, but if you do it right, once is enough.",
    author: "Mae West"
}, {
    quote: "Design is not just what it looks like and feels like. Design is how it works.",
    author: "Steve Jobs"
}, {
    quote: "I want to put a ding in the universe.",
    author: "Steve Jobs"
}, {
    quote: "Innovation distinguishes between a leader and a follower.",
    author: "Steve Jobs"
}, {
    quote: "Being the richest man in the cemetery doesn't matter to me. Going to bed at night saying we've done something wonderful, that's what matters to me.",
    author: "Steve Jobs"
}, {
    quote: "Sometimes life is going to hit you in the head with a brick. Don't lose faith.",
    author: "Steve Jobs"
}, {
    quote: "It's better to be a pirate than to join the Navy.",
    author: "Steve Jobs"
}];

const loginContainer = document.querySelector('.loginContainer')
// 명언
const sayingWrap = document.querySelector('.sayingWrap')
const sayingQuote = document.querySelector('.sayingWrap .quote')
const sayingAuthor = document.querySelector('.sayingWrap .author')
const sayingNum = quotesList[Math.floor(Math.random() * quotesList.length)];
sayingQuote.innerHTML = sayingNum.quote;
sayingAuthor.innerHTML = ` - ${sayingNum.author} -`
const imgNum = imgSrc[Math.floor(Math.random() * imgSrc.length)];
sayingWrap.style.background = `url(images/${imgNum}) no-repeat center/cover`

// 로그인
const loginForm = document.querySelector('#loginForm')
const loginInput = document.querySelector('#loginForm input')

const header = document.querySelector('header');
const logoutBtn = document.querySelector('header .logout');
const userName = document.querySelector('header .userName');

//투두
const todoForm = document.querySelector('#todoForm');
const todoInput = document.querySelector('#todoForm input');
const todoList = document.querySelector('.todoList');

let todoArr = [];

if (localStorage.name == '' || localStorage.name != undefined ) {
    userName.innerHTML = localStorage.name;
    loginContainer.classList.remove('show')
}

//로그인 버튼 눌렀을 때
function loginBtnSubmit(e) { 
    e.preventDefault();
    localStorage.setItem('name', loginInput.value);
  
    //네임에 값이 있으면
    if (localStorage.name != '') {
        userName.innerHTML = localStorage.name;
        loginContainer.classList.remove('show')
    } else { 
        loginContainer.classList.add('show')
    }
}

//로그아웃 했을 때 로컬스토리지 전체 지우기
function localStorageClaer() { 
    const ul = document.querySelector(".todoList")
    const li = document.querySelector(".todoList li")

    // while (ul.hasChildNodes()) {	
    //     ul.removeChild(
    //       ul.firstChild
    //     );
    //   }

    localStorage.clear();
    location.reload();
    userName.innerHTML = "";
    loginContainer.classList.add('show');
    loginInput.value = "";
}


//투두리스트 그려지는 부분
function paintTodo(newTodo){ 
    const li = document.createElement("li");
    li.id = newTodo.id;
    
    const span = document.createElement("span");
    const button = document.createElement("button");

    li.appendChild(span);
    span.innerText = newTodo.text;
    todoList.appendChild(li)
    button.innerText = "❌";
    li.appendChild(button)

    button.addEventListener("click", deleteTodo);
}


//투두리스트 작성하고 엔터 눌렀을 때
function todoListSubmit(e) { 
    e.preventDefault();
    const newTodo = todoInput.value
    
    todoInput.value = "";
    const newTodoObj = {
        text: newTodo,
        id: Date.now()
    }
    todoArr.push(newTodoObj)
    console.log(todoArr)

    paintTodo(newTodoObj)
    saveTodo();

    const todoHeight = todoList.clientHeight
    if(todoHeight >= 320){
        todoList.scrollTop = todoList.scrollHeight;
    }

}

//로컬스토리지에 저장
function saveTodo() { 
    console.log('저장')
    localStorage.setItem("todo", JSON.stringify(todoArr));
}

//투두 지우기 버튼 눌렀을 때
function deleteTodo(e) {
    const li = e.target.parentElement;
    li.remove();
    todoArr = todoArr.filter((toDo) => toDo.id !== Number(li.id));
    saveTodo();
}

const saveTodoArr = JSON.parse(localStorage.getItem("todo"));
if (saveTodoArr != null) {
    todoArr = saveTodoArr;
    saveTodoArr.forEach(paintTodo)
    saveTodoArr.map(() => {paintTodo})
} 

//로그인
loginForm.addEventListener("submit", loginBtnSubmit)
//로그아웃 
logoutBtn.addEventListener("click", localStorageClaer)
//투두 입력
todoForm.addEventListener("submit", todoListSubmit)