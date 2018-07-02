import { JsomNode } from 'sp-jsom-node';
import { getAuth } from '../common/auth';
import { getRelativeUrl } from '../common/utils';
// import { Changes } from '../common/changes';

(async () => {

  const { siteUrl, authOptions } = await getAuth.getContext();
  new JsomNode({ siteUrl, authOptions }).init();

  const ctx = new SP.ClientContext(siteUrl);
  const list = ctx.get_web().getList(`${getRelativeUrl(siteUrl)}/Lists/SysUpdate01`);

  const guineaPigs = [ 'Braveheart', 'Leonard', 'Boomer' ];

  const camlQuery = new SP.CamlQuery();
  camlQuery.set_viewXml(`
    <View Scope='RecursiveAll'>
      <Query>
        <Where>
          <In>
            <FieldRef Name='Title' />
            <Values>
              ${guineaPigs.map(name => {
                return `<Value Type='Text'>${name}</Value>`;
              }).join('')}
            </Values>
          </In>
        </Where>
      </Query>
    </View>
  `);

  const items = list.getItems(camlQuery);

  ctx.load(items, 'Include(ID,Title)');
  await ctx.executeQueryPromise();

  items.get_data().forEach(item => {
    const { ID, Title } = item.get_fieldValues();
    console.log(`Updating: ${Title} (${ID})`);
    item.set_item('DataField01', `Updated with JSOM request, ${new Date().toISOString()}`);
    // item.update();
    item['systemUpdate'](); // item.systemUpdate() just is not added in typings yet
    // item['updateOverwriteVersion']();
  });

  // const changes = new Changes(`${getRelativeUrl(siteUrl)}/Lists/SysUpdate01`);
  // await changes.initPnp();
  // await changes.getCurrentToken();

  await ctx.executeQueryPromise();

  // const changedItems = await changes.getChanges();
  // console.log(changedItems);

  console.log('Done');

})()
  .catch(console.log);
