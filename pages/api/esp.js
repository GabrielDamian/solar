// Next.js API route handler
const handler = async (req, res) => {
  console.log('ESP API handler called:', { 
    method: req.method,
    url: process.env.ESP_URL
  });

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.ESP_URL) {
    return res.status(500).json({ error: 'ESP_URL environment variable is not configured' });
  }

  try {
    console.log('Making request to ESP device...');
    const response = await fetch(process.env.ESP_URL, {
      method: 'GET',
      headers: {
        'Accept': 'text/plain, application/json',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      },
      timeout: 5000 // 5 second timeout
    });

    if (!response.ok) {
      throw new Error(`ESP device returned error: ${response.status} ${response.statusText}`);
    }

    const data = await response.text();
    console.log('ESP response received:', data);
    
    return res.status(200).json({ 
      success: true,
      message: 'Successfully connected to ESP device',
      data 
    });

  } catch (error) {
    console.error('ESP API Error:', error);
    
    if (error.type === 'request-timeout' || error.name === 'AbortError') {
      return res.status(504).json({ 
        error: 'Request timeout - ESP device not responding',
        details: 'The ESP device did not respond within 5 seconds'
      });
    }

    return res.status(500).json({ 
      error: 'Failed to connect to ESP device',
      details: error.message
    });
  }
};

// Make sure to export the handler as default
export default handler;
