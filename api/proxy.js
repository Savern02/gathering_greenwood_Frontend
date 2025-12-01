export default async function handler(req, res) {
  const { path, ...queryParams } = req.query;
  const apiUrl = `http://172.232.24.146/api/${path || ''}`;

  // Build URL with query parameters (excluding 'path')
  const url = new URL(apiUrl);
  Object.entries(queryParams).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });

  try {
    const response = await fetch(url.toString(), {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: req.method !== 'GET' && req.body ? JSON.stringify(req.body) : undefined,
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Failed to fetch from backend', details: error.message });
  }
}
