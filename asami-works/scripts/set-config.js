// Firebase Functions の設定を行うスクリプト
const { execSync } = require('child_process');
require('dotenv').config({ path: '.env.local' });

const setConfig = () => {
  const configs = [
    `gmail.service_account_email="${process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL}"`,
    `gmail.private_key="${process.env.GOOGLE_PRIVATE_KEY}"`,
    `gmail.user="${process.env.GMAIL_USER}"`,
    `gmail.admin_email="${process.env.ADMIN_EMAIL}"`,
    `app.site_url="${process.env.NEXT_PUBLIC_SITE_URL}"`
  ];

  configs.forEach(config => {
    try {
      execSync(`firebase functions:config:set ${config}`, { stdio: 'inherit' });
    } catch (error) {
      console.error(`Failed to set ${config}:`, error.message);
    }
  });

  console.log('Configuration set successfully!');
};
setConfig();


