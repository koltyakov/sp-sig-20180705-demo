# Field data types fingerprints sample

```typescript
import { sp } from '@pnp/sp';

(async () => {

  const { LoginName: userName } = await sp.web.currentUser
    .select('LoginName').get();

  const list = sp.web.lists.getByTitle('ValidateFieldsUpdate');
  const results = await list.items
    .getById(1)
    .validateUpdateListItem([
      { FieldName: 'Text01', FieldValue: '123' },
      { FieldName: 'Number01', FieldValue: '123' /* as string */ },
      { FieldName: 'YesNo01', FieldValue: '1' /* Yes, No, 1, 2 */ },
      { FieldName: 'Person01', FieldValue: JSON.stringify([{ Key: userName }]) /* LoginName */ },
      { FieldName: 'DateTime01', FieldValue: '6/23/2018 10:15 PM' /* 'M/D/YYYY h:m A' */ },
      { FieldName: 'Date01', FieldValue: '6/23/2018' /* 'M/D/YYYY' */ },
      { FieldName: 'Choice01', FieldValue: 'Choice 1' },
      { FieldName: 'MultiChoice01', FieldValue: 'Choice 1;#Choice 2' },
      // Or picture, after URL a description can go after ', ' delimeter
      { FieldName: 'Hyperlink01', FieldValue: 'https://arvosys.com, ARVO Systems' },
      { FieldName: 'Lookup01', FieldValue: '2' /* Item ID as string */ },
      { FieldName: 'MutliLookup01', FieldValue: [3, 4, 5].map(id => `${id};#`).join(';#') },
      { FieldName: 'SingleMMD01', FieldValue: 'Department 2|220a3627-4cd3-453d-ac54-34e71483bb8a;' },
      { FieldName: 'MultiMMD01', FieldValue: 'Department 2|220a3627-4cd3-453d-ac54-34e71483bb8a;Department 3|700a1bc3-3ef6-41ba-8a10-d3054f58db4b;' }
    ])
    .then(result => {
      const errors = result.filter(field => field.ErrorMessage !== null);
      if (errors.length > 0) {
        throw new Error(JSON.stringify(errors));
      }
      return result;
    });

  console.log(results);

})()
  .catch(console.error);
```