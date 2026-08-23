export interface Env {
  CRAZYLAB_KV: KVNamespace
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
  'Access-Control-Allow-Headers': 'content-type',
}

const MAX_BODY_BYTES = 2_000_000

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS })
    }

    const key = new URL(request.url).pathname.slice(1)
    if (!key) {
      return new Response('Missing key', { status: 400, headers: CORS_HEADERS })
    }

    if (request.method === 'GET') {
      const value = await env.CRAZYLAB_KV.get(key)
      if (value === null) {
        return new Response('Not found', { status: 404, headers: CORS_HEADERS })
      }
      return new Response(value, {
        headers: { ...CORS_HEADERS, 'content-type': 'application/json' },
      })
    }

    if (request.method === 'PUT') {
      const body = await request.text()
      if (body.length > MAX_BODY_BYTES) {
        return new Response('Payload too large', { status: 413, headers: CORS_HEADERS })
      }
      await env.CRAZYLAB_KV.put(key, body)
      return new Response(null, { status: 204, headers: CORS_HEADERS })
    }

    return new Response('Method not allowed', { status: 405, headers: CORS_HEADERS })
  },
}
