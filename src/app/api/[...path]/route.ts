import { NextRequest, NextResponse } from 'next/server';

// Route segment config for Vercel
export const runtime = 'edge';

// External backend proxy mode
function normalizeBackendUrl(url: string | undefined | null): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (!trimmed) return '';
  const hasProtocol = /^https?:\/\//i.test(trimmed);
  const withProtocol = hasProtocol ? trimmed : `https://${trimmed}`;
  return withProtocol.replace(/\/+$/, '');
}

const BACKEND_URL = normalizeBackendUrl(
  process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL
);

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const params = await context.params;
  return handleRequest(request, params);
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const params = await context.params;
  return handleRequest(request, params);
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const params = await context.params;
  return handleRequest(request, params);
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const params = await context.params;
  return handleRequest(request, params);
}

async function handleRequest(
  request: NextRequest,
  { path }: { path: string[] }
) {
  try {
    const pathString = '/' + path.join('/');
    const searchParams = request.nextUrl.searchParams.toString();
    const queryString = searchParams ? `?${searchParams}` : '';

    // If external backend configured, proxy the request
    if (BACKEND_URL) {
      const targetBase = BACKEND_URL.replace(/\/$/, '');
      const targetUrl = `${targetBase}/api${pathString}${queryString}`;

      // Build headers
      const forwardHeaders: Record<string, string> = {};
      request.headers.forEach((value, key) => {
        const lower = key.toLowerCase();
        // Do not remove Content-Type; let it pass through (essential for multipart boundaries)
        if (!['host', 'connection', 'content-length'].includes(lower)) {
          forwardHeaders[key] = value;
        }
      });

      console.log('[api-proxy] ->', request.method, targetUrl);

      // Stream the body if it's not GET/HEAD
      const method = request.method;
      let body: ReadableStream | null = null;
      // @ts-ignore: 'duplex' is a valid fetch option in Node > 18 but might be missing in types
      const fetchOptions: RequestInit & { duplex?: string } = {
        method,
        headers: forwardHeaders,
      };

      if (method && !['GET', 'HEAD'].includes(method.toUpperCase())) {
        if (request.body) {
          fetchOptions.body = request.body;
          fetchOptions.duplex = 'half';
        }
      }

      const backendResponse = await fetch(targetUrl, fetchOptions);

      const contentType = backendResponse.headers.get('content-type') || 'application/json';
      const responseHeaders = new Headers();
      responseHeaders.set('content-type', contentType);

      // Stream the response back
      return new NextResponse(backendResponse.body, {
        status: backendResponse.status,
        headers: responseHeaders,
      });
    }

    // If no external backend configured, show diagnostic
    return NextResponse.json(
      {
        error: 'Backend URL not configured',
        message:
          'Set BACKEND_URL (or NEXT_PUBLIC_BACKEND_URL) environment variable to your external backend base URL.',
        path: pathString,
      },
      { status: 500 }
    );
  } catch (error) {
    console.error('[api] Handler error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

