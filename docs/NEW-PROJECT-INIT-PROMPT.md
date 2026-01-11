# 새 프로젝트 초기화 프롬프트 템플릿

> **사용법**: 새 프로젝트를 시작할 때 아래 프롬프트를 복사하고, `[...]` 부분을 수정한 후 Claude에게 전달하세요.

---

## 전체 버전 (권장)

모든 정보를 한 번에 전달하여 완전한 설정을 수행합니다.

```markdown
# 새 프로젝트 프롬프트 수집 시스템 초기화

## 역할
너는 프로젝트 초기 설정 전문가야.
자동화와 일관성을 중시하며, 기존 템플릿을 최대한 활용해.

## 환경 정보
- prompt-library 경로: C:\Users\jusan\Desktop\calclab\prompt-library
- CLAUDE_TEMPLATE 경로: C:\Users\jusan\Desktop\calclab\docs\CLAUDE_TEMPLATE.md
- GitHub 사용자명: HMWKR

## 새 프로젝트 정보
- 프로젝트명: [프로젝트명]
- 프로젝트 경로: [전체 경로, 예: C:\Users\jusan\Desktop\my-app]
- 한 줄 설명: [프로젝트가 뭔지 한 줄로]
- 기술 스택: [React/Node/Python 등]
- 핵심 기능:
  1. [기능1] - [설명]
  2. [기능2] - [설명]
  3. [기능3] - [설명]

## 수행할 작업

### 1단계: prompt-library에 프로젝트 등록
```bash
cd C:\Users\jusan\Desktop\calclab\prompt-library
./scripts/setup-project.sh [프로젝트명] HMWKR --with-claude-md [프로젝트 경로]
```

### 2단계: CLAUDE.md 커스터마이징
복사된 CLAUDE.md의 [TODO: ...] 부분을 위 프로젝트 정보로 수정해줘.

### 3단계: sync-prompts.yml 업데이트
prompt-library/.github/workflows/sync-prompts.yml의 matrix에 프로젝트 추가.

### 4단계: 변경사항 커밋 & 푸시
- prompt-library 변경사항 커밋
- 새 프로젝트 CLAUDE.md 커밋

### 5단계: 초기 폴더 구조 생성 (선택)
프로젝트 기술 스택에 맞는 기본 폴더 구조를 만들어줘.

## 완료 후 출력
- 생성된 파일 목록
- 다음 단계 안내
- 대시보드 URL: https://hmwkr.github.io/prompt-dashboard/
```

---

## 간단 버전 (최소 입력)

핵심 정보만 입력하는 짧은 버전입니다.

```markdown
## 새 프로젝트 초기화

prompt-library: C:\Users\jusan\Desktop\calclab\prompt-library
템플릿: C:\Users\jusan\Desktop\calclab\docs\CLAUDE_TEMPLATE.md

### 프로젝트
- 이름: [프로젝트명]
- 경로: [프로젝트 전체 경로]
- 설명: [한 줄 설명]
- 스택: [기술 스택]
- 기능: [기능1], [기능2], [기능3]

### 요청
1. setup-project.sh 실행
2. CLAUDE.md 커스터마이징
3. sync-prompts.yml 업데이트
4. 전부 커밋 & 푸시
```

---

## 실제 사용 예시

### 예시 1: 예산 관리 앱

```markdown
# 새 프로젝트 프롬프트 수집 시스템 초기화

## 역할
너는 프로젝트 초기 설정 전문가야.
자동화와 일관성을 중시하며, 기존 템플릿을 최대한 활용해.

## 환경 정보
- prompt-library 경로: C:\Users\jusan\Desktop\calclab\prompt-library
- CLAUDE_TEMPLATE 경로: C:\Users\jusan\Desktop\calclab\docs\CLAUDE_TEMPLATE.md
- GitHub 사용자명: HMWKR

## 새 프로젝트 정보
- 프로젝트명: my-budget-app
- 프로젝트 경로: C:\Users\jusan\Desktop\my-budget-app
- 한 줄 설명: 개인 예산 관리 및 지출 분석 웹 애플리케이션
- 기술 스택: React, TypeScript, Supabase, Tailwind CSS
- 핵심 기능:
  1. 수입/지출 기록 - 카테고리별 거래 내역 관리
  2. 예산 설정 - 월별 카테고리 예산 설정 및 알림
  3. 통계 대시보드 - 차트로 지출 패턴 분석

## 수행할 작업
(위 전체 버전과 동일)
```

### 예시 2: API 서버 (간단 버전)

```markdown
## 새 프로젝트 초기화

prompt-library: C:\Users\jusan\Desktop\calclab\prompt-library
템플릿: C:\Users\jusan\Desktop\calclab\docs\CLAUDE_TEMPLATE.md

### 프로젝트
- 이름: my-api-server
- 경로: C:\Users\jusan\Desktop\my-api-server
- 설명: RESTful API 백엔드 서버
- 스택: Node.js, Express, PostgreSQL, Prisma
- 기능: 사용자 인증, CRUD API, 파일 업로드

### 요청
1. setup-project.sh 실행
2. CLAUDE.md 커스터마이징
3. sync-prompts.yml 업데이트
4. 전부 커밋 & 푸시
```

---

## Claude가 수행하는 작업

이 프롬프트를 받으면 Claude는 다음을 자동으로 수행합니다:

```
┌─────────────────────────────────────────────────────────────────────┐
│                     Claude 자동 수행 작업                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  [1단계] setup-project.sh 실행                                      │
│  ├── prompt-library/projects/<name>/config.json 생성                │
│  ├── prompt-library/projects/<name>/prompts/ 폴더 생성              │
│  └── 새 프로젝트에 CLAUDE.md 템플릿 복사                             │
│                                                                      │
│  [2단계] CLAUDE.md 커스터마이징                                      │
│  ├── 프로젝트 개요 섹션 수정                                        │
│  ├── 기술 스택 업데이트                                             │
│  ├── 핵심 기능 목록 작성                                            │
│  └── Quick Start 명령어 추가                                        │
│                                                                      │
│  [3단계] sync-prompts.yml 업데이트                                  │
│  └── matrix에 새 프로젝트 추가                                      │
│                                                                      │
│  [4단계] 커밋 & 푸시                                                 │
│  ├── prompt-library 변경사항 커밋                                   │
│  └── 새 프로젝트 CLAUDE.md 커밋                                     │
│                                                                      │
│  [5단계] 결과 보고                                                   │
│  ├── 생성된 파일 목록                                               │
│  ├── 다음 단계 안내                                                 │
│  └── 대시보드 URL 제공                                              │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 사전 준비 사항

프롬프트 사용 전 확인할 것:

- [ ] 새 프로젝트 폴더가 생성되어 있는지 (`mkdir` 또는 파일 탐색기로)
- [ ] 새 프로젝트가 Git 저장소로 초기화되어 있는지 (`git init`)
- [ ] GitHub에 원격 저장소가 생성되어 있는지
- [ ] 원격 저장소와 연결되어 있는지 (`git remote add origin ...`)

### 사전 준비 명령어

```bash
# 1. 프로젝트 폴더 생성
mkdir C:\Users\jusan\Desktop\my-new-app
cd C:\Users\jusan\Desktop\my-new-app

# 2. Git 초기화
git init

# 3. GitHub 원격 저장소 연결 (GitHub에서 먼저 저장소 생성 필요)
git remote add origin https://github.com/HMWKR/my-new-app.git

# 4. 초기 커밋 (빈 커밋이라도 필요)
git commit --allow-empty -m "Initial commit"
git push -u origin main
```

---

## 문제 해결

### Q: "프로젝트 폴더가 존재하지 않습니다" 오류

새 프로젝트 폴더를 먼저 만들어야 합니다:
```bash
mkdir [프로젝트 경로]
```

### Q: "Git 저장소가 아닙니다" 오류

프로젝트 폴더에서 Git을 초기화해야 합니다:
```bash
cd [프로젝트 경로]
git init
```

### Q: CLAUDE.md가 커스터마이징되지 않음

프로젝트 정보(설명, 기술 스택, 기능)를 더 상세히 작성해주세요.

---

## 관련 문서

- [NEW-PROJECT-SETUP-GUIDE.md](./NEW-PROJECT-SETUP-GUIDE.md) - 비전공자용 상세 가이드
- [CLAUDE_TEMPLATE.md](../../docs/CLAUDE_TEMPLATE.md) - 프로젝트 지침 템플릿
- [prompt-dashboard](https://hmwkr.github.io/prompt-dashboard/) - 프롬프트 통계 대시보드

---

*이 템플릿은 Claude와의 협업으로 작성되었습니다.*
