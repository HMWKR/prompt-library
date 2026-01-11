# Prompt Library

AI 협업 프롬프트 라이브러리 - 프롬프트 통계 분석 및 학습 자료

## 개요

이 저장소는 여러 프로젝트의 커밋 메시지에서 **3단계 프롬프트 기록**을 수집하고 분석합니다:

1. **원본 프롬프트**: 사용자가 실제로 입력한 내용
2. **프롬프트 분석**: Claude의 해석 (작업 유형, 제약 수준, 핵심 키워드)
3. **최적화된 프롬프트**: 더 나은 결과를 위한 개선 버전

## 대시보드

**Live Dashboard**: [https://hmwkr.github.io/prompt-dashboard/](https://hmwkr.github.io/prompt-dashboard/)

대시보드는 별도 저장소로 분리되었습니다: [prompt-dashboard](https://github.com/HMWKR/prompt-dashboard)

## 프로젝트 구조

```
prompt-library/
├── projects/           # 프로젝트별 프롬프트
│   └── calclab/
│       ├── config.json
│       ├── prompts/
│       └── stats/
├── global/             # 전체 통합 데이터 (대시보드 데이터 소스)
│   ├── index.json
│   └── stats/
├── docs/templates/     # 재사용 가능한 프롬프트 템플릿
└── scripts/            # 추출/분석 스크립트
```

## 통계 현황

<!-- STATS_START -->
*통계가 아직 생성되지 않았습니다.*
<!-- STATS_END -->

## 프롬프트 기록 형식

커밋 메시지에서 다음 형식의 프롬프트를 추출합니다:

```markdown
## 프롬프트 기록

### 원본 프롬프트
```
사용자 입력 내용
```

### 프롬프트 분석
> **해석**: Claude가 이해한 내용
> **작업 유형**: 수렴적/발산적/혼합형
> **제약 수준**: 높음/중간/낮음
> **핵심 키워드**: keyword1, keyword2

### 최적화된 프롬프트
```
개선된 프롬프트 버전
```

**개선 포인트**:
- 개선 사항 1
- 개선 사항 2
```

## 통합 프로젝트

| 프로젝트 | 설명 | 상태 |
|----------|------|------|
| [CalcLab](https://github.com/HMWKR/CalcLab) | SI 차원 분석 기반 공학 계산기 | ✅ 활성 |

## 새 프로젝트 추가

> **상세 가이드**: 비전공자도 따라할 수 있는 자세한 설명은 [NEW-PROJECT-SETUP-GUIDE.md](docs/NEW-PROJECT-SETUP-GUIDE.md)를 참고하세요.

### 빠른 설정 (권장)

```bash
cd prompt-library
./scripts/setup-project.sh <project-name> [github-username] [--with-claude-md <path>]
```

**예시:**

```bash
# 기본 사용법
./scripts/setup-project.sh my-new-app

# GitHub 사용자명 지정
./scripts/setup-project.sh my-new-app HMWKR

# CLAUDE.md 템플릿도 함께 복사
./scripts/setup-project.sh my-new-app HMWKR --with-claude-md /path/to/new-project
```

**스크립트가 자동으로 수행하는 작업:**

1. `projects/<name>/prompts/` 폴더 생성
2. `projects/<name>/config.json` 생성
3. `sync-prompts.yml` 업데이트 안내
4. (선택) 새 프로젝트에 CLAUDE.md 템플릿 복사

### 수동 설정

1. `projects/<project-name>/config.json` 생성:

```json
{
  "name": "project-name",
  "repository": "owner/repo",
  "syncEnabled": true
}
```

2. `.github/workflows/sync-prompts.yml`의 matrix에 프로젝트 추가

3. GitHub Actions가 자동으로 프롬프트를 수집합니다.

## 분석 도구

### 프롬프트 추출

```bash
cd <source-project>
node ../prompt-library/scripts/extract-prompts.js <project-name>
```

### 통계 생성

```bash
node scripts/generate-stats.js
```

## 라이선스

MIT License
