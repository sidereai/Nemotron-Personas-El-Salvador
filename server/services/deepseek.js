import OpenAI from 'openai';
import pLimit from 'p-limit';

const client = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.DEEPSEEK_API_KEY,
});

const limit = pLimit(10);

/**
 * Generate a response from DeepSeek for a persona + policy prompt.
 * @param {string} systemPrompt - The system-level instruction
 * @param {string} userPrompt - The user-level prompt with persona + policy
 * @param {object} options - { quality: 'flash' | 'mayor_calidad' }
 */
export async function generateResponse(systemPrompt, userPrompt, options = {}) {
  const { quality = 'flash' } = options;

  const params = {
    model: 'deepseek-v4-flash',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.8,
    max_tokens: 600,
    response_format: { type: 'json_object' },
  };

  if (quality === 'mayor_calidad') {
    params.thinking = { type: 'enabled' };
    params.reasoning_effort = 'medium';
    // When thinking is enabled, response_format json_object may not be supported
    // We'll handle JSON parsing manually
    delete params.response_format;
  }

  const response = await client.chat.completions.create(params);
  return response.choices[0].message.content;
}

/**
 * Run multiple prompts in parallel with throttling (max 10 concurrent).
 * Calls onProgress for each completed prompt.
 */
export async function runBatch(prompts, options, onProgress) {
  const results = [];

  const tasks = prompts.map((prompt, index) =>
    limit(async () => {
      try {
        const raw = await generateResponse(prompt.system, prompt.user, options);
        const result = { index, profile: prompt.profile, raw, error: null };
        results.push(result);
        if (onProgress) onProgress(result, index, prompts.length);
        return result;
      } catch (err) {
        const result = { index, profile: prompt.profile, raw: null, error: err.message };
        results.push(result);
        if (onProgress) onProgress(result, index, prompts.length);
        return result;
      }
    })
  );

  await Promise.all(tasks);
  return results.sort((a, b) => a.index - b.index);
}
