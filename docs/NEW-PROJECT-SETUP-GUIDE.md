# 새 프로젝트 프롬프트 수집 설정 가이드

> **이 가이드의 목적**: 새로운 프로젝트에서 AI(Claude)와의 대화 기록을 자동으로 수집하고 분석하는 시스템을 설정합니다.
>
> **예상 소요 시간**: 약 15-20분
>
> **난이도**: 초급 (터미널 기본 사용법만 알면 됨)

---

## 목차

1. [이 시스템이 뭔가요?](#1-이-시스템이-뭔가요)
2. [시작하기 전에 필요한 것](#2-시작하기-전에-필요한-것)
3. [1단계: 스크립트 실행하기](#3-1단계-스크립트-실행하기)
4. [2단계: CLAUDE.md 파일 수정하기](#4-2단계-claudemd-파일-수정하기)
5. [3단계: 워크플로우 파일 수정하기](#5-3단계-워크플로우-파일-수정하기)
6. [4단계: 변경사항 저장하기 (커밋 & 푸시)](#6-4단계-변경사항-저장하기-커밋--푸시)
7. [5단계: 결과 확인하기](#7-5단계-결과-확인하기)
8. [자주 묻는 질문 (FAQ)](#8-자주-묻는-질문-faq)
9. [문제 해결](#9-문제-해결)
10. [용어 설명](#10-용어-설명)

---

## 1. 이 시스템이 뭔가요?

### 한 줄 요약

**"Claude와 나눈 대화를 자동으로 모아서 통계로 보여주는 시스템"**

### 왜 필요한가요?

프로젝트를 진행하면서 Claude에게 여러 가지 요청을 하게 됩니다:

```
"로그인 기능 만들어줘"
"이 버그 고쳐줘"
"테스트 코드 작성해줘"
```

이런 대화들을 **커밋 메시지**에 기록해두면, 나중에:

- 어떤 요청이 효과적이었는지 분석할 수 있고
- 비슷한 작업을 할 때 참고할 수 있으며
- AI와의 협업 패턴을 개선할 수 있습니다

### 어떻게 동작하나요?

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│   [당신이 하는 일]                                               │
│   1. Claude에게 요청 → 코드 작성                                 │
│   2. 커밋할 때 대화 내용을 메시지에 포함                          │
│                                                                  │
│   [자동으로 일어나는 일]                                         │
│   3. GitHub가 6시간마다 커밋 메시지를 스캔                        │
│   4. 대화 내용을 추출해서 저장                                   │
│   5. 통계를 계산해서 대시보드에 표시                             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. 시작하기 전에 필요한 것

### 필수 준비물

| 항목 | 설명 | 확인 방법 |
|------|------|----------|
| **Git** | 코드 버전 관리 도구 | 터미널에서 `git --version` 입력 |
| **GitHub 계정** | 코드 저장소 서비스 | github.com에 로그인 |
| **새 프로젝트 폴더** | 설정할 프로젝트 | 폴더가 존재하는지 확인 |
| **prompt-library 저장소** | 프롬프트 수집 저장소 | 이미 클론되어 있어야 함 |

### Git이 설치되어 있는지 확인하기

터미널(명령 프롬프트)을 열고 다음을 입력합니다:

```bash
git --version
```

**결과 예시:**
```
git version 2.43.0
```

이런 식으로 버전이 나오면 설치되어 있는 것입니다.

### prompt-library가 있는지 확인하기

```bash
# Windows의 경우 (예시 경로)
cd C:\Users\사용자명\Desktop\calclab\prompt-library

# Mac/Linux의 경우 (예시 경로)
cd ~/Desktop/calclab/prompt-library
```

이 폴더가 존재해야 합니다. 없다면 먼저 클론해야 합니다:

```bash
git clone https://github.com/HMWKR/prompt-library.git
```

---

## 3. 1단계: 스크립트 실행하기

### 스크립트란?

**스크립트**는 여러 작업을 자동으로 해주는 "레시피" 같은 것입니다.

우리가 만든 `setup-project.sh` 스크립트는:
- 필요한 폴더를 만들고
- 설정 파일을 생성하고
- CLAUDE.md 템플릿을 복사합니다

### 실행 방법

#### Windows 사용자

1. **Git Bash 열기**
   - 시작 메뉴에서 "Git Bash" 검색 후 실행
   - 또는 폴더에서 우클릭 → "Git Bash Here"

2. **prompt-library 폴더로 이동**
   ```bash
   cd /c/Users/사용자명/Desktop/calclab/prompt-library
   ```

   > **팁**: `/c/`는 Windows의 `C:\`를 의미합니다

3. **스크립트 실행**
   ```bash
   ./scripts/setup-project.sh 프로젝트이름 깃허브아이디 --with-claude-md 새프로젝트경로
   ```

#### Mac/Linux 사용자

1. **터미널 열기**
   - Mac: Spotlight에서 "터미널" 검색
   - Linux: Ctrl+Alt+T

2. **prompt-library 폴더로 이동**
   ```bash
   cd ~/Desktop/calclab/prompt-library
   ```

3. **스크립트 실행**
   ```bash
   ./scripts/setup-project.sh 프로젝트이름 깃허브아이디 --with-claude-md 새프로젝트경로
   ```

### 실제 예시

가정:
- 새 프로젝트 이름: `my-todo-app`
- GitHub 아이디: `HMWKR`
- 새 프로젝트 위치: `C:\Users\jusan\Desktop\my-todo-app`

```bash
# Windows (Git Bash)
./scripts/setup-project.sh my-todo-app HMWKR --with-claude-md /c/Users/jusan/Desktop/my-todo-app

# Mac/Linux
./scripts/setup-project.sh my-todo-app HMWKR --with-claude-md ~/Desktop/my-todo-app
```

### 성공하면 이런 화면이 나옵니다

```
==================================================
  새 프로젝트 프롬프트 수집 설정
==================================================

  프로젝트: my-todo-app
  저장소:   HMWKR/my-todo-app

[Step 1] 프로젝트 폴더 생성
✓ 생성됨: .../prompt-library/projects/my-todo-app/prompts/

[Step 2] config.json 생성
✓ 생성됨: .../prompt-library/projects/my-todo-app/config.json

[Step 3] 워크플로우 업데이트
⚠ sync-prompts.yml의 matrix에 다음을 추가해주세요:
  - { name: "my-todo-app", repo: "HMWKR/my-todo-app" }

[Step 4] CLAUDE.md 템플릿 복사
✓ 복사됨: .../my-todo-app/CLAUDE.md
⚠ CLAUDE.md의 [TODO: ...] 부분을 수정해주세요!

==================================================
  ✓ my-todo-app 프로젝트 설정 완료!
==================================================
```

### 무엇이 생성되었나요?

스크립트 실행 후 두 곳에 파일이 생성됩니다:

**1. prompt-library 안 (프롬프트 수집 설정)**
```
prompt-library/
└── projects/
    └── my-todo-app/           ← 새로 생성됨!
        ├── config.json        ← 프로젝트 설정
        └── prompts/           ← 나중에 프롬프트가 저장될 곳
```

**2. 새 프로젝트 폴더 안 (Claude 지침서)**
```
my-todo-app/
└── CLAUDE.md                  ← 새로 생성됨!
```

---

## 4. 2단계: CLAUDE.md 파일 수정하기

### CLAUDE.md가 뭔가요?

**CLAUDE.md**는 Claude에게 "이 프로젝트에서는 이렇게 일해줘"라고 알려주는 **지침서**입니다.

이 파일에는:
- 프로젝트 설명
- 코드 작성 규칙
- **커밋 메시지 작성 방법** (이게 프롬프트 수집의 핵심!)

### 수정해야 할 부분 찾기

복사된 CLAUDE.md를 열면 `[TODO: ...]`라고 표시된 부분이 있습니다.
이 부분을 당신의 프로젝트에 맞게 수정해야 합니다.

### 수정 방법

**1. 파일 열기**

원하는 텍스트 편집기로 CLAUDE.md를 엽니다:
- Windows: 메모장, VS Code, Notepad++
- Mac: TextEdit, VS Code

**2. [TODO: ...] 부분 찾아서 수정하기**

**수정 전:**
```markdown
## 1. 프로젝트 개요

**[TODO: 프로젝트명]**은 [TODO: 한 줄 설명]입니다.

### 핵심 기능

1. **[TODO: 기능1]** - [설명]
2. **[TODO: 기능2]** - [설명]
```

**수정 후:**
```markdown
## 1. 프로젝트 개요

**My Todo App**은 할 일을 관리하는 웹 애플리케이션입니다.

### 핵심 기능

1. **할 일 추가** - 새로운 할 일을 목록에 추가
2. **완료 표시** - 완료된 항목에 체크 표시
```

### 절대 수정하면 안 되는 부분

**섹션 12. 커밋 메시지 규칙**은 수정하지 마세요!

이 부분이 프롬프트 수집의 핵심입니다:

```markdown
## 12. 커밋 메시지 규칙

### 원본 프롬프트
```
사용자가 실제로 입력한 내용
```

### 프롬프트 분석
> **해석**: Claude가 이해한 내용
> ...

### 최적화된 프롬프트
```
개선된 버전
```
```

이 형식이 그대로 있어야 나중에 프롬프트가 자동으로 수집됩니다.

---

## 5. 3단계: 워크플로우 파일 수정하기

### 워크플로우란?

**워크플로우**는 "언제, 무엇을 자동으로 할지" 정의한 것입니다.

GitHub Actions라는 서비스가 이 파일을 읽고:
- 6시간마다 자동으로 실행되어
- 각 프로젝트의 커밋을 스캔하고
- 프롬프트를 추출합니다

### 수정할 파일 위치

```
prompt-library/
└── .github/
    └── workflows/
        └── sync-prompts.yml    ← 이 파일을 수정
```

> **참고**: `.github` 폴더는 숨김 폴더입니다
> - Windows: 파일 탐색기에서 "숨김 항목" 표시 체크
> - Mac: Cmd + Shift + . 으로 숨김 파일 표시

### 수정 방법

**1. 파일 열기**

`sync-prompts.yml` 파일을 텍스트 편집기로 엽니다.

**2. matrix 섹션 찾기**

파일 안에서 `matrix:`를 찾습니다. 이런 모양입니다:

```yaml
strategy:
  matrix:
    project:
      - { name: "calclab", repo: "HMWKR/CalcLab" }
```

**3. 새 프로젝트 추가**

기존 줄 아래에 새 프로젝트를 추가합니다:

```yaml
strategy:
  matrix:
    project:
      - { name: "calclab", repo: "HMWKR/CalcLab" }
      - { name: "my-todo-app", repo: "HMWKR/my-todo-app" }  # ← 이 줄 추가!
```

### 주의사항

- 들여쓰기(앞의 공백)를 정확히 맞춰야 합니다
- 띄어쓰기 2칸씩 사용
- 쉼표, 따옴표 위치 정확히

**올바른 예:**
```yaml
      - { name: "my-todo-app", repo: "HMWKR/my-todo-app" }
```

**잘못된 예:**
```yaml
- { name: "my-todo-app", repo: "HMWKR/my-todo-app" }  # 들여쓰기 없음!
      - { name: 'my-todo-app', repo: 'HMWKR/my-todo-app' }  # 작은따옴표 사용!
```

---

## 6. 4단계: 변경사항 저장하기 (커밋 & 푸시)

### 커밋과 푸시가 뭔가요?

- **커밋(Commit)**: 변경사항을 "저장"하는 것 (로컬 컴퓨터에)
- **푸시(Push)**: 저장한 내용을 "인터넷(GitHub)에 올리는" 것

### prompt-library 변경사항 저장하기

**터미널에서:**

```bash
# 1. prompt-library 폴더로 이동
cd /c/Users/사용자명/Desktop/calclab/prompt-library

# 2. 변경된 파일 확인
git status

# 3. 모든 변경사항 추가
git add .

# 4. 커밋 (저장)
git commit -m "feat: my-todo-app 프로젝트 추가"

# 5. 푸시 (GitHub에 올리기)
git push origin main
```

**각 명령어 설명:**

| 명령어 | 의미 |
|--------|------|
| `git status` | "뭐가 바뀌었는지 보여줘" |
| `git add .` | "바뀐 것 전부 준비해" |
| `git commit -m "메시지"` | "이 메시지로 저장해" |
| `git push origin main` | "GitHub에 올려" |

### 새 프로젝트의 CLAUDE.md 저장하기

```bash
# 1. 새 프로젝트 폴더로 이동
cd /c/Users/사용자명/Desktop/my-todo-app

# 2. CLAUDE.md 추가
git add CLAUDE.md

# 3. 커밋
git commit -m "docs: CLAUDE.md 프롬프트 지침 추가"

# 4. 푸시
git push origin main
```

### 성공 확인

푸시가 성공하면 이런 메시지가 나옵니다:

```
To https://github.com/HMWKR/prompt-library.git
   abc1234..def5678  main -> main
```

---

## 7. 5단계: 결과 확인하기

### 언제 결과를 볼 수 있나요?

GitHub Actions는 **6시간마다** 자동 실행됩니다.

따라서:
- 설정 직후에는 데이터가 없습니다
- 첫 번째 프롬프트가 포함된 커밋을 하고
- 6시간 후에 대시보드에서 확인할 수 있습니다

### 대시보드 접속

브라우저에서 다음 주소로 접속:

```
https://hmwkr.github.io/prompt-dashboard/
```

### 대시보드에서 볼 수 있는 것

| 항목 | 설명 |
|------|------|
| **총 프롬프트 수** | 지금까지 수집된 대화 수 |
| **프로젝트별 통계** | 각 프로젝트의 프롬프트 수 |
| **커밋 타입 분포** | feat, fix, docs 등의 비율 |
| **키워드 클라우드** | 자주 사용한 단어들 |
| **월별 트렌드** | 시간에 따른 변화 |

### 프롬프트가 수집되려면?

커밋 메시지에 다음 형식으로 작성해야 합니다:

```
feat: 로그인 기능 구현

## 산출물
- LoginForm.tsx 생성
- authService.ts 생성

## 프롬프트 기록

### 원본 프롬프트
```
로그인 폼 만들어줘. 이메일이랑 비밀번호 입력받고 로그인 버튼 있게.
```

### 프롬프트 분석
> **해석**: 이메일/비밀번호 입력 폼과 로그인 버튼이 있는 컴포넌트 생성
> **작업 유형**: 수렴적
> **제약 수준**: 중간
> **핵심 키워드**: 로그인, 폼, 이메일, 비밀번호

### 최적화된 프롬프트
```
React로 로그인 폼 컴포넌트를 만들어줘:
- 입력 필드: 이메일(유효성 검사 포함), 비밀번호
- 로그인 버튼: 클릭 시 onSubmit 호출
- 에러 메시지 표시 영역
```

---
🤖 Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
```

---

## 8. 자주 묻는 질문 (FAQ)

### Q: 모든 커밋에 프롬프트를 기록해야 하나요?

**A: 아니요.**

Claude와 대화한 작업만 기록하면 됩니다.
단순한 오타 수정이나 혼자 한 작업은 일반 커밋 메시지로 해도 됩니다.

### Q: 프롬프트 형식을 꼭 지켜야 하나요?

**A: 네.**

자동 수집 시스템이 `### 원본 프롬프트`, `### 프롬프트 분석` 같은 마커를 찾아서 추출합니다.
형식이 다르면 인식되지 않습니다.

### Q: 영어로 작성해도 되나요?

**A: 네.**

프롬프트 내용은 한국어든 영어든 상관없습니다.
마커(### 원본 프롬프트 등)만 정확하면 됩니다.

### Q: 민감한 정보가 포함되면 어떻게 하나요?

**A: 주의하세요!**

커밋 메시지는 공개 저장소에서 누구나 볼 수 있습니다.
비밀번호, API 키, 개인정보는 절대 포함하지 마세요.

### Q: 나중에 프로젝트를 추가할 수 있나요?

**A: 네.**

같은 스크립트를 다시 실행하면 됩니다.
이미 있는 프로젝트는 자동으로 건너뜁니다.

---

## 9. 문제 해결

### 문제: "permission denied" 오류

```
bash: ./scripts/setup-project.sh: Permission denied
```

**해결:**
```bash
chmod +x scripts/setup-project.sh
```

이 명령어는 스크립트에 "실행 권한"을 부여합니다.

### 문제: "No such file or directory" 오류

```
bash: ./scripts/setup-project.sh: No such file or directory
```

**해결:**
현재 위치가 `prompt-library` 폴더인지 확인하세요:
```bash
pwd
# 출력이 .../prompt-library 여야 합니다
```

### 문제: CLAUDE.md가 복사되지 않음

```
[Step 4] CLAUDE.md 템플릿 복사
✗ 경로가 존재하지 않습니다: /path/to/project
```

**해결:**
- 새 프로젝트 폴더가 실제로 존재하는지 확인
- 경로를 정확히 입력했는지 확인
- Windows에서는 `/c/Users/...` 형식 사용

### 문제: git push 실패

```
error: failed to push some refs to 'github.com/...'
```

**해결:**
```bash
# 먼저 최신 변경사항 가져오기
git pull origin main

# 다시 푸시
git push origin main
```

### 문제: 대시보드에 데이터가 안 보임

**확인할 것:**
1. 커밋 메시지에 프롬프트 형식이 정확한가?
2. 커밋을 푸시했는가?
3. 6시간이 지났는가? (GitHub Actions 실행 주기)

**수동으로 GitHub Actions 실행하기:**
1. GitHub에서 prompt-library 저장소 접속
2. "Actions" 탭 클릭
3. "Sync Prompts" 워크플로우 선택
4. "Run workflow" 버튼 클릭

---

## 10. 용어 설명

| 용어 | 쉬운 설명 |
|------|----------|
| **Git** | 코드의 변경 이력을 관리하는 도구. "저장" 버튼의 고급 버전 |
| **GitHub** | Git으로 관리하는 코드를 인터넷에 저장하는 서비스 |
| **저장소(Repository)** | 프로젝트 폴더. 코드와 이력이 담긴 곳 |
| **커밋(Commit)** | 변경사항을 저장하는 행위. 게임의 "세이브 포인트" 같은 것 |
| **푸시(Push)** | 로컬 저장 내용을 GitHub에 올리는 것 |
| **풀(Pull)** | GitHub의 최신 내용을 내 컴퓨터로 가져오는 것 |
| **브랜치(Branch)** | 코드의 평행 세계. 원본을 건드리지 않고 실험할 수 있음 |
| **터미널** | 명령어를 입력하는 검은 화면. 명령 프롬프트, Git Bash 등 |
| **스크립트** | 여러 명령어를 모아놓은 자동화 파일 |
| **워크플로우** | 자동으로 실행되는 작업 순서 |
| **GitHub Actions** | GitHub에서 제공하는 자동화 서비스 |
| **YAML** | 설정 파일 형식. `.yml` 확장자 |
| **마커** | 특정 위치를 표시하는 문자열. 예: `### 원본 프롬프트` |

---

## 체크리스트

설정이 완료되었는지 확인하세요:

- [ ] 스크립트 실행 완료
- [ ] `projects/<이름>/config.json` 파일 존재
- [ ] `projects/<이름>/prompts/` 폴더 존재
- [ ] 새 프로젝트에 `CLAUDE.md` 파일 존재
- [ ] `CLAUDE.md`의 `[TODO: ...]` 부분 수정 완료
- [ ] `sync-prompts.yml`에 프로젝트 추가 완료
- [ ] prompt-library 커밋 & 푸시 완료
- [ ] 새 프로젝트 CLAUDE.md 커밋 & 푸시 완료

모든 항목에 체크되었다면, 설정 완료!

---

## 다음 단계

1. **프로젝트 작업 시작**: Claude와 대화하며 코드 작성
2. **커밋 시 프롬프트 기록**: CLAUDE.md의 형식에 맞춰 커밋 메시지 작성
3. **6시간 후 확인**: 대시보드에서 수집된 프롬프트 확인
4. **패턴 분석**: 어떤 프롬프트가 효과적이었는지 분석

---

**도움이 필요하면:**
- GitHub Issues: https://github.com/HMWKR/prompt-library/issues
- 대시보드: https://hmwkr.github.io/prompt-dashboard/

---

*이 가이드는 Claude와의 협업으로 작성되었습니다.*
