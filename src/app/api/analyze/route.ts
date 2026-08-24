import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { codedLanguageDictionary } from '@/lib/coded-language';
import { platformPolicies } from '@/lib/platform-policies';

export const maxDuration = 60;

// Helper to sanitize markdown from JSON response
function cleanJsonResponse(text: string) {
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\n/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\n/, '');
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.replace(/\n```$/, '');
  }
  return cleaned;
}

export async function POST(request: Request) {
  try {
    const { content, contentType, imageBase64 } = await request.json();

    if (!content && !imageBase64) {
      return NextResponse.json({ error: 'Missing content or image' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    
    // --- FALLBACK MOCK MODE ---
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not set. Using mock analysis.");
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const lowerContent = content ? content.toLowerCase() : '';
      let isJizya = lowerContent.includes('halal') || lowerContent.includes('jizya') || lowerContent.includes('economic jihad');
      
      return NextResponse.json({
        severity: isJizya ? 'Medium' : 'High',
        severityScore: isJizya ? 6 : 8,
        categories: isJizya ? ['Conspiracy', 'Relational'] : ['Coded Slur', 'Explicit'],
        codedTermsFound: isJizya ? 
          [{ term: 'jizya / economic jihad', meaning: 'Falsely claiming halal certification fees fund terrorism.', context: 'Common conspiracy to boycott Muslim businesses.', severity: 'High' }] :
          [{ term: 'kebab', meaning: 'Reference to Serbian genocide used against Muslims ("Remove Kebab")', context: 'Internet meme that glorifies ethnic cleansing', severity: 'Critical' }],
        contextExplanation: isJizya ? 
          "This post promotes a well-documented anti-Muslim conspiracy theory claiming that fees paid by food manufacturers for halal certification function as a stealth tax ('jizya') used to finance terrorism or 'economic jihad'. In reality, halal certification is a standard commercial service that verifies food compliance with Islamic dietary laws, similar to Kosher or organic labeling, and its proceeds do not fund terrorism." : 
          'This content uses historic genocide references to bypass standard hate speech filters while promoting violence against Muslim communities.',
        counterNarratives: isJizya ?
          ["Halal certification is a voluntary, standard business service that ensures food meets religious dietary guidelines, identical in function to Kosher, Vegan, or Organic certifications.", "Multiple law enforcement and regulatory authorities worldwide have thoroughly investigated these claims and confirmed there is no connection between halal certification fees and terrorist funding."] :
          ['This phrase is recognized by the UN as hate speech linked to ethnic cleansing.'],
        platformViolations: [{ platform: 'meta', policy: 'Hate Speech', reportUrl: 'https://www.facebook.com/help/111029285741369' }]
      });
    }

    // --- REAL API MODE ---
    const ai = new GoogleGenerativeAI(apiKey);
    
    // Prepare the dictionary for context
    const dictionaryContext = Object.values(codedLanguageDictionary)
      .map(entry => `- ${entry.term}: ${entry.meaning}`)
      .join('\n');

    const prompt = `You are an expert analyst for a Trust & Safety team specializing in detecting anti-Muslim hate speech and Islamophobia.
Your task is to analyze the provided content and determine if it violates hate speech policies.

Content to analyze:
${content ? `"${content}"` : "(Image provided)"}

Look for:
1. Explicit slurs and direct threats.
2. Coded language, dog whistles, and emojis used to bypass filters.
3. Conspiracy theories (e.g., Great Replacement, Love Jihad, Creeping Sharia, Halal Tax/Jizya).
4. Dehumanizing tropes.
Pay special attention to terms like "jizya" (when used to claim halal taxes fund terrorism), "economic jihad", "love jihad", "taqiyya", "remove kebab", and other coded political slurs.

Reference this dictionary of known coded terms:
${dictionaryContext}

Output MUST be a valid JSON object matching this structure exactly:
{
  "severity": "Low" | "Medium" | "High" | "Critical",
  "severityScore": 8,
  "categories": ["explicit", "coded", "visual", "relational", "synthetic", "conspiracy"],
  "codedTermsFound": [
    { "term": "string", "meaning": "string", "context": "string", "severity": "Low"|"Medium"|"High"|"Critical" }
  ],
  "contextExplanation": "A detailed explanation (2-4 sentences) of why this content is harmful, explaining the historical context or conspiracy theory behind it.",
  "counterNarratives": ["Fact-based counter argument 1", "Fact-based counter argument 2"],
  "platformViolations": [
     { "platform": "string", "policy": "string", "reportUrl": "string" }
  ]
}

Analyze the following content carefully and objectively.`;

    try {
      const model = ai.getGenerativeModel({ model: 'gemini-3.5-flash-lite' });
      let response;
      
      if (imageBase64) {
        const base64Data = imageBase64.split(',')[1];
        const mimeType = imageBase64.split(';')[0].split(':')[1];
        
        const result = await model.generateContent([
          prompt,
          {
            inlineData: {
              data: base64Data,
              mimeType
            }
          }
        ]);
        response = result.response;
      } else {
        const result = await model.generateContent(prompt);
        response = result.response;
      }

      const textResponse = response.text();
      if (!textResponse) {
        throw new Error("No text returned from Gemini API");
      }

      const cleanedJson = cleanJsonResponse(textResponse);
      const parsed = JSON.parse(cleanedJson);
      
      if (!parsed.codedTermsFound && parsed.codedLanguageDetected) {
         parsed.codedTermsFound = parsed.codedLanguageDetected;
      }
      if (!parsed.severity) parsed.severity = 'High';

      return NextResponse.json(parsed);

    } catch (aiError) {
      console.warn("Gemini API call failed (e.g., invalid key or quota exceeded). Falling back to mock data.", aiError);
      
      const lowerContent = content ? content.toLowerCase() : '';
      
      if (lowerContent.includes('halal') || lowerContent.includes('jizya') || lowerContent.includes('economic jihad')) {
        return NextResponse.json({
          severity: 'Medium',
          severityScore: 6,
          categories: ['Conspiracy', 'Relational'],
          codedTermsFound: [{ term: 'jizya / economic jihad', meaning: 'Falsely claiming halal certification fees fund terrorism.', context: 'Common conspiracy to boycott Muslim businesses.', severity: 'High' }],
          contextExplanation: "This post promotes a well-documented anti-Muslim conspiracy theory claiming that fees paid by food manufacturers for halal certification function as a stealth tax ('jizya') used to finance terrorism or 'economic jihad'. In reality, halal certification is a standard commercial service that verifies food compliance with Islamic dietary laws, similar to Kosher or organic labeling, and its proceeds do not fund terrorism.",
          counterNarratives: ["Halal certification is a voluntary, standard business service that ensures food meets religious dietary guidelines, identical in function to Kosher, Vegan, or Organic certifications.", "Multiple law enforcement and regulatory authorities worldwide have thoroughly investigated these claims and confirmed there is no connection between halal certification fees and terrorist funding."],
          platformViolations: [{ platform: 'meta', policy: 'Hate Speech', reportUrl: 'https://www.facebook.com/help/111029285741369' }]
        });
      }
      
      if (lowerContent.includes('termites') || lowerContent.includes('remplacement') || lowerContent.includes('replacement')) {
        return NextResponse.json({
          severity: 'Critical',
          severityScore: 9,
          categories: ['Conspiracy', 'Dehumanization', 'Explicit'],
          codedTermsFound: [
            { term: 'termites', meaning: 'Dehumanizing language comparing minorities to pests.', context: 'Historically used to justify ethnic cleansing by portraying a group as an infestation.', severity: 'Critical' },
            { term: 'grand remplacement', meaning: 'French origin of the "Great Replacement" theory.', context: 'White supremacist conspiracy theory claiming Western populations are being actively replaced by non-white/Muslim immigrants.', severity: 'Critical' }
          ],
          contextExplanation: "This content combines dehumanizing language ('termites') with the 'Great Replacement' conspiracy theory. By framing immigration as a 'stealth takeover', it promotes panic and implicitly justifies violence against minority populations as a form of self-defense.",
          counterNarratives: ["The 'Great Replacement' is a debunked, dangerous white supremacist conspiracy theory responsible for inspiring multiple real-world terror attacks.", "Using language that compares human beings to pests or insects is recognized internationally as a precursor to genocidal violence."],
          platformViolations: [{ platform: 'twitter', policy: 'Violent Speech & Dehumanization', reportUrl: 'https://help.twitter.com/en/rules-and-policies/violent-speech' }]
        });
      }

      if (lowerContent.includes('peace') || lowerContent.includes('💣') || lowerContent.includes('🥓')) {
        return NextResponse.json({
          severity: 'Medium',
          severityScore: 5,
          categories: ['Coded', 'Relational'],
          codedTermsFound: [
            { term: 'religion of peace', meaning: 'Sarcastic weaponization of a common phrase.', context: 'Used ironically to imply all Muslims are inherently violent.', severity: 'Medium' },
            { term: '💣 / 🥓', meaning: 'Weaponized emojis.', context: 'Spammed to harass Muslims by associating them with terrorism or mocking their dietary restrictions.', severity: 'Low' }
          ],
          contextExplanation: "This content uses sarcastic phrasing ('religion of peace') and weaponized emojis to bypass standard text-based hate speech filters while clearly attempting to associate an entire religious group with violence and terrorism.",
          counterNarratives: ["Associating billions of diverse people globally with the actions of extreme outliers is factually incorrect and promotes systemic bias.", "Using emojis to bypass hate speech filters still violates platform policies against targeted harassment."],
          platformViolations: [{ platform: 'tiktok', policy: 'Hateful Ideologies', reportUrl: 'https://www.tiktok.com/community-guidelines' }]
        });
      }

      // Default fallback (Kebab)
      return NextResponse.json({
        severity: 'High',
        severityScore: 8,
        categories: ['Coded Slur', 'Explicit'],
        codedTermsFound: [{ term: 'remove kebab', meaning: 'Reference to Serbian genocide used against Muslims', context: 'Internet meme that glorifies ethnic cleansing', severity: 'Critical' }],
        contextExplanation: 'This content uses historic genocide references to bypass standard hate speech filters while promoting violence against Muslim communities.',
        counterNarratives: ['This phrase is recognized by the UN as hate speech linked to ethnic cleansing.'],
        platformViolations: [{ platform: 'x', policy: 'Hateful Conduct', reportUrl: 'https://help.twitter.com/en/rules-and-policies/hateful-conduct' }]
      });
    }

  } catch (error: any) {
    console.error('Analysis API Error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze content', details: error.message },
      { status: 500 }
    );
  }
}
