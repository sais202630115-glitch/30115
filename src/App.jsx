import { useState, useEffect } from "react";
import { useStore } from "./store";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Tasks from "./components/Tasks";
import Projects from "./components/Projects";
export default function App() {
    const [page, setPage] = useState("dashboard");
    const [pageKey, setPageKey] = useState(0);
    const [defaultProjectFilter, setDefaultProjectFilter] = useState(null);
    const store = useStore();
    function navigate(p, projectId) {
        setPage(p);
        setPageKey(k => k + 1);
        if (projectId)
            setDefaultProjectFilter(projectId);
        else
            setDefaultProjectFilter(null);
    }
    useEffect(() => {
        const labels = { dashboard: "대시보드", tasks: "작업", projects: "프로젝트" };
        document.title = `TaskFlow — ${labels[page] ?? page}`;
    }, [page]);
    return (<div className="flex h-full bg-[var(--background)]">
      <Sidebar current={page} onChange={p => navigate(p)} taskCount={store.tasks.length} projectCount={store.projects.length}/>

      <main className="flex-1 min-w-0 relative overflow-hidden">
        {/* Page header strip */}
        <div className="absolute top-0 left-0 right-0 h-px bg-[var(--border)] z-10"/>

        <div key={pageKey} className="h-full">
          {page === "dashboard" && (<Dashboard tasks={store.tasks} projects={store.projects} onNavigate={p => navigate(p)}/>)}
          {page === "tasks" && (<TasksWrapper store={store} defaultProjectFilter={defaultProjectFilter}/>)}
          {page === "projects" && (<Projects projects={store.projects} tasks={store.tasks} onAdd={store.addProject} onUpdate={store.updateProject} onDelete={store.deleteProject} onNavigateTasks={projectId => navigate("tasks", projectId)} onUpdateTask={store.updateTask} onAddTask={store.addTask} onDeleteTask={store.deleteTask}/>)}
        </div>
      </main>
    </div>);
}
function TasksWrapper({ store, defaultProjectFilter }) {
    return (<div className="h-full flex flex-col">
      <div className="shrink-0 px-8 pt-6 pb-0">
        <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[var(--muted-foreground)] mono mb-1">워크스페이스</p>
        <h1 className="text-2xl font-semibold text-[var(--foreground)] mb-4">작업</h1>
      </div>
      <div className="flex-1 min-h-0">
        <Tasks tasks={store.tasks} projects={store.projects} onAdd={store.addTask} onUpdate={store.updateTask} onDelete={store.deleteTask}/>
      </div>
    </div>);
}
