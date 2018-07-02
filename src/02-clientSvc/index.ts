import { sp } from '@pnp/sp';
import { PnpNode } from 'sp-pnp-node';
import { getAuth } from '../common/auth';
import { getRelativeUrl } from '../common/utils';
import { systemUpdate } from './helper';

(async () => {

  const { siteUrl, authOptions } = await getAuth.getContext();

  sp.setup({
    sp: {
      fetchClientFactory: () => new PnpNode({ siteUrl, authOptions }),
      baseUrl: siteUrl
    }
  });

  const guineaPigs = [ 'Homer', 'Zipper', 'Bart' ];

  const listUri = 'Lists/SysUpdate01';
  const items = await sp.web.getList(`${getRelativeUrl(siteUrl)}/${listUri}`).items
    .select('Id,Title')
    .filter(guineaPigs.map(name => {
      return `Title eq '${name}'`;
    }).join(' or '))
    .get();

  for (const { Id, Title } of items) {
    console.log(`Updating: ${Title} (${Id})`);
    await systemUpdate(siteUrl, listUri, Id, [{
      name: 'DataField01',
      value: `Updated with raw JSOM XML request, ${new Date().toISOString()}`
    }]);
  }

  console.log('Done');

})()
  .catch(console.log);
