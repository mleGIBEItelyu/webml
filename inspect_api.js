const https = require('https');
const ticker = 'BBCA';
const GIBEI_API_URL = 'https://gibeiml-apigibei.hf.space';

console.log(`[inspect] Fetching data for ${ticker} from ${GIBEI_API_URL}/predict/${ticker}...`);

https.get(`${GIBEI_API_URL}/predict/${ticker}`, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      console.log("\n--- API RESPONSE STRUCTURE ---");
      console.log("Root Keys:", Object.keys(parsed));
      
      console.log("\n--- FEATURES & DATA SAMPLES ---");
      
      if (parsed.historical_prices) {
        console.log("historical_prices (length):", parsed.historical_prices.length);
        console.log("historical_prices (sample):", parsed.historical_prices.slice(-3));
      }
      
      if (parsed.historical_volumes) {
        console.log("historical_volumes (length):", parsed.historical_volumes.length);
        console.log("historical_volumes (sample):", parsed.historical_volumes.slice(-3));
      }

      console.log("\nLatest Data Point:");
      console.log("- Date:", parsed.date);
      console.log("- Last Close:", parsed.last_close);
      console.log("- Recommendation:", parsed.recommendation);
      console.log("- Signal:", parsed.signal);
      
      if (parsed.range) {
        console.log("- Range:", parsed.range);
      }
      
      // Look for other interesting fields
      const features = Object.keys(parsed).filter(k => 
        !['historical_prices', 'historical_volumes', 'date', 'last_close'].includes(k)
      );
      console.log("\nOther available features/fields:", features);

    } catch (e) {
      console.log("Error parsing JSON:", e.message);
      console.log("Raw Response Header:", res.headers['content-type']);
      console.log("Raw Response (snippet):", data.slice(0, 500));
    }
  });
}).on('error', (err) => {
  console.log('Request Error: ' + err.message);
});
