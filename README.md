# Content Connector Modern


## Table of contents
* [Intro](#Intro)
* [API Routes](#API-Routes)
* []
* [Example 1](#Example-1)


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
**Valid response. If the token times out, send a 401 and Templafy will request a new OAuth**
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

| Body Key  | Value Type  | Description | Example |
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

#### Examples

- /content/?skip=0&limit=30&contentType=slides
- /content/?skip=0&limit=30&contentType=image&parentId=01
- /content/?skip=0&limit=30&contentType=image&parentId=01%2f02

## GET /content/{contentId}/download-url

### Request
```
curl X GET \
-H "authorization":"Bearer fake_access_token" \
-H "x-templafyuser":"spo@templafy.com" \
-H "accept-encoding":"gzip" \
"https://contentconnector.io/content/1500/download-url"
```
### Response
```json
HTTP 200 OK
{ "downloadUrl": "https://imagelink.com/pre-signed-url-for-this-image.png" }
```
# Getting Started
## Setup Mongodb Atlas
### Environment Variables
```
NODE_ENV = development
PORT = 5000
MONGO_URI = mongodb+srv://MONGODB:MONGODBPASSWORD]@cluster0.gahkhen.mongodb.net/?retryWrites=true&w=majority
```
### Add Content
### Test Content

## Setup Templafy
