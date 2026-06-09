import express from 'express';
import { sampleProfiles } from '../services/sampler.js';
import { runBatch } from '../services/deepseek.js';
import { parseAgentResponse, aggregateResults } from '../services/analyzer.js';

export const simulateRoute = express.Router();

function getPrompt(profile, policy) {
  const system = `Eres un ciudadano salvadoreño. Adopta exactamente la identidad descrita.
Responde SIEMPRE en español salvadoreño natural, usando expresiones locales.
Tu respuesta DEBE ser un JSON válido con esta estructura exacta:
{
  "reaccion": "tu respuesta en primera persona aquí (max 150 palabras)",
  "sentimiento": "a_favor" | "neutral" | "en_contra",
  "intensidad": un número del 1 al 5,
  "razon_principal": "razón breve de tu postura"
}`;

  const user = `Perfil:
- Edad: ${profile.age} años
- Sexo: ${profile.sex}
- Ocupación: ${profile.occupation}
- Educación: ${profile.education_level}
- Ubicación: ${profile.municipality}, ${profile.department}
- Contexto: ${profile.persona}
- Cultura: ${profile.cultural_background}

Política pública a evaluar: "${policy}"

¿Cuál es tu reacción ante esta política?`;

  return { system, user, profile };
}

simulateRoute.post('/', async (req, res) => {
  const { policy, mode = 'rapida', quality = 'flash', filters = {} } = req.body;

  if (!policy) {
    return res.status(400).json({ error: 'Policy is required' });
  }

  // Set up SSE
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const sendEvent = (type, data) => {
    res.write(`event: ${type}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  try {
    let size = 50;
    if (mode === 'estandar') size = 100;
    if (mode === 'profunda') size = 1000;

    sendEvent('status', { message: 'Muestreando perfiles...' });
    const profiles = sampleProfiles(size, filters);
    
    if (profiles.length === 0) {
      sendEvent('error', { message: 'No se encontraron perfiles con esos filtros.' });
      return res.end();
    }

    sendEvent('status', { message: `Iniciando simulación con ${profiles.length} agentes.`, total: profiles.length });
    
    const prompts = profiles.map(p => getPrompt(p, policy));
    
    let completed = 0;
    const allResults = [];

    await runBatch(prompts, { quality }, (result, idx, total) => {
      completed++;
      const parsed = result.error ? null : parseAgentResponse(result.raw);
      result.parsed = parsed;
      allResults.push(result);
      
      // Send individual progress update
      sendEvent('progress', {
        current: completed,
        total,
        profile: {
          uuid: result.profile.uuid,
          age: result.profile.age,
          sex: result.profile.sex,
          occupation: result.profile.occupation,
          department: result.profile.department,
          municipality: result.profile.municipality,
          education_level: result.profile.education_level,
          avatarSeed: result.profile.persona
        },
        parsed: parsed,
        error: result.error
      });
    });

    // Send final aggregation
    sendEvent('status', { message: 'Analizando resultados agregados...' });
    const aggregation = aggregateResults(allResults);
    
    sendEvent('complete', {
      summary: aggregation.summary,
      byDepartment: aggregation.byDepartment,
      byAge: aggregation.byAge,
      bySex: aggregation.bySex,
      byEducation: aggregation.byEducation,
      totalCompleted: completed
    });

  } catch (error) {
    console.error('Simulation error:', error);
    sendEvent('error', { message: error.message || 'Error interno durante la simulación' });
  } finally {
    res.end();
  }
});
