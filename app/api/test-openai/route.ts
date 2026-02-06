import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function GET() {
  try {
    const openaiApiKey = process.env.OPENAI_API_KEY;
    
    if (!openaiApiKey) {
      return NextResponse.json(
        { 
          error: 'OPENAI_API_KEY not configured',
          configured: false,
        },
        { status: 500 }
      );
    }

    const openai = new OpenAI({ apiKey: openaiApiKey });

    // Test simple avec un prompt minimal
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: 'Réponds simplement "OK" en JSON: {"status": "ok"}',
        },
      ],
      response_format: { type: 'json_object' },
      max_tokens: 50,
    });

    const content = completion.choices[0]?.message?.content;

    return NextResponse.json({
      configured: true,
      keyLength: openaiApiKey.length,
      testResult: content,
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      {
        configured: !!process.env.OPENAI_API_KEY,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false,
      },
      { status: 500 }
    );
  }
}
