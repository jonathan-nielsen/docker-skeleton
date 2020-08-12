# Setup

## Create .env file
```shell
cp app/.env.sample app/.env
```

## Start the docker containers
Make sure you're in the root folder
```shell
./scripts/start.sh
```

Open new terminal and trace logs of the app container by running
```shell
./scripts/logs.sh
```

## Install node modules
Insall packages locally as well to prevent errors in your editor
```shell
cd app
npm install
```

# Install new package
```shell
npm i -s <package-name>
docker exec -t app npm i -s <package-name>
```