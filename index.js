var express = require ('express'); 
var app = express(); 

require('dotenv').config(); 
var path = require("path"); 

//// serve up production assets
app.use(express.static('build'));
app.use(express.static('img'));

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
var tagSchema = new Schema ({
  id: String,
  subject: Array,
  grade: Array, 
  industry: Array
})
var domainSchema = new Schema ({
  name: String,
  domains: Array
})
var specialUsersSchema = new Schema ({
  name: String,
  emails: Array,
})
const User = mongoose.model('User', userSchema);
const TagFile = mongoose.model('TagFile', tagSchema)
const Domains = mongoose.model('Domains', domainSchema)
const SpecialUsers = mongoose.model('SpecialUsers', specialUsersSchema)

function makeNewTag() {
  TagFile.remove({}, (err, res) => {
    if (err) return console.log(err);
    console.log("deleted files")
  });
}

makeNewTag();

app.use(express.static('img'));
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './src/Pages/img')
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
})

const uploads = multer({storage})
console.log(multer)

const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const { file } = require('googleapis/build/src/apis/file');
const { domain } = require('process');


/// GOOGLE DRIVE API MAIN ROUTES 



// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/classroom.courses', 'https://www.googleapis.com/auth/classroom.coursework.students'];
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
      console.log(oAuth2Client);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    console.log(oAuth2Client);
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
      console.log(token);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
      updateTest(oAuth2Client);
      listCourses(oAuth2Client);
      addProperties(oAuth2Client);
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
    pageSize: 1000,
    fields: "nextPageToken, files(id, name, mimeType, description, properties, parents)",
    orderBy: "folder"});
  const files = res.data.files;
  for(var i = 0; i < files.length; i++) {
      TagFile.count({id: files[i].id}, (err, count) => {
        if(err) return console.log(err);
        //console.log(files[i].id)
      })
      //console.log(files[i].id)
  }
  const fileArray = [{
    file: '',
    id: '',
    description: '',
    type: '',
    properties: {
      subject: [],
      grade: [],
      industry: [],
      imgsrc: ''
    },
    parents: [],
  }];
  if (files.length) {
    const fileDisplay = [];
    const fileIdArray = [];
    const description = [];
    const mimeType = [];
    const parents = [];
    var subjectArray = [];
    var gradeArray = [];
    var industryArray = [];
    const imgsrc = [];
    var newLoop = [];
    for (var i = 0; i < files.length; i++) {
      await TagFile.find({id: files[i].id}, (err, res) => {
        if (err) return console.log("This is the error for TagFile " + err);
        //console.log(res);
        newLoop = res;
      })
      //console.log(newLoop.subject);
      fileDisplay.push(files[i].name);
      fileIdArray.push(files[i].id);
      description.push(files[i].description);
      mimeType.push(files[i].mimeType);
      parents.push(files[i].parents);
      subjectArray.push(newLoop.subject)
      gradeArray.push(newLoop.grade)
      industryArray.push(newLoop.industry)
    }
    for (var y = 0; y < fileDisplay.length; y++) {
      for(var j = 0; j < subjectArray.length; j++) {
        if(subjectArray[j] === undefined) {
          subjectArray[j] = [];
        }
      }
      for(var j = 0; j < gradeArray.length; j++) {
        if(gradeArray[j] === undefined) {
          gradeArray[j] = [];
        }
      }
      for(var j = 0; j < industryArray.length; j++) {
        if(industryArray[j] === undefined) {
          industryArray[j] = [];
        }
      }
      fileArray.push({
        file: fileDisplay[y],
        id: fileIdArray[y],
        description: description[y],
        type: mimeType[y],
        properties: {
          subject: subjectArray[y],
          grade: gradeArray[y],
          industry: industryArray[y],
          imgsrc: ''
        },
        parents: parents[y],
      });
    }
    app.set('fileArray', fileArray);
    console.log(fileArray)
  }
}




/// GOOGLE DRIVE EXPORT TO CLASSROOM

app.post("/accesstoken", async (req, res) => {
  const TOKEN_PATH2 = 'token2.json';
  var accessToken = req.body.accessToken
  console.log(accessToken)
  console.log("Something Found.")
  await fs.writeFile(TOKEN_PATH2, JSON.stringify(accessToken), (err) => {
    if (err) return console.log(err);
    console.log('Token stored to', TOKEN_PATH2);
  })
  fs.readFile('token2.json', (err, content) => {
    if (err) return console.log(err);
    console.log(JSON.parse(content))
    console.log("token extracted.")
  })
})

app.get('/getaccesstoken', (req, res) => {
  fs.readFile('token2.json', (err, content) => {
    if (err) return console.log(err);
    console.log(content)
    console.log("token extracted.")
  })
  var accessToken = req.app.get("accessToken");
  res.send(accessToken);
  console.log(accessToken);
})

app.get("drivecall2", (req, res) => {
  const SCOPES2 = ['https://www.googleapis.com/auth/drive.files'];
  const TOKEN_PATH2 = 'token2.json';

  // Load client secrets from a local file.
  fs.readFile('credentials2.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Drive API.
    authorize(JSON.parse(content), listFiles);
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
    fs.readFile(TOKEN_PATH2, (err, token) => {
      if (err) return getAccessToken(oAuth2Client, callback);
      oAuth2Client.setCredentials(JSON.parse(token));
      callback(oAuth2Client);
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
      pageSize: 1000,
      fields: "nextPageToken, files(id, name, mimeType, description, properties, parents)",
      orderBy: "folder"});
    const files = res.data.files;
    const fileArray = [{
      file: '',
      id: '',
      description: '',
      type: '',
      properties: {
        subject: [],
        grade: [],
        industry: [],
        imgsrc: ''
      },
      parents: [],
    }];
    if (files.length) {
      const fileDisplay = [];
      const fileIdArray = [];
      const description = [];
      const mimeType = [];
      const parents = [];
      var subjectArray = [];
      var gradeArray = [];
      var industryArray = [];
      const imgsrc = [];
      var newLoop = [];
      for (var i = 0; i < files.length; i++) {
        //console.log(newLoop.subject);
        fileDisplay.push(files[i].name);
        fileIdArray.push(files[i].id);
        description.push(files[i].description);
        mimeType.push(files[i].mimeType);
        parents.push(files[i].parents);
      }
      for (var y = 0; y < fileDisplay.length; y++) {
        fileArray.push({
          file: fileDisplay[y],
          id: fileIdArray[y],
          description: description[y],
          type: mimeType[y],
          parents: parents[y],
        });
      }
      res.send(fileArray)
    }
  }
})

app.post('/classroomexport', async (req, res) => {
  const drive2 = req.app.get('drive2');
  const fileId = req.body.id
  app.set('fileId', fileId);
  const fileName = req.body.name
  app.set('fileName', fileName)
  const parent = req.body.parent
  const type = req.body.type
  app.set('type', type)
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
  var destSimple = './src/Pages/downloads/' + fileName + '.' + type;
  console.log(destSimple)

  await drive.files.export({
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

  var fileMetadata = {
    'name': fileName,
    'description': "This is " + fileName,
    'parents': []
  };
  console.log(fileMetadata)
  var media = {
    mimeType: newType,
    body: fs.createReadStream(destSimple)
  };
  console.log(media)
  drive.files.create({
    resource: fileMetadata,
    media: media,
  }, function (err, file) {
    if (err) {
      console.log("Error for file creation: " + err);
    } else {
      console.log(file.name);
    }
  });
})


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
      if(foundDomains[i] !== domain) {
        SpecialUsers.find({name: "Special Users"}, (err, res) => {
          if (err) return console.log(err);
          var specialEmails = res[0].emails;
          for(var y = 0; y < specialEmails.length; y++) {
            if(specialEmails[i] === email) {
              bcrypt.hash(password, 10, (err, hash) => {
                if(err) return console.log(err);
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
                if(foundDomains[i] !== data[0].domain) {
                  SpecialUsers.find({name: "Special Users"}, (err, res) => {
                    if(err) return console.log(err);
                    var specialUsers = res[0].emails;
                    for(var y = 0; y < specialUsers.length; y++) {
                      if(specialUsers[i] === data[0].email) {
                        done(null, req.session.sessionID);
                      }
                      else {
                        return console.log("user does not match any of our records.")
                      }
                    }
                  })
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

app.get('/specialusers', (req, res) => {
  SpecialUsers.find({name: "Special Users"}, (err, data) => {
    if(err) return console.log(err);
    console.log(data);
    res.send(data);
  })
})

app.post('/addspecialuser', (req, res) => {
  const newUser = req.body.specialUser;
  console.log(newUser)
  Domains.findOneAndUpdate(
    {name: "Special Users"}, 
    {$push: {emails: newDomains}},
    {new: true},
    (err, data) => {console.log(data)})
})

app.get('/api', (req, res, done) => {
  var fileArray = req.app.get('fileArray');
  res.send(fileArray);
  console.log("sent.");
  done;
})

app.post('/update', uploads.single('myFile'), (req, res, done) => {
  var drive = req.app.get('drive');
  var fileId = req.body.id;
  var subject = req.body.subject;
  var grade = req.body.grade;
  var industry = req.body.industry;
  const imageUrl = req.file.filename;
  var video = req.body.video;
  var rubric = req.body.rubric;
  var handout = req.body.handout; 
  drive.files.update({
    fileId: fileId,
    requestBody: {properties: {subject: subject, grade: grade, industry: industry, imgSrc: imageUrl, video: video, rubric: rubric, handout: handout}},
  })
})

app.post("/makenew", (req, res) => {
  var drive = req.app.get('drive');
  var name = req.body.name;
  var description = req.body.description;
  var type = req.body.type;
  var fileMetadata = {
    'name': name,
    'description': description,
    'mimeType': type,
  };
  drive.files.create({
    resource: fileMetadata,
  }, function (err, file) {
    if (err) {
      // Handle error
      console.error(err);
    } else {
      console.log(file.id);
    }
  });
})

app.post('/profile', uploads.single('myFile'), function (req, res) {
  var drive = req.app.get('drive');
  const id = req.body.fileId; 
  console.log(id);
  const image = req.file.filename;
  console.log(image);
  drive.files.update({
    fileId: id,
    requestBody: {properties: {imgsrc: image}},
  })
})

app.get('/download', (req, res) => {
  console.log("file downloaded.")
  const fileName = req.app.get('fileName');
  const type = req.app.get('type')
  var pathStart = './src/Pages/downloads/'
  var newPath = pathStart.concat(fileName + '.' + type)
  console.log(newPath)
  res.download(newPath)
})

app.post("/downloaddocument", async (req, res) => {
  const drive = req.app.get('drive');
  const fileId = req.body.id
  app.set('fileId', fileId);
  const fileName = req.body.name
  app.set('fileName', fileName)
  const type = req.body.type
  app.set('type', type)
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
  var destSimple = './src/Pages/downloads/' + fileName + '.' + type;
  console.log(destSimple)

  await drive.files.export({
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

  var fileMetadata = {
    'name': fileName,
    'description': "This is " + fileName,
    'parents': []
  };
  console.log(fileMetadata)
  var media = {
    mimeType: newType,
    body: fs.createReadStream(destSimple)
  };
  console.log(media)
  drive.files.create({
    resource: fileMetadata,
    media: media,
  }, function (err, file) {
    if (err) {
      console.log("Error for file creation: " + err);
    } else {
      console.log(file.name);
    }
  });
})

app.get('/listfolders', (req, res) => {
  const drive2 = req.app.get('drive2');
  drive.files.list({fileId: fileId}, (err, res) => {
    if (err) return console.log(err)
    res.send(res);
  })
})
