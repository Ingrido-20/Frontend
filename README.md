TASK MANAGER — component template
  Assumes a component class with (at minimum) these members. Adjust names
  to match your actual TaskManagerComponent if they differ:

    tasks: Task[]
    newTaskTitle: string
    newTaskPriority: 'low' | 'medium' | 'high'
    filterStatus: 'all' | 'todo' | 'in-progress' | 'done'
    searchTerm: string
    selectedTask: Task | null

    get filteredTasks(): Task[]
    get todoTasks(): Task[]
    get inProgressTasks(): Task[]
    get doneTasks(): Task[]

    addTask(): void
    deleteTask(task: Task): void
    updateStatus(task: Task, status: string): void
    toggleComplete(task: Task): void
    openTaskDetail(task: Task): void
    closeTaskDetail(): void