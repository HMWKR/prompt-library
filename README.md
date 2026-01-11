# Prompt Library

AI 협업 프롬프트 라이브러리 - 프롬프트 통계 분석 및 학습 자료

## 개요

이 저장소는 여러 프로젝트의 커밋 메시지에서 **3단계 프롬프트 기록**을 수집하고 분석합니다:

1. **원본 프롬프트**: 사용자가 실제로 입력한 내용
2. **프롬프트 분석**: Claude의 해석 (작업 유형, 제약 수준, 핵심 키워드)
3. **최적화된 프롬프트**: 더 나은 결과를 위한 개선 버전

## 프로젝트 구조

```
prompt-library/
├── projects/           # 프로젝트별 프롬프트
│   └── calclab/
│       ├── config.json
│       ├── prompts/
│       └── stats/
├── global/             # 전체 통합 데이터
│   ├── index.json
│   └── stats/
├── docs/templates/     # 재사용 가능한 프롬프트 템플릿
├── dashboard/          # 통계 대시보드 (GitHub Pages)
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

1. `projects/<project-name>/config.json` 생성:

```json
{
  "name": "project-name",
  "repository": "owner/repo",
  "syncEnabled": true
}
```

2. GitHub Actions가 자동으로 프롬프트를 수집합니다.

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
