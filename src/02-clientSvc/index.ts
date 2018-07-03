import { sp } from '@pnp/sp';
import { initPnp } from '../common/auth';
import { getRelativeUrl } from '../common/utils';
import { systemUpdate } from './helper';

(async () => {

  const { siteUrl } = await initPnp();

  const guineaPigs = [ 'Leonard', 'Bart', 'Sebastian' ];

  const listUri = 'Lists/GuineaPigs';
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
