#!/bin/sh
# *******************************************************************************
#
# This file will bundle up the Angular applications into the Tomcat server 
# deployment directory and then build the deployment jar file for the NCHS Sniffer.
#
# *******************************************************************************

echo "******************************"
echo "* Cleaning up Angular distros"
echo "******************************"

if [ -d 'server/src/main/resources/public' ]
  then rm -fr 'server/src/main/resources/public'
fi

mkdir 'server/src/main/resources/public'

# Build the UI.

cd nchs-sniffer-ui

if [ ! -d 'node_modules' ]
  then npm install
fi

#echo "Linting UI..."
#npx eslint .

echo "Building Sniffer UI..."
ng build --output-path ../server/src/main/resources/public

cd ../server

# Build the Server and zip 'em up.

mvn clean compile package

cd ..

if [ -d 'nchs-sniffer-dist' ]
  then rm -fr 'nchs-sniffer-dist'
fi

mkdir nchs-sniffer-dist


cp ./server/target/nchs-sniffer.jar ./nchs-sniffer-dist
cp ./RunNchsSniffer.bat ./nchs-sniffer-dist/RunNchsSniffer.bat

zip -r nchs-sniffer-dist.zip ./nchs-sniffer-dist
