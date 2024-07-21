/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "llxyw8vdwy6tiwn",
    "created": "2024-07-06 01:23:47.653Z",
    "updated": "2024-07-06 01:23:47.653Z",
    "name": "societies",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "sq2hbs5c",
        "name": "name",
        "type": "text",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "min": 1,
          "max": 20,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "vgf6gtxw",
        "name": "cap",
        "type": "number",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "min": 0,
          "max": 1000,
          "noDecimal": true
        }
      },
      {
        "system": false,
        "id": "ejcaj0nm",
        "name": "description_site",
        "type": "url",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "exceptDomains": [],
          "onlyDomains": []
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
  const collection = dao.findCollectionByNameOrId("llxyw8vdwy6tiwn");

  return dao.deleteCollection(collection);
})
