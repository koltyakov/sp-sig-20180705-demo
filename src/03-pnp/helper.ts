import { Item, ListItemFormUpdateValue } from '@pnp/sp';
import { format } from 'date-fns';

export const dateToFormString = (dateTime: Date | string): string => {
  return format(dateTime, 'M/D/YYYY h:m A');
};

export const loginToFormString = (userName: string): string => {
  return JSON.stringify([{ Key: userName }]);
};

export const systemUpdate = async (item: Item, formUpdateValues: ListItemFormUpdateValue[]) => {

  const { Editor: { Name }, Modified } = await item.select('Modified,Editor/Name').expand('Editor').get();

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
