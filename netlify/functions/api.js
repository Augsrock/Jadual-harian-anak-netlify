// netlify/functions/api.js
exports.handler = async (event, context) => {
  // Ambil URL rahsia daripada Netlify Environment Variables
  const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;

  if (!GOOGLE_SCRIPT_URL) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server Configuration Error: URL tidak dijumpai." }),
    };
  }

  // Dapatkan query parameters (untuk GET request seperti login & getData)
  const queryString = new URLSearchParams(event.queryStringParameters).toString();
  const fullUrl = queryString ? `${GOOGLE_SCRIPT_URL}?${queryString}` : GOOGLE_SCRIPT_URL;

  try {
    const options = {
      method: event.httpMethod,
      headers: { 'Content-Type': 'application/json' }
    };

    // Jika POST request (saveData & changeActiveChild), hantar body data sekali
    if (event.httpMethod === 'POST' && event.body) {
      options.body = event.body;
    }

    const response = await fetch(fullUrl, options);
    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // Mengendalikan CORS secara selamat
      },
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.toString() }),
    };
  }
};