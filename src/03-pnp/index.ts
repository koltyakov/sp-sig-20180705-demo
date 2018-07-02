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

  const guineaPigs = [ 'Oliver', 'Rocko', 'Sebastian' ];

  const listUri = 'Lists/SysUpdate01';
  const list = sp.web.getList(`${getRelativeUrl(siteUrl)}/${listUri}`);
  const items = await list.items
    .select('Id,Title')
    .filter(guineaPigs.map(name => {
      return `Title eq '${name}'`;
    }).join(' or '))
    .get();

  for (const { Id, Title } of items) {
    console.log(`Updating: ${Title} (${Id})`);
    await systemUpdate(list.items.getById(Id), [{
      FieldName: 'DataField01',
      FieldValue: `Updated with REST using PnPjs, ${new Date().toISOString()}`
    }]);
  }

  console.log('Done');

})()
  .catch(console.log);
