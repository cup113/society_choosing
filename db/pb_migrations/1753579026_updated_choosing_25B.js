/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("6lcvyw2x8slj5b4")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE UNIQUE INDEX `idx_2ZYcwULkVE` ON `choosing_25B` (`user`)"
    ]
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("6lcvyw2x8slj5b4")

  // update collection data
  unmarshal({
    "indexes": []
  }, collection)

  return app.save(collection)
})
