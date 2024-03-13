# Note API Specifications

## Create Note
Endpoint: POST /api/notes

Header:
- Authorization: token

Request body:
```json
{
  "data": {
    "title": "My Note",                 
    "body": "This is my first note."  // optional
  }
}
```
Response body success:
```json
{
  "data": {
    "id": "uuid",
    "title": "My Note",
    "body": "This is my first note.",
    "createdAt": "YYYY-MM-DD hh:mm:ss",
    "updatedAt": "YYYY-MM-DD hh:mm:ss"
  }
}
```
Response body error:
```json
{
  "error": "Title is required."
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
  "body": "I just updated my note."   // optional
}
```
Response body success:
```json
{
  "data": {
    "id": "unique-id",
    "title": "My New Title",
    "body": "I just updated my note.",
    "createdAt": "YYYY-MM-DD hh:mm:ss",
    "updatedAt": "YYYY-MM-DD hh:mm:ss"
  }
}
```
Response body error:
```json
{
  "error": "Title is required."
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
  "createdAt": "YYYY-MM-DD hh:mm:ss",
  "updatedAt": "YYYY-MM-DD hh:mm:ss"
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
  "error": "Note does not exist."
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
      "createdAt": "YYYY-MM-DD hh:mm:ss",
      "updatedAt": "YYYY-MM-DD hh:mm:ss"
    }, 
    {
      "id": "unique-id",
      "title": "second note",
      "body": "example body",
      "createdAt": "YYYY-MM-DD hh:mm:ss",
      "updatedAt": "YYYY-MM-DD hh:mm:ss"
    } 
  ],
  "paging": {
    "size": 2,
    "totalPage": 3,
    "currentPage": 1
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
      "createdAt": "YYYY-MM-DD hh:mm:ss",
      "updatedAt": "YYYY-MM-DD hh:mm:ss"
    }, 
    {
      "id": "unique-id",
      "title": "second note",
      "body": "example body",
      "createdAt": "YYYY-MM-DD hh:mm:ss",
      "updatedAt": "YYYY-MM-DD hh:mm:ss"
    } 
  ],
  "paging": {
    "size": 2,
    "totalPage": 3,
    "currentPage": 1
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
  "error": "Unauthorized."
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
