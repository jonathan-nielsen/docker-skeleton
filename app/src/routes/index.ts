import express, { Request, Response } from 'express'
import debugPkg from 'debug'

const debug = debugPkg('app:import')
const router = express.Router()

router.get('/', index)

function index(_req: Request, res: Response): void {
	debug('Index route')
	res.send('index')
}

module.exports.router = router