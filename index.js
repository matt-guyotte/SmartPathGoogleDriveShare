var express = require ('express'); 
var app = express(); 

require('dotenv').config(); 
var path = require("path"); 

var bodyParser = require('body-parser');
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());

app.listen(process.env.PORT || 8080, () => {
  console.log('Port 8080 is Active.')
});

var cors = require('cors'); 
app.use(cors()); 

var mongoose = require ('mongoose'); 
    mongoose.set('useNewUrlParser', true);
    mongoose.set('useUnifiedTopology', true);
    mongoose.set('useFindAndModify', false);
    mongoose.connect(process.env.MONGO_URI);
    var db = mongoose.connection;

var bcrypt = require('bcrypt');
var session = require('express-session'); 
var mongoStore = require('connect-mongo')(session); 
app.use(session({secret: process.env.secret, 
    resave: false, saveUninitialized: true,
    cookie: {maxAge: null},
    store: new mongoStore({mongooseConnection: db})}));

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
    console.log("Mongoose connection successful.");
  });

var Schema = mongoose.Schema;  
var userSchema = new Schema ({
    email: String,
    password: String,
    domain: String
}); 
var domainSchema = new Schema ({
  name: String,
  domains: Array
})
const User = mongoose.model('User', userSchema);
const Domains = mongoose.model('Domains', domainSchema)

const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const { file } = require('googleapis/build/src/apis/file');
const { domain } = require('process');

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
  const {client_secret, client_id, redirect_uris} = credentials.web;
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
    prompt: 'consent',
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
      updateTest(oAuth2Client)
    });
  });
}



/**
 * Lists the names and IDs of up to 10 files.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */

async function listFiles(auth) {

  const drive = google.drive({ version: "v3", auth });
  app.set('drive', drive);
  const res = await drive.files.list({
    pageSize: 10,
    fields: "nextPageToken, files(id, name, description, mimeType, createdTime, parents, properties)",
  });
  const files = res.data.files;
  const fileArray = [];
  if (files.length) {
    const fileDisplay = [];
    const fileIdArray = [];
    const description = [];
    const mimeType = [];
    const parents = [];
    const properties = [];
    console.log("Files:");
    for (var i = 0; i < files.length; i++) {
      fileDisplay.push(files[i].name);
      fileIdArray.push(files[i].id);
      description.push(files[i].description);
      mimeType.push(files[i].mimeType);
      properties.push(files[i].properties);
      parents.push(files[i].parents);
    }
    for (var y = 0; y < fileDisplay.length; y++) {
      fileArray.push({
        file: fileDisplay[y],
        id: fileIdArray[y],
        description: description[y],
        type: mimeType[y],
        properties: properties[y],
        parents: parents[y],
      });
    }
    console.log(fileArray);
    app.set('fileArray', fileArray);
  }
}

//// serve up production assets
app.use(express.static('build'));


// Authentication Routes

app.post("/register", (req, res, done) => {
  const email = req.body.email;
  const password = req.body.password;
  const domain = req.body.domain;
  Domains.find({name: "Domains"}, (err, res) => {
    if (err) return console.log(err);
    var foundDomains = res[0].domains;
    for(var i = 0; i < foundDomains.length; i++) {
      if(foundDomains[i] === domain) {
        bcrypt.hash(password, 10, (err, hash) => {
          var addedUser = new User ({
              email: email,
              password: hash,
              domain: domain,
          })
          addedUser.save((err, data) => {
              if (err) {
                  return done(err); 
              }
              req.session.sessionID = data._id; 
              console.log(req.session.sessionID); 
              done(null, data); 
              console.log(data); 
          })
        })
      }
    }
  })
}); 

app.post('/login', (req, res, done) => {
  const email = req.body.email; 
  const password = req.body.password;
  User.find({email: email}, (err, data) => {
      if (err) { 
          done(err); 
          console.log("email not found.")
      }
      else { 
      console.log('user found!'); 
      bcrypt.compare(password, data[0].password, (err, result) => {
          if(err) {
              done(err);
              console.log('passwords do not match.')
          }
          if(result === true) {
            req.session.sessionID = data[0]._id; 
            console.log(data);
            Domains.find({name: "Domains"}, (err, res) => {
              if (err) return console.log(err);
              var foundDomains = res[0].domains;
              for(var i = 0; i < foundDomains.length; i++) {
                if(foundDomains[i] === data[0].domain) {
                  done(null, req.session.sessionID);
                  console.log(req.session.sessionID); 
                }
              }
            })
          }
          else {
              console.log("outside error found")
          }
      }) 
      }
  })
})

app.get('/login2', (req, res) => {
  if(req.session.sessionID) {
      res.send(true);
      console.log("login2 ran.")
  }
  else{ 
      res.send(false); 
  }   
})

app.get('/logout', function (req, res, done) {
  console.log("logout called.")
  if (req.session.sessionID) {
    req.session.destroy();
    }
  });

  //Api Routes

app.get('/apicall', (req, res, done) => {
  console.log("apicall called.")
  console.log(req.session.sessionID)
  if(req.session.sessionID) {
      console.log(req.session.sessionID)
      res.send(true);
  }
  else {
  done(null)
  }
})

app.get('/domains', (req, res) => {
  Domains.find({name: "Domains"}, (err, data) => {
    if (err) return console.log(err);
    console.log(data)
    res.send(data);
  })
})

app.post('/adddomain', (req, res) => {
  const newDomains = req.body.domain;
  console.log(newDomains)
  Domains.findOneAndUpdate(
    {name: "Domains"}, 
    {$push: {domains: newDomains}},
    {new: true},
    (err, data) => {console.log(data)})
})

app.get('/api', (req, res, done) => {
  var fileArray = req.app.get('fileArray');
  res.send(fileArray);
  console.log("sent.");
  done;
})

app.post('/update', (req, res, done) => {
  var drive = req.app.get('drive');
  var fileId = req.body.id;
  var subject = req.body.subject;
  var response = drive.files.update({
    fileId: fileId,
    requestBody: {properties: {subject: subject}},
  })
})

app.post("/makenew", (req, res) => {
  var drive = req.app.get('drive');
  var name = req.body.name;
  var description = req.body.description;
  var subject = req.body.subject;
  var grade = req.body.grade;
  var type = req.body.type;
  console.log(subject);
  var fileMetadata = {
    'name': name,
    'description': description,
    "properties": {
      "subject": subject,
      "grade": grade,
    },
    'mimeType': type,
  };
  drive.files.create({
    resource: fileMetadata,
    fields: 'id'
  }, function (err, file) {
    if (err) {
      // Handle error
      console.error(err);
    } else {
      console.log(file.id);
    }
  });
})

app.get('/downloadtest', (req, res) => {
  res.download('./src/Pages/downloads/lesson 2.txt')
  console.log("file downloaded.")
})

app.post("/downloaddocument", (req, res) => {
  const drive = req.app.get('drive');
  const fileId = req.body.id
  const fileName = req.body.name
  const type = req.body.type
  var newType = ''
  if(type === 'pdf') {
    newType = 'application/pdf'
  }
  if(type === 'docx') {
    newType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  }
  if(type === 'txt') {
    newType === 'text/plain'
  }
  var dest = fs.createWriteStream('./src/Pages/downloads/' + fileName + '.' + type);
  console.log(dest);

  drive.files.export({
    fileId: fileId, mimeType: newType}, 
    {responseType: 'stream'},
    function(err, response){
    if(err)return console.log(err);
    response.data.on('error', err => {
        console.log(err);
    }).on('end', ()=>{
        console.log("sent file.")
    })
    .pipe(dest);
  });
})

app.post("/downloadfolder", (req, res) => {
  const drive = req.app.get('drive');
  const fileId = req.body.id
  console.log(req.body.id)
  const fileName = req.body.name
  const type = req.body.type
  console.log(type);
  var dest = fs.createWriteStream('./src/Pages/downloads/' + fileName + '.' + type );
  console.log(dest);

  //drive.files.export({
  //  fileId: fileId, mimeType: 'application/zip'}, 
  //  {responseType: 'stream'},
  //  function(err, response){
  //  if(err)return console.log(err);
  //  response.data.on('error', err => {
  //      console.log(err);
  //  }).on('end', ()=>{
  //      console.log("sent file.")
  //  })
  //  .pipe(dest);
  //});

})
