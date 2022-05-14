const todoUl = document.querySelector(".to-do-lists-ul");
const todoNotesItems = document.querySelector(".to-do-notes-items");
const todoNotesItemsAll = document.querySelectorAll(".to-do-notes-items");
const todoComplete = document.querySelector(".completed");
const button = document.querySelector(".btn-add-note");
const div = document.querySelector(".notes-div");
const divCompletedTasks = document.querySelector(".div-completed-tasks");
const activeNotes = document.querySelector(".active-notes");
const inputNote = document.querySelector(".input-note");
const notesForm = document.querySelector(".notes-form");
const inputList = document.querySelector(".lists-input");
const listsForm = document.querySelector(".lists-form");
const toDoNotes = document.querySelector(".to-do-notes");
const notesH1 = document.querySelector(".notes-h1")
const notesHeader = document.querySelector(".notes-header");
const trash = document.querySelector(".trash");
const tasksToDo = document.querySelector(".tasks-to-do");
const tasksComplete = document.querySelector(".div-completed-tasks");
const divTasksToDo = document.querySelector(".div-tasks-to-do");
const clearCompletedTasks = document.querySelector(".clear-completed-tasks");

const todosId = "todo123";
const activeId = "active123";

let todos = JSON.parse(localStorage.getItem(todosId)) || [];
let isActive = JSON.parse(localStorage.getItem(activeId)) || [];

const renderTodos = (isItTrue) => {
    removeElements(todoUl);

    for (let todo of todos) {
        const li = document.createElement("li");
        li.dataset.todoId = todo.id;
        li.classList.add("todoLi")

        if (isActive.length > 0) {
            if (todo.id === isActive[0].id) {
                li.classList.add("isActive");
            }
        }
        if (isItTrue && isItTrue == todo.id) {
            isItTrueFunc(li);
        }
        li.textContent = todo.name;
        todoUl.append(li);
    }
    if (isActive.length === 0) {
        toDoNotes.style.display = "none";
    }
    else {
        toDoNotes.style.display = "";
        renderNotes();
    }
}

todoUl.addEventListener("click", (e) => {

    if (e.target.childNodes[0].data) {
        let todo = todos.find(t => t.id == e.target.dataset.todoId);
        if (isActive.length > 0) {
            if (isActive[0].id == e.target.dataset.todoId) {
                isActive = [];
                saveLocalStorage();
                renderTodos();
            }
            else {
                isActive = [todo];
                saveLocalStorage();
                renderTodos();
            }
        }
        else if (todo) {
            isActive = [todo];
            saveLocalStorage();
            renderTodos();
        }
    }
})


button.addEventListener("click", (e) => {
    const toggle = document.querySelector(".input-note-two");
    if (!toggle) {
        button.innerText = "Hide Task Form";
    }
    else {
        button.innerText = "Show Task Form";
    }
    notesForm.classList.toggle("input-note-two");
});



const renderNotes = (isItTrue) => {
    removeElements(todoNotesItems);
    removeElements(todoComplete);

    const p = document.querySelector(".no-notes");
    const pComp = document.querySelector(".no-notes-completed");

    if (p) p.remove();
    if (pComp) pComp.remove();

    const completedSum = isActive[0].items.reduce((sum, arr) => arr.complete ? sum += 1 : sum, 0);
    const incompleteSum = isActive[0].items.reduce((sum, arr) => !arr.complete ? sum += 1 : sum, 0);

    if (incompleteSum == 0 || isActive[0].items.length === 0) {
        noItemsYet("incomplete", divTasksToDo, activeNotes);
    }
    if (completedSum == 0 || isActive[0].items.length === 0) {
        noItemsYet("completed", tasksComplete, todoComplete);
    }
    if (completedSum > 0 && isActive[0].items.length > 0) {
        clearCompletedTasks.classList.add("show-clear-completed-tasks");
    }

    for (let todo of isActive[0].items) {
        //parentDiv
        const parentDiv = document.createElement("div");
        parentDiv.dataset.noteId = todo.id;
        parentDiv.classList.add("noteLi");
        //WrapLabelDiv
        const wrapLabelDiv = document.createElement("div");
        wrapLabelDiv.classList.add("div-wrap-label");
        wrapLabelDiv.dataset.noteId = todo.id;
        //Checkbox
        const checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.id = todo.id;
        checkbox.dataset.noteId = todo.id;
        //purple-trash
        const img = document.createElement("img");
        img.src = "./icons/purple-trash.svg";
        img.classList.add("purple-trash");
        img.dataset.trashId = todo.id;
        //Label
        const label = document.createElement("label");
        label.setAttribute("htmlFor", todo.id);
        label.dataset.noteId = todo.id;
        label.innerText = todo.name;
        label.setAttribute("htmlFor", todo.id);
        label.dataset.noteId = todo.id;

        if (isItTrue && isItTrue == todo.id) {
            isItTrueFunc(parentDiv);
        }
        if (!todo.complete) {
            wrapLabelDiv.append(checkbox, label);
            parentDiv.append(wrapLabelDiv, img);
            todoNotesItems.append(parentDiv);
        }
        else {
            checkbox.checked = true;
            label.classList.add("note-completed");
            wrapLabelDiv.append(checkbox, label);
            parentDiv.append(wrapLabelDiv, img);
            todoComplete.append(parentDiv);
        }
    }
    notesH1.textContent = isActive[0].name;
}

notesForm.addEventListener("submit", (e) => {
    submitHandler(inputNote.value, "notes", e);
    inputNote.value = "";
});

listsForm.addEventListener("submit", (e) => {
    submitHandler(inputList.value, "lists", e);
    inputList.value = "";
});

todoNotesItems.addEventListener("click", (e) => {
    todosClickHandler(e.target.dataset.trashId, e.target.dataset.noteId);
})

todoComplete.addEventListener("click", (e) => {
    todosClickHandler(e.target.dataset.trashId, e.target.dataset.noteId);
})

trash.addEventListener("click", () => {

    for (let ul of todoUl.children) {
        if (ul.dataset.todoId == isActive[0].id) {
            ul.classList.add("removeTodo");
            toDoNotes.classList.add("removeTodo");
        }
    }

    setTimeout(() => {
        for (let ul of todoUl.children) {
            if (ul.dataset.todoId == isActive[0].id) {
                ul.classList.remove("removeTodo");
                toDoNotes.classList.remove("removeTodo");
            }
        }
        todos = todos.filter(t => t.id != isActive[0].id);
        isActive = [];
        saveLocalStorage();
        renderTodos();
    }, 600);
});

clearCompletedTasks.addEventListener("click", () => {

    isActive[0].items = isActive[0].items.filter(item => !item.complete);
    for (let item of todoComplete.children) {
        item.classList.add("removeTodo");
    }

    setTimeout(() => {
        saveLocalStorage();
        renderNotes();
    }, 600);
});

const submitHandler = (value, name, e) => {
    e.preventDefault();
    if (value && value.trim().length > 0) {
        const objElement = name == "lists" ? { items: [] } : { complete: false };
        const newItem = { id: Math.random(), name: value, ...objElement };
        console.log(name)
        if (name === "lists") {
            todos.push(newItem);
            renderTodos(newItem.id);
            saveLocalStorage();
            value = "";
        }
        else {
            isActive[0].items.push(newItem);
            renderNotes(newItem.id);
            saveLocalStorage();
            value = "";
        }
    }
}

const todosClickHandler = (trashId, noteId) => {

    isActive[0].items.forEach((item) => {
        if (item.id == trashId) {
            const allNotes = [...todoNotesItemsAll[0].children, ...todoNotesItemsAll[1].children];
            for (let i of allNotes) {
                if (i.dataset.noteId == trashId) {
                    i.classList.add("removeTodo");
                }
            }
            setTimeout(() => {
                isActive[0].items = isActive[0].items.filter(i => i.id != trashId);
                saveLocalStorage();
                renderNotes();
            }, 600)
        }
        if (item.id == noteId) {
            item.complete = !item.complete;
            saveLocalStorage();
            renderNotes();
        }
    })
}

const saveLocalStorage = () => {
    if (isActive && isActive.length > 0) {
        for (let todo of todos) {
            if (todo.id == isActive[0].id) {
                todo = isActive[0];
            }
        }
    }
    localStorage.setItem(todosId, JSON.stringify(todos));
    localStorage.setItem(activeId, JSON.stringify(isActive));
}

const removeElements = (elements) => {
    while (elements.lastChild) {
        elements.lastChild.remove();
    }
}

function noItemsYet(name, parent, beforeElement) {
    const p = document.createElement("p");
    p.classList.add(name === "completed" ? "no-notes-completed" : "no-notes");
    p.innerText = name === "completed" ? "No task completed yet..." : "No task to do..."
    parent.insertBefore(p, beforeElement);
    if (name === "completed") {
        clearCompletedTasks.classList.contains("show-clear-completed-tasks")
            && clearCompletedTasks.classList.remove("show-clear-completed-tasks");
    }
}

isItTrueFunc = (element) => {
    element.classList.add("newLi-added");
    setTimeout(() => {
        element.classList.remove("newLi-added");
    }, 1000)
}

renderTodos();






