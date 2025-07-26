/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "6lcvyw2x8slj5b4",
    "created": "2025-07-19 01:41:36.279Z",
    "updated": "2025-07-19 01:41:36.279Z",
    "name": "choosing_25B",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "g4jg3rd4",
        "name": "user",
        "type": "relation",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "_pb_users_auth_",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
        }
      },
      {
        "system": false,
        "id": "m7zfbfuo",
        "name": "choices",
        "type": "relation",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "llxyw8vdwy6tiwn",
          "cascadeDelete": false,
          "minSelect": 1,
          "maxSelect": 7,
          "displayFields": null
        }
      },
      {
        "system": false,
        "id": "gfcg3oxz",
        "name": "answers",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": 10000,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "kspivsui",
        "name": "ip",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": 40,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "x91zr8kx",
        "name": "rejects",
        "type": "relation",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "llxyw8vdwy6tiwn",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": null,
          "displayFields": null
        }
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("6lcvyw2x8slj5b4");

  return dao.deleteCollection(collection);
})
