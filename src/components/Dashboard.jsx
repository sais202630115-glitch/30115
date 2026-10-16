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

function StatCard({ label, value, sub, delay }) {
  return (
    <div
      className="bg-[var(--card)] border border-[var(--border)] p-5 animate-fade-slide-in"
      style={{ animationDelay: `${delay}ms`, opacity: 0 }}
    >
      <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--muted-foreground)] mono mb-3">{label}</p>
      <p className="text-3xl font-bold text-[var(--foreground)] leading-none mb-1">{value}</p>
      <p className="text-xs text-[var(--muted-foreground)]">{sub}</p>
    </div>
  );
}

export default function Dashboard({ tasks, projects, onNavigate }) {
  const done = tasks.filter(t => t.status === "done").length;
  const inProgress = tasks.filter(t => t.status === "in_progress").length;
  const todo = tasks.filter(t => t.status === "todo").length;
  const highPriority = tasks.filter(t => t.priority === "high" && t.status !== "done").length;

  const recent = [...tasks].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5);
  const projectMap = Object.fromEntries(projects.map(p => [p.id, p]));

  const today = new Date().toISOString().split("T")[0];
  const overdue = tasks.filter(
    task => task.dueDate && task.dueDate < today && task.status !== "done",
  );

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "좋은 아침이에요,";
    if (h < 18) return "안녕하세요,";
    return "수고 많으셨어요,";
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-8 max-w-5xl">
        {/* Header */}
        <div className="mb-8 animate-fade-slide-in" style={{ animationDelay: "0ms", opacity: 0 }}>
          <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[var(--muted-foreground)] mono mb-1">
            {new Date().toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric", weekday: "long" })}
          </p>
          <h1 className="text-2xl font-semibold text-[var(--foreground)]">{greeting()} 지원님.</h1>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-px bg-[var(--border)] mb-8">
          <StatCard label="전체 작업" value={tasks.length} sub={`${done}개 완료됨`} delay={80} />
          <StatCard label="진행 중" value={inProgress} sub="현재 활성 작업" delay={120} />
          <StatCard label="백로그" value={todo} sub="아직 시작 안 함" delay={160} />
          <StatCard label="높은 우선순위" value={highPriority} sub="즉시 처리 필요" delay={200} />
        </div>

        <div className="grid grid-cols-5 gap-6">
          {/* Recent tasks */}
          <div className="col-span-3 animate-fade-slide-in" style={{ animationDelay: "240ms", opacity: 0 }}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--muted-foreground)] mono">최근 작업</p>
              <button onClick={() => onNavigate("tasks")} className="text-[10px] text-[var(--primary)] hover:underline cursor-pointer mono">모두 보기 →</button>
            </div>
            <div className="bg-[var(--card)] border border-[var(--border)] divide-y divide-[var(--border)]">
              {recent.map((task, i) => {
                const proj = projectMap[task.projectId];
                return (
                  <div key={task.id} className="px-4 py-3 flex items-center gap-3 hover:bg-[var(--muted)] transition-colors" style={{ animationDelay: `${(i + 5) * 40}ms` }}>
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: PRIORITY_COLOR[task.priority] }} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${task.status === "done" ? "line-through text-[var(--muted-foreground)]" : "text-[var(--foreground)]"}`}>
                        {task.title}
                      </p>
                      {proj && <p className="text-[10px] text-[var(--muted-foreground)] mt-0.5">{proj.name}</p>}
                    </div>
                    <span className={`text-[10px] mono px-1.5 py-0.5 rounded shrink-0 font-medium
                      ${task.status === "done" ? "bg-[var(--muted)] text-[var(--muted-foreground)]"
                      : task.status === "in_progress" ? "bg-blue-50 text-blue-700"
                      : "bg-[var(--secondary)] text-[var(--secondary-foreground)]"}`}>
                      {STATUS_LABEL[task.status]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Projects + Overdue */}
          <div className="col-span-2 space-y-6 animate-fade-slide-in" style={{ animationDelay: "280ms", opacity: 0 }}>
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--muted-foreground)] mono">프로젝트</p>
                <button onClick={() => onNavigate("projects")} className="text-[10px] text-[var(--primary)] hover:underline cursor-pointer mono">모두 보기 →</button>
              </div>
              <div className="bg-[var(--card)] border border-[var(--border)] divide-y divide-[var(--border)]">
                {projects.map(proj => {
                  const ptasks = tasks.filter(t => t.projectId === proj.id);
                  const pdone = ptasks.filter(t => t.status === "done").length;
                  const pct = ptasks.length ? Math.round((pdone / ptasks.length) * 100) : 0;
                  return (
                    <div key={proj.id} className="px-4 py-3">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ background: proj.color }} />
                        <p className="text-sm font-medium text-[var(--foreground)] truncate">{proj.name}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1 bg-[var(--muted)] rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: proj.color }} />
                        </div>
                        <span className="text-[10px] mono text-[var(--muted-foreground)] shrink-0">{pct}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {overdue.length > 0 && (
              <div>
                <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--primary)] mono mb-3">기한 초과</p>
                <div className="bg-[var(--card)] border border-[var(--primary)] divide-y divide-[var(--border)]">
                  {overdue.slice(0, 3).map(task => (
                    <div key={task.id} className="px-4 py-3">
                      <p className="text-sm font-medium text-[var(--foreground)] truncate">{task.title}</p>
                      <p className="text-[10px] text-[var(--primary)] mono mt-0.5">마감 {task.dueDate}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
