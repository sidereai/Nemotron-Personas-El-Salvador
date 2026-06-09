import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = join(__dirname, '../../data/personas-sample.json');

let personas = null;

function loadData() {
  if (personas) return personas;
  try {
    const raw = readFileSync(DATA_PATH, 'utf-8');
    personas = JSON.parse(raw);
    console.log(`📊 Loaded ${personas.length} personas from dataset`);
    return personas;
  } catch (err) {
    console.warn('⚠️  Dataset not found. Run: npm run download-data');
    personas = [];
    return personas;
  }
}

/**
 * Sample profiles with optional stratified sampling.
 * @param {number} count - Number of profiles to sample
 * @param {object} filters - Optional filters
 */
export function sampleProfiles(count, filters = {}) {
  const data = loadData();
  if (data.length === 0) return [];

  let filtered = [...data];

  if (filters.department) {
    filtered = filtered.filter(p => p.department === filters.department);
  }
  if (filters.sex) {
    filtered = filtered.filter(p => p.sex === filters.sex);
  }
  if (filters.education_level) {
    filtered = filtered.filter(p => p.education_level === filters.education_level);
  }
  if (filters.area) {
    filtered = filtered.filter(p => p.area === filters.area);
  }
  if (filters.ageRange) {
    const [min, max] = filters.ageRange;
    filtered = filtered.filter(p => p.age >= min && p.age <= max);
  }

  // Stratified sampling by department to maintain geographic representation
  if (!filters.department && filtered.length > count) {
    return stratifiedSample(filtered, count);
  }

  // Simple random sample
  return shuffle(filtered).slice(0, count);
}

function stratifiedSample(data, count) {
  const byDept = {};
  for (const p of data) {
    if (!byDept[p.department]) byDept[p.department] = [];
    byDept[p.department].push(p);
  }

  const depts = Object.keys(byDept);
  const perDept = Math.max(1, Math.floor(count / depts.length));
  const remainder = count - perDept * depts.length;

  let result = [];
  for (const dept of depts) {
    const shuffled = shuffle(byDept[dept]);
    result.push(...shuffled.slice(0, perDept));
  }

  // Distribute remainder randomly
  if (remainder > 0) {
    const remaining = data.filter(p => !result.includes(p));
    result.push(...shuffle(remaining).slice(0, remainder));
  }

  return shuffle(result).slice(0, count);
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function getStats() {
  const data = loadData();
  if (data.length === 0) return { total: 0 };

  const stats = {
    total: data.length,
    byDepartment: {},
    bySex: {},
    byEducation: {},
    byArea: {},
    ageRange: { min: Infinity, max: -Infinity, avg: 0 },
  };

  let ageSum = 0;
  for (const p of data) {
    stats.byDepartment[p.department] = (stats.byDepartment[p.department] || 0) + 1;
    stats.bySex[p.sex] = (stats.bySex[p.sex] || 0) + 1;
    stats.byEducation[p.education_level] = (stats.byEducation[p.education_level] || 0) + 1;
    stats.byArea[p.area] = (stats.byArea[p.area] || 0) + 1;
    if (p.age < stats.ageRange.min) stats.ageRange.min = p.age;
    if (p.age > stats.ageRange.max) stats.ageRange.max = p.age;
    ageSum += p.age;
  }
  stats.ageRange.avg = Math.round(ageSum / data.length);

  return stats;
}
