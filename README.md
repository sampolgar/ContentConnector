# ContentConnector Modern

this readme is a work in progress

# Required query params

/content/?skip=0&limit=30&contentType=image
/content/?skip=0&limit=30&contentType=image&parentId=01
/content/?skip=0&limit=30&contentType=image&parentId=01%2f02

# sample cURL requests from Templafy to your Content Connector

## POST /oauth/token

## GET /content

**Request 1 from Templafy to Content Connector as soon as user opens page**

```
curl X GET \
-H "host":"68e0-220-233-33-78.au.ngrok.io" \
-H "authorization":"Bearer fake_access_token" \
-H "traceparent":"00-654d8b7b002d427cbb3887f355721021-5e2b2d446bea2f2c-01" \
-H "x-forwarded-for":"20.193.37.124" \
-H "x-forwarded-proto":"https"
-H "x-templafyuser":"spo@templafy.com" \
-H "accept-encoding":"gzip" \
"https://68e0-220-233-33-78.au.ngrok.io/content/?skip=0&limit=30&contentType=image"
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
