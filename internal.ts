type routeKind = "staticRoute" | "dynamicRoute"

export type routesDef = {
  routes: routeDef[]
  trailingWildcard: boolean
}

type routeDef = {
  kind: routeKind
  staticName: string
  dynamicName: string
}

export function parseDef(pathstr: string): routesDef {
  const [paths, trailingWildcard] = splitPath(pathstr, false)

  const routesDef: routesDef = {
    routes: [],
    trailingWildcard,
  }

  for (const v of paths) {
    if (v[0] === ":") {
      routesDef.routes.push({
        kind: "dynamicRoute",
        dynamicName: v.slice(1),
        staticName: "",
      })
      continue
    }
    routesDef.routes.push({
      kind: "staticRoute",
      staticName: v,
      dynamicName: "",
    })
  }

  return routesDef
}

export function matches(pathstr: string, def: routesDef): boolean {
  const [paths] = splitPath(pathstr, true)

  if (!def.trailingWildcard && paths.length !== def.routes.length) {
    return false
  }

  if (def.trailingWildcard && paths.length < def.routes.length) {
    return false
  }

  for (let i = 0; i < def.routes.length; i += 1) {
    const v = def.routes[i]
    if (v.kind === "staticRoute" && paths[i] !== v.staticName) {
      return false
    }
    continue
  }

  return true
}

export function extractDynamicRoute(
  pathstr: string,
  def: routesDef
): Map<string, string> {
  const result: Map<string, string> = new Map()

  const [paths] = splitPath(pathstr, true)
  const dynIndexes: number[] = []

  for (let i = 0; i < def.routes.length; i += 1) {
    const v = def.routes[i]
    if (v.kind === "dynamicRoute") {
      dynIndexes.push(i)
    }
  }

  for (const v of dynIndexes) {
    result.set(def.routes[v].dynamicName, paths[v])
  }

  return result
}

/**
 * 第2返値は末尾がワイルドカードか否か
 */
function splitPath(
  pathstr: string,
  includeTrailingWildcard: boolean
): [string[], boolean] {
  const pathsRaw = pathstr.split("/")
  const paths: string[] = []

  let trailingWildcard = false

  for (let i = 0; i < pathsRaw.length; i += 1) {
    const v = pathsRaw[i]
    if (v === "") {
      continue
    }
    if (i === pathsRaw.length - 1 && v === "*") {
      trailingWildcard = true
      if (!includeTrailingWildcard) {
        break
      }
    }
    paths.push(v)
  }

  return [paths, trailingWildcard]
}
