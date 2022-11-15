# Content Connector Modern

## Introduction

This template demonstrates how any developer can setup the Templafy Content Connector, it includes sample content and required API route handling.
You can deploy this template as is and learn how it functions with Templafy, or you can use it as a base and replace MongoDB queries with your needs.

[Templafy's Content Connector](https://support.templafy.com/hc/en-us/articles/4688349602077-How-to-build-a-Custom-Content-Connector-API-) is a server that receives requests from Templafy and responds with data/content to be displayed in the Templafy interface. This template is a sample server to help you learn how it works and how to configure it with Templafy.


## Table of contents

- [Instructions](#Instructions)
- [Content and Folder Structure](#Content-and-Folder-Structure)
- [API Routes](#API-Routes)

## Why use a Content Connector?

Efficency, 
In this example, the end-user is in PowerPoint and finds their content within the application. With 1 click they can insert additional slides and insert images directly into content controls with automatic cropping.

https://user-images.githubusercontent.com/39210767/197703163-46b293e1-e7ef-434a-a422-ee4b548630c3.mp4

## Technology

- mongodb as the data repository
- content stored in a public Azure blob
- content preview url & content download url are both public static links, best practice would change these to pre-signed URL's
- JavaScript/NodeJS/npm/express.js

# Instructions
[Detailed in our knowledge base](https://support.templafy.com/hc/en-us/articles/4688349602077-How-to-build-a-Custom-Content-Connector-API-), Templafy needs the following 3 endpoints supported

1. POST /oauth/token
2. GET /content
3. GET /content/{contentId}/download-url

## Summary

- [Setup MongoDB](#MongoDB)
- [Setup the Server](#Server)
- [API Routes](#API-Routes)
- [Testing with Postman & Adding Content to DB](#Testing-with-Postman-&-Adding-Content-to-DB)
- [Create MongoDB Index](#Create-MongoDB-Index)
- [Use Ngrok to make your localhost public](#Use-Ngrok-to-make-your-localhost-public)
- [Create MongoDB Index](#Create-MongoDB-Index)
- [Test Locally](#Test-Locally)
- [Test Online](#Test-Online)
- [Configure in Templafy](#Configure-in-Templafy)

## MongoDB 

1. Setup MongoDB - [follow these instructions](https://www.mongodb.com/docs/atlas/getting-started/)
2. Ensure your IP address is whitelisted, for all IP addresses - use 0.0.0.0/0 
3. Click Connect and MongoDB Drivers and copy the connection string `mongodb+srv://contentconnector:<password>@cluster0.6j5j1zz.mongodb.net/?retryWrites=true&w=majority`
4. change `contentconnector:<password>` with your username/password

## Server

1. create a directory for the project on your computer
2. run git clone `https://github.com/sampolgar/ContentConnector.git`
3. open the folder in your text editor e.g. vscode
4. rename the `.env-sample` file to `.env` and replace the sample MONGO_URI with the URI from step 5 above
5. run `npm install`
6. run `npm run server`
7. Your server should be running on `http://localhost:5000` and you should be connected to the database

## Testing with Postman & Adding Content to DB

1. Add [my Postman collection](https://www.getpostman.com/collections/ac22205c7b33e7aefa04) to your Postman collections [details here](https://learning.postman.com/docs/getting-started/importing-and-exporting-data/#importing-postman-data)
2. Use the `1. POST new content to the DB` to add the test content to the database. You can test its there with the 2nd postman request and delete with the 3rd

## Create MongoDB Index

The index will enable our Content Connector to search for names and tags. e.g. when the user searches "food", MongoDB finds all content with names/tags with food or Food or fooderati.
Note: Index must be create after adding content to the database

1. in mongodb atlas, click on your database, then browse collection
2. click on `search` > `create index`
3. `json editor` > keep defaults & ensure `"dynamic": true` and index name is `default`
4. create

## Test Locally
The following postman tests should retreive results
1.  POST http://localhost:5000/oauth/token
2.  GET http://localhost:5000/content/?skip=0&limit=30&contentType=pdf
3.  GET http://localhost:5000/content/?skip=0&limit=30&contentType=image&parentId=100%2f103
4.  GET http://localhost:5000/content/1003/download-url

## Test Online
1. install [ngrok](https://ngrok.com/)
2. run setup instructions from [ngrok](https://ngrok.com/)
3. run `ngrok http 5000`
4. copy the https url
5. Retest the above local tests with the Ngrok URL

## Configure in Templafy
1. Login to Templafy as an admin https://tenant.templafy.com/admin, browse to the Integrations and setup a custom connector. If you don't have access, ask your Templafy account manager
2. Enter the https url from ngrok, the client id and client secret can be anything. Click save
3. Navigate to the user interface https://tenant.templafy.com, find the connector in the library panel and view the folders and images

## Limitations
- Page limit set to 30

# Content and Folder Structure

The content connector can return all content, a folder structure, or both. It's upto the (the customer requirements) & the engineer configuring this Template to decide what to return. 3 scenarios we see are
1. Nested folder structure required
2. No folders, display all content
3. Search

## General request timeline
### 1. https://contentconnector/content/?skip=0&limit=30&contentType=image
### 2. https://contentconnector/content/?skip=0&limit=30&contentType=image&parentId=100%2f103
### 3. https://contentconnector/content/?skip=0&limit=30&contentType=image&parentId=100%2f103&search=wine

## 1. Nested folder structure required
- When Templafy sends `?skip=0&limit=30&contentType=image`, respond with the parent folders
- When the user selects a parent folder, Templafy will send that in the next request. That's the cue to navigate down the folder path `?skip=0&limit=30&contentType=image&parentId=100/103`
- Return all subfolders and content within the selected parent

## 2. No folders, display all content
- When Templafy sends `?skip=0&limit=30&contentType=image`, respond with all images in your system
- As the user scrolls down the page, pagination will continue to skip results `?skip=30&limit=30&contentType=image`

## 3. Search
Some clients want search to search the entire content base or only to search a subfolder
**Entire content base **
- `?skip=0&limit=30&contentType=image&parentId=100%2f103&search=wine` find the search query param, disregard folder structure and search for the item
- `?skip=0&limit=30&contentType=image&parentId=100%2f103&search=wine` find the search query param and only search in the subfolder 103

# API Routes
Below you'll find sample requests from Templafy and corresponding responses required
<details><summary>POST /oauth/token</summary>
  <p>
**Valid request**

```shell
curl -X POST \
  -H "content-type":"application/x-www-form-urlencoded"
  -H "x-templafyuser":"spo@templafy.com" \
  -H "accept-encoding":"gzip" \
  -d "grant_type=client_credentials" \
  -d "client_secret=clientSecretFromTemplafy" \
  -d "client_id=clientIdFromTemplafy" \
  "https://contentconnector.io/oauth/token"
```


**Valid response**

```shell
HTTP 200 OK
{ "access_token": "fake_access_token" }
```

**Valid response. If the token times out, send a 401 and Templafy will request a new OAuth**

```shell
HTTP 401 Unauthorized
```
  </p>
</details>

<details><summary> GET /content</summary>
  <p>

**Query Parameters for GET /content**

| Query Parameter | Type    | Description                                                                                                                                                          |
| --------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `skip`          | Integer | For paging - From the query, skip the first `x` results. Templafy's first request is `skip=0`                                                                        |
| `limit`         | Integer | Always set to `30` - page size, no flexibility to change                                                                                                             |
| `contentType`   | String  | Templafy requests different content from this server based on what the user requests. Types = `image`, `textElement`, `slide`, `slideElement`, `pdf`, `emailElement` |
| `parentId`      | String  | Enables the folder structure in Templafy. When an end-user selects a folder in the interface, Templafy requests all content from the folder using its `parentId`     |
| `search`        | String  | Enables an end-user to search through your content. We recommend searching names and tags                                                                            |

**Valid request**

```shell
curl X GET \
-H "authorization":"Bearer fake_access_token" \
-H "x-templafyuser":"spo@templafy.com" \
-H "accept-encoding":"gzip" \
"https://contentconnector.io/content/?skip=0&limit=30&contentType=image&parentId=101"
```

**Response Body for GET /content**

| Body Key        | Value Type | Description                                                                                                                                                                                   | Example                                                                                                                                                                                                                                                  |
| --------------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `contentCount ` | Integer    | Total number of results from the search query                                                                                                                                                 | `"contentCount":33`                                                                                                                                                                                                                                      |
| `offset `       | Integer    | Current offset. `offset=30` means skip the first 30                                                                                                                                           | `"offset":30`                                                                                                                                                                                                                                            |
| `content`       | Array      | Array of objects containing `id`, `mimeType`, `name`, `previewUrl`, `tags`                                                                                                                    | `content: [{},{}]`                                                                                                                                                                                                                                       |
| `id`            | String     | ID of the content                                                                                                                                                                             | `"id":"1001"`                                                                                                                                                                                                                                            |
| `mimeType`      | String     | mimeType tells Templafy what content it is                                                                                                                                                    | `application/vnd.templafy.folder`, `image/jpeg`, `image/png`, `image/svg+xml`, `application/pdf`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`, `application/vnd.openxmlformats-officedocument.presentationml.presentation` |
| `name`          | String     | Name of the content e.g. image name or folder name                                                                                                                                            | `Images Folder`, `Wine Photo`                                                                                                                                                                                                                            |
| `previewUrl`    | String     | Public image link to preview content in Templafy. For PowerPoint, Word, & PDF please choose a content preview or use an icon for Templafy to render to the end-user. Not required for folders | `"previewUrl":"htpps://contractpdf.jpg"`                                                                                                                                                                                                                 |
| `tags`          | String     | Content tags to support searching. Not required for folders                                                                                                                                   | `"tags":"Wine, Restaurants, Burgundy"`                                                                                                                                                                                                                   |

**Valid response**

```shell
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

**Examples**

- /content/?skip=0&limit=30&contentType=slides
- /content/?skip=0&limit=30&contentType=image&parentId=01
- /content/?skip=0&limit=30&contentType=image&parentId=01%2f02
- /content/?skip=0&limit=30&contentType=pdf&parentId=01%2f02&search=possum

  </p>
</details>

<details><summary>GET /content/{contentId}/download-url</summary>
  <p>

**Request**

```shell
curl X GET \
-H "authorization":"Bearer fake_access_token" \
-H "x-templafyuser":"spo@templafy.com" \
-H "accept-encoding":"gzip" \
"https://contentconnector.io/content/1500/download-url"
```

**Response**

```shell
HTTP 200 OK
{ "downloadUrl": "https://imagelink.com/pre-signed-url-for-this-image.png" }
```
  </p>
</details>

