export const initialProfile = {
  name: "Alex Morgan",
  username: "alexmorgan",
  role: "Product Designer & Engineer",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  bio: "Passionate about creating fluid interfaces, staying organized, and shipping great software."
};

export const avatarPresets = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80"
];

export const initialTodos = [
  {
    id: "task-1",
    title: "Design new onboarding user journey & interactive prototype",
    status: "in_progress", // 'todo' | 'in_progress' | 'done'
    priority: true,
    category: "Design",
    dueDate: "2026-10-18",
    createdAt: "2026-10-15T09:00:00Z"
  },
  {
    id: "task-2",
    title: "Prepare quarterly product roadmap review presentation",
    status: "todo",
    priority: true,
    category: "Work",
    dueDate: "2026-10-20",
    createdAt: "2026-10-15T11:30:00Z"
  },
  {
    id: "task-3",
    title: "Refactor state management and modularize React components",
    status: "done",
    priority: false,
    category: "Work",
    dueDate: "2026-10-16",
    createdAt: "2026-10-14T14:15:00Z"
  },
  {
    id: "task-4",
    title: "Schedule annual healthcare and dental checkup",
    status: "todo",
    priority: false,
    category: "Personal",
    dueDate: "2026-10-25",
    createdAt: "2026-10-15T16:00:00Z"
  },
  {
    id: "task-5",
    title: "Review PR #142: Smooth micro-interactions & bulk actions",
    status: "done",
    priority: true,
    category: "Work",
    dueDate: "2026-10-15",
    createdAt: "2026-10-13T10:00:00Z"
  },
  {
    id: "task-6",
    title: "Complete interactive React 19 architecture workshop module",
    status: "in_progress",
    priority: false,
    category: "Study",
    dueDate: "2026-10-19",
    createdAt: "2026-10-16T08:30:00Z"
  }
];

export const CATEGORIES = ["All", "Work", "Design", "Personal", "Study", "Urgent"];
export const STATUS_OPTIONS = [
  { value: "todo", label: "To Do" },
  { value: "in_progress", label: "In Progress" },
  { value: "done", label: "Done" }
];
