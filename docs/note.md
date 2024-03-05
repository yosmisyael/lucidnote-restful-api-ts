# Note API Specifications

## Create Note
Endpoint: POST /api/notes

Header:
- Authorization: token

Request body:
```json
{
  "data": {
    "title": "My Note",                 // optional
    "body": "This is my first note."    // optional
  }
}
```
Response body success:
```json
{
  "data": {
    "id": "uuid"
  }
}
```
Response body error:
```json
{
  "errors": "Title is required."
}
```

## Update Note
Endpoint: PUT /api/notes/{noteId}

Header:
- Authorization: token

Request body:
```json
{
  "title": "My New Title",
  "body": "I just updated my note."
}
```
Response body success:
```json
{
  "data": {
    "id": "unique-id",
    "title": "My New Title",
    "body": "I just updated my note.",
    "createdAt": 1688302310471,
    "updatedAt": 1688302324523
  }
}
```
Response body error:
```json
{
  "errors": "Title is required."
}
```

## Get Note
Endpoint: GET /api/notes/{noteId}

Header:
- Authorization: token

Response body success:
```json
{
  "id": "unique-id",
  "title": "My New Title",
  "body": "I just updated my note.",
  "createdAt": 1688302310471,
  "updatedAt": 1688302310471
}
```
Response body error:
```json
{
  "error": "note is not found"
}
```

## Delete Note
Endpoint: DELETE /api/notes/{noteId}

Header:
- Authorization: token

Response body success:
```json
{
  "data": "OK"
}
```
Response body error:
```json
{
  "errors": "note is not found"
}
```

## Search Note
Endpoint: GET /api/notes

Header:
- Authorization: token

Query Params:
- title: search by title
- page: number of page, default 1
- size: size per page, default 10
  Response body success:
```json
{
  "data": [
    {
      "id": "unique-id",
      "title": "first note",
      "body": "example body",
      "createdAt": 1688302310471,
      "updatedAt": 1688302324523
    }, 
    {
      "id": "unique-id",
      "title": "second note",
      "body": "example body",
      "createdAt": 1688302310471,
      "updatedAt": 1688302324523
    } 
  ],
  "paging": {
    "page": 1,
    "totalPage": 3,
    "totalItem": 30
  }
}
```

## Filter Notes by Tags
Endpoint: POST api/notes/tags

Header:
- Authorization: token

Request body:
```json
{
  "filter": ["tagId1", "tagId2"]
}
```
Response body success:
```json
{
  "data": [
    {
      "id": "unique-id",
      "title": "first note",
      "body": "example body",
      "createdAt": 1688302310471,
      "updatedAt": 1688302324523
    }, 
    {
      "id": "unique-id",
      "title": "second note",
      "body": "example body",
      "createdAt": 1688302310471,
      "updatedAt": 1688302324523
    } 
  ],
  "paging": {
    "page": 1,
    "totalPage": 3,
    "totalItem": 30
  }
}
```

## Attach Note to Tags
Endpoint: POST /api/notes/{noteId}/tags

Header:
- Authorization: token

Request body:
```json
{
  "selectedTag": ["tagId1", "tagId2", "tagId3"]
}
```

Response body success:
```json
{
  "data": "OK"
}
```

Response body error:
```json
{
  "error": "unauthorized"
}
```

## Get Note's Tags
Endpoint: GET /api/notes/{noteId}/tags

Header:
- Authorization: token

Response body success:
```json
{ 
  "data": ["tagName11", "tagName12", "tagName13"]
}
```

## Update Note's Tag
Endpoint: PUT /api/notes/{noteId}/tags

Header:
- Authorization: token

Request body:
```json
{
  "selectedTag": ["tagId1", "tagId2"]
}
```

Response body success:
```json
{
  "data": "OK"
}
```

Response body error:
```json
{
  "error": "Tag must be valid."
}
```
