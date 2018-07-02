import { sp } from '@pnp/sp';
import { PnpNode } from 'sp-pnp-node';
import { AuthConfig } from 'node-sp-auth-config';

export const getAuth = new AuthConfig({
  configPath: './config/private.json',
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
