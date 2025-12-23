import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import TransitionWrapper from "../components/TransitionWrapper";

interface Task {
  id: string;
  content: string;
}

interface Column {
  id: string;
  title: string;
  color: string;
  tasks: Task[];
}

const initialColumns: Column[] = [
  {
    id: "todo",
    title: "To Do",
    color: "neon-pink",
    tasks: [
      { id: "task-1", content: "Research new technologies" },
      { id: "task-2", content: "Design system architecture" },
      { id: "task-3", content: "Write documentation" },
    ],
  },
  {
    id: "in-progress",
    title: "In Progress",
    color: "neon-purple",
    tasks: [
      { id: "task-4", content: "Implement authentication" },
      { id: "task-5", content: "Build REST API" },
    ],
  },
  {
    id: "done",
    title: "Done",
    color: "neon-cyan",
    tasks: [
      { id: "task-6", content: "Project setup" },
      { id: "task-7", content: "Database schema" },
    ],
  },
];

// Sortable Task Component
function SortableTask({ task, columnColor }: { task: Task; columnColor: string }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        p-4 rounded-xl cursor-grab active:cursor-grabbing transition-all
        ${isDragging
          ? "opacity-50 scale-105 shadow-lg"
          : "bg-white/5 hover:bg-white/10 border border-white/10"
        }
      `}
    >
      <p className="text-sm">{task.content}</p>
    </div>
  );
}

// Task overlay shown while dragging
function TaskOverlay({ task }: { task: Task }) {
  return (
    <div className="p-4 rounded-xl bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl cursor-grabbing">
      <p className="text-sm">{task.content}</p>
    </div>
  );
}

// Column Component
function KanbanColumn({
  column,
  onAddTask,
  onDeleteTask,
}: {
  column: Column;
  onAddTask: (columnId: string, content: string) => void;
  onDeleteTask: (columnId: string, taskId: string) => void;
}) {
  const [newTaskContent, setNewTaskContent] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  // Make the column itself droppable (for empty columns)
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  const handleAddTask = () => {
    if (newTaskContent.trim()) {
      onAddTask(column.id, newTaskContent.trim());
      setNewTaskContent("");
      setIsAdding(false);
    }
  };

  return (
    <div className="glass-card flex flex-col h-full min-h-[400px]">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: `var(--color-${column.color})` }}
          />
          <h3 className="font-semibold">{column.title}</h3>
          <span className="text-white/40 text-sm">({column.tasks.length})</span>
        </div>
      </div>

      {/* Tasks - droppable area */}
      <div
        ref={setNodeRef}
        className={`flex-1 space-y-3 overflow-y-auto rounded-xl transition-colors ${
          isOver ? "bg-white/5 ring-2 ring-white/20" : ""
        }`}
      >
        <SortableContext
          items={column.tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {column.tasks.map((task) => (
            <div key={task.id} className="relative group">
              <SortableTask task={task} columnColor={column.color} />
              <button
                onClick={() => onDeleteTask(column.id, task.id)}
                className="absolute top-2 right-2 p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-500/20 text-red-400 transition-all"
                aria-label="Delete task"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </SortableContext>

        {column.tasks.length === 0 && (
          <div className={`text-center py-8 text-sm ${isOver ? "text-white/50" : "text-white/30"}`}>
            {isOver ? "Drop here" : "No tasks yet"}
          </div>
        )}
      </div>

      {/* Add Task */}
      <div className="mt-4 pt-4 border-t border-white/10">
        {isAdding ? (
          <div className="space-y-2">
            <textarea
              value={newTaskContent}
              onChange={(e) => setNewTaskContent(e.target.value)}
              aria-label="New task description"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleAddTask();
                }
                if (e.key === "Escape") {
                  setIsAdding(false);
                  setNewTaskContent("");
                }
              }}
              placeholder="Enter task description..."
              className="glass-input w-full h-20 resize-none text-sm"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddTask}
                className="btn-neon py-2 px-4 text-sm flex-1"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setIsAdding(false);
                  setNewTaskContent("");
                }}
                className="btn-glass py-2 px-4 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full py-2 rounded-xl text-white/50 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center gap-2 text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add task
          </button>
        )}
      </div>
    </div>
  );
}

// Main Kanban Component
const Kanban = () => {
  const [columns, setColumns] = useState<Column[]>(() => {
    const saved = localStorage.getItem("kanban-columns");
    return saved ? JSON.parse(saved) : initialColumns;
  });
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  // Save to localStorage
  const saveColumns = (newColumns: Column[]) => {
    setColumns(newColumns);
    localStorage.setItem("kanban-columns", JSON.stringify(newColumns));
  };

  // Sensors for drag detection
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Find which column contains a task
  const findColumn = (taskId: string) => {
    return columns.find((col) => col.tasks.some((t) => t.id === taskId));
  };

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const column = findColumn(active.id as string);
    const task = column?.tasks.find((t) => t.id === active.id);
    if (task) {
      setActiveTask(task);
    }
  };

  // Handle drag over (moving between columns)
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeColumn = findColumn(activeId);
    const overColumn = findColumn(overId) || columns.find((col) => col.id === overId);

    if (!activeColumn || !overColumn || activeColumn.id === overColumn.id) return;

    const activeTask = activeColumn.tasks.find((t) => t.id === activeId);
    if (!activeTask) return;

    const newColumns = columns.map((col) => {
      if (col.id === activeColumn.id) {
        return {
          ...col,
          tasks: col.tasks.filter((t) => t.id !== activeId),
        };
      }
      if (col.id === overColumn.id) {
        const overTaskIndex = col.tasks.findIndex((t) => t.id === overId);
        const newTasks = [...col.tasks];
        if (overTaskIndex >= 0) {
          newTasks.splice(overTaskIndex, 0, activeTask);
        } else {
          newTasks.push(activeTask);
        }
        return {
          ...col,
          tasks: newTasks,
        };
      }
      return col;
    });

    setColumns(newColumns);
  };

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    const activeColumn = findColumn(activeId);
    if (!activeColumn) return;

    const oldIndex = activeColumn.tasks.findIndex((t) => t.id === activeId);
    const newIndex = activeColumn.tasks.findIndex((t) => t.id === overId);

    if (oldIndex !== -1 && newIndex !== -1) {
      const newColumns = columns.map((col) => {
        if (col.id === activeColumn.id) {
          return {
            ...col,
            tasks: arrayMove(col.tasks, oldIndex, newIndex),
          };
        }
        return col;
      });
      saveColumns(newColumns);
    } else {
      saveColumns(columns);
    }
  };

  // Add new task
  const handleAddTask = (columnId: string, content: string) => {
    const newColumns = columns.map((col) => {
      if (col.id === columnId) {
        return {
          ...col,
          tasks: [
            ...col.tasks,
            { id: `task-${Date.now()}`, content },
          ],
        };
      }
      return col;
    });
    saveColumns(newColumns);
  };

  // Delete task
  const handleDeleteTask = (columnId: string, taskId: string) => {
    const newColumns = columns.map((col) => {
      if (col.id === columnId) {
        return {
          ...col,
          tasks: col.tasks.filter((t) => t.id !== taskId),
        };
      }
      return col;
    });
    saveColumns(newColumns);
  };

  // Reset board
  const handleReset = () => {
    saveColumns(initialColumns);
  };

  const totalTasks = columns.reduce((acc, col) => acc + col.tasks.length, 0);
  const doneTasks = columns.find((col) => col.id === "done")?.tasks.length || 0;

  return (
    <TransitionWrapper>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">
            <span className="text-gradient">Kanban</span> Board
          </h1>
          <p className="text-white/60">Drag and drop tasks between columns</p>
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-6 mb-8">
          <div className="glass px-6 py-3 rounded-xl text-center">
            <span className="text-2xl font-bold text-gradient">{totalTasks}</span>
            <span className="text-white/60 text-sm ml-2">Total Tasks</span>
          </div>
          <div className="glass px-6 py-3 rounded-xl text-center">
            <span className="text-2xl font-bold text-neon-cyan">{doneTasks}</span>
            <span className="text-white/60 text-sm ml-2">Completed</span>
          </div>
          <button
            onClick={handleReset}
            className="glass px-4 py-3 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-all text-sm"
          >
            Reset Board
          </button>
        </div>

        {/* Kanban Board */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="grid md:grid-cols-3 gap-6">
            {columns.map((column) => (
              <motion.div
                key={column.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <KanbanColumn
                  column={column}
                  onAddTask={handleAddTask}
                  onDeleteTask={handleDeleteTask}
                />
              </motion.div>
            ))}
          </div>

          <DragOverlay>
            {activeTask ? <TaskOverlay task={activeTask} /> : null}
          </DragOverlay>
        </DndContext>
      </div>
    </TransitionWrapper>
  );
};

export default Kanban;
