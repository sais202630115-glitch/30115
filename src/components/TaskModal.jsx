import { useState, useEffect } from "react";
export default function TaskModal({ task, projects, onSave, onClose }) {
    const [title, setTitle] = useState(task?.title ?? "");
    const [description, setDescription] = useState(task?.description ?? "");
    const [projectId, setProjectId] = useState(task?.projectId ?? (projects[0]?.id ?? ""));
    const [priority, setPriority] = useState(task?.priority ?? "medium");
    const [status, setStatus] = useState(task?.status ?? "todo");
    const [dueDate, setDueDate] = useState(task?.dueDate ?? "");
    useEffect(() => {
        const handler = (e) => { if (e.key === "Escape")
            onClose(); };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [onClose]);
    function handleSubmit(e) {
        e.preventDefault();
        if (!title.trim())
            return;
        onSave({ title: title.trim(), description: description.trim(), projectId, priority, status, dueDate });
        onClose();
    }
    return (<div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/30 animate-fade-in"/>
      <div className="relative bg-[var(--card)] border border-[var(--border)] w-full max-w-md shadow-2xl animate-scale-in" onClick={e => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-[var(--border)] flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[var(--foreground)]">{task ? "작업 수정" : "새 작업"}</h2>
          <button onClick={onClose} className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] text-lg leading-none cursor-pointer">×</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--muted-foreground)] mono mb-1.5">제목 *</label>
            <input autoFocus value={title} onChange={e => setTitle(e.target.value)} placeholder="작업 제목" className="w-full px-3 py-2 text-sm bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] transition-colors"/>
          </div>

          <div>
            <label className="block text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--muted-foreground)] mono mb-1.5">설명</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="세부 내용을 입력하세요..." rows={2} className="w-full px-3 py-2 text-sm bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] transition-colors resize-none"/>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--muted-foreground)] mono mb-1.5">프로젝트</label>
              <select value={projectId} onChange={e => setProjectId(e.target.value)} className="w-full px-3 py-2 text-sm bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] transition-colors cursor-pointer">
                {projects.map(p => (<option key={p.id} value={p.id}>{p.name}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--muted-foreground)] mono mb-1.5">마감일</label>
              <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full px-3 py-2 text-sm bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] transition-colors"/>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--muted-foreground)] mono mb-1.5">우선순위</label>
              <select value={priority} onChange={e => setPriority(e.target.value)} className="w-full px-3 py-2 text-sm bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] transition-colors cursor-pointer">
                <option value="high">높음</option>
                <option value="medium">중간</option>
                <option value="low">낮음</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--muted-foreground)] mono mb-1.5">상태</label>
              <select value={status} onChange={e => setStatus(e.target.value)} className="w-full px-3 py-2 text-sm bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] transition-colors cursor-pointer">
                <option value="todo">할 일</option>
                <option value="in_progress">진행 중</option>
                <option value="done">완료</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <button type="submit" className="flex-1 py-2 text-sm font-semibold bg-[var(--primary)] text-white hover:opacity-90 transition-opacity cursor-pointer">
              {task ? "변경사항 저장" : "작업 만들기"}
            </button>
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors cursor-pointer">
              취소
            </button>
          </div>
        </form>
      </div>
    </div>);
}
