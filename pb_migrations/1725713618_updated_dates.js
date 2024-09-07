/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("p27svj9cwmq1wl5")

  collection.listRule = ""
  collection.updateRule = "@request.auth.role = \"teacher\""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("p27svj9cwmq1wl5")

  collection.listRule = null
  collection.updateRule = null

  return dao.saveCollection(collection)
})
