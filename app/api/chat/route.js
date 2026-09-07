import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `
You are an expert Neuro-Linguistic Programming (NLP) practitioner.
Your goal is to help the user identify and dismantle limiting beliefs using Meta-Model techniques.

Rules:
1. ACKNOWLEDGE & isolate the core limiting belief.
2. CATEGORIZE the linguistic pattern (e.g., Universal Quantifiers like 'always/never', Modal Operators like 'can't/must', Mind Reading, Complex Equivalence).
3. SOCRATIC PROBE: Ask ONE precise question targeted at that pattern to challenge its rigid logic. Do not offer solutions yet.
4. SHIFT: Once the user sees a flaw in the belief, offer two grounded, empowering alternative perspectives.

Keep answers concise, empathetic, and under 90 words per turn.
`;

export async function POST(req) {
  try {
    const { messages } = await req.json();

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages
      ],
      temperature: 0.7,
    });

    return NextResponse.json({
      response: completion.choices[0].message.content
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
