import {
  extractDynamicRoute,
  matches,
  parseDef,
  routesDef,
} from "./internal.ts"

type router = {
  rawPatterns: string[]
  defs: routesDef[]
  handlers: HandlerFunc[]
  methodFilters: string[]
}

const router: router = {
  rawPatterns: [],
  defs: [],
  handlers: [],
  methodFilters: [],
}

export type HandlerFunc = (req: Request) => Response

export function All(pattern: string, f: HandlerFunc) {
  const def = parseDef(pattern)
  router.rawPatterns.push(pattern)
  router.defs.push(def)
  router.handlers.push(f)
  router.methodFilters.push("")
}

export function Get(pattern: string, f: HandlerFunc) {
  const def = parseDef(pattern)
  router.rawPatterns.push(pattern)
  router.defs.push(def)
  router.handlers.push(f)
  router.methodFilters.push("GET")
}

export function Post(pattern: string, f: HandlerFunc) {
  const def = parseDef(pattern)
  router.rawPatterns.push(pattern)
  router.defs.push(def)
  router.handlers.push(f)
  router.methodFilters.push("POST")
}

export function Patch(pattern: string, f: HandlerFunc) {
  const def = parseDef(pattern)
  router.rawPatterns.push(pattern)
  router.defs.push(def)
  router.handlers.push(f)
  router.methodFilters.push("PATCH")
}

export function Delete(pattern: string, f: HandlerFunc) {
  const def = parseDef(pattern)
  router.rawPatterns.push(pattern)
  router.defs.push(def)
  router.handlers.push(f)
  router.methodFilters.push("DELETE")
}

export function Put(pattern: string, f: HandlerFunc) {
  const def = parseDef(pattern)
  router.rawPatterns.push(pattern)
  router.defs.push(def)
  router.handlers.push(f)
  router.methodFilters.push("PUT")
}

export function Params(r: Request): Map<string, string> {
  const u = new URL(r.url)
  const pathstr = u.pathname
  // @ts-expect-error Request['__router_def'] は型定義に存在しない
  const def = r["__router_def"] as routesDef

  return extractDynamicRoute(pathstr, def)
}

export function Handler(): HandlerFunc {
  return route
}

function route(r: Request): Response {
  const u = new URL(r.url)
  const pathstr = u.pathname

  for (let i = 0; i < router.defs.length; i += 1) {
    const def = router.defs[i]
    if (
      matches(pathstr, def) &&
      (router.methodFilters[i] === "" || r.method === router.methodFilters[i])
    ) {
      const h = router.handlers[i]
      const k = "__router_def"
      // @ts-expect-error Request['__router_def'] は型定義に存在しない
      r[k] = def
      return h(r)
    }
  }

  return new Response("not found\n", { status: 404 })
}
