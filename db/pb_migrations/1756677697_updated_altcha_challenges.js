/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2866934195")

  // update collection data
  unmarshal({
    "createRule": "",
    "deleteRule": "",
    "viewRule": ""
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2866934195")

  // update collection data
  unmarshal({
    "createRule": null,
    "deleteRule": null,
    "viewRule": null
  }, collection)

  return app.save(collection)
})
