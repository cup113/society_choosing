/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("r8y1ijogotx8gfw")

  collection.listRule = "@request.auth.role ?= \"teacher\""
  collection.createRule = "@request.auth.id ?= user.id"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("r8y1ijogotx8gfw")

  collection.listRule = ""
  collection.createRule = null

  return dao.saveCollection(collection)
})
