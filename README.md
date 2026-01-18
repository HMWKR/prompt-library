# Prompt Registry

프롬프트 에코시스템의 **프로젝트 레지스트리**입니다.

---

## 역할

```
┌─────────────────────────────────────────────────────────────────┐
│                    Distributed Push Architecture                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  각 프로젝트 (CalcLab, claude-templates, ...)                  │
│       │                                                         │
│       │ prompts.json 자체 배포 (gh-pages)                      │
│       ▼                                                         │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                 prompt-registry                          │   │
│  │                 (이 저장소)                              │   │
│  │                                                          │   │
│  │  역할: 프로젝트 목록 관리                                │   │
│  │  파일: data/projects.json                                │   │
│  │                                                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│       │                                                         │
│       │ 프로젝트 목록 제공                                     │
│       ▼                                                         │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                 prompt-dashboard                         │   │
│  │                                                          │   │
│  │  1. projects.json fetch (이 저장소에서)                  │   │
│  │  2. 각 프로젝트 prompts.json fetch                       │   │
│  │  3. 브라우저에서 데이터 집계 및 시각화                   │   │
│  │                                                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**핵심 원칙**: 이 저장소는 **프로젝트 목록만** 관리합니다.
- 프롬프트 데이터는 각 프로젝트가 자체 gh-pages에 배포
- 데이터 집계는 prompt-dashboard가 브라우저에서 수행
- 중앙 서버 없는 완전 분산 아키텍처

---

## 폴더 구조

```
prompt-registry/
├── data/
│   └── projects.json      # 프로젝트 레지스트리 (v3.0)
├── docs/                  # 가이드 문서
├── schema/                # JSON 스키마 정의
├── archive/               # 레거시 폴더 (참조용)
│   ├── projects/          # (구) 프로젝트별 데이터
│   ├── global/            # (구) 중앙 집계 데이터
│   └── scripts/           # (구) 추출 스크립트
├── CLAUDE.md              # Claude 협업 지침
└── README.md              # 이 문서
```

---

## 등록된 프로젝트

| 프로젝트 | 설명 | 카테고리 | 상태 |
|----------|------|:--------:|:----:|
| [CLAUDE-TEMPLATES](https://github.com/HMWKR/CLAUDE-TEMPLATES) | Claude 협업 템플릿 | template | ✅ |
| [CalcLab](https://github.com/HMWKR/CalcLab) | SI 차원 분석 계산기 | application | ✅ |
| [promptProject](https://github.com/HMWKR/promptProject) | 프롬프트 설정 가이드 | guide | ✅ |
| [prompt-dashboard](https://github.com/HMWKR/prompt-dashboard) | 시각화 대시보드 | dashboard | ✅ |

---

## projects.json 스키마 (v3.0)

```json
{
  "version": "3.0",
  "architecture": "distributed-push",
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

### 필드 설명

| 필드 | 용도 |
|------|------|
| `promptsUrl` | 각 프로젝트의 prompts.json URL (dashboard가 fetch) |
| `metadata` | 프로젝트 분류 및 상태 정보 |
| `cache` | 대시보드가 캐시한 통계 (선택) |
| `summary` | 전체 요약 통계 |

---

## 새 프로젝트 등록

### 1. 프로젝트에 시스템 설치

```bash
# claude-templates의 init-project.sh 실행
curl -sL https://raw.githubusercontent.com/HMWKR/CLAUDE-TEMPLATES/main/init-project.sh | bash
```

### 2. 이 저장소에 등록

`data/projects.json`에 프로젝트 추가:

```json
{
  "name": "new-project",
  "repo": "owner/new-project",
  "owner": "owner",
  "promptsUrl": "https://owner.github.io/new-project/prompts.json",
  "metadata": {
    "category": "application",
    "status": "active",
    "description": "프로젝트 설명"
  },
  "cache": {
    "promptCount": null,
    "lastFetched": null
  }
}
```

### 3. PR 생성

```bash
git checkout -b add-new-project
git add data/projects.json
git commit -m "chore: add new-project to registry"
git push origin add-new-project
# → PR 생성
```

---

## 관련 저장소

| 저장소 | 역할 | URL |
|--------|------|-----|
| **prompt-ecosystem** | 문서 허브 | (로컬) |
| **prompt-dashboard** | 시각화 | https://github.com/HMWKR/prompt-dashboard |
| **claude-templates** | 템플릿 소스 | https://github.com/HMWKR/CLAUDE-TEMPLATES |

---

## 라이선스

MIT

---

*최종 업데이트: 2026-01-15*
*버전: v3.0 (프로젝트 레지스트리)*
*Claude Opus 4.5 + User 협업*
