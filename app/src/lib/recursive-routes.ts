// Most stuff here is ripped from
// https://github.com/megadix/express-recursive-routes

// Customized to have better control, logging and support for typescript.
// Also have to be able to run tests.

import debugPkg from 'debug'
import fs from 'fs'
import path from 'path'
import { Express } from 'express'

const debug = debugPkg('app:config')
const basePath = path.join(__dirname, '..', 'routes')

interface IRoute {
	path: string;
	src: string;
}

export default function mountRoutes(app: Express): void {
	const routes: IRoute[] = mountDir()

	routes.forEach(route => {
		try {
			// eslint-disable-next-line @typescript-eslint/no-var-requires
			app.use(route.path, require(route.src).router)
		} catch(e) {
			debug(`Something went wrong with route "${route.src}", check the contents of the file.`)
			throw e
		}
	})
}

function mountDir(dirPath = basePath) {
	let res: IRoute[] = []

	fs.readdirSync(dirPath).forEach(filename => {
		const filePath = `${dirPath}${path.sep}${filename}`
		const stat = fs.statSync(filePath)

		if (stat.isDirectory()) {
			res = res.concat(mountDir(filePath))
		} else if (stat.isFile() && (filename.toLowerCase().endsWith('.js') || filename.toLowerCase().endsWith('.ts'))) {
			// Ignore test files and files that starts with underscore
			if (!(filename.toLowerCase().endsWith('.spec.js') || filename.toLowerCase().endsWith('.spec.ts')) && !filename.startsWith('_')) {
				res = res.concat(mountFile(filePath))
			}
		} else {
			if (!['.DS_Store'].includes(filename)) {
				throw Error(`Filename "${filePath}" is neither a file nor a directory`)
			}
		}
	})

	return res
}

function mountFile(filePath: string) {
	const dirname = path.dirname(filePath)
	const requestPath = (dirname.startsWith(basePath) ? dirname.substr(basePath.length) : dirname)
		.replace(/\\/g, '/') // Windows-only

	const filename = path.basename(filePath)

	if (filename.indexOf('.js') === -1 && filename.indexOf('.ts') === -1) {
		return []
	}

	let filePathPart = filename

	// remove pattern from route path
	filePathPart = filePathPart.replace('.js', '').replace('.ts', '')

	if (filePathPart.endsWith('.js') || filePathPart.endsWith('.ts')) {
		// remove trailing .js/.ts if the path matched start of the string
		filePathPart = filePathPart.substr(0, filePathPart.length - 3)
	}

	const isIndex = filePathPart.toLowerCase() === 'index'

	// combine path segments
	const routePath = `${requestPath}/${isIndex ? '' : filePathPart}`

	return {
		path: routePath,
		src: filePath,
	}
}