import { useState } from "react";
import TaskModal from "./TaskModal";
const STATUS_LABEL = {
    todo: "할 일",
    in_progress: "진행 중",
    done: "완료",
};
const PRIORITY_COLOR = {
    high: "var(--primary)",
    medium: "#d48b00",
    low: "var(--muted-foreground)",
};
export default function Tasks({ tasks, projects, onAdd, onUpdate, onDelete }) {
    const [modal, setModal] = useState({ open: false });
    const [filterStatus, setFilterStatus] = useState("all");
    const [filterPriority, setFilterPriority] = useState("all");
    const [filterProject, setFilterProject] = useState("all");
    const [search, setSearch] = useState("");
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const projectMap = Object.fromEntries(projects.map(p => [p.id, p]));
    const filtered = tasks.filter(t => {
        if (filterStatus !== "all" && t.status !== filterStatus)
            return false;
        if (filterPriority !== "all" && t.priority !== filterPriority)
            return false;
        if (filterProject !== "all" && t.projectId !== filterProject)
            return false;
        if (search && !t.title.toLowerCase().includes(search.toLowerCase()))
            return false;
        return true;
    });
    function cycleStatus(task) {
        const next = { todo: "in_progress", in_progress: "done", done: "todo" };
        onUpdate(task.id, { status: next[task.status] });
    }
    return (<div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="shrink-0 px-8 py-4 border-b border-[var(--border)] bg-[var(--card)] flex items-center gap-3 flex-wrap">
        <div className="flex-1 min-w-40">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="작업 검색…" className="w-full px-3 py-1.5 text-sm bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] transition-colors"/>
        </div>

        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-3 py-1.5 text-xs bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none cursor-pointer mono">
          <option value="all">전체 상태</option>
          <option value="todo">할 일</option>
          <option value="in_progress">진행 중</option>
          <option value="done">완료</option>
        </select>

        <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)} className="px-3 py-1.5 text-xs bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none cursor-pointer mono">
          <option value="all">전체 우선순위</option>
          <option value="high">높음</option>
          <option value="medium">중간</option>
          <option value="low">낮음</option>
        </select>

        <select value={filterProject} onChange={e => setFilterProject(e.target.value)} className="px-3 py-1.5 text-xs bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none cursor-pointer mono">
          <option value="all">전체 프로젝트</option>
          {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>

        <button onClick={() => setModal({ open: true })} className="px-4 py-1.5 text-xs font-semibold bg-[var(--primary)] text-white hover:opacity-90 transition-opacity cursor-pointer">
          + 새 작업
        </button>
      </div>

      {/* Count */}
      <div className="shrink-0 px-8 py-2.5 flex items-center gap-2">
        <span className="text-[10px] mono text-[var(--muted-foreground)] font-medium">작업 {filtered.length}개</span>
        {(filterStatus !== "all" || filterPriority !== "all" || filterProject !== "all" || search) && (<button onClick={() => { setFilterStatus("all"); setFilterPriority("all"); setFilterProject("all"); setSearch(""); }} className="text-[10px] text-[var(--primary)] hover:underline cursor-pointer">
            필터 초기화
          </button>)}
      </div>

      {/* Task list */}
      <div className="flex-1 overflow-y-auto px-8 pb-8">
        {filtered.length === 0 ? (<div className="flex flex-col items-center justify-center py-20 text-[var(--muted-foreground)]">
            <p className="text-sm">작업이 없습니다</p>
            <button onClick={() => setModal({ open: true })} className="mt-3 text-xs text-[var(--primary)] hover:underline cursor-pointer">
              작업 만들기 →
            </button>
          </div>) : (<div className="border border-[var(--border)] divide-y divide-[var(--border)] bg-[var(--card)]">
            {filtered.map((task, i) => {
                const proj = projectMap[task.projectId];
                const today = new Date().toISOString().split("T")[0];
                const isOverdue = task.dueDate && task.dueDate < today && task.status !== "done";
                return (<div key={task.id} className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--muted)] transition-colors group animate-fade-slide-in" style={{ animationDelay: `${i * 30}ms`, opacity: 0 }}>
                  {/* Status toggle */}
                  <button onClick={() => cycleStatus(task)} title={`상태: ${STATUS_LABEL[task.status]} — 클릭하여 변경`} className="shrink-0 w-4 h-4 rounded-sm border-2 flex items-center justify-center transition-all cursor-pointer hover:scale-110" style={{
                        borderColor: task.status === "done" ? "var(--primary)" : "var(--border)",
                        background: task.status === "done" ? "var(--primary)" : "transparent",
                    }}>
                    {task.status === "done" && <span className="text-white text-[9px] leading-none">✓</span>}
                    {task.status === "in_progress" && <span className="w-1.5 h-1.5 rounded-sm bg-blue-500"/>}
                  </button>

                  {/* Priority dot */}
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: PRIORITY_COLOR[task.priority] }}/>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${task.status === "done" ? "line-through text-[var(--muted-foreground)]" : "text-[var(--foreground)]"}`}>
                      {task.title}
                    </p>
                    {task.description && (<p className="text-xs text-[var(--muted-foreground)] truncate mt-0.5">{task.description}</p>)}
                  </div>

                  {/* Meta */}
                  <div className="flex items-center gap-3 shrink-0">
                    {proj && (<span className="text-[10px] mono px-1.5 py-0.5 font-medium" style={{ color: proj.color, background: `${proj.color}18` }}>
                        {proj.name}
                      </span>)}
                    {task.dueDate && (<span className={`text-[10px] mono ${isOverdue ? "text-[var(--primary)] font-semibold" : "text-[var(--muted-foreground)]"}`}>
                        {isOverdue ? "!" : ""}{task.dueDate}
                      </span>)}
                    <span className={`text-[10px] mono px-1.5 py-0.5 font-medium
                      ${task.status === "done" ? "bg-[var(--muted)] text-[var(--muted-foreground)]"
                        : task.status === "in_progress" ? "bg-blue-50 text-blue-700"
                            : "bg-[var(--secondary)] text-[var(--secondary-foreground)]"}`}>
                      {STATUS_LABEL[task.status]}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setModal({ open: true, task })} className="text-[10px] px-2 py-1 border border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:border-[var(--foreground)] transition-colors cursor-pointer">
                      수정
                    </button>
                    {deleteConfirm === task.id ? (<button onClick={() => { onDelete(task.id); setDeleteConfirm(null); }} className="text-[10px] px-2 py-1 bg-[var(--primary)] text-white cursor-pointer">
                        확인
                      </button>) : (<button onClick={() => setDeleteConfirm(task.id)} className="text-[10px] px-2 py-1 border border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--primary)] hover:border-[var(--primary)] transition-colors cursor-pointer">
                        삭제
                      </button>)}
                  </div>
                </div>);
            })}
          </div>)}
      </div>

      {modal.open && (<TaskModal task={modal.task} projects={projects} onSave={data => modal.task ? onUpdate(modal.task.id, data) : onAdd(data)} onClose={() => setModal({ open: false })}/>)}
    </div>);
}
