# Field data types fingerprints sample

```typescript
import { sp } from '@pnp/sp';

(async () => {

  const { LoginName: userName } = await sp.web.currentUser
    .select('LoginName').get();

  const list = sp.web.lists.getByTitle('ValidateFieldsUpdate');
  const results = await list.items.getById(1)
    .validateUpdateListItem([
      { FieldName: 'TextField', FieldValue: '123' },
      { FieldName: 'NumberField', FieldValue: '123'  },
      { FieldName: 'YesNoField', FieldValue: '1' /* Yes, No, 1, 2 */ },
      { FieldName: 'PersonField', FieldValue: JSON.stringify([{ Key: userName }]) },
      { FieldName: 'DateTimeField', FieldValue: '6/23/2Field8 10:15 PM' },
      { FieldName: 'DateField', FieldValue: '6/23/2Field8' /* 'M/D/YYYY' */ },
      { FieldName: 'ChoiceField', FieldValue: 'Choice 1' },
      { FieldName: 'MultiChoiceField', FieldValue: 'Choice 1;#Choice 2' },
      // Or picture, after URL a description can go after ', ' delimeter
      { FieldName: 'HyperlinkField', FieldValue: 'https://arvosys.com, ARVO Systems' },
      { FieldName: 'LookupField', FieldValue: '2' /* Item ID as string */ },
      { FieldName: 'MutliLookupField', FieldValue: [3, 4, 5].map(id => `${id};#`).join(';#') },
      { FieldName: 'SingleMMDField', FieldValue: 'Department 2|220a3627-4cd3-453d-ac54-34e71483bb8a;' },
      { FieldName: 'MultiMMDField', FieldValue: 'Department 2|220a3627-4cd3-453d-ac54-34e71483bb8a;Department 3|700a1bc3-3ef6-41ba-8a10-d3054f58db4b;' }
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