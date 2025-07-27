/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("6lcvyw2x8slj5b4")

  collection.listRule = "@request.auth.role = \"teacher\" || @request.auth.id = user.id"
  collection.viewRule = ""
  collection.createRule = "@request.auth.role = \"teacher\" || @request.auth.id = user.id"
  collection.updateRule = "@request.auth.role = \"teacher\" || @request.auth.id = user.id"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("6lcvyw2x8slj5b4")

  collection.listRule = null
  collection.viewRule = null
  collection.createRule = null
  collection.updateRule = null

  return dao.saveCollection(collection)
})
