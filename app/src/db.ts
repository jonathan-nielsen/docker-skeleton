import debugPkg from 'debug'
import { MongoClient } from 'mongodb'
import env from './environment'

const debug = debugPkg('app:db')
const atlas = false

// <prefix>://<username>:<password>@<host>:<port><suffix>
const localDatabaseUrl = `${env.db.mongo.prefix}://${env.db.mongo.username}:${env.db.mongo.password}@${env.db.mongo.host}:${env.db.mongo.port}/${env.db.mongo.suffix}`

// <prefix>://<username>:<password>@<host>/<database><suffix>
export const atlasDatabaseUrl = `${env.db.mongo.atlas.prefix}://${env.db.mongo.atlas.username}:${env.db.mongo.atlas.password}@${env.db.mongo.atlas.host}/${env.db.mongo.atlas.database}${env.db.mongo.atlas.suffix}`

debug('Database variables and url configured')

const client = new MongoClient(atlas ? atlasDatabaseUrl : localDatabaseUrl, {
	useUnifiedTopology: true,
	useNewUrlParser: true,
})

/*
	Will try to connect to MongoDB and handle
	errors and disconnections.
	Credentials for the DB URL is configured
	in the .env-file.
*/
let connectionPool: MongoClient = client

export async function connect(): Promise<void> {
	try {
		debug(`Attempting to connect to${atlas ? '': ' local'} MongoDB${atlas ? ' Atlas': ''} ...`)
		connectionPool = await client.connect()
		debug('Successfully connected to MongoDB')
	} catch(e) {
		debug('Could not connect to database')
		client.close()
		throw e
	}
}

// Since the server awaits the connection before starting, connectionPool
// will have a value when the server starts.
export default connectionPool