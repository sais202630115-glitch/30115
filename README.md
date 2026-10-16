# TaskFlow

TaskFlow는 작업과 프로젝트를 관리하는 한국어 웹 애플리케이션입니다. 대시보드에서 진행 상황을 확인하고, 작업과 프로젝트를 생성·수정·삭제할 수 있습니다. 모든 데이터는 브라우저의 `localStorage`에 저장됩니다.

## 주요 기능

- 대시보드 작업 통계와 프로젝트 진행률
- 작업 생성, 조회, 수정, 삭제
- 프로젝트 생성, 조회, 수정, 삭제
- 작업 제목 검색과 상태·우선순위·프로젝트 필터
- 할 일, 진행 중, 완료 상태 변경
- 미완료 기한 초과 작업 표시
- 브라우저 `localStorage` 데이터 저장

## 기술 스택

- JavaScript / JSX
- React 19
- Vite 8
- Tailwind CSS 4

## 실행 방법

Node.js와 pnpm을 설치한 뒤 프로젝트 폴더에서 다음 명령어를 실행합니다.

```bash
pnpm install
pnpm dev
```

터미널에 표시되는 로컬 주소를 브라우저에서 열면 앱을 확인할 수 있습니다.

## 프로덕션 빌드

```bash
pnpm build
```

빌드 결과는 `dist` 폴더에 생성됩니다. `vite.config.js`의 상대 경로 설정을 사용하므로 GitHub Pages와 일반 정적 호스팅 서비스에 배포할 수 있습니다.

## 프로젝트 구조

```text
src/
├── components/
│   ├── Dashboard.jsx
│   ├── Projects.jsx
│   ├── Sidebar.jsx
│   ├── TaskModal.jsx
│   └── Tasks.jsx
├── App.jsx
├── index.css
├── main.jsx
└── store.js
```

## 데이터 저장

작업과 프로젝트는 각각 `taskflow_tasks`, `taskflow_projects` 키로 브라우저 `localStorage`에 저장됩니다. 서버나 별도의 데이터베이스는 필요하지 않습니다.
