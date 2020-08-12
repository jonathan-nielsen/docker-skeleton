import bodyParser from 'body-parser'
import connectRedis from 'connect-redis'
import cookieParser from 'cookie-parser'
import debugPkg from 'debug'
import express, { NextFunction, Request, Response } from 'express'
import redis from 'redis'
import session from 'express-session'
import { createServer, Server } from 'http'

import env from './environment'
import notFoundRoute from './404'
import recursiveRoutes from './lib/recursive-routes'
import HttpException from 'exceptions/HttpException'
import { connect } from './db'

const debug = debugPkg('app:config')
const app = express()
const http = createServer(app)
let server: Server

async function initate() {
	attachMiddlewares()
	await connectToDatabase()
	mountRoutes()
	startServer()
}

function attachMiddlewares() {
	debug('Configuring middlewares')

	// Parse content body to req.body, specify the types of data, access via req.body
	app.use(bodyParser.json())
	app.use(bodyParser.urlencoded({ extended: true }))

	// Parse cookie data from Headers and access via req.cookies
	app.use(cookieParser())

	app.set('trust proxy', 1)

	// Session storage with Redis
	debug('Connecting to redis')
	const RedisStore = connectRedis(session)
	const redisClient = redis.createClient({
		host: env.db.redis.host,
		port: env.db.redis.port,
		password: env.db.redis.password,
		retry_strategy(opt) {
			if (opt.error && opt.error.code === 'ECONNREFUSED') {
				return new Error('REDIS: The server refused the connection')
			}

			if (opt.total_retry_time > 1000 * 60 * 60) {
				return new Error('REDIS: Retry time exhausted')
			}

			if (opt.attempt > 10) {
				return undefined
			}

			return Math.min(opt.attempt * 100, 3000)
		},
	})

	redisClient
		.on('ready', () => debug('Successfully connected to Redis'))
		.on('error', debug)

	app.use(session({
		store: new RedisStore({ client: redisClient }),
		secret: env.sessionSecret,
		cookie: {
			secure: false,
			path: '/',
			httpOnly: true,
			maxAge: 60 * 60 * 1000, // 1 Hour
		},
		resave: true,
		saveUninitialized: false,
	}))
}

function mountRoutes() {
	debug('Mounting routes')

	// Routes, must be added after app configs
	recursiveRoutes(app)

	// 404 route
	app.use(notFoundRoute)

	// Express.js error handling route, ignore line because this route requires 4 params
	// and _next will never be used.
	// eslint-disable-next-line
	app.use((err: HttpException, _req: Request, res: Response, _next: NextFunction) => {
		err.status = err.status || 500
		err.message = err.message || 'Something went wrong'
		debug(err)
		res.status(err.status).json(err)
	})
}

async function connectToDatabase() {
	debug('Connecting to database')
	await connect()
}

function startServer() {
	debug('Starting server')

	server = http.listen(env.server.httpPort, () => {
		debug(`Listening at http://localhost:${env.server.httpPort}`)
	})
}

initate()

// For testing purpose
export function stop(): void {
	server.close()
}

export default app