/*
    Created by Pravin Lolage on 26 Sept 2018.
*/
'use strict';

let pg = require('postgreslib');

module.exports = function () {
    let appConfig = {};
    let algorithm = 'aes';
    return {
        init: async (dbConfig, dbKey, env, projectKey) => {
            if(!dbConfig) throw new Error(`Please provide the config provided`);
            if(!dbKey) throw new Error(`Please provide the database key provided`);
            if(!env) throw new Error(`Please provide the environment provided`);
            if(!projectKey) throw new Error(`Please provide the project key provided`);

            await pg.__init(dbConfig);
            let confRes = await pg.__select("SELECT decrypt(config, $1, $2) AS config FROM public.app_config WHERE env=$3 AND project_key=$4 AND is_active=true;", [dbKey, algorithm, env, projectKey]);

            if(confRes.length) {
                try {
                    appConfig.dbConfig = JSON.parse(confRes[0].config);
                    return appConfig;
                } catch(e) {
                    throw new Error(`Invalid database key provided for ${env} environment`);
                }
            } else {
                throw new Error(`Database config not found for ${env} environment`);
            }
        },
        getConfig: (key = null) => {
            if(key) return appConfig[key] || null;
            else return appConfig;
        },
        setConfig: (value) => {
            if(!value) throw new Error(`Invalid config value provided`);
            appConfig = value;
        },
        addConfig: (key, value) => {
            if(!key) throw new Error(`Invalid config key provided`);
            if(!value) throw new Error(`Invalid config value provided`);
            appConfig[key] = value;
        },
        mergeConfig: (config) => {
            return appConfig = {...appConfig, ...config};
        }
    }
}();
