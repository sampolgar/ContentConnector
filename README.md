# ContentConnector Modern

## Table of contents
* [Intro](#Intro)
* [API Routes](#API Routes)
* [Setup](#setup)

# Intro
[Templafy's Content Connector](https://support.templafy.com/hc/en-us/articles/4688349602077-How-to-build-a-Custom-Content-Connector-API-) is a server that receives requests from Templafy and responds with data/content to be displayed in the Templafy interface. This template is a sample server to help you learn how it works and how to configure it with Templafy.

## Example
In this example, the end-user is in PowerPoint and finds their content within the application. With 1 click they can insert additional slides and insert images directly into content controls with automatic cropping.

https://user-images.githubusercontent.com/39210767/197703163-46b293e1-e7ef-434a-a422-ee4b548630c3.mp4

## Technology
- mongodb as the data repository
- content stored in a public Azure blob
- content preview url & content download url are both public static links, best practice would change these to pre-signed URL's
- JavaScript/NodeJS/npm/express.js

## How does the template work?
[Detailed in our knowledge base](https://support.templafy.com/hc/en-us/articles/4688349602077-How-to-build-a-Custom-Content-Connector-API-), Templafy needs the following 3 endpoints supported. This template includes the content format and required requests and responses to fully support its function.

# API Routes

1. POST /oauth/token
2. GET  /content
3. GET  /content/{contentId}/download-url

## POST /oauth/token
### Request
```
curl -X POST \
  -H "content-type":"application/x-www-form-urlencoded"
  -H "x-templafyuser":"spo@templafy.com" \
  -H "accept-encoding":"gzip" \
  -d "grant_type=client_credentials" \
  -d "client_secret=clientSecretFromTemplafy" \
  -d "client_id=clientIdFromTemplafy" \
  "https://contentconnector.io/oauth/token"
```

### Response
**Valid response**
```json
HTTP 200 OK
{ "access_token": "fake_access_token" }
```
**Invalid response, e.g. Oauth time out**
```json
HTTP 401 Unauthorized 
```

## GET /content

### Query Parameters for GET /content

| Query Parameter  | Type  | Description |
| -------------|-----------| ------------- |
| `skip`       | Integer   | For paging - From the query, skip the first `x` results. Templafy's first request is `skip=0` |
| `limit`      | Integer   | Always set to `30` - page size, no flexibility to change  |
| `contentType`| String    | Templafy requests different content from this server based on what the user requests. Types = `image`, `textElement`, `slide`, `slideElement`, `pdf`, `emailElement`    |
| `parentId`   | String    | Enables the folder structure in Templafy. When an end-user selects a folder in the interface, Templafy requests all content from the folder using its `parentId`  |
| `search`     | String    | Enables an end-user to search through your content. We recommend searching names and tags  |

### Request
```
curl X GET \
-H "authorization":"Bearer fake_access_token" \
-H "x-templafyuser":"spo@templafy.com" \
-H "accept-encoding":"gzip" \
"https://contentconnector.io/content/?skip=0&limit=30&contentType=image&parentId=101"
```

### Response Body for GET /content

| Query Parameter  | Type  | Description | Example |
| -------------|-----------| ------------- | ---------------------- |
| `contentCount `| Integer   | Total number of results from the search query | `"contentCount":33` |
| `offset `      | Integer   | Current offset. `offset=30` means skip the first 30  | `"offset":30` |
| `content`| Array    | Array of objects containing `id`, `mimeType`, `name`, `previewUrl`, `tags`  | `content: [{},{}]` |
| `id`   | String    | ID of the content | `"id":"1001"` |
| `mimeType`     | String    | mimeType tells Templafy what content it is | `application/vnd.templafy.folder`, `image/jpeg`, `image/png`, `image/svg+xml`, `application/pdf`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`, `application/vnd.openxmlformats-officedocument.presentationml.presentation`  |
| `name`   | String    | Name of the content e.g. image name or folder name | `Images Folder`, `Wine Photo` |
| `previewUrl`   | String    | Public image link to preview content in Templafy. For PowerPoint, Word, & PDF please choose a content preview or use an icon for Templafy to render to the end-user. Not required for folders  | `"previewUrl":"htpps://contractpdf.jpg"`  |
| `tags`   | String    | Content tags to support searching. Not required for folders | `"tags":"Wine, Restaurants, Burgundy"`  |

### Response
**Valid response**
```json
HTTP 200 OK
{
   "contentCount": 3,
   "offset": 0,
   "content":[
      {
         "id":"1001",
         "parentId": "101",
         "mimeType":"image/jpeg",
         "previewUrl":"https://templafydownload.blob.core.windows.net/delivery/Integrations/ContentConnector-Images/Food1.jpg",
         "downloadUrl":"https://templafydownload.blob.core.windows.net/delivery/Integrations/ContentConnector-Images/Food1.jpg",
         "name":"Food1.jpg",
         "tags":"Tag1, tag2"
      },
      {
         "id":"1002",
         "mimeType":"image/jpeg",
         "parentId": "101",
         "previewUrl":"https://templafydownload.blob.core.windows.net/delivery/Integrations/ContentConnector-Images/Food1.jpg",
         "downloadUrl":"https://templafydownload.blob.core.windows.net/delivery/Integrations/ContentConnector-Images/Food1.jpg",
         "name":"Food1.jpg",
         "tags":"Tag1, tag2"
      },
      {
         "id":"102",
         "parentId": "101",
         "mimeType":"application/vnd.templafy.folder",
         "previewUrl":"",
         "downloadUrl":"",
         "name":"Fine Food",
         "tags":"Tag1, tag2"
      },
  ],
}
```



#### Content Body for GET /content Response

#### Examples

- /content/?skip=0&limit=30&contentType=slides
- /content/?skip=0&limit=30&contentType=image&parentId=01
- /content/?skip=0&limit=30&contentType=image&parentId=01%2f02

## GET /content/{contentId}/download-url

https://mongodb.com/

# sample cURL requests from Templafy to your Content Connector

## POST /oauth/token

## GET /content

**Request 1 from Templafy to Content Connector as soon as user opens page**

```
curl X GET \
-H "authorization":"Bearer fake_access_token" \
-H "x-templafyuser":"spo@templafy.com" \
-H "accept-encoding":"gzip" \
"https://contentconnector.io/content/?skip=0&limit=30&contentType=image"
```

**Response 1 from Content Connector to Templafy**

```
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 1108
ETag: W/"454-1hBu3SYJ0ZtHV9TcnZuhsbd18iM"
Date: Mon, 26 Sep 2022 03:16:35 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
   "contentCount":"1",
   "offset":"0",
   "content":[
      {
         "id":"1001",
         "parentId": "101",
         "mimeType":"image/jpeg",
         "previewUrl":"https://templafydownload.blob.core.windows.net/delivery/Integrations/ContentConnector-Images/Food1.jpg",
         "downloadUrl":"https://templafydownload.blob.core.windows.net/delivery/Integrations/ContentConnector-Images/Food1.jpg",
         "name":"Food1.jpg",
         "tags":"Tag1, tag2"
      },
      {
         "id":"1002",
         "mimeType":"image/jpeg",
         "parentId": "101",
         "previewUrl":"https://templafydownload.blob.core.windows.net/delivery/Integrations/ContentConnector-Images/Food1.jpg",
         "downloadUrl":"https://templafydownload.blob.core.windows.net/delivery/Integrations/ContentConnector-Images/Food1.jpg",
         "name":"Food1.jpg",
         "tags":"Tag1, tag2"
      },
        {
         "id":"1003",
         "mimeType":"image/jpeg",
         "parentId": "",
         "previewUrl":"https://templafydownload.blob.core.windows.net/delivery/Integrations/ContentConnector-Images/Food1.jpg",
         "downloadUrl":"https://templafydownload.blob.core.windows.net/delivery/Integrations/ContentConnector-Images/Food1.jpg",
         "name":"Food1.jpg",
         "tags":"Tag1, tag2"
      },
      {
         "id":"101",
         "parentId": "",
         "mimeType":"application/vnd.templafy.folder",
         "previewUrl":"",
         "downloadUrl":"",
         "name":"Test Folder",
         "tags":"Tag1, tag2"
      },
      {
         "id":"102",
         "parentId": "",
         "mimeType":"application/vnd.templafy.folder",
         "previewUrl":"",
         "downloadUrl":"",
         "name":"Test Folder 2",
         "tags":"Tag1, tag2"
      },
        {
         "id":"103",
         "parentId": "102",
         "mimeType":"application/vnd.templafy.folder",
         "previewUrl":"",
         "downloadUrl":"",
         "name":"Test Folder 2",
         "tags":"Tag1, tag2"
      }
   ]
   "__v":0
}
```

**Request 2 from Templafy to Content Connector when user selects a folder**

```
curl X GET \
-H "host":"68e0-220-233-33-78.au.ngrok.io" \
-H "authorization":"Bearer fake_access_token" \
-H "traceparent":"00-654d8b7b002d427cbb3887f355721021-5e2b2d446bea2f2c-01" \
-H "x-forwarded-for":"20.193.37.124" \
-H "x-forwarded-proto":"https"
-H "x-templafyuser":"spo@templafy.com" \
-H "accept-encoding":"gzip" \
"https://68e0-220-233-33-78.au.ngrok.io/content/?skip=0&limit=30&contentType=image&parentId=01"
```

**Response 2 from Content Connector to Templafy**

```
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 1108
ETag: W/"454-1hBu3SYJ0ZtHV9TcnZuhsbd18iM"
Date: Mon, 26 Sep 2022 03:16:35 GMT
Connection: keep-alive
Keep-Alive: timeout=5


```

## GET /content/{contentId}/download-url
