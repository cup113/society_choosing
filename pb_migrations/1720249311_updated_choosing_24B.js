/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("r8y1ijogotx8gfw")

  collection.createRule = "@request.auth.id != null"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("r8y1ijogotx8gfw")

  collection.createRule = "@request.data.user.id != \"\""

  return dao.saveCollection(collection)
})
