/**
 * Parse a JSON response from the LLM. Handles cases where the model
 * wraps JSON in markdown code fences or includes extra text.
 */
export function parseAgentResponse(raw) {
  if (!raw) {
    return {
      reaccion: '',
      sentimiento: 'neutral',
      intensidad: 3,
      razon_principal: 'Sin respuesta',
    };
  }

  // Try direct JSON parse
  try {
    const parsed = JSON.parse(raw);
    return validateResponse(parsed);
  } catch {
    // noop
  }

  // Try extracting JSON from markdown code fence
  const jsonMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) {
    try {
      return validateResponse(JSON.parse(jsonMatch[1].trim()));
    } catch {
      // noop
    }
  }

  // Try finding JSON object in text
  const braceMatch = raw.match(/\{[\s\S]*\}/);
  if (braceMatch) {
    try {
      return validateResponse(JSON.parse(braceMatch[0]));
    } catch {
      // noop
    }
  }

  // Fallback: treat entire response as free text reaction
  return {
    reaccion: raw.slice(0, 800),
    sentimiento: inferSentimentFromText(raw),
    intensidad: 3,
    razon_principal: 'Respuesta no estructurada',
  };
}

function validateResponse(obj) {
  const valid = ['a_favor', 'neutral', 'en_contra'];
  return {
    reaccion: String(obj.reaccion || obj.reaction || '').slice(0, 1000),
    sentimiento: valid.includes(obj.sentimiento) ? obj.sentimiento : 'neutral',
    intensidad: Math.min(5, Math.max(1, Number(obj.intensidad) || 3)),
    razon_principal: String(obj.razon_principal || obj.razon || '').slice(0, 200),
  };
}

function inferSentimentFromText(text) {
  const lower = text.toLowerCase();
  const positive = ['apoyo', 'favor', 'bien', 'necesario', 'correcto', 'bueno', 'excelente'];
  const negative = ['rechazo', 'contra', 'mal', 'peligroso', 'injusto', 'error', 'opongo'];

  let pos = 0, neg = 0;
  for (const w of positive) if (lower.includes(w)) pos++;
  for (const w of negative) if (lower.includes(w)) neg++;

  if (pos > neg) return 'a_favor';
  if (neg > pos) return 'en_contra';
  return 'neutral';
}

/**
 * Aggregate results by various demographics.
 */
export function aggregateResults(results) {
  const summary = { a_favor: 0, neutral: 0, en_contra: 0, total: 0 };
  const byDepartment = {};
  const byAge = { '18-25': { a_favor: 0, neutral: 0, en_contra: 0 }, '26-35': { a_favor: 0, neutral: 0, en_contra: 0 }, '36-45': { a_favor: 0, neutral: 0, en_contra: 0 }, '46-60': { a_favor: 0, neutral: 0, en_contra: 0 }, '60+': { a_favor: 0, neutral: 0, en_contra: 0 } };
  const bySex = {};
  const byEducation = {};

  for (const r of results) {
    if (r.error || !r.parsed) continue;

    const s = r.parsed.sentimiento;
    summary[s]++;
    summary.total++;

    const dept = r.profile?.department || 'Desconocido';
    if (!byDepartment[dept]) byDepartment[dept] = { a_favor: 0, neutral: 0, en_contra: 0 };
    byDepartment[dept][s]++;

    const age = r.profile?.age || 30;
    const ageGroup = age <= 25 ? '18-25' : age <= 35 ? '26-35' : age <= 45 ? '36-45' : age <= 60 ? '46-60' : '60+';
    byAge[ageGroup][s]++;

    const sex = r.profile?.sex || 'Desconocido';
    if (!bySex[sex]) bySex[sex] = { a_favor: 0, neutral: 0, en_contra: 0 };
    bySex[sex][s]++;

    const edu = r.profile?.education_level || 'Desconocido';
    if (!byEducation[edu]) byEducation[edu] = { a_favor: 0, neutral: 0, en_contra: 0 };
    byEducation[edu][s]++;
  }

  return { summary, byDepartment, byAge, bySex, byEducation };
}
