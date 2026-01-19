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

## 9-2. 깊은 사고 기법 (Deep Reasoning Techniques)

> **2026-01-16 변경**: Thinking budget이 기본 최대(31,999 토큰)로 설정됨.
> `ultrathink`, `think hard` 등 키워드는 더 이상 작동하지 않음.

### 효과적인 사고 유도 방법

| 방법 | 프롬프트 예시 | 효과 |
|------|--------------|------|
| **High-level Instruction** | "깊이 분석해줘" | Anthropic 공식 권장 |
| **Step-by-step** | "단계별로 분석해줘" | Chain of Thought |
| **Structured Output** | "`<thinking>`과 `<answer>` 태그로 구분해줘" | 사고/결론 분리 |
| **Problem Decomposition** | "하위 문제로 분해해서 해결해줘" | 복잡한 문제 분해 |
| **Self-Verification** | "결론 전에 스스로 검증해줘" | 정확도 향상 |

### 핵심 원칙

> **"Claude often performs better with high-level instructions to just think deeply about a task rather than step-by-step prescriptive guidance."**
> — [Claude Docs](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/extended-thinking-tips)

**즉, "단계별로 해라"보다 "깊이 분석해라"가 더 효과적.**

### 5단계 고차원 사고 유도 프롬프트

> **핵심 원칙**: 모든 작업에서 **5단계 메타인지 프롬프트를 기본**으로 적용

| 레벨 | 효과 | 설명 |
|:----:|:----:|------|
| 1단계 | 낮음 | 기본 ("단계별로 생각해줘") |
| 2단계 | 중간 | 구조화된 사고 유도 |
| 3단계 | 높음 | 계층적 분해 (Hierarchical Decomposition) |
| 4단계 | 매우 높음 | XML 태그 구조화 |
| **5단계** | **최고** | **메타인지 프롬프트 ⭐ 기본 권장** |

#### 5단계: 메타인지 프롬프트 (최고 수준) ⭐ 기본 권장

> **모든 작업에서 이 방식을 기본으로 사용**

```
이 문제를 해결하기 전에:

1. **가정 검토**: 내가 당연하게 여기는 전제는 무엇인가?
2. **반대 관점**: 이 결론에 반대하는 가장 강력한 논거는?
3. **실패 모드**: 이 해결책이 실패할 수 있는 시나리오는?
4. **숨겨진 변수**: 내가 놓치고 있을 수 있는 요소는?
5. **확신도**: 내 결론에 대해 얼마나 확신하는가? (1-10)

각 단계를 명시적으로 거친 후 최종 답변을 제시해줘.
```

> ✅ **Claude는 모든 작업에서 위 5가지 자가 검증을 내부적으로 수행해야 함**

### Thinking Mode 분기 가이드

| Thinking Mode | 권장 프롬프트 스타일 |
|:-------------:|---------------------|
| **ON** | 5단계 메타인지 + 고수준 지시 ("깊이 생각해") |
| **OFF** | 5단계 메타인지 + 구조화된 지시 (XML 태그, 단계별 프레임워크) |

---

## 10. 문제 해결 프로토콜

> **2026-01-16 변경**: `ultrathink` 키워드는 더 이상 작동하지 않음. 대신 5단계 메타인지 사고 적용.

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
1) 5단계 메타인지 사고 적용 (모든 작업)
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
