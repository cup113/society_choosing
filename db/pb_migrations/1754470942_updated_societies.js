/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("llxyw8vdwy6tiwn")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.role = \"teacher\""
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("llxyw8vdwy6tiwn")

  // update collection data
  unmarshal({
    "createRule": null
  }, collection)

  return app.save(collection)
})
