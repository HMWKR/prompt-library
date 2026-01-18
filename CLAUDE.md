# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## 1. 프로젝트 개요

**prompt-library (prompt-registry)**는 프롬프트 에코시스템의 **프로젝트 레지스트리**입니다.

### 역할

| 항목 | 설명 |
|------|------|
| **핵심 역할** | 에코시스템에 등록된 프로젝트 목록 관리 |
| **핵심 파일** | `data/projects.json` |
| **소비자** | prompt-dashboard (브라우저에서 fetch) |

### 분산 Push 아키텍처에서의 위치

```
각 프로젝트 (prompts.json 자체 배포)
       ↓
  prompt-registry ← 이 저장소 (프로젝트 목록만)
       ↓
  prompt-dashboard (브라우저에서 집계)
```

**중요**: 이 저장소는 프로젝트 **목록만** 관리합니다. 프롬프트 데이터 수집/집계는 수행하지 않습니다.

---

## 2. Quick Start

### projects.json 수정

```bash
# 1. 파일 열기
code data/projects.json

# 2. 새 프로젝트 추가 (projects 배열에)
# 3. 커밋
git add data/projects.json
git commit -m "chore: add new-project to registry"
git push origin main
```

### 주요 명령어

| 명령어 | 설명 |
|--------|------|
| `git status` | 변경 사항 확인 |
| `git diff data/projects.json` | JSON 변경 확인 |

---

## 3. 아키텍처

### 폴더 구조

```
prompt-library/
├── data/
│   └── projects.json      # v3.0 프로젝트 레지스트리
├── docs/                  # 가이드 문서
├── schema/                # JSON 스키마
├── archive/               # 레거시 (참조용)
│   ├── projects/
│   ├── global/
│   └── scripts/
├── .github/
│   └── workflows/
├── CLAUDE.md              # 이 문서
└── README.md
```

### 핵심 파일

| 파일 | 역할 | 중요도 |
|------|------|:------:|
| `data/projects.json` | 프로젝트 레지스트리 | ⭐⭐⭐ |
| `README.md` | 저장소 설명 | ⭐⭐ |
| `schema/*.json` | 스키마 정의 | ⭐ |

---

## 4. projects.json 스키마 (v3.0)

### 구조

```json
{
  "version": "3.0",
  "architecture": "distributed-push",
  "lastUpdated": "YYYY-MM-DD",
  "description": "...",
  "projects": [
    {
      "name": "프로젝트명",
      "repo": "owner/repo",
      "owner": "owner",
      "promptsUrl": "https://owner.github.io/repo/prompts.json",
      "metadata": {
        "category": "template|application|guide|dashboard",
        "status": "active|inactive|archived",
        "description": "프로젝트 설명"
      },
      "cache": {
        "promptCount": null,
        "lastFetched": null
      }
    }
  ],
  "summary": {
    "totalProjects": 4,
    "totalPromptsCached": null,
    "lastAggregated": null
  }
}
```

### 필드 규칙

| 필드 | 필수 | 규칙 |
|------|:----:|------|
| `name` | ✅ | 프로젝트 표시 이름 |
| `repo` | ✅ | GitHub 저장소 경로 (owner/repo) |
| `promptsUrl` | ✅ | 정확한 gh-pages URL |
| `metadata.category` | ✅ | template, application, guide, dashboard 중 하나 |
| `metadata.status` | ✅ | active, inactive, archived 중 하나 |
| `cache` | ❌ | dashboard가 업데이트 (수동 수정 금지) |

---

## 5-8. 해당 없음

> 이 저장소는 순수 레지스트리로, 타입 시스템/테스트/환경 설정/알려진 이슈가 해당되지 않습니다.

---

# Claude 작업 지침

---

## 9. 언어 및 스타일

- 모든 대화 및 출력은 **한국어**로 작성
- **기술문서 스타일** (명확·간결·구조적)
- JSON 수정 시 **포맷 유지** (2칸 들여쓰기)

---

## 9-1. 환각 방지 프로토콜 — 필수

### 핵심 원칙: Read Before Write

| 단계 | 행동 | 금지 |
|:----:|------|------|
| 1 | projects.json 수정 전 **반드시 Read로 확인** | 존재 여부 추정 금지 |
| 2 | URL은 **실제 gh-pages 확인** | 추정 URL 금지 |
| 3 | 프로젝트 정보는 **실제 GitHub에서 확인** | 기억 의존 금지 |

### 불확실성 표시

| 표시 | 의미 |
|------|------|
| `[검증됨]` | 실제 파일/URL에서 확인 |
| `[추정]` | 패턴 기반 추측 |
| `[미확인]` | 확인 필요 |

---

## 10. 문제 해결 프로토콜

> **모든 작업은 ultrathink 모드로 진행한다.**

### 레지스트리 작업 워크플로우

| 단계 | 행동 |
|:----:|------|
| 0 | CLAUDE.md 지침 확인 |
| 1 | projects.json 읽기 |
| 2 | 변경 사항 계획 |
| 3 | JSON 수정 |
| 4 | 형식 검증 |

---

## 11. projects.json 수정 규칙

### DO (해야 할 것)

- [x] 새 프로젝트 추가 시 모든 필수 필드 포함
- [x] `lastUpdated` 날짜 업데이트
- [x] `summary.totalProjects` 카운트 업데이트
- [x] JSON 형식 유지 (2칸 들여쓰기)

### DON'T (하지 말 것)

- [ ] `cache` 필드 수동 수정 (dashboard가 관리)
- [ ] `promptsUrl` 형식 변경 (https://owner.github.io/repo/prompts.json)
- [ ] 프로젝트 삭제 (archived로 변경)

### 예시: 새 프로젝트 추가

```json
{
  "name": "new-project",
  "repo": "HMWKR/new-project",
  "owner": "HMWKR",
  "promptsUrl": "https://hmwkr.github.io/new-project/prompts.json",
  "metadata": {
    "category": "application",
    "status": "active",
    "description": "새로운 프로젝트 설명"
  },
  "cache": {
    "promptCount": null,
    "lastFetched": null
  }
}
```

---

## 12. 커밋 메시지 규칙

### 간소화 형식 (레지스트리 특화)

```
[type]: [한 줄 요약]

## 변경 내용
- [수정/추가 항목]

## 변경 이유
- [왜 이 변경이 필요한지]

---
Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
```

### 커밋 타입

| 타입 | 용도 |
|------|------|
| `chore` | 프로젝트 추가/수정 |
| `docs` | README/문서 수정 |
| `fix` | 오류 수정 |

---

## 13-19. 공통 규칙 (간소화)

### 보안 규칙

- 민감 정보 (토큰, API 키) 코드 포함 **금지**
- URL 검증 필수

### 문서 업데이트

다음 상황 시 README.md 업데이트 제안:
- 새 카테고리 추가 시
- 스키마 변경 시

### 사고 절차 (필수)

```
[1단계] 현재 projects.json 읽기
[2단계] 변경 계획 수립
[3단계] JSON 수정
[4단계] 형식 검증
[5단계] 커밋
```

---

## Safety Rules (절대 금지)

- 기존 프로젝트 삭제 금지 (archived로 변경)
- promptsUrl 형식 변경 금지
- cache 필드 수동 수정 금지

---

## 미션

```
[미션]
너는 prompt-registry의 관리자다.
프로젝트 목록을 정확하게 관리하고, 스키마 규칙을 준수하라.

[환각 방지 최우선]
- projects.json 수정 전 반드시 Read
- URL은 실제 확인
- 불확실한 정보는 [추정] 표시

[필수 준수]
1) ultrathink 모드
2) JSON 형식 유지
3) 필수 필드 누락 금지
4) cache 필드 수동 수정 금지
```

---

# End of CLAUDE.md

<!--
작성일: 2026-01-15
작성자: Claude Opus 4.5
저장소: prompt-library (프로젝트 레지스트리)
버전: v3.0
-->
