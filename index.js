var express = require ('express'); 
var app = express(); 

app.listen(process.env.PORT || 8080, () => {
  console.log('Port 8080 is Active.')
});

var cors = require('cors'); 
app.use(cors()); 

const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const { file } = require('googleapis/build/src/apis/file');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/drive'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Drive API.
  authorize(JSON.parse(content), listFiles());
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    listFiles(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}



/**
 * Lists the names and IDs of up to 10 files.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */

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
    app.set('fileArray', fileArray);
    const fileId = fileArray[0].id
    const update = await drive.files.update({
      fileId,
      multipart: {
        mimeType: 'text/plain',
        properties:  {subject: 'english'}
      }
    })
console.log(fileArray)
  }
}

//// serve up production assets
app.use(express.static('build'));


app.get('/api', (req, res, done) => {
  var fileArray = req.app.get('fileArray');
  res.send(fileArray);
  console.log("sent.");
  done;
})

app.patch('/update', (req, res, done) => {
})

