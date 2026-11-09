import { defineConfig } from '@playwright/test'
export default defineConfig({testDir:'./tests',use:{baseURL:'http://127.0.0.1:43117',headless:true,launchOptions:{executablePath:process.env.CHROME_PATH}},webServer:{command:'npm run build && npx vite preview --host 127.0.0.1 --port 43117',port:43117,reuseExistingServer:false,timeout:120000}})
