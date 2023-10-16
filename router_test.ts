import { assertEquals } from "https://deno.land/std@0.204.0/assert/mod.ts"
import * as router from "./router.ts"

Deno.test("All", async () => {
  const r = new Request("https://example.com/foo/bar")

  router.All("/foo", () => {
    return new Response("ng")
  })
  router.All("/foo/bar", () => {
    return new Response("ok")
  })
  router.All("/", () => {
    return new Response("ng")
  })

  const got = await router.Handler()(r).text()
  assertEquals("ok", got)
})

Deno.test("Get", async () => {
  const r = new Request("https://example.com/foo/bar", { method: "GET" })

  router.Post("/foo/bar", () => {
    return new Response("ngPost")
  })

  router.Get("/foo/bar", () => {
    return new Response("ok")
  })

  router.All("/foo/bar", () => {
    return new Response("ngAll")
  })

  const got = await router.Handler()(r).text()

  assertEquals("ok", got)
})

Deno.test("Params", async () => {
  const r = new Request("https://example.com/users/1")

  router.All("/users/:user_id", (r) => {
    const p = router.Params(r)
    return new Response(p.get("user_id"))
  })

  const got = await router.Handler()(r).text()

  assertEquals("1", got)
})

Deno.test("Wildcard", async () => {
  const r = new Request("https://example.com/foo/bar")

  router.All("/foo", () => {
    return new Response("ng")
  })

  router.All("/foo/*", () => {
    return new Response("ok")
  })

  const got = await router.Handler()(r).text()

  assertEquals("ok", got)
})
