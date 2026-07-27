import 'dotenv/config';
import app from './src/app.js';
import { envConfig } from './src/config/env.config.js';

const PORT = envConfig.port || 5000;
console.log("OODLE_API_KEY:", envConfig.oodleApiKey);
console.log("OODLE_BASE_URL:", envConfig.oodleBaseUrl);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
