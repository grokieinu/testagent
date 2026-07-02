import { NextResponse } from 'next/server';

// Bypass SSL verification (corporate proxy/antivirus doing SSL inspection)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const API_KEY = process.env.API_KEY;
const API_BASE_URL = process.env.API_BASE_URL || 'https://api.deepseek.com/v1';
const API_MODEL = process.env.API_MODEL || 'deepseek-chat';

export async function POST(request) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'messages array is required' },
        { status: 400 }
      );
    }

    const res = await fetch(`${API_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: API_MODEL,
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          ...messages,
        ],
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json(
        { error: errorData.error?.message || 'API error' },
        { status: res.status }
      );
    }

    const data = await res.json();

    return NextResponse.json({
      response: data.choices[0].message.content,
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
