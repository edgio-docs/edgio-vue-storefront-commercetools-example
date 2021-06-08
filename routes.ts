import { Router, ResponseWriter } from "@layer0/core/router";
import { CacheOptions } from "@layer0/core/router/CacheOptions";
import { nuxtRoutes, renderNuxtPage } from "@layer0/nuxt";

const HTML: CacheOptions = {
  edge: {
    maxAgeSeconds: 60 * 60 * 24,
    staleWhileRevalidateSeconds: 60 * 60 * 24,
    forcePrivateCaching: true
  },
  browser: false
};

const API: CacheOptions = {
  edge: {
    maxAgeSeconds: 60 * 60 * 24,
    staleWhileRevalidateSeconds: 60 * 60 * 24,
    forcePrivateCaching: true
  },
  browser: {
    maxAgeSeconds: 0,
    serviceWorkerSeconds: 60 * 60 * 24
  }
};

function cacheHTML({ cache, removeUpstreamResponseHeader }: ResponseWriter) {
  removeUpstreamResponseHeader("set-cookie");
  cache(HTML);
}

function cacheAPI({ cache, removeUpstreamResponseHeader }: ResponseWriter) {
  removeUpstreamResponseHeader("set-cookie");
  cache(API);
}

export default new Router()
  .match("/service-worker.js", ({ serviceWorker }) => {
    serviceWorker(".nuxt/dist/client/service-worker.js");
  })
  .get("/", cacheHTML)
  .post("/api/ct/getCategory", cacheAPI)
  .post("/api/ct/getProduct", cacheAPI)
  .get("/c/:slug*", cacheHTML)
  .get("/p/:slug*", cacheHTML)
  .use(nuxtRoutes)
  .fallback(renderNuxtPage);
