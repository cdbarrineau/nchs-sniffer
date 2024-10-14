
# *******************************************************************************
#
# This file will bundle up the Angular applications into the Tomcat server 
# deployment directory and then build the deployment jar file for NCHS Sniffer.
#
# *******************************************************************************

Write-Host "******************************"
Write-Host "* Cleaning up Angular distros"
Write-Host "******************************"
if ( Test-Path -Path 'server/src/main/resources/public' -PathType Container ) { Remove-Item -Recurse 'server/src/main/resources/public' }

# Build the UI.
cd kdas-ui

if ( -Not(Test-Path -Path 'node_modules' -PathType Container )) { npm install }

# Write-Host "Linting UI..."
# npx eslint .

Write-Host "Building NCHS Sniffer UI..."
npm run ng -- build --output-path ../server/src/main/resources/public

cd ..

# Build the Server and zip 'em up.

cd server

mvn clean compile package

cd ..

if (Test-Path nchs-sniffer-dist) {
   
    Remove-Item -Recurse -Force nchs-sniffer-dist
}

mkdir nchs-sniffer-dist

Copy-Item -Path ".\server\target\nchs-sniffer.jar" -Destination ".\nchs-sniffer-dist"
Copy-Item -Path ".\RunNchsSniffer.bat" -Destination ".\nchs-sniffer-dist"

$compressServer = @{
  Path = ".\nchs-sniffer-dist"
  CompressionLevel = "Fastest"
  DestinationPath = ".\nchs-sniffer-dist.zip"
}
Compress-Archive -Force @compressServer


