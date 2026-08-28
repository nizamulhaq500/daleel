import { NextResponse } from 'next/server';
import { ToxicityScores } from '@/lib/types';

const apiKey = process.env.PERSPECTIVE_API_KEY;
const API_URL = 'https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze';

// Generate mock scores when API key is missing
const generateMockScores = (content: string): ToxicityScores => {
  const lowercaseContent = content.toLowerCase();
  let baseToxicity = 0.1;
  
  if (lowercaseContent.includes('hate') || lowercaseContent.includes('stupid')) baseToxicity += 0.4;
  if (lowercaseContent.includes('kill') || lowercaseContent.includes('destroy')) baseToxicity += 0.6;
  if (lowercaseContent.includes('kebab') || lowercaseContent.includes('muzzie')) baseToxicity += 0.7;

  return {
    toxicity: Math.min(baseToxicity, 0.99),
    severeToxicity: Math.min(baseToxicity * 0.8, 0.95),
    identityAttack: Math.min(baseToxicity * 1.2, 0.98),
    insult: Math.min(baseToxicity * 0.9, 0.99),
    threat: Math.min(baseToxicity * 0.7, 0.9)
  };
};

export async function POST(request: Request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized: Missing or invalid token' }, { status: 401 });
  }
  // Note: For full production security, verify this token with firebase-admin.
  const token = authHeader.split('Bearer ')[1];

  try {
    const body = await request.json();
    const { content } = body;

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    if (!apiKey) {
      console.warn("PERSPECTIVE_API_KEY not found. Falling back to mock toxicity scores.");
      const mockScores = generateMockScores(content);
      return NextResponse.json(mockScores);
    }

    const requestedAttributes = {
      TOXICITY: {},
      SEVERE_TOXICITY: {},
      IDENTITY_ATTACK: {},
      INSULT: {},
      THREAT: {}
    };

    const response = await fetch(`${API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        comment: { text: content },
        languages: ['en'],
        requestedAttributes,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Perspective API Error:', errorData);
      throw new Error('Failed to analyze with Perspective API');
    }

    const data = await response.json();

    const scores: ToxicityScores = {
      toxicity: data.attributeScores.TOXICITY.summaryScore.value,
      severeToxicity: data.attributeScores.SEVERE_TOXICITY.summaryScore.value,
      identityAttack: data.attributeScores.IDENTITY_ATTACK.summaryScore.value,
      insult: data.attributeScores.INSULT.summaryScore.value,
      threat: data.attributeScores.THREAT.summaryScore.value,
    };

    return NextResponse.json(scores);

  } catch (error) {
    console.error('Error in toxicity API:', error);
    return NextResponse.json(
      { error: 'Failed to calculate toxicity', details: (error as Error).message },
      { status: 500 }
    );
  }
}
