# Team Splitter Admin UI

## Install dependencies
```sh
npm install 
```

## Start app
```sh
npm start 
```


Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.


## AWS & Amplify

### AWS Login
```sh
amplify configure
```
Or if using SSO:
```sh
aws sso login --profile <profile-name>
```

### Amplify Environment Commands
```sh
amplify env list                  # list all environments
amplify env checkout <env-name>   # switch to an environment
amplify env add                   # create a new environment
amplify env pull                  # pull current env cloud resources
amplify env remove <env-name>     # delete an environment
```

### Deploy Backend & Frontend
```sh
amplify push       # deploy backend only (Lambda, DynamoDB, etc.)
amplify publish    # deploy backend + build and deploy frontend
```

## Real certificates
https://www.ssls.com/