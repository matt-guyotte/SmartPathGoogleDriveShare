const {google} = require('googleapis');
const fs = require('fs');
const readline = require('readline');
const querystring = require('querystring');
const { oauth2 } = require('googleapis/build/src/apis/oauth2');

// generate a url that asks permissions for Drive scope
const scopes = ['https://www.googleapis.com/auth/drive'];

fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Drive API.
    authorize(JSON.parse(content));
  });

function authorize(credentials) {
  const {client_secret, client_id, redirect_uris} = credentials.web;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);
      url(oAuth2Client);
  }

  function url(oAuth2Client) {
    const url = oAuth2Client.generateAuthUrl({
        // 'online' (default) or 'offline' (gets refresh_token)
        access_type: 'offline',
        prompt: 'consent',
        // If you only need one scope you can pass it as a string
        scope: scopes
      });
    console.log(url);
    oAuth2Client.getToken("", (err, token) => {
      if (err) return console.error('Error retrieving access token', err); 
      oAuth2Client.setCredentials(token);
      console.log(oAuth2Client);
      listFiles(oAuth2Client);
    })
  }

  async function listFiles(auth) {
    const drive = google.drive({ version: "v3", auth });
    const res = await drive.files.list({
      pageSize: 10,
      fields: "nextPageToken, files(id, name, description, mimeType, createdTime, parents, properties)",
    });
    const files = res.data.files;
    const fileArray = [];
    if (files.length) {
      const fileDisplay = [];
      const fileIdArray = [];
      const mimeType = [];
      const parents = [];
      const properties = [];
      console.log("Files:");
      for (var i = 0; i < files.length; i++) {
        fileDisplay.push(files[i].name);
        fileIdArray.push(files[i].id);
        mimeType.push(files[i].mimeType);
        properties.push(files[i].properties);
        parents.push(files[i].parents);
      }
      for (var y = 0; y < fileDisplay.length; y++) {
        fileArray.push({
          file: fileDisplay[y],
          id: fileIdArray[y],
          type: mimeType[y],
          parents: parents[y],
          properties: properties[y],
        });
      }
      console.log(fileArray)
    }
  }