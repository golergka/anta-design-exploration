import {defineConfig} from '@playwright/test';
export default defineConfig({testDir:'./tests',use:{baseURL:'http://127.0.0.1:4174',browserName:'chromium'},webServer:{command:'python3 -m http.server 4174 --directory out',url:'http://127.0.0.1:4174',reuseExistingServer:!process.env.CI}});
