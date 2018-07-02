import { AuthConfig } from 'node-sp-auth-config';

export const getAuth = new AuthConfig({
  configPath: './config/private.json',
  encryptPassword: true,
  saveConfigOnDisk: true
});
