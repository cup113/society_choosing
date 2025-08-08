/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("6lcvyw2x8slj5b4")

  // update collection data
  unmarshal({
    "deleteRule": "@request.auth.role = \"teacher\""
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("6lcvyw2x8slj5b4")

  // update collection data
  unmarshal({
    "deleteRule": null
  }, collection)

  return app.save(collection)
})
