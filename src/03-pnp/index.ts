import { sp } from '@pnp/sp';
import { initPnp } from '../common/auth';
import { getRelativeUrl } from '../common/utils';
import { systemUpdate } from './helper';
// import { Changes } from '../common/changes';

(async () => {

  const { siteUrl } = await initPnp();

  const guineaPigs = [ 'Oliver', 'Rocko', 'Sebastian' ];

  const listUri = 'Lists/SysUpdate01';
  const list = sp.web.getList(`${getRelativeUrl(siteUrl)}/${listUri}`);
  const items = await list.items
    .select('Id,Title')
    .filter(guineaPigs.map(name => {
      return `Title eq '${name}'`;
    }).join(' or '))
    .get();

  // const changes = new Changes(`${getRelativeUrl(siteUrl)}/Lists/SysUpdate01`);
  // await changes.getCurrentToken();

  for (const { Id, Title } of items) {
    console.log(`Updating: ${Title} (${Id})`);
    await systemUpdate(list.items.getById(Id), [{
      FieldName: 'DataField01',
      FieldValue: `Updated with REST using PnPjs, ${new Date().toISOString()}`
    }]);
  }

  // const changedItems = await changes.getChanges();
  // console.log(changedItems);

  console.log('Done');

})()
  .catch(console.log);
