import { NextRequest, NextResponse } from 'next/server';

// Route segment config for Vercel
export const runtime = 'nodejs';

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
      const targetUrl = `${targetBase}${pathString}${queryString}`;

      // Build headers
      const forwardHeaders: Record<string, string> = {};
      request.headers.forEach((value, key) => {
        const lower = key.toLowerCase();
        if (!['host', 'connection', 'content-length'].includes(lower)) {
          forwardHeaders[key] = value;
        }
      });

      let body: BodyInit | undefined = undefined;
      const method = request.method;
      if (method && !['GET', 'HEAD'].includes(method.toUpperCase())) {
        try {
          const contentType = request.headers.get('content-type');
          if (contentType?.includes('multipart/form-data')) {
            // For file uploads, pass through the FormData
            body = await request.formData();
            // Don't set Content-Type header - browser sets it with boundary
            delete forwardHeaders['Content-Type'];
          } else if (contentType?.includes('application/json')) {
            body = JSON.stringify(await request.json());
            forwardHeaders['Content-Type'] = 'application/json';
          } else {
            body = await request.text();
          }
        } catch {
          body = undefined;
        }
      }

      console.log('[api-proxy] ->', method, targetUrl);

      const backendResponse = await fetch(targetUrl, {
        method,
        headers: forwardHeaders,
        body,
      });

      const contentType = backendResponse.headers.get('content-type') || 'application/json';
      const responseHeaders = new Headers();
      responseHeaders.set('content-type', contentType);

      if (contentType.includes('application/json')) {
        const data = await backendResponse.json().catch(() => ({}));
        return NextResponse.json(data, {
          status: backendResponse.status,
          headers: responseHeaders,
        });
      } else {
        const text = await backendResponse.text();
        return new NextResponse(text, {
          status: backendResponse.status,
          headers: responseHeaders,
        });
      }
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

