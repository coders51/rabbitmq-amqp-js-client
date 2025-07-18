"use strict"

/**
 * @typedef {import('../../')} Packages
 * @typedef {import('esbuild').Plugin} esbuild.Plugin
 */

import { promisify } from "util"
import browserResolve from "browser-resolve"

const pBrowserResolve = promisify(browserResolve)

const plugin = (/** @type {Packages | {[key: string]: string}} */ stdLibBrowser) => {
  /** @type {esbuild.Plugin} */
  const main = {
    name: "node-stdlib-browser-alias",
    async setup(build) {
      const map = new Map()
      const promises = Object.entries(stdLibBrowser).map(async ([name, path]) => {
        const resolvedPath = await pBrowserResolve(path, {})
        map.set(name, resolvedPath)
      })
      await Promise.all(promises)

      map.forEach((path, name) => {
        build.onResolve({ filter: new RegExp(`^${name}$`) }, () => {
          return {
            path,
          }
        })
      })
    },
  }
  return main
}

export default plugin
