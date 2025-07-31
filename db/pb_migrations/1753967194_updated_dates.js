/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("p27svj9cwmq1wl5")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.role = \"teacher\"",
    "listRule": "",
    "viewRule": null
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("p27svj9cwmq1wl5")

  // update collection data
  unmarshal({
    "createRule": null,
    "listRule": null,
    "viewRule": ""
  }, collection)

  return app.save(collection)
})
