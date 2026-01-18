#!/bin/bash
#
# setup-project.sh - 새 프로젝트 프롬프트 수집 설정
#
# 사용법:
#   ./scripts/setup-project.sh <project-name> [github-username] [--with-claude-md <path>]
#
# 예시:
#   ./scripts/setup-project.sh my-new-app
#   ./scripts/setup-project.sh my-new-app HMWKR
#   ./scripts/setup-project.sh my-new-app HMWKR --with-claude-md /path/to/new-project
#
# 기능:
#   1. projects/<name>/config.json 생성
#   2. projects/<name>/prompts/ 폴더 생성
#   3. .github/workflows/sync-prompts.yml 업데이트 안내
#   4. (선택) 새 프로젝트에 CLAUDE.md 복사
#

set -e

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 스크립트 위치 기준으로 prompt-library 루트 찾기
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROMPT_LIB_ROOT="$(dirname "$SCRIPT_DIR")"

# 기본값
DEFAULT_USERNAME="HMWKR"
CLAUDE_TEMPLATE="$PROMPT_LIB_ROOT/../docs/CLAUDE_TEMPLATE.md"

# 헬퍼 함수
print_step() {
    echo -e "${BLUE}[Step $1]${NC} $2"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# 사용법 출력
usage() {
    echo "사용법: $0 <project-name> [github-username] [--with-claude-md <path>]"
    echo ""
    echo "인자:"
    echo "  project-name     프로젝트 이름 (필수)"
    echo "  github-username  GitHub 사용자명 (기본값: $DEFAULT_USERNAME)"
    echo "  --with-claude-md 새 프로젝트 경로에 CLAUDE.md 복사"
    echo ""
    echo "예시:"
    echo "  $0 my-new-app"
    echo "  $0 my-new-app HMWKR"
    echo "  $0 my-new-app HMWKR --with-claude-md /home/user/my-new-app"
    exit 1
}

# 인자 파싱
PROJECT_NAME=""
GITHUB_USER="$DEFAULT_USERNAME"
CLAUDE_MD_PATH=""

while [[ $# -gt 0 ]]; do
    case $1 in
        --with-claude-md)
            CLAUDE_MD_PATH="$2"
            shift 2
            ;;
        --help|-h)
            usage
            ;;
        *)
            if [[ -z "$PROJECT_NAME" ]]; then
                PROJECT_NAME="$1"
            elif [[ "$GITHUB_USER" == "$DEFAULT_USERNAME" ]]; then
                GITHUB_USER="$1"
            fi
            shift
            ;;
    esac
done

# 필수 인자 확인
if [[ -z "$PROJECT_NAME" ]]; then
    print_error "프로젝트 이름이 필요합니다."
    echo ""
    usage
fi

# 프로젝트 경로
PROJECT_DIR="$PROMPT_LIB_ROOT/projects/$PROJECT_NAME"

echo ""
echo "=================================================="
echo "  새 프로젝트 프롬프트 수집 설정"
echo "=================================================="
echo ""
echo "  프로젝트: $PROJECT_NAME"
echo "  저장소:   $GITHUB_USER/$PROJECT_NAME"
echo ""

# Step 1: 프로젝트 폴더 생성
print_step "1" "프로젝트 폴더 생성"

if [[ -d "$PROJECT_DIR" ]]; then
    print_warning "프로젝트 폴더가 이미 존재합니다: $PROJECT_DIR"
else
    mkdir -p "$PROJECT_DIR/prompts"
    print_success "생성됨: $PROJECT_DIR/prompts/"
fi

# Step 2: config.json 생성
print_step "2" "config.json 생성"

CONFIG_FILE="$PROJECT_DIR/config.json"

if [[ -f "$CONFIG_FILE" ]]; then
    print_warning "config.json이 이미 존재합니다. 건너뜁니다."
else
    cat > "$CONFIG_FILE" << EOF
{
  "name": "$PROJECT_NAME",
  "displayName": "$PROJECT_NAME",
  "repository": "$GITHUB_USER/$PROJECT_NAME",
  "branch": "main",
  "syncEnabled": true,
  "promptFormat": {
    "originalMarker": "### 원본 프롬프트",
    "analysisMarker": "### 프롬프트 분석",
    "optimizedMarker": "### 최적화된 프롬프트"
  }
}
EOF
    print_success "생성됨: $CONFIG_FILE"
fi

# Step 3: sync-prompts.yml 업데이트 안내
print_step "3" "워크플로우 업데이트"

WORKFLOW_FILE="$PROMPT_LIB_ROOT/.github/workflows/sync-prompts.yml"

if [[ -f "$WORKFLOW_FILE" ]]; then
    # 이미 프로젝트가 등록되어 있는지 확인
    if grep -q "\"$PROJECT_NAME\"" "$WORKFLOW_FILE" 2>/dev/null; then
        print_warning "프로젝트가 이미 워크플로우에 등록되어 있습니다."
    else
        echo ""
        print_warning "sync-prompts.yml의 matrix에 다음을 추가해주세요:"
        echo ""
        echo -e "  ${YELLOW}- { name: \"$PROJECT_NAME\", repo: \"$GITHUB_USER/$PROJECT_NAME\" }${NC}"
        echo ""
    fi
else
    print_warning "워크플로우 파일을 찾을 수 없습니다: $WORKFLOW_FILE"
fi

# Step 4: CLAUDE.md 복사 (선택)
print_step "4" "CLAUDE.md 템플릿 복사"

if [[ -n "$CLAUDE_MD_PATH" ]]; then
    if [[ -d "$CLAUDE_MD_PATH" ]]; then
        DEST_CLAUDE_MD="$CLAUDE_MD_PATH/CLAUDE.md"
        if [[ -f "$DEST_CLAUDE_MD" ]]; then
            print_warning "CLAUDE.md가 이미 존재합니다: $DEST_CLAUDE_MD"
        elif [[ -f "$CLAUDE_TEMPLATE" ]]; then
            cp "$CLAUDE_TEMPLATE" "$DEST_CLAUDE_MD"
            print_success "복사됨: $DEST_CLAUDE_MD"
            echo ""
            print_warning "CLAUDE.md의 [TODO: ...] 부분을 수정해주세요!"
        else
            print_error "템플릿을 찾을 수 없습니다: $CLAUDE_TEMPLATE"
        fi
    else
        print_error "경로가 존재하지 않습니다: $CLAUDE_MD_PATH"
    fi
else
    echo "  --with-claude-md 옵션이 없어 건너뜁니다."
    echo ""
    echo "  나중에 복사하려면:"
    echo "  cp docs/CLAUDE_TEMPLATE.md /path/to/your/project/CLAUDE.md"
fi

# Step 5: 완료 메시지
echo ""
echo "=================================================="
echo -e "  ${GREEN}✓ $PROJECT_NAME 프로젝트 설정 완료!${NC}"
echo "=================================================="
echo ""
echo "  다음 단계:"
echo ""
echo "  1. sync-prompts.yml에 프로젝트 추가 (위 안내 참조)"
echo ""
echo "  2. 변경사항 커밋 & 푸시:"
echo "     cd $PROMPT_LIB_ROOT"
echo "     git add ."
echo "     git commit -m \"feat: $PROJECT_NAME 프로젝트 추가\""
echo "     git push origin main"
echo ""
echo "  3. 새 프로젝트에서 CLAUDE.md 설정 후 커밋하면"
echo "     6시간마다 자동으로 프롬프트가 수집됩니다."
echo ""
echo "  대시보드: https://$GITHUB_USER.github.io/prompt-dashboard/"
echo ""
