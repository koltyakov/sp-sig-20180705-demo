import { JsomNode } from 'sp-jsom-node';
import { getAuth } from '../common/auth';
import { getRelativeUrl } from '../common/utils';

(async () => {

  const { siteUrl, authOptions } = await getAuth.getContext();
  new JsomNode().init({ siteUrl, authOptions });

  const ctx = new SP.ClientContext(siteUrl);
  const list = ctx.get_web().getList(`${getRelativeUrl(siteUrl)}/Lists/GuineaPigs`);

  const guineaPigs = [ 'Braveheart', 'Zipper', 'Rocko' ];

  const camlQuery = new SP.CamlQuery();
  camlQuery.set_viewXml(`
    <View Scope='RecursiveAll'>
      <Query>
        <Where>
          <In>
            <FieldRef Name='Title' />
            <Values>
              ${guineaPigs.map((name) => {
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

  items.get_data().forEach((item) => {
    const { ID, Title } = item.get_fieldValues();
    console.log(`Updating: ${Title} (${ID})`);
    item.set_item('DataField01', `Updated with JSOM request, ${new Date().toISOString()}`);
    // item.update();
    // item['updateOverwriteVersion']();
    (item as any).systemUpdate(); // item.systemUpdate() just is not added in typings yet
  });

  await ctx.executeQueryPromise();

  console.log('Done');

})()
  .catch(console.log);
