import { sp } from '@pnp/sp';
import { initPnp } from '../common/auth';
import { getRelativeUrl } from '../common/utils';
import { dateToFormString, loginToFormString } from '../03-pnp/helper';

const getRandomDate = (start: Date, end: Date): Date => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

(async () => {

  const { siteUrl } = await initPnp();

  const currentUser = await sp.web.currentUser.select('LoginName').get();
  const users = await sp.web.siteUsers.select('Id,LoginName').get()
    .then(users => users.filter(({ LoginName }) => LoginName.indexOf('i:0#.f|membership|') !== -1))
    .then(users => users.filter(({ LoginName }) => LoginName !== currentUser.LoginName));

  const listUri = 'Lists/GuineaPigs';
  const list = sp.web.getList(`${getRelativeUrl(siteUrl)}/${listUri}`);
  const items = await list.items.select('Id,Title').orderBy('Id').get();

  for (const item of items) {
    console.log(`Resetting: ${item.Title} item`);
    const randomUser = users.length > 0 ? users[Math.floor(Math.random() * users.length)] : currentUser;
    const randomDate = getRandomDate(new Date(2016, 1, 1), new Date(2018, 7, 1));
    await list.addValidateUpdateItemUsingPath([
      { FieldName: 'Title', FieldValue: item.Title },
      { FieldName: 'Author', FieldValue: loginToFormString(randomUser.LoginName) },
      { FieldName: 'Created', FieldValue: dateToFormString(new Date(randomDate)) },
      { FieldName: 'Editor', FieldValue: loginToFormString(randomUser.LoginName) },
      { FieldName: 'Modified', FieldValue: dateToFormString(new Date(randomDate)) }
    ], `${getRelativeUrl(siteUrl)}/${listUri}`);
    await list.items.getById(item.Id).delete();
  }

  console.log('Done');

})()
  .catch(console.log);
