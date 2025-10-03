let todos = [];
let filterState = 'all'; // 'all' | 'done' | 'undone'

function addTodo() {
    const todoInput = document.getElementById("todo-input");
    const todoDate = document.getElementById("todo-date");

    if (validateInput(todoInput.value, todoDate.value)) {
        /// Add new todo to the array
        let todo = { task: todoInput.value, date: todoDate.value, completed: false };
        todos.push(todo);

        /// Render the updated todo list
        renderTodo();
        updateFilterCounts();
    }
    /// Clear input fields
    todoInput.value = '';
    todoDate.value = '';    
}


function deleteAllTodo() {
    // Ask for confirmation in Indonesian before deleting all
    const confirmed = confirm('Apakah kamu yakin ingin menghapus semua todo?');
    if (!confirmed) return;

    /// Clear the todos array
    todos = [];

    /// Render the empty todo list
    renderTodo();
    updateFilterCounts();
}


function renderTodo() {
    // Get the todo list container
    const todoList = document.getElementById("todo-list");

    /// Clear existing list
    todoList.innerHTML = '';

    if (todos.length === 0) {
        todoList.innerHTML = `<p class="text-center text-black">No todos yet. Add one above!</p>`;
        return;
    }

    // Build a list of visible items while preserving original indexes for actions
    const visibleItems = todos
        .map((todo, idx) => ({ todo, idx }))
        .filter(({ todo }) => {
            if (filterState === 'all') return true;
            if (filterState === 'done') return todo.completed === true;
            if (filterState === 'undone') return todo.completed === false;
            return true;
        });

    if (visibleItems.length === 0) {
        todoList.innerHTML = `<p class="text-center text-gray-500">No todos match the selected filter.</p>`;
        return;
    }

    visibleItems.forEach(({ todo, idx }) => {
        const completedClass = todo.completed ? 'line-through text-black' : '';
        const doneLabel = todo.completed ? 'Undone' : 'Done';
        todoList.innerHTML += `<li class="rounded-lg p-2 mb-2 flex justify-between items-center" style="background:#FFECC0;">
            <div>
                <p class="font-bold ${completedClass}" style="color:black">${todo.task}</p>
                <p class="text-sm ${completedClass}" style="color:black">${todo.date}</p>
            </div>
            <div class="flex gap-2">
                <button onclick="toggleDone(${idx})" class="p-1 rounded" style="background:#F39F9F;color:black">${doneLabel}</button>
                <button onclick="deleteTodo(${idx})" class="p-1 rounded" style="background:#B95E82;color:white">Delete</button>
                <button onclick="editTodo(${idx})" class="p-1 rounded" style="background:#B95E82;color:white">Edit</button>
            </div>
        </li>`;
    });
}

function deleteTodo(index) {
    // Ask for confirmation in Indonesian before deleting this todo
    const confirmed = confirm('Apakah kamu yakin ingin menghapus list ini?');
    if (!confirmed) return;

    /// Remove the todo item at the specified index
    todos.splice(index, 1);
    /// Render the updated todo list
    renderTodo();
    updateFilterCounts();
}   

function editTodo(index) {
    ///edit todo functionality
    const todo = todos[index];
    document.getElementById("edit-todo-input").value = todo.task;
    document.getElementById("edit-todo-date").value = todo.date;    
    document.getElementById("save-edit-btn").setAttribute("onclick", `saveEdit(${index})`);
    document.getElementById("edit-popup").classList.remove("hidden");   
}

function saveEdit(index) {
    const editTodoInput = document.getElementById("edit-todo-input").value.trim();
    const editTodoDate = document.getElementById("edit-todo-date").value;

    // Validate
    if (!validateInput(editTodoInput, editTodoDate)) {
        return;
    }

    // Update the todo
    todos[index] = { task: editTodoInput, date: editTodoDate };

    // Hide popup and re-render
    document.getElementById('edit-popup').classList.add('hidden');
    renderTodo();
    updateFilterCounts();
}

function toggleDone(index) {
    if (todos[index]) {
        todos[index].completed = !todos[index].completed;
        renderTodo();
        updateFilterCounts();
    }
}

function updateFilterCounts() {
    const select = document.getElementById('filter-select');
    if (!select) return;
    const total = todos.length;
    const done = todos.filter(t => t.completed).length;
    const undone = total - done;

    // Update option labels while keeping their values
    for (let opt of select.options) {
        if (opt.value === 'all') opt.text = `All (${total})`;
        if (opt.value === 'done') opt.text = `Done (${done})`;
        if (opt.value === 'undone') opt.text = `Undone (${undone})`;
    }
}

function validateInput(todo, date) {
    /// Check if fields are empty
    if (todo === '' || date === '') {
        /// Show an alert if validation fails
        alert("Mohon isi semua field!");
        return false;
    }

    /// Input is valid
    return true;
}

// Ensure modal buttons are wired even if DOM is ready after script load
document.addEventListener('DOMContentLoaded', () => {
    const saveBtn = document.getElementById('save-edit-btn');
    const cancelBtn = document.getElementById('cancel-edit-btn');

    if (saveBtn) {
        // If save button already has an onclick from editTodo, this will not overwrite it.
        saveBtn.addEventListener('click', (e) => {
            // If saveBtn has an onclick attribute with saveEdit(index), that will run too.
            // This handler is a fallback for cases where the attribute wasn't set.
            const onclickAttr = saveBtn.getAttribute('onclick');
            if (!onclickAttr) {
                // Try to find the currently editing index from a data attribute
                const idx = saveBtn.dataset.editIndex;
                if (idx !== undefined) {
                    saveEdit(Number(idx));
                }
            }
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            document.getElementById('edit-popup').classList.add('hidden');
        });
    }

    // Wire filter select combo box
    const filterSelect = document.getElementById('filter-select');
    if (filterSelect) {
        // initialize
        filterSelect.value = filterState;
        filterSelect.addEventListener('change', (e) => {
            filterState = e.target.value;
            renderTodo();
        });
    }
    // initialize filter counts on load
    updateFilterCounts();
});
