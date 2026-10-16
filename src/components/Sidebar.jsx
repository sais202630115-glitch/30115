const NAV = [
    { id: "dashboard", label: "대시보드", icon: "◈" },
    { id: "tasks", label: "작업", icon: "◻" },
    { id: "projects", label: "프로젝트", icon: "◧" },
];
export default function Sidebar({ current, onChange, taskCount, projectCount }) {
    return (<aside className="w-56 shrink-0 border-r border-[var(--border)] flex flex-col bg-[var(--card)] h-full">
      <div className="px-6 py-5 border-b border-[var(--border)]">
        <span className="text-[var(--primary)] text-xs font-semibold tracking-[0.2em] uppercase mono">TaskFlow</span>
      </div>

      <nav className="flex-1 py-4 px-3 space-y-0.5">
        {NAV.map(item => (<button key={item.id} onClick={() => onChange(item.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all duration-150 rounded-[var(--radius)] text-left cursor-pointer
              ${current === item.id
                ? "bg-[var(--foreground)] text-[var(--background)]"
                : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]"}`}>
            <span className="text-base leading-none">{item.icon}</span>
            <span>{item.label}</span>
            {item.id === "tasks" && (<span className={`ml-auto mono text-xs ${current === item.id ? "text-[var(--background)] opacity-70" : "text-[var(--muted-foreground)]"}`}>
                {taskCount}
              </span>)}
            {item.id === "projects" && (<span className={`ml-auto mono text-xs ${current === item.id ? "text-[var(--background)] opacity-70" : "text-[var(--muted-foreground)]"}`}>
                {projectCount}
              </span>)}
          </button>))}
      </nav>

      <div className="px-6 py-4 border-t border-[var(--border)]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-[var(--primary)] flex items-center justify-center text-white text-xs font-semibold">김</div>
          <div>
            <p className="text-xs font-medium text-[var(--foreground)]">김지원</p>
            <p className="text-[10px] text-[var(--muted-foreground)]">프로덕트 팀</p>
          </div>
        </div>
      </div>
    </aside>);
}
