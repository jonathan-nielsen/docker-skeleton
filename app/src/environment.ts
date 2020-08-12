import dotenv from 'dotenv'

/*
  Importing environment variables set in the .env-file
  The .env-file will not be shared so you have to
  create your own .env-file in the root-folder based on
  .env.sample and update the values.
  https://www.npmjs.com/package/dotenv
*/
dotenv.config()

export default {
	env: process.env.NODE_ENV as string,
	sessionSecret: process.env.SESSION_SECRET as string,
	server: {
		httpPort: parseInt(process.env.PORT as string, 10),
	},
	db: {
		globalDbName: process.env.DB_GLOBAL_DATABASE_NAME as string,
		customerDataDbName: process.env.DB_CUSTOMER_DATA_DATABASE_NAME as string,
		mongo: {
			prefix: process.env.DB_MONGO_PREFIX as string,
			host: process.env.DB_MONGO_HOST as string,
			suffix: process.env.DB_MONGO_SUFFIX as string,
			port: parseInt(process.env.DB_MONGO_PORT as string, 10),
			username: process.env.DB_MONGO_USERNAME as string,
			password: process.env.DB_MONGO_PASSWORD as string,
			atlas: {
				prefix: process.env.DB_MONGO_ATLAS_PREFIX as string,
				host: process.env.DB_MONGO_ATLAS_HOST as string,
				suffix: process.env.DB_MONGO_ATLAS_SUFFIX as string,
				database: process.env.DB_MONGO_ATLAS_DATABASE as string,
				username: process.env.DB_MONGO_ATLAS_USERNAME as string,
				password: process.env.DB_MONGO_ATLAS_PASSWORD as string,
			},
		},
		redis: {
			host: process.env.DB_REDIS_HOST as string,
			port: parseInt(process.env.DB_REDIS_PORT as string, 10),
			password: process.env.DB_REDIS_PASSWORD as string,
		},
	},
}