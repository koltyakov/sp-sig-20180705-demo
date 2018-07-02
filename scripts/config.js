//@ts-check

const { AuthConfig } = require('node-sp-auth-config');

const args = process.argv.splice(3);

const forcePrompts = args.indexOf('--force') !== -1;

const authConfig = new AuthConfig({
  configPath: './config/private.json',
  encryptPassword: true,
  saveConfigOnDisk: true,
  forcePrompts
});

authConfig.getContext().catch(console.log);