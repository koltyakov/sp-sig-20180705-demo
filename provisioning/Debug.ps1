. "$PSScriptRoot\lib\Functions.ps1";

$Context = Get-SpAuthContext -Path "./config/private.json";

$Connection = Connect-PnPOnline -Url $Context.SiteUrl -Credential $Context.Credentials;

Set-PnPTenantSite -Url $Context.SiteUrl -NoScriptSite:$False -Connection $Connection;
