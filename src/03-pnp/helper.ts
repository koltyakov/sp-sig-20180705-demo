import { sp, Item, ListItemFormUpdateValue, PermissionKind, Web } from '@pnp/sp';
import { format, addMinutes } from 'date-fns';

export const dateToFormStringAutoOffset = async (dateTime: Date | string, web: Web = sp.web): Promise<string> => {
  const { Bias: offsetBias } = await web.regionalSettings.timeZone.usingCaching().get().then((t) => t.Information);
  return dateToFormString(dateTime, offsetBias);
};

export const dateToFormString = (dateTime: Date | string, offsetBias: number = 0): string => {
  dateTime = addMinutes(new Date(dateTime), new Date().getTimezoneOffset() - offsetBias);
  return format(dateTime, 'M/D/YYYY h:m A');
};

export const loginToFormString = (userName: string): string => {
  return JSON.stringify([{ Key: userName, IsResolved: true }]);
};

export const systemUpdate = async (item: Item, formUpdateValues: ListItemFormUpdateValue[]) => {

  const web = new Web(item.toUrl().split('_api')[0]);

  const permissions = await item.getCurrentUserEffectivePermissions();
  if (!item.hasPermissions(permissions, PermissionKind.ManagePermissions)) {
    throw new Error('403 - Access denied. Full Control permissions level is required for performing this operation.');
  }

  const { Author: { Name }, Created: Modified } = await item.select('Created,Author/Name').expand('Author').get();

  const sysUpdateData = [
    { FieldName: 'Editor', FieldValue: loginToFormString(Name) },
    { FieldName: 'Modified', FieldValue: await dateToFormStringAutoOffset(Modified, web) }
  ];

  const result = await item.validateUpdateListItem(formUpdateValues.concat(sysUpdateData), true);

  const errors = result.filter((field) => field.ErrorMessage !== null);
  if (errors.length > 0) {
    throw new Error(JSON.stringify(errors));
  }

  return result;

};
