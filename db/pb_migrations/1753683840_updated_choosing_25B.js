/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("6lcvyw2x8slj5b4")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.id = user.id"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("6lcvyw2x8slj5b4")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.role = \"teacher\" || @request.auth.id = user.id"
  }, collection)

  return app.save(collection)
})
