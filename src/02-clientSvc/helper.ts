import { SPHttpClient } from '@pnp/sp';
import { getRelativeUrl } from '../common/utils';

export const systemUpdate = (siteUrl: string, listUri: string, itemId: number, data: { name: string; value: string }[]): Promise<any> => {

  const body = (() => {
    let objectId = 4;
    return `
      <Request xmlns="http://schemas.microsoft.com/sharepoint/clientquery/2009" SchemaVersion="15.0.0.0" LibraryVersion="16.0.0.0" ApplicationName="Javascript Library">
        <Actions>
          ${data.map(d => {
            return `
              <Method Name="SetFieldValue" Id="${objectId++}" ObjectPathId="3">
                <Parameters>
                  <Parameter Type="String">${d.name}</Parameter>
                  <Parameter Type="String">${d.value}</Parameter>
                </Parameters>
              </Method>
            `;
          }).join('')}
          <Method Name="SystemUpdate" Id="${objectId++}" ObjectPathId="3" />
        </Actions>
        <ObjectPaths>
          <Property Id="1" ParentId="0" Name="Web" />
          <Method Id="2" ParentId="1" Name="GetList">
            <Parameters>
              <Parameter Type="String">${getRelativeUrl(siteUrl)}/${listUri}</Parameter>
            </Parameters>
          </Method>
          <Method Id="3" ParentId="2" Name="GetItemById">
            <Parameters>
              <Parameter Type="Number">${itemId}</Parameter>
            </Parameters>
          </Method>
          <StaticProperty Id="0" TypeId="{3747adcd-a3c3-41b9-bfab-4a64dd2f1e0a}" Name="Current" />
        </ObjectPaths>
      </Request>
    `;
  })();

  const endpoint = `${siteUrl}/_vti_bin/client.svc/ProcessQuery`;
  const client = new SPHttpClient();

  return client.post(endpoint, {
    headers: {
      'Accept': '*/*',
      'Content-Type': 'text/xml;charset="UTF-8"',
      'X-Requested-With': 'XMLHttpRequest'
    },
    body
  })
    .then(r => r.json())
    .then(r => {
      if (r[0].ErrorInfo) {
        throw new Error(r[0].ErrorInfo.ErrorMessage);
      }
      return r;
    });

};
