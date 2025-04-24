# Parameters
$siteUrl = "https://saltirefm.sharepoint.com/sites/nintexworkflowcloud"
$contentTypeId = "0x0100804A4F7667C39642BCD5817890198946"

# Connect to SharePoint Online
Connect-PnPOnline -Url $siteUrl -Interactive

# Get the content type
$contentType = Get-PnPContentType | Where-Object { $_.StringId -eq $contentTypeId }

if ($contentType -ne $null) {
    Write-Host "Found Content Type: $($contentType.Name)"

    # Export details
    $output = @{
        Id = $contentType.StringId
        Name = $contentType.Name
        Description = $contentType.Description
        Group = $contentType.Group
        Fields = @()
    }

    # Get all fields associated with the content type
    $fields = Get-PnPField -List $contentType.Id

    foreach ($field in $fields) {
        $output.Fields += [PSCustomObject]@{
            Title = $field.Title
            InternalName = $field.InternalName
            TypeAsString = $field.TypeAsString
            Required = $field.Required
        }
    }

    # Export to JSON
    $jsonPath = "./ContentTypeSchema.json"
    $output | ConvertTo-Json -Depth 4 | Set-Content -Path $jsonPath -Encoding UTF8
    Write-Host "Schema exported to $jsonPath"
} else {
    Write-Warning "Content Type with ID $contentTypeId not found."
}