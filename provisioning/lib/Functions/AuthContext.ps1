Function Get-SpAuthContext {
  [CmdletBinding()]

  param (
    [Parameter(Mandatory=$False)]
    [string] $Path = "./config/private.json"
  );

  Process {
    # Write-Host "Auth config locations:" $Path

    $Context = $null;

    if ((Test-Path $Path) -eq $False) {
      Write-Host "`nNo connection file found ($Path), run ``npm run connect`` first to configure the connection to SharePoint.`n" -ForegroundColor Red;
      Exit;
    }

    if (Test-Path $Path) {
      $SpAuthRead = "node_modules/.bin/sp-auth read -p $Path";

      $Context = Invoke-Expression $SpAuthRead | ConvertFrom-Json;

      $Username = $Context.authOptions.username;
      $Password = $Context.authOptions.password;

      $secPassword = ConvertTo-SecureString -String $Password -AsPlainText -Force;

      $Credentials = New-Object System.Management.Automation.PSCredential ($Username, $secPassword);
      $TenantHostUrl = ([System.Uri]$Context.siteUrl).Scheme + "://" + ([System.Uri]$Context.siteUrl).IdnHost;
      $TenantAdminUrl = $TenantHostUrl.Replace(".sharepoint.com", "-admin.sharepoint.com");

      $Context | Add-Member -NotePropertyName Credentials -NotePropertyValue $Credentials;
      $Context | Add-Member -NotePropertyName TenantHostUrl -NotePropertyValue $TenantHostUrl;
      $Context | Add-Member -NotePropertyName TenantAdminUrl -NotePropertyValue $TenantAdminUrl;
    }

    $Context;
  }
}