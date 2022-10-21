{"skip":"0","limit":"30","contentType":"slide"}
{"host":"7b40-220-233-33-78.au.ngrok.io","authorization":"Bearer fake_access_token","traceparent":"00-17444baf80f240cc9482ddaf4868f2bb-65fe130b8580c904-01","x-forwarded-for":"20.53.72.229","x-forwarded-proto":"https","x-templafyuser":"spo@templafy.com","accept-encoding":"gzip"}
req.url "/content/?skip=0&limit=30&contentType=slide"
body: {}
{"skip":"0","limit":"30","contentType":"slideElement"}
{"host":"7b40-220-233-33-78.au.ngrok.io","authorization":"Bearer fake_access_token","traceparent":"00-17444baf80f240cc9482ddaf4868f2bb-815b49aee43ee531-01","x-forwarded-for":"20.53.72.229","x-forwarded-proto":"https","x-templafyuser":"spo@templafy.com","accept-encoding":"gzip"}
req.url "/content/?skip=0&limit=30&contentType=slideElement"
body: {}
{"skip":"0","limit":"30","contentType":"textElement"}
{"host":"7b40-220-233-33-78.au.ngrok.io","authorization":"Bearer fake_access_token","traceparent":"00-17444baf80f240cc9482ddaf4868f2bb-ccd10dbb0281e3d9-01","x-forwarded-for":"20.53.72.229","x-forwarded-proto":"https","x-templafyuser":"spo@templafy.com","accept-encoding":"gzip"}
req.url "/content/?skip=0&limit=30&contentType=textElement"
body: {}
{}
{"host":"7b40-220-233-33-78.au.ngrok.io","content-length":"93","content-type":"application/x-www-form-urlencoded","traceparent":"00-17444baf80f240cc9482ddaf4868f2bb-234f9ae679959ed3-01","x-forwarded-for":"20.53.72.229","x-forwarded-proto":"https","x-templafyuser":"spo@templafy.com","accept-encoding":"gzip"}
req.url "/oauth/token"
body: {"client_secret":"sample_client_secret23","client_id":"sample_client_id","grant_type":"client_credentials"}
{"skip":"0","limit":"30","contentType":"image"}
{"host":"7b40-220-233-33-78.au.ngrok.io","authorization":"Bearer fake_access_token","traceparent":"00-17444baf80f240cc9482ddaf4868f2bb-5e6e0cd7f3ef24a0-01","x-forwarded-for":"20.53.72.229","x-forwarded-proto":"https","x-templafyuser":"spo@templafy.com","accept-encoding":"gzip"}
req.url "/content/?skip=0&limit=30&contentType=image"
body: {}
{"skip":"0","limit":"30","contentType":"image"}
{"host":"7b40-220-233-33-78.au.ngrok.io","authorization":"Bearer fake_access_token","traceparent":"00-17444baf80f240cc9482ddaf4868f2bb-60a61d41a3fd7807-01","x-forwarded-for":"20.53.72.229","x-forwarded-proto":"https","x-templafyuser":"spo@templafy.com","accept-encoding":"gzip"}
req.url "/content/?skip=0&limit=30&contentType=image"
body: {}
{"skip":"0","limit":"30","contentType":"pdf"}
{"host":"7b40-220-233-33-78.au.ngrok.io","authorization":"Bearer fake_access_token","traceparent":"00-17444baf80f240cc9482ddaf4868f2bb-47542688b79984ca-01","x-forwarded-for":"20.53.72.229","x-forwarded-proto":"https","x-templafyuser":"spo@templafy.com","accept-encoding":"gzip"}
req.url "/content/?skip=0&limit=30&contentType=pdf"
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

# DB Queries

- skip=0
- limit=30
- contentType=slide / image / textElement / slideElement / pdf
- search=string
- parentId=0 / 01 / 02
- contentId=0 / 01 / 02

## Get all images - every request should query folders as well?

```
{
   "mimeType":{
      "$in":[
         "application/vnd.templafy.folder",
         "image/jpeg",
         "image/png",
         "image/svg+xml"
      ]
   }
}
```

## Search Query

- https://www.mongodb.com/docs/atlas/atlas-search/wildcard/

```
{
   "$search":{
      "wildcard":{
         "query":"*food*",
         "path":{
            "wildcard":"*"
         },
         "allowAnalyzedField":true
      }
   }
}
```

{
"$search":{
      "wildcard":{
         "query":"*food*",
         "path":{ "wildcard":"*" },
         "allowAnalyzedField":true
      }
   }
},
{
   "mimeType":{
      "$in":[
"application/vnd.templafy.folder",
"image/jpeg",
"image/png",
"image/svg+xml"
]
}
}

//https://stackoverflow.com/questions/40251597/mongoose-search-query better search query

//https://cloud.mongodb.com/v2/62e0c495c589fd236d6ab383#clusters/atlasSearch/Cluster0?collectionName=movies&database=sample_mflix&indexName=sample-movies&view=SearchTester
[
{
'$search': {
'index': 'sample-movies',
'text': {
'query': '{
$search: { text: { query: "baseball", path: "plot", }, }, }, { $limit: 5, }, { $project: { _id: 0, title: 1, plot: 1, }, }',
'path': {
'wildcard': '*'
}
}
}
}
]
