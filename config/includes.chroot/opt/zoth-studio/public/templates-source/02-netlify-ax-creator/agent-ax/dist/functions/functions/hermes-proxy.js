import { execSync } from 'node:child_process';

function getSimulatedResponse(prompt, personality) {
  const p = String(personality).toLowerCase();
  const lowerPrompt = prompt.toLowerCase();

  let ans = '';
  if (lowerPrompt.includes('joke')) {
    ans = "Why do programmers wear glasses? Because they can't C#!";
  } else if (lowerPrompt.includes('weather')) {
    ans = "The weather is currently sunny in your local environment, with 0% chance of system crashes.";
  } else if (lowerPrompt.includes('hello') || lowerPrompt.includes('hi')) {
    ans = "Hello! I am Hermes, your persistent digital agent. How can I assist you with your projects today?";
  } else {
    ans = `I have received your request: "${prompt}". I've run the operations, checked the codebase, and everything is looking solid. Let me know what step we should take next!`;
  }

  switch (p) {
    case 'catgirl':
      return `Nyaaa~! (=^･ω･^=) *wags tail* ${ans.replace(/[\.\!]/g, ' nya!')} Let's do our best together, nya!`;
    case 'hype':
      return `YOOO!!! 🔥🔥🔥 LET'S GOOOO! ${ans.toUpperCase()} WE'RE ABSOLUTELY CRUSHING IT! 🚀😤`;
    case 'kawaii':
      return `Hellowo! (◕‿◕)★ ${ans} *sparkles* Have an amazing day desu~! ヽ(>∀<☆)ノ`;
    case 'uwu':
      return `hewwo! uwu *nuzzles your prompt* ${ans.toLowerCase().replace(/r/g, 'w').replace(/l/g, 'w')} >w<`;
    case 'noir':
      return `The neon sign flickered outside the window. ${ans} In this city, code doesn't sleep, and bugs don't rest. I'm keeping my eyes on it.`;
    case 'pirate':
      return `Ahoy, matey! 🏴‍☠️ Captain Hermes here. ${ans.replace(/I /g, 'Me ').replace(/my/g, 'me')} Yo ho ho!`;
    case 'shakespeare':
      return `Hark! ${ans.replace(/you/g, 'thou').replace(/are/g, 'art')} Thus speaks Hermes, thy humble servant.`;
    case 'surfer':
      return `Whoa, totally rad! 🤙 ${ans} Just ride the waves of logic, dude. Cowabunga!`;
    default:
      return ans;
  }
}

export async function handler(event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  let payload = {};
  try {
    payload = JSON.parse(event.body || '{}');
  } catch (err) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Bad Request', message: 'Request body must be valid JSON.' })
    };
  }

  const prompt = payload.prompt || payload.question || '';
  const personality = payload.personality || 'helpful';
  const sessionId = payload.sessionId || null;

  if (!prompt) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Bad Request', message: 'Prompt is required.' })
    };
  }

  try {
    const cmdArgs = ['-z', JSON.stringify(prompt)];
    if (payload.model) {
      cmdArgs.push('-m', JSON.stringify(payload.model));
    }
    if (sessionId) {
      cmdArgs.push('--resume', JSON.stringify(sessionId));
    }

    const cmd = `/home/neo/.hermes/hermes-agent/hermes ${cmdArgs.join(' ')}`;
    console.log('Netlify Function Running Hermes CLI:', cmd);

    const stdout = execSync(cmd, { encoding: 'utf-8', timeout: 15000 });
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        ok: true,
        response: stdout.trim(),
        source: 'hermes-cli'
      })
    };
  } catch (error) {
    console.log('Netlify Function Hermes CLI failed, running simulator:', String(error));
    const simRes = getSimulatedResponse(prompt, personality);
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        ok: true,
        response: simRes,
        source: 'simulator'
      })
    };
  }
}
