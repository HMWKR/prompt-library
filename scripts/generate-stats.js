#!/usr/bin/env node
/**
 * generate-stats.js
 * 프롬프트 데이터 기반 통계 생성
 */

const fs = require('fs');
const path = require('path');

class PromptAnalyzer {
  constructor(baseDir) {
    this.baseDir = baseDir;
    this.prompts = [];
  }

  /**
   * 디렉토리 재귀 탐색
   */
  walkDir(dir, callback) {
    if (!fs.existsSync(dir)) return;

    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        this.walkDir(filePath, callback);
      } else {
        callback(filePath);
      }
    }
  }

  /**
   * 모든 프롬프트 로드
   */
  loadAllPrompts() {
    const projectsDir = path.join(this.baseDir, 'projects');
    if (!fs.existsSync(projectsDir)) {
      console.error('Projects directory not found');
      return this;
    }

    const projects = fs.readdirSync(projectsDir);

    for (const project of projects) {
      const promptsDir = path.join(projectsDir, project, 'prompts');
      if (!fs.existsSync(promptsDir)) continue;

      this.walkDir(promptsDir, (filePath) => {
        if (filePath.endsWith('.json') && !filePath.includes('index.json')) {
          try {
            const content = fs.readFileSync(filePath, 'utf-8');
            const prompt = JSON.parse(content);
            this.prompts.push(prompt);
          } catch (e) {
            console.warn(`Failed to parse: ${filePath}`);
          }
        }
      });
    }

    console.log(`Loaded ${this.prompts.length} prompts`);
    return this;
  }

  /**
   * 필드별 그룹화
   */
  groupBy(field) {
    const result = {};
    for (const prompt of this.prompts) {
      const value = this.getNestedValue(prompt, field) || 'unknown';
      result[value] = (result[value] || 0) + 1;
    }
    return result;
  }

  /**
   * 중첩 필드 접근
   */
  getNestedValue(obj, path) {
    return path.split('.').reduce((o, k) => o?.[k], obj);
  }

  /**
   * 평균 계산
   */
  avgField(field, transform = v => v) {
    const values = this.prompts
      .map(p => transform(this.getNestedValue(p, field)))
      .filter(v => typeof v === 'number' && !isNaN(v));

    if (values.length === 0) return 0;
    return values.reduce((a, b) => a + b, 0) / values.length;
  }

  /**
   * 배열 필드 카운트
   */
  countArrayField(field) {
    const result = {};
    for (const prompt of this.prompts) {
      const arr = this.getNestedValue(prompt, field);
      if (Array.isArray(arr)) {
        for (const item of arr) {
          result[item] = (result[item] || 0) + 1;
        }
      }
    }
    // 빈도순 정렬
    return Object.fromEntries(
      Object.entries(result).sort((a, b) => b[1] - a[1])
    );
  }

  /**
   * 월별 그룹화
   */
  groupByMonth() {
    const result = {};
    for (const prompt of this.prompts) {
      const date = prompt.commit?.date || prompt.timestamp;
      if (date) {
        const month = date.substring(0, 7); // YYYY-MM
        result[month] = (result[month] || 0) + 1;
      }
    }
    return result;
  }

  /**
   * 상위 통찰 추출
   */
  extractTopInsights(n = 10) {
    const insights = [];
    for (const prompt of this.prompts) {
      if (prompt.insights) {
        for (const insight of prompt.insights) {
          insights.push({
            text: insight,
            project: prompt.project,
            commit: prompt.commit?.shortHash
          });
        }
      }
    }
    return insights.slice(0, n);
  }

  /**
   * 효율성 계산 (프롬프트 길이 대비 산출물)
   */
  calculateEfficiency() {
    const withOutcome = this.prompts.filter(
      p => p.outcome?.files?.length > 0 && p.original?.wordCount > 0
    );

    if (withOutcome.length === 0) return null;

    return {
      avgFilesPerPrompt: withOutcome.reduce(
        (sum, p) => sum + p.outcome.files.length, 0
      ) / withOutcome.length,
      byComplexity: {
        simple: this.avgEfficiencyFor(withOutcome.filter(p => p.complexity === 'simple')),
        standard: this.avgEfficiencyFor(withOutcome.filter(p => p.complexity === 'standard')),
        complex: this.avgEfficiencyFor(withOutcome.filter(p => p.complexity === 'complex'))
      }
    };
  }

  avgEfficiencyFor(prompts) {
    if (prompts.length === 0) return null;
    return prompts.reduce(
      (sum, p) => sum + (p.outcome?.files?.length || 0) / p.original.wordCount * 100, 0
    ) / prompts.length;
  }

  /**
   * 전체 통계 생성
   */
  generateGlobalStats() {
    return {
      generatedAt: new Date().toISOString(),
      total: this.prompts.length,
      byProject: this.groupBy('project'),
      byType: this.groupBy('type'),
      byComplexity: this.groupBy('complexity'),
      byTaskType: this.groupBy('analysis.taskType'),
      avgPromptWordCount: Math.round(this.avgField('original.wordCount')),
      avgPromptLineCount: Math.round(this.avgField('original.lineCount')),
      techniqueUsage: this.countArrayField('optimized.techniques'),
      keywordFrequency: this.countArrayField('analysis.keywords'),
      tagFrequency: this.countArrayField('tags'),
      monthlyTrends: this.groupByMonth(),
      topInsights: this.extractTopInsights(20),
      efficiency: this.calculateEfficiency()
    };
  }

  /**
   * 프로젝트별 통계 생성
   */
  generateProjectStats(project) {
    const projectPrompts = this.prompts.filter(p => p.project === project);
    const analyzer = new PromptAnalyzer(this.baseDir);
    analyzer.prompts = projectPrompts;

    return {
      ...analyzer.generateGlobalStats(),
      project
    };
  }
}

/**
 * 메인 실행
 */
function main() {
  const baseDir = path.join(__dirname, '..');

  const analyzer = new PromptAnalyzer(baseDir);
  analyzer.loadAllPrompts();

  if (analyzer.prompts.length === 0) {
    console.log('No prompts found. Skipping stats generation.');
    return;
  }

  // 전역 통계 생성
  const globalStats = analyzer.generateGlobalStats();
  const globalStatsDir = path.join(baseDir, 'global', 'stats');

  if (!fs.existsSync(globalStatsDir)) {
    fs.mkdirSync(globalStatsDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(globalStatsDir, 'summary.json'),
    JSON.stringify(globalStats, null, 2)
  );

  console.log('Global stats generated.');

  // 전역 인덱스 생성
  const globalIndex = analyzer.prompts.map(p => ({
    id: p.id,
    project: p.project,
    date: p.commit?.date,
    title: p.commit?.title,
    type: p.type,
    complexity: p.complexity,
    tags: p.tags
  })).sort((a, b) => new Date(b.date) - new Date(a.date));

  fs.writeFileSync(
    path.join(baseDir, 'global', 'index.json'),
    JSON.stringify(globalIndex, null, 2)
  );

  console.log('Global index generated.');

  // 프로젝트별 통계 생성
  const projects = [...new Set(analyzer.prompts.map(p => p.project))];

  for (const project of projects) {
    const projectStats = analyzer.generateProjectStats(project);
    const projectStatsDir = path.join(baseDir, 'projects', project, 'stats');

    if (!fs.existsSync(projectStatsDir)) {
      fs.mkdirSync(projectStatsDir, { recursive: true });
    }

    fs.writeFileSync(
      path.join(projectStatsDir, 'summary.json'),
      JSON.stringify(projectStats, null, 2)
    );

    console.log(`Stats generated for ${project}`);
  }

  console.log('\nStats generation complete!');
  console.log(`Total prompts: ${globalStats.total}`);
  console.log(`Projects: ${Object.keys(globalStats.byProject).join(', ')}`);
}

main();
