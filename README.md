# ContentConnector
Content Connector Modern

npm run server for running nodemon
Format = On Windows: Shift + Alt + F.

Todo
- [ ] upload content
- [ ] 

Tutorial
https://www.digitalocean.com/community/tutorials/how-to-create-queries-in-mongodb
https://www.digitalocean.com/community/tutorials/how-to-perform-full-text-search-in-mongodb


Supported query params
/content/?skip=0&limit=30&contentType=image
/content/?skip=0&limit=30&contentType=image&parentId=01
/content/?skip=0&limit=30&contentType=image&parentId=01%2f02

{"skip":"0","limit":"30","contentType":"image"}
{"skip":"0","limit":"30","contentType":"image","parentId":"01/02"}
{"skip":"0","limit":"30","contentType":"image","parentId":"01"}


# sample cURL requests from Templafy to your Content Connector

## POST /oauth/token

{}
{"host":"7b40-220-233-33-78.au.ngrok.io","content-length":"66","content-type":"application/x-www-form-urlencoded","traceparent":"00-17444baf80f240cc9482ddaf4868f2bb-3b6f586734c2390f-01","x-forwarded-for":"20.53.72.229","x-forwarded-proto":"https","x-templafyuser":"spo@templafy.com","accept-encoding":"gzip"}
req.url  "/oauth/token"
body: {"client_secret":"secret4","client_id":"id23","grant_type":"client_credentials"}

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










{"skip":"0","limit":"30","contentType":"slide"}
{"host":"7b40-220-233-33-78.au.ngrok.io","authorization":"Bearer fake_access_token","traceparent":"00-17444baf80f240cc9482ddaf4868f2bb-65fe130b8580c904-01","x-forwarded-for":"20.53.72.229","x-forwarded-proto":"https","x-templafyuser":"spo@templafy.com","accept-encoding":"gzip"}
req.url  "/content/?skip=0&limit=30&contentType=slide"
body: {}
{"skip":"0","limit":"30","contentType":"slideElement"}
{"host":"7b40-220-233-33-78.au.ngrok.io","authorization":"Bearer fake_access_token","traceparent":"00-17444baf80f240cc9482ddaf4868f2bb-815b49aee43ee531-01","x-forwarded-for":"20.53.72.229","x-forwarded-proto":"https","x-templafyuser":"spo@templafy.com","accept-encoding":"gzip"}
req.url  "/content/?skip=0&limit=30&contentType=slideElement"
body: {}
{"skip":"0","limit":"30","contentType":"textElement"}
{"host":"7b40-220-233-33-78.au.ngrok.io","authorization":"Bearer fake_access_token","traceparent":"00-17444baf80f240cc9482ddaf4868f2bb-ccd10dbb0281e3d9-01","x-forwarded-for":"20.53.72.229","x-forwarded-proto":"https","x-templafyuser":"spo@templafy.com","accept-encoding":"gzip"}
req.url  "/content/?skip=0&limit=30&contentType=textElement"
body: {}
{}
{"host":"7b40-220-233-33-78.au.ngrok.io","content-length":"93","content-type":"application/x-www-form-urlencoded","traceparent":"00-17444baf80f240cc9482ddaf4868f2bb-234f9ae679959ed3-01","x-forwarded-for":"20.53.72.229","x-forwarded-proto":"https","x-templafyuser":"spo@templafy.com","accept-encoding":"gzip"}
req.url  "/oauth/token"
body: {"client_secret":"sample_client_secret23","client_id":"sample_client_id","grant_type":"client_credentials"}
{"skip":"0","limit":"30","contentType":"image"}
{"host":"7b40-220-233-33-78.au.ngrok.io","authorization":"Bearer fake_access_token","traceparent":"00-17444baf80f240cc9482ddaf4868f2bb-5e6e0cd7f3ef24a0-01","x-forwarded-for":"20.53.72.229","x-forwarded-proto":"https","x-templafyuser":"spo@templafy.com","accept-encoding":"gzip"}
req.url  "/content/?skip=0&limit=30&contentType=image"
body: {}
{"skip":"0","limit":"30","contentType":"image"}
{"host":"7b40-220-233-33-78.au.ngrok.io","authorization":"Bearer fake_access_token","traceparent":"00-17444baf80f240cc9482ddaf4868f2bb-60a61d41a3fd7807-01","x-forwarded-for":"20.53.72.229","x-forwarded-proto":"https","x-templafyuser":"spo@templafy.com","accept-encoding":"gzip"}
req.url  "/content/?skip=0&limit=30&contentType=image"
body: {}
{"skip":"0","limit":"30","contentType":"pdf"}
{"host":"7b40-220-233-33-78.au.ngrok.io","authorization":"Bearer fake_access_token","traceparent":"00-17444baf80f240cc9482ddaf4868f2bb-47542688b79984ca-01","x-forwarded-for":"20.53.72.229","x-forwarded-proto":"https","x-templafyuser":"spo@templafy.com","accept-encoding":"gzip"}
req.url  "/content/?skip=0&limit=30&contentType=pdf"
body: {}



# Logging with express.js
1. app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
2. app.use(express.json({extended: true}));


### getting query string params
const query = req.query;
console.log(JSON.stringify(req.query));

### logging headers
const headers = req.headers
console.log(JSON.stringify(headers))

### logging request url
console.log("req.url ", JSON.stringify(req.originalUrl))

### logging post form data
console.log("body: "+JSON.stringify(req.body));

