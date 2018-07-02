import { sp } from '@pnp/sp';
import { PnpNode } from 'sp-pnp-node';
import { AuthConfig } from 'node-sp-auth-config';
import * as parseArgs from 'minimist';

const args = parseArgs(process.argv);

export const configPath = args['private'] || './config/private.json';

export const getAuth = new AuthConfig({
  configPath,
  encryptPassword: true,
  saveConfigOnDisk: true
});

export const initPnp = async (): Promise<{ siteUrl: string }> => {
  const { siteUrl, authOptions } = await getAuth.getContext();
  sp.setup({
    sp: {
      fetchClientFactory: () => new PnpNode({ siteUrl, authOptions }),
      baseUrl: siteUrl
    }
  });
  return { siteUrl };
};
