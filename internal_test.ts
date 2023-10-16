import { extractDynamicRoute, matches, parseDef } from "./internal.ts"
import {
  assert,
  assertEquals,
} from "https://deno.land/std@0.204.0/assert/mod.ts"

Deno.test("matches", () => {
  let def = parseDef("/foo/bar")
  let result = matches("/foo/bar", def)
  assert(result)

  def = parseDef("/foo/bar")
  result = matches("/foo/bar/", def)
  assert(result)

  def = parseDef("/foo/bar")
  result = matches("/foo/bar/baz", def)
  assert(!result)

  def = parseDef("/foo/bar/*")
  result = matches("/foo/bar/baz", def)
  assert(result)

  def = parseDef("/foo/bar/*")
  result = matches("/foo/bar/baz/foo", def)
  assert(result)

  def = parseDef("/")
  result = matches("/", def)
  assert(result)

  def = parseDef("/")
  result = matches("/foo", def)
  assert(!result)

  def = parseDef("/*")
  result = matches("/", def)
  assert(result)

  def = parseDef("/*")
  result = matches("/foo", def)
  assert(result)

  def = parseDef("/:id")
  result = matches("/", def)
  assert(!result)

  def = parseDef("/:id")
  result = matches("/foo", def)
  assert(result)

  def = parseDef("/:id/*")
  result = matches("/foo", def)
  assert(result)

  def = parseDef("/:id/*")
  result = matches("/foo/", def)
  assert(result)

  def = parseDef("/:id/*")
  result = matches("/foo/bar", def)
  assert(result)

  def = parseDef("/prefix/:id")
  result = matches("/prefix/foo", def)
  assert(result)

  def = parseDef("/prefix/:id")
  result = matches("/prefix", def)
  assert(!result)

  def = parseDef("/prefix/:id")
  result = matches("/foo", def)
  assert(!result)

  def = parseDef("/prefix/:id")
  result = matches("/foo/bar", def)
  assert(!result)
})

Deno.test("extractDynamicRoute", () => {
  const def = parseDef("/:foo/:bar")
  const m = extractDynamicRoute("/foo/bar", def)

  assertEquals(m.size, 2)
  assertEquals(m.get("foo"), "foo")
  assertEquals(m.get("bar"), "bar")
})
