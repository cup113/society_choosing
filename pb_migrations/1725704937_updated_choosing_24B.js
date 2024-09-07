/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("r8y1ijogotx8gfw")

  collection.deleteRule = "@request.auth.role = \"teacher\""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("r8y1ijogotx8gfw")

  collection.deleteRule = null

  return dao.saveCollection(collection)
})
