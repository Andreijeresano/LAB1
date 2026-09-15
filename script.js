const defaultTasks = [
  { id: 1, title: 'Create the initial HTML webpage', subject: 'Web Development', priority: 'High', due: '2026-09-16', completed: true },
  { id: 2, title: 'Add CSS styling and responsive layout', subject: 'Web Development', priority: 'High', due: '2026-09-18', completed: false },
  { id: 3, title: 'Build JavaScript task interactions', subject: 'Web Development', priority: 'Medium', due: '2026-09-20', completed: false },
  { id: 4, title: 'Review Git branching commands', subject: 'Information Security', priority: 'Low', due: '2026-09-21', completed: false }
];

let tasks = [...defaultTasks];
let activeFilter = 'all';

const taskList = document.querySelector('#taskList');
const emptyState = document.querySelector('#emptyState');
const searchInput = document.querySelector('#searchInput');
const taskDialog = document.querySelector('#taskDialog');
const taskForm = document.querySelector('#taskForm');

function saveTasks() {
  // This demo keeps the task state in memory so it works without a backend.
}

function formatDate(date) {
  if (!date) return 'No due date';
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
}

function renderTasks() {
  const query = searchInput.value.toLowerCase().trim();

  const filtered = tasks.filter(task => {
    const matchesFilter =
      activeFilter === 'all' ||
      (activeFilter === 'completed' && task.completed) ||
      (activeFilter === 'pending' && !task.completed);

    const matchesSearch =
      `${task.title} ${task.subject} ${task.priority}`.toLowerCase().includes(query);

    return matchesFilter && matchesSearch;
  });

  taskList.innerHTML = '';

  filtered.forEach(task => {
    const item = document.createElement('article');
    item.className = 'task-item';
    item.innerHTML = `
      <input class="task-check" type="checkbox" ${task.completed ? 'checked' : ''}
        aria-label="Mark ${escapeHTML(task.title)} as complete" data-id="${task.id}" />
      <div class="task-info">
        <p class="task-title ${task.completed ? 'done' : ''}">${escapeHTML(task.title)}</p>
        <div class="task-meta">
          <span>${escapeHTML(task.subject)}</span>
          <span>•</span>
          <span>${formatDate(task.due)}</span>
          <span class="priority ${task.priority}">${task.priority}</span>
        </div>
      </div>
      <button class="delete-task" data-delete="${task.id}" aria-label="Delete task">×</button>
    `;
    taskList.appendChild(item);
  });

  emptyState.classList.toggle('hidden', filtered.length !== 0);
  updateStats();
}

function updateStats() {
  const completed = tasks.filter(task => task.completed).length;
  const pending = tasks.length - completed;
  const rate = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;

  document.querySelector('#completedCount').textContent = completed;
  document.querySelector('#pendingCount').textContent = pending;
  document.querySelector('#completionRate').textContent = `${rate}%`;
  document.querySelector('#ringPercent').textContent = `${rate}%`;
  document.querySelector('#progressRing').style.setProperty('--progress', `${rate}%`);
}

function escapeHTML(value) {
  return value.replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }[character]));
}

document.querySelectorAll('.filter').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.filter').forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    activeFilter = button.dataset.filter;
    renderTasks();
  });
});

searchInput.addEventListener('input', renderTasks);

taskList.addEventListener('change', event => {
  if (!event.target.classList.contains('task-check')) return;
  const task = tasks.find(item => item.id === Number(event.target.dataset.id));
  if (task) {
    task.completed = event.target.checked;
    saveTasks();
    renderTasks();
  }
});

taskList.addEventListener('click', event => {
  const button = event.target.closest('[data-delete]');
  if (!button) return;
  tasks = tasks.filter(task => task.id !== Number(button.dataset.delete));
  saveTasks();
  renderTasks();
});

document.querySelector('#openTaskForm').addEventListener('click', () => {
  taskForm.reset();
  taskDialog.showModal();
});

document.querySelector('#closeTaskForm').addEventListener('click', () => {
  taskDialog.close();
});

taskForm.addEventListener('submit', event => {
  event.preventDefault();

  const title = document.querySelector('#taskTitle').value.trim();
  if (!title) return;

  tasks.unshift({
    id: Date.now(),
    title,
    subject: document.querySelector('#taskSubject').value,
    priority: document.querySelector('#taskPriority').value,
    due: document.querySelector('#taskDue').value,
    completed: false
  });

  saveTasks();
  renderTasks();
  taskDialog.close();
});

document.querySelector('#themeToggle').addEventListener('click', () => {
  document.body.classList.toggle('dark');
  document.querySelector('#themeToggle').textContent =
    document.body.classList.contains('dark') ? '☀' : '☾';
});

const quotes = [
  'Success is the sum of small efforts, repeated day in and day out.',
  'A little progress each day adds up to big results.',
  'Do not wait for motivation. Start small and let progress follow.',
  'Your future self will thank you for the work you do today.'
];

document.querySelector('#newQuote').addEventListener('click', () => {
  const current = document.querySelector('#quoteText').textContent;
  const options = quotes.filter(quote => quote !== current);
  document.querySelector('#quoteText').textContent =
    options[Math.floor(Math.random() * options.length)];
});

renderTasks();
