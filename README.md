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


## How to regenerate SSL self signed certificate

1. Genenate new cert and key
```
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout nginx-selfsigned.key -out nginx-selfsigned.crt
```

2. Add to k8s secret 
```
kubectl create secret tls nginx-secret-cert --cert=nginx-selfsigned.crt --key=nginx-selfsigned.key -n team-splitter
```

3. Restart the pod/deployment so new cert/key is applied in ArgoCD


## Real certificates
https://www.ssls.com/