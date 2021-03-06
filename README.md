# What you will forget.

## Getting Ready for Production
ng build --prod <br/>
Moves files over to dist folder

## Test Changes
firebase hosting:channel:deploy test <br/>
This will create a temporary site so you can see the changes before pushing live

## Publish
firebase deploy --only hosting