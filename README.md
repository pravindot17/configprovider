Retrieve env wise DB config without revealing db config to the outside world
===================
This library is useful for fetching encrypted db config to use for the application

## How to use
First of all create a master db schema for storing projects config using following code. I am using postgressql here for storing data.
```sql
-- create database
CREATE DATABASE master_db_config;

-- create table
CREATE TABLE app_config(
   id  SERIAL PRIMARY KEY,
   config           bytea,
   env            varchar(30),
   is_active        bool default true,
   createdon timestamp,
   updatedon timestamp
);

-- this is required for running encrypt and decrypt functions
CREATE EXTENSION pgcrypto;

INSERT INTO app_config(config, env, createdon, updatedon) VALUES ( encrypt( '{"host":"localhost","port":"5432","database":"myDb","user":"postgres","password":"root","max":"10","idleTimeoutMillis":"30000"}', 'ml9gi2r5ce275y3i8sxq', 'aes'), 'development', '2018-09-26 10:01:00', '2018-09-26 10:01:00' );

-- ml9gi2r5ce275y3i8sxq - is the encryption key, you can set anything based on your project and environment
-- aes - is the encryption algorithm
```

### Get used to it
Get library in your node modules using following command:
```
npm install --save https://github.com/pravindot17/configprovider
```

Let's see about js code:
```js
let configProvider = require('configprovider');

let masterDbConfig = {
    "host":"localhost",
    "port":"5432",
    "database":"myDb",
    "user":"postgres",
    "password":"root",
    "max":"10",
    "idleTimeoutMillis":"30000"
}

// init the connection in your bootstrap file using following code
configProvider.init(config, 'MY_SECRET_KEY', 'development').then((appConfig) => {
	console.log('received the db config here in appConfig.dbConfig');
}).catch(console.error);

// to use it inside your application use following
let dbConfig = configProvider.getConfig().dbConfig;

// You can also add more config to the cache
configProvider.addConfig('appConfig', {"title": "My worst application", "isEmailRequired": true});

// You can also merge config into existing config
configProvider.mergeConfig({"smsConfig": { "isEnabled": true, "content": "Have a good day!" }});