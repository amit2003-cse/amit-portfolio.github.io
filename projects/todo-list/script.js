document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('todoForm');
    const input = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');
    const emptyState = document.getElementById('emptyState');
    const completedCountEl = document.getElementById('completedCount');
    const totalCountEl = document.getElementById('totalCount');

    let tasks = JSON.parse(localStorage.getItem('amit_todos')) || [];

    function saveTasks() {
        localStorage.setItem('amit_todos', JSON.stringify(tasks));
        updateStats();
    }

    function updateStats() {
        const total = tasks.length;
        const completed = tasks.filter(t => t.completed).length;
        totalCountEl.textContent = total;
        completedCountEl.textContent = completed;
        
        if (total === 0) {
            emptyState.classList.add('visible');
        } else {
            emptyState.classList.remove('visible');
        }
    }

    function renderTasks() {
        taskList.innerHTML = '';
        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;
            
            li.innerHTML = `
                <div class="checkbox" onclick="toggleTask(${index})">
                    <i class="fas fa-check"></i>
                </div>
                <span class="task-text">${escapeHTML(task.text)}</span>
                <button class="delete-btn" onclick="deleteTask(${index})" title="Delete task">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            taskList.appendChild(li);
        });
        updateStats();
    }

    window.toggleTask = function(index) {
        tasks[index].completed = !tasks[index].completed;
        saveTasks();
        renderTasks();
        
        if (tasks[index].completed) {
            triggerConfetti();
        }
    };

    window.deleteTask = function(index) {
        const item = taskList.children[index];
        item.classList.add('removing');
        
        setTimeout(() => {
            tasks.splice(index, 1);
            saveTasks();
            renderTasks();
        }, 300);
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = input.value.trim();
        if (text) {
            tasks.unshift({ text, completed: false }); // Add to top
            input.value = '';
            saveTasks();
            renderTasks();
        }
    });

    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag])
        );
    }

    function triggerConfetti() {
        if (typeof confetti === 'function') {
            confetti({
                particleCount: 50,
                spread: 60,
                origin: { y: 0.8 },
                colors: ['#58a6ff', '#8b5cf6', '#2ea043']
            });
        }
    }

    renderTasks();
});
