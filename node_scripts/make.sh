#!/bin/sh
set -e

echo "Webpart build, bundle and ship:"
echo
echo "REMINDER: update version in package.json before running this script because that will become the version of the webpart package."
echo

echo "Building webpart..."
npm run build

# Remove unwanted assets
rm -rf webpart/src/webparts/assets/fonts || true
rm -rf webpart/src/webparts/assets/mock-data || true
rm -f webpart/src/webparts/assets/*.ico || true
rm -f webpart/src/webparts/assets/*.html || true
rm -f webpart/src/webparts/assets/*.css || true

echo
echo "Bundling assets..."
node node_scripts/bundle-webpart-assets.js

echo
echo "Packaging for shipping to SharePoint..."
npx gulp --gulpfile ./webpart/gulpfile.js clean
npx gulp --gulpfile ./webpart/gulpfile.js bundle --ship
npx gulp --gulpfile ./webpart/gulpfile.js package-solution --ship

echo
echo "DONE."
echo "Webpart package for uploading to App Catalog is in: webpart/sharepoint/solution/"
