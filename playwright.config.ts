import { defineConfig, devices } from '@playwright/test';
try { process.loadEnvFile('.env'); } catch { /* CI fornece as variáveis diretamente. */ }
if (!process.env.TEST_DATABASE_URL || !new URL(process.env.TEST_DATABASE_URL).pathname.endsWith('_test')) throw new Error('Configure um TEST_DATABASE_URL exclusivo com sufixo _test');
export default defineConfig({
  testDir:'./tests/e2e',fullyParallel:false,workers:1,timeout:30000,
  use:{baseURL:'http://127.0.0.1:3100',trace:'retain-on-failure'},
  projects:[{name:'desktop',use:{...devices['Desktop Chrome']}},{name:'mobile',use:{...devices['iPhone 13'],defaultBrowserType:'chromium'}}],
  webServer:[
    {command:'npm run start -w @haru/api',url:'http://127.0.0.1:3002/api/health',reuseExistingServer:false,env:{DATABASE_URL:process.env.TEST_DATABASE_URL,API_PORT:'3002',WEB_ORIGIN:'http://127.0.0.1:3100'}},
    {command:'npm run start -w @haru/web -- -p 3100',url:'http://127.0.0.1:3100',reuseExistingServer:false,env:{API_URL:'http://127.0.0.1:3002'}},
  ],
});
