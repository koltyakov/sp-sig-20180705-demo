import { AuthConfig } from 'node-sp-auth-config';
import { configPath } from './auth';

const args = process.argv.splice(3);

const forcePrompts = args.indexOf('--force') !== -1;

const authConfig = new AuthConfig({
  configPath,
  encryptPassword: true,
  saveConfigOnDisk: true,
  forcePrompts
});

authConfig.getContext().catch(console.log);
