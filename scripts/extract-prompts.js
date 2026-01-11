#!/usr/bin/env node
/**
 * extract-prompts.js
 * 커밋 메시지에서 3단계 프롬프트 기록을 추출하는 스크립트
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 설정
const CONFIG = {
  markers: {
    original: '### 원본 프롬프트',
    analysis: '### 프롬프트 분석',
    optimized: '### 최적화된 프롬프트',
    promptRecord: '## 프롬프트 기록',
    outcome: '## 산출물',
    insights: '## 핵심 통찰'
  },
  taskTypeMap: {
    '수렴적': 'convergent',
    '발산적': 'divergent',
    '혼합형': 'mixed'
  },
  constraintMap: {
    '높음': 'high',
    '중간': 'medium',
    '낮음': 'low'
  }
};

/**
 * 코드 블록에서 내용 추출
 */
function extractCodeBlock(text) {
  if (!text) return null;
  const match = text.match(/```[\w]*\n?([\s\S]*?)```/);
  return match ? match[1].trim() : null;
}

/**
 * 프롬프트 분석 섹션 파싱
 */
function parseAnalysis(text) {
  if (!text) return null;

  const interpretation = text.match(/\*\*해석\*\*[:\s]+(.*?)(?=\n|$)/)?.[1]?.trim();
  const taskTypeKo = text.match(/\*\*작업 유형\*\*[:\s]+(수렴적|발산적|혼합형)/)?.[1];
  const constraintKo = text.match(/\*\*제약 수준\*\*[:\s]+(높음|중간|낮음)/)?.[1];
  const keywordsMatch = text.match(/\*\*핵심 키워드\*\*[:\s]+(.*?)(?=\n|$)/)?.[1];

  const keywords = keywordsMatch
    ? keywordsMatch.split(/[,"\s]+/).filter(k => k && k.length > 1)
    : [];

  return {
    interpretation,
    taskType: CONFIG.taskTypeMap[taskTypeKo] || null,
    constraintLevel: CONFIG.constraintMap[constraintKo] || null,
    keywords
  };
}

/**
 * 최적화된 프롬프트 섹션 파싱
 */
function parseOptimized(text) {
  if (!text) return null;

  const promptText = extractCodeBlock(text);
  const improvements = [];

  // 개선 포인트 추출
  const improvementsMatch = text.match(/\*\*개선 포인트\*\*[:\s]*([\s\S]*?)(?=##|$)/);
  if (improvementsMatch) {
    const lines = improvementsMatch[1].split('\n');
    for (const line of lines) {
      const item = line.replace(/^[-*]\s*/, '').trim();
      if (item) improvements.push(item);
    }
  }

  // 사용된 기법 감지
  const techniques = [];
  const techniquePatterns = {
    'chain-of-thought': /단계별|step.?by.?step|순서|차례/i,
    'few-shot': /예시|example|입출력/i,
    'role-prompting': /역할|너는.*전문가|role/i,
    'negative-constraints': /절대|금지|하지 마|❌/i,
    'self-verification': /검증|확인|verify/i
  };

  for (const [technique, pattern] of Object.entries(techniquePatterns)) {
    if (pattern.test(text)) {
      techniques.push(technique);
    }
  }

  return {
    text: promptText,
    improvements,
    techniques
  };
}

/**
 * 커밋 메시지에서 프롬프트 데이터 추출
 */
function extractPromptFromCommit(commitHash, projectName, repoUrl) {
  try {
    // 커밋 정보 가져오기
    const format = '%H|%h|%an|%cI|%s';
    const info = execSync(`git log -1 --format="${format}" ${commitHash}`, { encoding: 'utf-8' }).trim();
    const [hash, shortHash, author, date, title] = info.split('|');

    // 커밋 메시지 본문 가져오기
    const body = execSync(`git log -1 --format=%b ${commitHash}`, { encoding: 'utf-8' });

    // 프롬프트 기록 섹션이 있는지 확인
    if (!body.includes(CONFIG.markers.promptRecord) && !body.includes(CONFIG.markers.original)) {
      return null;
    }

    // 커밋 타입 추출
    const typeMatch = title.match(/^(\w+)(?:\([^)]+\))?:/);
    const type = typeMatch ? typeMatch[1] : 'chore';

    // 원본 프롬프트 추출
    const originalSection = body.split(CONFIG.markers.original)[1]?.split(/###|##/)[0];
    const originalText = extractCodeBlock(originalSection);

    if (!originalText) {
      return null;
    }

    // 분석 섹션 추출
    const analysisSection = body.split(CONFIG.markers.analysis)[1]?.split(/###|##/)[0];
    const analysis = parseAnalysis(analysisSection);

    // 최적화된 프롬프트 추출
    const optimizedSection = body.split(CONFIG.markers.optimized)[1]?.split(/##(?!#)/)[0];
    const optimized = parseOptimized(optimizedSection);

    // 산출물 추출
    const outcomeSection = body.split(CONFIG.markers.outcome)[1]?.split(/##/)[0];
    const files = [];
    if (outcomeSection) {
      const fileMatches = outcomeSection.matchAll(/[-*]\s*([^\n]+)/g);
      for (const match of fileMatches) {
        files.push(match[1].trim());
      }
    }

    // 통찰 추출
    const insightsSection = body.split(CONFIG.markers.insights)[1]?.split(/##/)[0];
    const insights = [];
    if (insightsSection) {
      const lines = insightsSection.split('\n');
      for (const line of lines) {
        const insight = line.replace(/^[>\-*\s]+/, '').trim();
        if (insight && insight.length > 5) {
          insights.push(insight);
        }
      }
    }

    // 복잡도 판단 (분석 섹션 유무 기반)
    let complexity = 'simple';
    if (analysis && optimized) {
      complexity = 'complex';
    } else if (analysis || optimized) {
      complexity = 'standard';
    }

    // 태그 생성
    const tags = [type];
    if (analysis?.keywords) {
      tags.push(...analysis.keywords.slice(0, 5));
    }

    return {
      id: `${projectName}_${shortHash}`,
      project: projectName,
      commit: {
        hash,
        shortHash,
        author,
        date,
        title,
        url: `${repoUrl}/commit/${hash}`
      },
      timestamp: new Date().toISOString(),
      type,
      complexity,
      original: {
        text: originalText,
        wordCount: originalText.split(/\s+/).length,
        lineCount: originalText.split('\n').length
      },
      analysis: analysis?.interpretation ? analysis : undefined,
      optimized: optimized?.text ? optimized : undefined,
      outcome: files.length > 0 ? { files } : undefined,
      insights: insights.length > 0 ? insights : undefined,
      tags: [...new Set(tags)]
    };
  } catch (error) {
    console.error(`Error extracting prompt from ${commitHash}:`, error.message);
    return null;
  }
}

/**
 * JSON을 Markdown으로 변환
 */
function toMarkdown(prompt) {
  let md = `# ${prompt.commit.title}\n\n`;
  md += `- **커밋**: [${prompt.commit.shortHash}](${prompt.commit.url})\n`;
  md += `- **날짜**: ${prompt.commit.date}\n`;
  md += `- **타입**: ${prompt.type}\n`;
  md += `- **복잡도**: ${prompt.complexity}\n`;
  md += `- **태그**: ${prompt.tags.join(', ')}\n\n`;

  md += `## 원본 프롬프트\n\n\`\`\`\n${prompt.original.text}\n\`\`\`\n\n`;

  if (prompt.analysis) {
    md += `## 프롬프트 분석\n\n`;
    if (prompt.analysis.interpretation) {
      md += `- **해석**: ${prompt.analysis.interpretation}\n`;
    }
    if (prompt.analysis.taskType) {
      md += `- **작업 유형**: ${prompt.analysis.taskType}\n`;
    }
    if (prompt.analysis.constraintLevel) {
      md += `- **제약 수준**: ${prompt.analysis.constraintLevel}\n`;
    }
    if (prompt.analysis.keywords?.length > 0) {
      md += `- **핵심 키워드**: ${prompt.analysis.keywords.join(', ')}\n`;
    }
    md += '\n';
  }

  if (prompt.optimized) {
    md += `## 최적화된 프롬프트\n\n\`\`\`\n${prompt.optimized.text}\n\`\`\`\n\n`;
    if (prompt.optimized.improvements?.length > 0) {
      md += `**개선 포인트**:\n`;
      for (const imp of prompt.optimized.improvements) {
        md += `- ${imp}\n`;
      }
      md += '\n';
    }
    if (prompt.optimized.techniques?.length > 0) {
      md += `**사용된 기법**: ${prompt.optimized.techniques.join(', ')}\n\n`;
    }
  }

  if (prompt.insights?.length > 0) {
    md += `## 핵심 통찰\n\n`;
    for (const insight of prompt.insights) {
      md += `> ${insight}\n`;
    }
    md += '\n';
  }

  return md;
}

/**
 * 메인 실행
 */
function main() {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.log('Usage: node extract-prompts.js <project-name> [commit-hash]');
    console.log('  If commit-hash is not provided, extracts from all commits');
    process.exit(1);
  }

  const projectName = args[0];
  const specificCommit = args[1];

  // 프로젝트 설정 로드
  const configPath = path.join(__dirname, '..', 'projects', projectName, 'config.json');
  if (!fs.existsSync(configPath)) {
    console.error(`Project config not found: ${configPath}`);
    process.exit(1);
  }

  const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  const repoUrl = `https://github.com/${config.repository}`;

  // 커밋 목록 가져오기
  let commits;
  if (specificCommit) {
    commits = [specificCommit];
  } else {
    const output = execSync('git log --format=%H --reverse', { encoding: 'utf-8' });
    commits = output.trim().split('\n').filter(Boolean);
  }

  console.log(`Processing ${commits.length} commits for ${projectName}...`);

  const promptsDir = path.join(__dirname, '..', 'projects', projectName, 'prompts');
  let extractedCount = 0;
  const allPrompts = [];

  for (const commitHash of commits) {
    const prompt = extractPromptFromCommit(commitHash, projectName, repoUrl);

    if (prompt) {
      const date = new Date(prompt.commit.date);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');

      const dirPath = path.join(promptsDir, String(year), month);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }

      const baseName = `${date.toISOString().split('T')[0]}_${prompt.commit.shortHash}`;

      // JSON 저장
      fs.writeFileSync(
        path.join(dirPath, `${baseName}.json`),
        JSON.stringify(prompt, null, 2)
      );

      // Markdown 저장
      fs.writeFileSync(
        path.join(dirPath, `${baseName}.md`),
        toMarkdown(prompt)
      );

      allPrompts.push({
        id: prompt.id,
        date: prompt.commit.date,
        title: prompt.commit.title,
        type: prompt.type,
        complexity: prompt.complexity,
        path: `${year}/${month}/${baseName}.json`
      });

      extractedCount++;
      console.log(`  Extracted: ${prompt.commit.shortHash} - ${prompt.commit.title}`);
    }
  }

  // 인덱스 파일 생성
  const indexPath = path.join(promptsDir, 'index.json');
  fs.writeFileSync(indexPath, JSON.stringify(allPrompts, null, 2));

  console.log(`\nDone! Extracted ${extractedCount} prompts from ${commits.length} commits.`);
}

main();
