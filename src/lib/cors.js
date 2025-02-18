// cors.js
export const allowCors = (req, res) => {
    const allowedOrigins = [
      "https://yourdomain.com",
      "https://sub.yourdomain.com",
      "http://localhost:5173",  // Allowing localhost for development
      "http://127.0.0.1:5173",  // Another localhost variant
    ];
  
    const origin = req.headers.origin;
  
    // Allow requests from allowed origins
    if (allowedOrigins.includes(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin);
    }
  
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  
    // Handle preflight requests (OPTIONS)
    if (req.method === "OPTIONS") {
      res.status(204).end();
      return;
    }
  };
  