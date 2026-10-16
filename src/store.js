import { useState, useEffect, useCallback } from "react";
const TASKS_KEY = "taskflow_tasks";
const PROJECTS_KEY = "taskflow_projects";
const INITIAL_PROJECTS = [
    { id: "p1", name: "웹사이트 리디자인", description: "회사 공개 웹사이트 전면 개편", color: "#e02020", createdAt: "2026-07-10T09:00:00Z" },
    { id: "p2", name: "모바일 앱", description: "크로스플랫폼 모바일 클라이언트 개발", color: "#2060e0", createdAt: "2026-07-18T10:00:00Z" },
    { id: "p3", name: "데이터 파이프라인", description: "분석 인프라를 위한 ETL 파이프라인 구축", color: "#20a060", createdAt: "2026-08-01T08:00:00Z" },
];
const INITIAL_TASKS = [
    { id: "t1", title: "현행 디자인 시스템 감사", description: "기존 컴포넌트 전수 검토 및 불일치 사항 문서화", projectId: "p1", priority: "high", status: "done", dueDate: "2026-07-20", createdAt: "2026-07-10T09:00:00Z" },
    { id: "t2", title: "홈페이지 와이어프레임 제작", description: "히어로·기능·가격 섹션을 포함한 로우파이 와이어프레임", projectId: "p1", priority: "high", status: "in_progress", dueDate: "2026-08-22", createdAt: "2026-07-12T10:00:00Z" },
    { id: "t3", title: "컬러 토큰 정의", description: "새로운 디자인 언어를 위한 시맨틱 컬러 토큰 수립", projectId: "p1", priority: "medium", status: "todo", dueDate: "2026-08-25", createdAt: "2026-07-14T11:00:00Z" },
    { id: "t4", title: "React Native 프로젝트 세팅", description: "내비게이션·테마 포함 RN 프로젝트 초기화", projectId: "p2", priority: "high", status: "done", dueDate: "2026-07-25", createdAt: "2026-07-18T10:00:00Z" },
    { id: "t5", title: "로그인 및 회원가입 화면 구현", description: "폼 유효성 검사를 포함한 인증 화면 개발", projectId: "p2", priority: "high", status: "in_progress", dueDate: "2026-08-20", createdAt: "2026-07-22T09:00:00Z" },
    { id: "t6", title: "푸시 알림 설정", description: "Android FCM 및 iOS APNs 연동", projectId: "p2", priority: "medium", status: "todo", dueDate: "2026-09-05", createdAt: "2026-07-30T14:00:00Z" },
    { id: "t7", title: "Postgres 스키마 설계", description: "분석 DB의 테이블·관계·인덱스 정의", projectId: "p3", priority: "high", status: "done", dueDate: "2026-08-05", createdAt: "2026-08-01T08:00:00Z" },
    { id: "t8", title: "수집 서비스 개발", description: "Kafka에서 원시 이벤트 데이터를 수집하는 Python 서비스", projectId: "p3", priority: "high", status: "in_progress", dueDate: "2026-08-25", createdAt: "2026-08-03T09:00:00Z" },
    { id: "t9", title: "dbt 변환 모델 구성", description: "dbt를 사용한 스테이징 및 마트 모델 정의", projectId: "p3", priority: "medium", status: "todo", dueDate: "2026-09-10", createdAt: "2026-08-05T10:00:00Z" },
];
function load(key, fallback) {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    }
    catch {
        return fallback;
    }
}
function save(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}
export function useStore() {
    const [projects, setProjects] = useState(() => load(PROJECTS_KEY, INITIAL_PROJECTS));
    const [tasks, setTasks] = useState(() => load(TASKS_KEY, INITIAL_TASKS));
    useEffect(() => { save(PROJECTS_KEY, projects); }, [projects]);
    useEffect(() => { save(TASKS_KEY, tasks); }, [tasks]);
    const addProject = useCallback((p) => {
        const project = { ...p, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
        setProjects(prev => [project, ...prev]);
        return project;
    }, []);
    const updateProject = useCallback((id, updates) => {
        setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    }, []);
    const deleteProject = useCallback((id) => {
        setProjects(prev => prev.filter(p => p.id !== id));
        setTasks(prev => prev.filter(t => t.projectId !== id));
    }, []);
    const addTask = useCallback((t) => {
        const task = { ...t, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
        setTasks(prev => [task, ...prev]);
        return task;
    }, []);
    const updateTask = useCallback((id, updates) => {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    }, []);
    const deleteTask = useCallback((id) => {
        setTasks(prev => prev.filter(t => t.id !== id));
    }, []);
    return { projects, tasks, addProject, updateProject, deleteProject, addTask, updateTask, deleteTask };
}
