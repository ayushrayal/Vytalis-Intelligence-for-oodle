import 'dotenv/config';
import app from './src/app.js';
import { envConfig } from './src/config/env.config.js';

const PORT = envConfig.port || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
