Function PrintInfoMessage($message) {
  Write-Host -Foregroundcolor Cyan $message;
}

Function PrintSuccessMessage($message) {
  Write-Host -Foregroundcolor Green $message;
}
Function PrintWarningMessage($message) {
  Write-Host -Foregroundcolor Yellow $message;
}
Function PrintErrorMessage($message) {
  Write-Host -Foregroundcolor Red "";
  Write-Host -Foregroundcolor Red "There was an error running the script. ";
  Write-Host -Foregroundcolor Red $message;
  Write-Host -Foregroundcolor Red "";
}