import { useState } from "react";
import TaskModal from "./TaskModal";
const STATUS_CYCLE = { todo: "in_progress", in_progress: "done", done: "todo" };
const STATUS_LABEL = { todo: "할 일", in_progress: "진행 중", done: "완료" };
const STATUS_STYLE = {
    todo: "bg-[var(--secondary)] text-[var(--secondary-foreground)]",
    in_progress: "bg-blue-50 text-blue-700",
    done: "bg-[var(--muted)] text-[var(--muted-foreground)]",
};
const COLORS = ["#e02020", "#2060e0", "#20a060", "#8020e0", "#e07020", "#20a0c0", "#c02080", "#60a020"];
function ProjectModal({ project, onSave, onClose }) {
    const [name, setName] = useState(project?.name ?? "");
    const [description, setDescription] = useState(project?.description ?? "");
    const [color, setColor] = useState(project?.color ?? COLORS[0]);
    function handleSubmit(e) {
        e.preventDefault();
        if (!name.trim())
            return;
        onSave({ name: name.trim(), description: description.trim(), color });
        onClose();
    }
    return (<div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/30 animate-fade-in"/>
      <div className="relative bg-[var(--card)] border border-[var(--border)] w-full max-w-sm shadow-2xl animate-scale-in" onClick={e => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-[var(--border)] flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[var(--foreground)]">{project ? "프로젝트 수정" : "새 프로젝트"}</h2>
          <button onClick={onClose} className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] text-lg leading-none cursor-pointer">×</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--muted-foreground)] mono mb-1.5">이름 *</label>
            <input autoFocus value={name} onChange={e => setName(e.target.value)} placeholder="프로젝트 이름" className="w-full px-3 py-2 text-sm bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] transition-colors"/>
          </div>
          <div>
            <label className="block text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--muted-foreground)] mono mb-1.5">설명</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="이 프로젝트는 무엇에 관한 건가요?" rows={2} className="w-full px-3 py-2 text-sm bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] transition-colors resize-none"/>
          </div>
          <div>
            <label className="block text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--muted-foreground)] mono mb-1.5">색상</label>
            <div className="flex gap-2 flex-wrap">
              {COLORS.map(c => (<button key={c} type="button" onClick={() => setColor(c)} className="w-6 h-6 rounded-sm transition-all cursor-pointer hover:scale-110" style={{
                background: c,
                outline: color === c ? `2px solid ${c}` : "2px solid transparent",
                outlineOffset: "2px",
            }}/>))}
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <button type="submit" className="flex-1 py-2 text-sm font-semibold bg-[var(--primary)] text-white hover:opacity-90 transition-opacity cursor-pointer">
              {project ? "변경사항 저장" : "프로젝트 만들기"}
            </button>
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors cursor-pointer">
              취소
            </button>
          </div>
        </form>
      </div>
    </div>);
}
export default function Projects({ projects, tasks, onAdd, onUpdate, onDelete, onNavigateTasks, onUpdateTask, onAddTask, onDeleteTask }) {
    const [modal, setModal] = useState({ open: false });
    const [taskModal, setTaskModal] = useState({ open: false });
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [deleteTaskConfirm, setDeleteTaskConfirm] = useState(null);
    const [expanded, setExpanded] = useState(null);
    return (<div className="h-full overflow-y-auto">
      <div className="p-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-end justify-between mb-8 animate-fade-slide-in" style={{ animationDelay: "0ms", opacity: 0 }}>
          <div>
            <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[var(--muted-foreground)] mono mb-1">워크스페이스</p>
            <h1 className="text-2xl font-semibold text-[var(--foreground)]">프로젝트</h1>
          </div>
          <button onClick={() => setModal({ open: true })} className="px-4 py-2 text-xs font-semibold bg-[var(--primary)] text-white hover:opacity-90 transition-opacity cursor-pointer">
            + 새 프로젝트
          </button>
        </div>

        {/* Project grid */}
        <div className="grid grid-cols-1 gap-4">
          {projects.map((proj, i) => {
            const ptasks = tasks.filter(t => t.projectId === proj.id);
            const done = ptasks.filter(t => t.status === "done").length;
            const inProgress = ptasks.filter(t => t.status === "in_progress").length;
            const todo = ptasks.filter(t => t.status === "todo").length;
            const pct = ptasks.length ? Math.round((done / ptasks.length) * 100) : 0;
            const isExpanded = expanded === proj.id;
            return (<div key={proj.id} className="bg-[var(--card)] border border-[var(--border)] overflow-hidden animate-fade-slide-in" style={{ animationDelay: `${i * 60 + 60}ms`, opacity: 0 }}>
                {/* Project header */}
                <div className="px-5 py-4 cursor-pointer hover:bg-[var(--muted)] transition-colors" onClick={() => setExpanded(isExpanded ? null : proj.id)}>
                  <div className="flex items-start gap-4">
                    <div className="w-1 self-stretch rounded-full shrink-0" style={{ background: proj.color }}/>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h2 className="text-sm font-semibold text-[var(--foreground)]">{proj.name}</h2>
                        <span className="text-[10px] mono text-[var(--muted-foreground)]">작업 {ptasks.length}개</span>
                      </div>
                      {proj.description && (<p className="text-xs text-[var(--muted-foreground)] mb-3">{proj.description}</p>)}
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-1 bg-[var(--muted)] rounded-full overflow-hidden max-w-xs">
                          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: proj.color }}/>
                        </div>
                        <span className="text-[10px] mono font-semibold" style={{ color: proj.color }}>{pct}%</span>
                        <div className="flex gap-3 text-[10px] mono text-[var(--muted-foreground)]">
                          <span>할 일 {todo}</span>
                          <span>진행 {inProgress}</span>
                          <span>완료 {done}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={e => { e.stopPropagation(); setModal({ open: true, project: proj }); }} className="text-[10px] px-2 py-1 border border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:border-[var(--foreground)] transition-colors cursor-pointer">
                        수정
                      </button>
                      {deleteConfirm === proj.id ? (<button onClick={e => { e.stopPropagation(); onDelete(proj.id); setDeleteConfirm(null); }} className="text-[10px] px-2 py-1 bg-[var(--primary)] text-white cursor-pointer">
                          확인
                        </button>) : (<button onClick={e => { e.stopPropagation(); setDeleteConfirm(proj.id); }} className="text-[10px] px-2 py-1 border border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--primary)] hover:border-[var(--primary)] transition-colors cursor-pointer">
                          삭제
                        </button>)}
                      <span className="text-[var(--muted-foreground)] text-xs ml-1">{isExpanded ? "▲" : "▼"}</span>
                    </div>
                  </div>
                </div>

                {/* Expanded task list */}
                {isExpanded && (<div className="border-t border-[var(--border)] animate-fade-in">
                    {ptasks.length === 0 ? (<div className="px-5 py-6 text-center">
                        <p className="text-xs text-[var(--muted-foreground)]">아직 작업이 없습니다.</p>
                        <button onClick={() => onNavigateTasks(proj.id)} className="mt-1 text-xs text-[var(--primary)] hover:underline cursor-pointer">
                          작업 추가하기 →
                        </button>
                      </div>) : (<>
                        <div className="divide-y divide-[var(--border)]">
                          {ptasks.slice(0, 5).map(task => (<div key={task.id} className="px-5 py-2.5 flex items-center gap-3 group/task hover:bg-[var(--muted)] transition-colors">
                              {/* Status toggle checkbox */}
                              <button onClick={() => onUpdateTask(task.id, { status: STATUS_CYCLE[task.status] })} title={`${STATUS_LABEL[task.status]} → 클릭하여 변경`} className="shrink-0 w-4 h-4 rounded-sm border-2 flex items-center justify-center transition-all cursor-pointer hover:scale-110" style={{
                                borderColor: task.status === "done" ? "var(--primary)" : task.status === "in_progress" ? "#3b82f6" : "var(--border)",
                                background: task.status === "done" ? "var(--primary)" : "transparent",
                            }}>
                                {task.status === "done" && <span className="text-white text-[9px] leading-none">✓</span>}
                                {task.status === "in_progress" && <span className="w-1.5 h-1.5 rounded-sm bg-blue-500"/>}
                              </button>
                              <p className={`text-xs flex-1 min-w-0 truncate ${task.status === "done" ? "line-through text-[var(--muted-foreground)]" : "text-[var(--foreground)]"}`}>
                                {task.title}
                              </p>
                              {/* Status badge */}
                              <button onClick={() => onUpdateTask(task.id, { status: STATUS_CYCLE[task.status] })} className={`text-[10px] mono px-1.5 py-0.5 font-medium transition-opacity cursor-pointer hover:opacity-70 shrink-0 ${STATUS_STYLE[task.status]}`} title="클릭하여 상태 변경">
                                {STATUS_LABEL[task.status]}
                              </button>
                              {/* Edit / Delete — visible on row hover */}
                              <div className="flex gap-1 opacity-0 group-hover/task:opacity-100 transition-opacity shrink-0">
                                <button onClick={() => setTaskModal({ open: true, task })} className="text-[10px] px-2 py-0.5 border border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:border-[var(--foreground)] transition-colors cursor-pointer">
                                  수정
                                </button>
                                {deleteTaskConfirm === task.id ? (<button onClick={() => { onDeleteTask(task.id); setDeleteTaskConfirm(null); }} className="text-[10px] px-2 py-0.5 bg-[var(--primary)] text-white cursor-pointer">
                                    확인
                                  </button>) : (<button onClick={() => setDeleteTaskConfirm(task.id)} className="text-[10px] px-2 py-0.5 border border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--primary)] hover:border-[var(--primary)] transition-colors cursor-pointer">
                                    삭제
                                  </button>)}
                              </div>
                            </div>))}
                        </div>
                        {ptasks.length > 5 && (<div className="px-5 py-2 border-t border-[var(--border)]">
                            <button onClick={() => onNavigateTasks(proj.id)} className="text-[10px] text-[var(--primary)] hover:underline cursor-pointer">
                              전체 작업 {ptasks.length}개 보기 →
                            </button>
                          </div>)}
                      </>)}
                  </div>)}
              </div>);
        })}
        </div>

        {projects.length === 0 && (<div className="flex flex-col items-center justify-center py-24 text-[var(--muted-foreground)]">
            <p className="text-sm">아직 프로젝트가 없습니다.</p>
            <button onClick={() => setModal({ open: true })} className="mt-3 text-xs text-[var(--primary)] hover:underline cursor-pointer">
              첫 번째 프로젝트 만들기 →
            </button>
          </div>)}
      </div>

      {modal.open && (<ProjectModal project={modal.project} onSave={data => modal.project ? onUpdate(modal.project.id, data) : onAdd(data)} onClose={() => setModal({ open: false })}/>)}

      {taskModal.open && (<TaskModal task={taskModal.task} projects={projects} onSave={data => taskModal.task ? onUpdateTask(taskModal.task.id, data) : onAddTask(data)} onClose={() => setTaskModal({ open: false })}/>)}
    </div>);
}
