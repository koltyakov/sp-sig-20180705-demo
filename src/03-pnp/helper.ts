import { Item, ListItemFormUpdateValue, PermissionKind } from '@pnp/sp';
import { format } from 'date-fns';

export const dateToFormString = (dateTime: Date | string): string => {
  return format(dateTime, 'M/D/YYYY h:m A');
};

export const loginToFormString = (userName: string): string => {
  return JSON.stringify([{ Key: userName }]);
};

export const systemUpdate = async (item: Item, formUpdateValues: ListItemFormUpdateValue[]) => {

  const permissions = await item.getCurrentUserEffectivePermissions();
  if (!item.hasPermissions(permissions, PermissionKind.ManagePermissions)) {
    throw new Error('403 - Access denied. Full Control permissions level is required for performing this operation.');
  }

  const { Author: { Name }, Created: Modified } = await item.select('Created,Author/Name').expand('Author').get();

  const sysUpdateData = [
    { FieldName: 'Editor', FieldValue: loginToFormString(Name) },
    { FieldName: 'Modified', FieldValue: dateToFormString(new Date(Modified)) }
  ];

  const result = await item.validateUpdateListItem(formUpdateValues.concat(sysUpdateData), true);

  const errors = result.filter(field => field.ErrorMessage !== null);
  if (errors.length > 0) {
    throw new Error(JSON.stringify(errors));
  }

  return result;

};
