$name = "Deployment-" + ((Get-Date).ToUniversalTime()).ToString("MMdd-HHmm")
$resourceGroup = "$name-rg"
New-AzureRmResourceGroup -Name $resourceGroup -Location "North Europe"
New-AzureRmResourceGroupDeployment -Name $name -ResourceGroupName $resourceGroup -TemplateFile .\azuredeploy.json -TemplateParameterFile .\azuredeploy.parameters.json