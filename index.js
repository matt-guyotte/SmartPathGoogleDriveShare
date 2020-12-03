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
    domain: String,
    active: Boolean,
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

//function makeNewTag() {
//  TagFile.remove({}, (err, res) => {
//    if (err) return console.log(err);
//    console.log("deleted files")
//  });
//}
//
//makeNewTag();

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

const nodemailer = require('nodemailer');
var transport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
     user: 'smartpathverification@gmail.com',
     pass: process.env.EMAIL_PASS,
  }
});

const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const { file } = require('googleapis/build/src/apis/file');
const { domain } = require('process');
const { request } = require('http');
const { appsactivity } = require('googleapis/build/src/apis/appsactivity');


/// GOOGLE DRIVE API MAIN ROUTES 



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
  for(var i = 0; i < files.length; i++) {
    TagFile.count({id: files[i].id}, (err, count) => {
      if(err) return console.log(err);
      if(count === 0) {
        //ALL
        if(!files[i].subject && !files[i].grade && !files[i].industry) {
          var newTags = new TagFile({id: files[i].id});
          newTags.save((err, res) => {
            if (err) return console.log(err);
            console.log(res);
          })
        }
        if(files[i].subject && files[i].grade && !files[i].industry) {
          var newTags = new TagFile({id: files[i].id, subject: [files[i].properties.subject], grade: [files[i].properties.grade], industry: [files[i].properties.industry] })
          newTags.save((err, res) => {
            if (err) return console.log(err);
            console.log(res);
          })
          fileArray.push({subject: files[i].properties.subject, grade: files[i].properties.grade, industry: files[i].industry})
        }
        //SUBJECT
        if(files[i].subject && !files[i].grade && !files[i].industry) {
          var newTags = new TagFile({id: files[i].id, subject: [files[i].properties.subject]})
          newTags.save((err, res) => {
            if (err) return console.log(err);
            console.log(res);
          })
          fileArray.push({subject: files[i].properties.subject})
        }
        if(files[i].subject && files[i].grade && !files[i].industry) {
          var newTags = new TagFile({id: files[i].id, subject: [files[i].properties.subject], grade: [files[i].properties.grade]})
          newTags.save((err, res) => {
            if (err) return console.log(err);
            console.log(res);
          })
          fileArray.push({subject: files[i].properties.subject, grade: files[i].properties.grade})
        }
        if(files[i].subject && !files[i].grade && files[i].industry) {
          var newTags = new TagFile({id: files[i].id, subject: [files[i].properties.subject], industry: [files[i].properties.industry]})
          newTags.save((err, res) => {
            if (err) return console.log(err);
            console.log(res);
          })
          fileArray.push({subject: files[i].properties.subject, industry: files[i].industry})
        }
        //GRADE
        if(!files[i].subject && files[i].grade && !files[i].industry) {
          var newTags = new TagFile({id: files[i].id, grade: files[i].grade})
          newTags.save((err, res) => {
            if (err) return console.log(err);
            console.log(res);
          })
          fileArray.push({grade: files[i].properties.grade})
        }
        if(files[i].subject && files[i].grade && !files[i].industry) {
          var newTags = new TagFile({id: files[i].id, subject: files[i].subject, grade: files[i].grade})
          newTags.save((err, res) => {
            if (err) return console.log(err);
            console.log(res);
          })
          fileArray.push({subject: files[i].properties.subject, grade: files[i].properties.grade})
        }
        if(!files[i].subject && files[i].grade && files[i].industry) {
          var newTags = new TagFile({id: files[i].id, grade: files[i].grade, industry: files[i].industry})
          newTags.save((err, res) => {
            if (err) return console.log(err);
            console.log(res);
          })
          fileArray.push({grade: files[i].properties.grade, industry: files[i].industry})
        }
        //INDUSTRY
        if(!files[i].subject && !files[i].grade && files[i].industry) {
          var newTags = new TagFile({id: files[i].id, grade: files[i].grade, industry: files[i].industry})
          newTags.save((err, res) => {
            if (err) return console.log(err);
            console.log(res);
          })
          fileArray.push({industry: files[i].industry})
        }
        if(files[i].subject && !files[i].grade && files[i].industry) {
          var newTags = new TagFile({id: files[i].id, subject: files[i].subject, industry: files[i].industry})
          newTags.save((err, res) => {
            if (err) return console.log(err);
            console.log(res);
          })
          fileArray.push({subject: files[i].properties.subject, industry: files[i].industry})
        }
        if(!files[i].subject && files[i].grade && files[i].industry) {
          var newTags = new TagFile({id: files[i].id, grade: files[i].grade, industry: files[i].industry})
          newTags.save((err, res) => {
            if (err) return console.log(err);
            console.log(res);
          })
          fileArray.push({grade: files[i].properties.grade, industry: files[i].industry})
        }
      }
      if(count > 1) {
        TagFile.find({id: files[i].id}, (err, res) => {
          if(err) return console.log(err);
          fileArray.push({subject: res[0].subject, grade: res[0].grade, industry: res[0].industry})
        })
      }
      else {
        return;
      }
    })
  }
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

function requireHTTPS(req, res, next) {
  // The 'x-forwarded-proto' check is for Heroku
  if (!req.secure && req.get('x-forwarded-proto') !== 'https' && process.env.NODE_ENV !== "development") {
    return res.redirect('https://' + req.get('host') + req.url);
  }
  next();
}

app.use(requireHTTPS);

/// GOOGLE DRIVE EXPORT TO CLASSROOMs

// Setting Files to Local 

app.post("/downloaddocument", async (req, res) => {
  const JSZip = require('jszip');
  const drive = req.app.get('drive');
  const files = req.body.files;
  app.set('files', files);
 
  var zip = new JSZip();
  let topFolderPathZip = ''

  for(var i = 0; i < files.length; i++) {
    if (files[i].type != "folder") {
      const fileId = files[i].id
      const fileName = files[i].name
      const type = files[i].type
      let newType = ''
      if(type === 'docx') {
        newType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      }
      if(type === 'pptx') {
        newType = 'application/vnd.google-apps.presentation'
      }
      if(type === 'xlsx') {
        newType === 'application/vnd.google-apps.spreadsheet'
      }

      const dest = await fs.createWriteStream('./src/Pages/downloads/' + fileName + '.' + type, (err) => {if (err) return console.log(err)});
      const destSimple = './src/Pages/downloads/' + fileName + '.' + type;
      console.log(destSimple)

      await drive.files.export({
        fileId: fileId, mimeType: newType}, 
        {responseType: 'stream'},
        function(err, response){
        if(err)return console.log(err);
        response.data.on('error', err => {
            console.log("Found at 911 " + err);
        })
        .pipe(dest, function(){console.log('file path written.')})
        .on('end', ()=>{
            console.log("sent file.")
        })
      });

      //await zip.file(destSimple, fs.readFile(destSimple), () => {if(err) return console.log(err)})
    }

    if(files[i].type === "folder") {
      await fs.mkdir('./src/Pages/downloads/' + files[i].name, { recursive: true }, (err) => {
        if (err) return console.log("At 764: " + err);
      });
      const topFolderPath = './src/Pages/downloads/' + files[i].name;
      const topFolderZip = await zip.folder('./src/Pages/downloads/' + files[i].name);
      if(files[i].children.length != 0) {
        //1
        for(var y = 0; y < files[i].children.length; y++) {
          const level1 = files[i].children[y]
          if(level1.type != 'folder') {
            const fileId1 = level1.id;
            const fileName1 = level1.name;
            const type1 = level1.type;
            const dest1 = await fs.createWriteStream(topFolderPath + "/" + fileName1 + '.' + type1, (err) => {if (err) return console.log("776: " + err)});
            const dest1file = topFolderPath + "/" + fileName1 + '.' + type1;
            const dest1zip = topFolderZip + "/" + fileName1 + '.' + type1;
            let newType1 = ''
            if(type1 === 'docx') {
              newType1 = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            }
            if(type1 === 'pptx') {
              newType1 = 'application/vnd.google-apps.presentation'
            }
            if(type1 === 'xlsx') {
              newType1 === 'application/vnd.google-apps.spreadsheet'
            }
            drive.files.export({
              fileId: fileId1, mimeType: newType1}, 
              {responseType: 'stream'},
              function(err, response){
              if(err)return console.log(err);
              response.data.on('error', err => {
                  console.log("Found at 796 " + err);
              })
              .pipe(dest1)
              .on('end', ()=>{
                  console.log("sent file.")
              })
              console.log("file written.")
            });
            //await zip.file(dest1zip, fs.readFile(dest1file, (err) => {if (err) return console.log(err)}));
          }
          if(level1.type === 'folder') {
            console.log("at 808 " + topFolderPath)
            fs.mkdir(topFolderPath + "/" + level1.name, { recursive: true }, (err) => {if (err) return console.log(err)});
            const level1FolderPath = topFolderPath + "/" + level1.name;
            const level1ZipPath = await zip.folder(topFolderZip + "/" + level1.name);
            if(level1.children.length != 0) {
              //2
              for(var a = 0; a < level1.children.length; a++) {
                const level2 = level1.children[a];
                if(level2.type != 'folder') {
                  const fileId2 = level2.id
                  const fileName2 = level2.name
                  const type2 = level2.type
                  const dest2 = await fs.createWriteStream(level1FolderPath + "/" + fileName2 + '.' + type2);
                  const dest2file = level1FolderPath + "/" + fileName2 + '.' + type2
                  const dest2zip = level1ZipPath + "/" + fileName1 + '.' + type1;
                  let newType2 = ''
                  if(type2 === 'docx') {
                    newType2 = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                  }
                  if(type2 === 'pptx') {
                    newType2 = 'application/vnd.google-apps.presentation'
                  }
                  if(type2 === 'xlsx') {
                    newType2 === 'application/vnd.google-apps.spreadsheet'
                  }
                  await drive.files.export({
                    fileId: fileId2, mimeType: newType2}, 
                    {responseType: 'stream'},
                    function(err, response){
                    if(err)return console.log(err);
                    response.data.on('error', err => {
                        console.log("Found at 837 " + err);
                    })
                    .pipe(dest2, function(){console.log('file path written.')})
                  });
                  //await zip.file(dest2zip, fs.readFile(dest2file, (err) => {if(err) return console.log(err)}));
                }
                if(level1.type === 'folder') {
                  await fs.mkdir(level1FolderPath + "/" + level2.name, { recursive: true }, (err) => {if (err) return console.log(err)});
                  const level2FolderPath = level1FolderPath + "/" + level2.name;
                  const level2ZipPath = await zip.folder(level1ZipPath + "/" + level2.name);
                  if(level2.children.length != 0) {
                    //3
                    for(var b = 0; b < level2.children.length; b++) {
                      const level3 = level2.children[b];
                      if(level3.type != 'folder') {
                        const fileId3 = level3.id
                        const fileName3 = level3.name
                        const type3 = level3.type
                        const dest3 = await fs.createWriteStream(level2FolderPath + "/" + fileName3 + '.' + type3);
                        const dest3file = level2FolderPath + "/" + fileName3 + '.' + type3
                        const dest3zip = level2ZipPath + "/" + fileName3 + '.' + type3;
                        let newType3 = ''
                        if(type3 === 'docx') {
                          newType3 = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                        }
                        if(type3 === 'pptx') {
                          newType3 = 'application/vnd.google-apps.presentation'
                        }
                        if(type3 === 'xlsx') {
                          newType3 === 'application/vnd.google-apps.spreadsheet'
                        }
                        await drive.files.export({
                          fileId: fileId3, mimeType: newType3}, 
                          {responseType: 'stream'},
                          function(err, response){
                          if(err)return console.log(err);
                          response.data.on('error', err => {
                              console.log("Found at 874 " + err);
                          })
                          .pipe(dest3, function(){console.log('file path written.')})
                        });
                        //await zip.file(dest3zip, fs.readFile(dest3file, (err) => {if(err) return console.log(err)}));
                      }
                      if(level3.type === 'folder') {
                        fs.mkdir(level2FolderPath + "/" + level3.name, { recursive: true }, (err) => {if (err) return console.log(err)});
                        var level3FolderPath = level2FolderPath + "/" + level3.name;
                        var level3ZipPath = zip.folder(level2ZipPath + "/" + level3.name);
                        if(level3.children.length != 0) {
                          //4
                          for(var c = 0; c < level3.children.length; c++) {
                            var level4 = level3.children[c];
                            if(level4.type != 'folder') {
                              var fileId4 = level4.id
                              var fileName4 = level4.name
                              var type4 = level4.type
                              var dest4 = fs.createWriteStream(level3FolderPath + "/" + fileName4 + '.' + type4);
                              var dest4file = level3FolderPath + "/" + fileName4 + '.' + type4;
                              var dest4zip = level3ZipPath + "/" + fileName4 + '.' + type4;
                              var newType4 = ''
                              if(type4 === 'docx') {
                                newType4 = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                              }
                              if(type4 === 'pptx') {
                                newType4 = 'application/vnd.google-apps.presentation'
                              }
                              if(type4 === 'xlsx') {
                                newType4 === 'application/vnd.google-apps.spreadsheet'
                              }
                              await drive.files.export({
                                fileId: fileId4, mimeType: newType4}, 
                                {responseType: 'stream'},
                                function(err, response){
                                if(err)return console.log(err);
                                response.data.on('error', err => {
                                    console.log(err);
                                }).on('end', ()=>{
                                    console.log("sent file.")
                                })
                                .pipe(dest4);
                              });
                              //zip.file(dest4zip, fs.readFile(dest4file, (err) => {if(err) return console.log(err)}));
                            }
                            if(level4.type === 'folder') {
                              fs.mkdir(level3FolderPath + "/" + level4.name, { recursive: true }, (err) => {if (err) return console.log(err)});
                              var level4FolderPath = level3FolderPath + "/" + level4.name;
                              var level4ZipPath = zip.folder(level3ZipPath + "/" + level4.name);
                              if(level4.children.length != 0) {
                                //5
                                for(var d = 0; d < level4.children.length; d++) {
                                  var level5 = level4.children[d];
                                  if(level5.type != 'folder') {
                                    var fileId5 = level5.id
                                    var fileName5 = level5.name
                                    var type5 = level5.type
                                    var dest5 = fs.createWriteStream(level4FolderPath + "/" + fileName5 + '.' + type5);
                                    var dest5file = level4FolderPath + "/" + fileName5 + '.' + type5;
                                    var dest5zip = level4ZipPath + "/" + fileName5 + '.' + type5;
                                    var newType5 = ''
                                    if(type5 === 'docx') {
                                      newType5 = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                                    }
                                    if(type5 === 'pptx') {
                                      newType5 = 'application/vnd.google-apps.presentation'
                                    }
                                    if(type5 === 'xlsx') {
                                      newType5 === 'application/vnd.google-apps.spreadsheet'
                                    }
                                    await drive.files.export({
                                      fileId: fileId5, mimeType: newType5}, 
                                      {responseType: 'stream'},
                                      function(err, response){
                                      if(err)return console.log(err);
                                      response.data.on('error', err => {
                                          console.log(err);
                                      }).on('end', ()=>{
                                          console.log("sent file.")
                                      })
                                      .pipe(dest5);
                                    });
                                    //zip.file(dest5zip, fs.readFile(dest5file, (err) => {if(err) return console.log(err)}));
                                  }
                                  if(level5.type === 'folder') {
                                    fs.mkdir(level4FolderPath + "/" + level5.name, { recursive: true }, (err) => {if (err) return console.log(err)});
                                    var level5FolderPath = level4FolderPath + "/" + level5.name;
                                    var level5ZipPath = zip.folder(level4ZipPath + "/" + level5.name);
                                    if(level5.children.length != 0) {
                                      //6
                                      for(var e = 0; e < level5.children.length; e++) {
                                        var level6 = level5.children[e];
                                        if(level6.type != 'folder') {
                                          var fileId6 = level6.id
                                          var fileName6 = level6.name
                                          var type6 = level6.type
                                          var dest6 = fs.createWriteStream(level5FolderPath + "/" + fileName6 + '.' + type6);
                                          var dest6file = level5FolderPath + "/" + fileName6 + '.' + type6;
                                          var dest6zip = level5ZipPath + "/" + fileName6 + '.' + type6;
                                          var newType6 = ''
                                          if(type6 === 'docx') {
                                            newType6 = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                                          }
                                          if(type6 === 'pptx') {
                                            newType6 = 'application/vnd.google-apps.presentation'
                                          }
                                          if(type6 === 'xlsx') {
                                            newType6 === 'application/vnd.google-apps.spreadsheet'
                                          }
                                          await drive.files.export({
                                            fileId: fileId6, mimeType: newType6}, 
                                            {responseType: 'stream'},
                                            function(err, response){
                                            if(err)return console.log(err);
                                            response.data.on('error', err => {
                                                console.log(err);
                                            }).on('end', ()=>{
                                                console.log("sent file.")
                                            })
                                            .pipe(dest6);
                                          });
                                          //zip.file(dest6zip, fs.readFile(dest6file, (err) => {if(err) return console.log(err)}));
                                        }
                                        if(level6.type === 'folder') {
                                          fs.mkdir(level5FolderPath + "/" + level6.name, { recursive: true }, (err) => {if (err) return console.log(err)});
                                          var level6FolderPath = level5FolderPath + "/" + level6.name;
                                          var level6ZipPath = zip.folder(level5ZipPath + "/" + level6.name);
                                          if(level6.children.length != 0) {
                                            //7
                                            for(var f = 0; f < level6.children.length; f++) {
                                              var level7 = level6.children[f];
                                              if(level7.type != 'folder') {
                                                var fileId7 = level7.id
                                                var fileName7 = level7.name
                                                var type7 = level7.type
                                                var dest7 = fs.createWriteStream(level6FolderPath + "/" + fileName7 + '.' + type7);
                                                var dest7file = level6FolderPath + "/" + fileName7 + '.' + type7;
                                                var dest7zip = level6ZipPath + "/" + fileName7 + '.' + type7;
                                                var newType7 = ''
                                                if(type7 === 'docx') {
                                                  newType7 = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                                                }
                                                if(type7 === 'pptx') {
                                                  newType7 = 'application/vnd.google-apps.presentation'
                                                }
                                                if(type7 === 'xlsx') {
                                                  newType7 === 'application/vnd.google-apps.spreadsheet'
                                                }
                                                await drive.files.export({
                                                  fileId: fileId7, mimeType: newType7}, 
                                                  {responseType: 'stream'},
                                                  function(err, response){
                                                  if(err)return console.log(err);
                                                  response.data.on('error', err => {
                                                      console.log(err);
                                                  }).on('end', ()=>{
                                                      console.log("sent file.")
                                                  })
                                                  .pipe(dest7);
                                                });
                                                //zip.file(dest7zip, fs.readFile(dest7file, (err) => {if(err) return console.log(err)}));
                                              }
                                              if(level7.type === 'folder') {
                                                fs.mkdir(level6FolderPath + "/" + level7.name, { recursive: true }, (err) => {if (err) return console.log(err)});
                                                var level7FolderPath = level6FolderPath + "/" + level7.name;
                                                var level7ZipPath = zip.folder(level6ZipPath + "/" + level7.name);
                                                if(level7.children.length != 0) {
                                                  //8
                                                  for(var g = 0; g < level7.children.length; g++) {
                                                    var level8 = level7.children[g];
                                                    if(level8.type != 'folder') {
                                                      var fileId8 = level8.id
                                                      var fileName8 = level8.name
                                                      var type8 = level8.type
                                                      var dest8 = fs.createWriteStream(level7FolderPath + "/" + fileName8 + '.' + type8);
                                                      var dest8file = level7FolderPath + "/" + fileName8 + '.' + type8;
                                                      var dest8zip = level7ZipPath + "/" + fileName8 + '.' + type8;
                                                      var newType8 = ''
                                                      if(type8 === 'docx') {
                                                        newType8 = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                                                      }
                                                      if(type8 === 'pptx') {
                                                        newType8 = 'application/vnd.google-apps.presentation'
                                                      }
                                                      if(type8 === 'xlsx') {
                                                        newType8 === 'application/vnd.google-apps.spreadsheet'
                                                      }
                                                      await drive.files.export({
                                                        fileId: fileId8, mimeType: newType8}, 
                                                        {responseType: 'stream'},
                                                        function(err, response){
                                                        if(err)return console.log(err);
                                                        response.data.on('error', err => {
                                                            console.log(err);
                                                        }).on('end', ()=>{
                                                            console.log("sent file.")
                                                        })
                                                        .pipe(dest8);
                                                      });
                                                      //zip.file(dest8zip, fs.readFile(dest8file, (err) => {if(err) return console.log(err)}));
                                                    }
                                                    if(level8.type === 'folder') {
                                                      fs.mkdir(level7FolderPath + "/" + level8.name, { recursive: true }, (err) => {if (err) return console.log(err)});
                                                      var level8FolderPath = level7FolderPath + "/" + level8.name;
                                                      var level8ZipPath = zip.folder(level7ZipPath + "/" + level8.name);
                                                      if(level8.children.length != 0) {
                                                        //9
                                                        for(var h = 0; h < level8.children.length; h++) {
                                                          var level9 = level8.children[g];
                                                          if(level9.type != 'folder') {
                                                            var fileId9 = level9.id
                                                            var fileName9 = level9.name
                                                            var type9 = level9.type
                                                            var dest9 = fs.createWriteStream(level8FolderPath + "/" + fileName9 + '.' + type9);
                                                            var dest9file = level8FolderPath + "/" + fileName9 + '.' + type9;
                                                            var dest9zip = level8ZipPath + "/" + fileName9 + '.' + type9;
                                                            var newType9 = ''
                                                            if(type9 === 'docx') {
                                                              newType9 = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                                                            }
                                                            if(type9 === 'pptx') {
                                                              newType9 = 'application/vnd.google-apps.presentation'
                                                            }
                                                            if(type9 === 'xlsx') {
                                                              newType9 === 'application/vnd.google-apps.spreadsheet'
                                                            }
                                                            await drive.files.export({
                                                              fileId: fileId9, mimeType: newType9}, 
                                                              {responseType: 'stream'},
                                                              function(err, response){
                                                              if(err)return console.log(err);
                                                              response.data.on('error', err => {
                                                                  console.log(err);
                                                              }).on('end', ()=>{
                                                                  console.log("sent file.")
                                                              })
                                                              .pipe(dest9);
                                                            });
                                                            //zip.file(dest9zip, fs.readFile(dest9file, (err) => {if(err) return console.log(err)}));
                                                          }
                                                          if(level9.type === 'folder') {
                                                            console.log("maximum file depth reached.")
                                                          }
                                                        } 
                                                      }
                                                    }
                                                  } 
                                                }
                                              }
                                            } 
                                          }
                                        }
                                      } 
                                    }
                                  }
                                } 
                              }
                            }
                          } 
                        }
                      }
                    } 
                  }
                }
              } 
            }
          }
        } 
      }          
    }
  }
  //zip.generateNodeStream({type:'nodebuffer',streamFiles:true})
  //  .pipe(fs.createWriteStream(topFolderPath + '.zip'))
  //  .on('finish', function () {
  //  // JSZip generates a readable stream with a "end" event,
  //  // but is piped here in a writable stream which emits a "finish" event.
  //  console.log("zip file written.");
  //  console.log(topFolderPathZip)
  //});  
})


//Web App Routes

app.post("/accesstoken", (req, res) => {
  const TOKEN_PATH2 = 'tokencode.json';
  var accessToken = req.body.accessToken
  console.log("Something Found.")
  console.log(accessToken);
  fs.writeFile(TOKEN_PATH2, JSON.stringify(accessToken), (err) => {
    if (err) return console.log(err);
    console.log('Token stored to', TOKEN_PATH2);
  })
})

app.get("/drivecall2", (req, res) => {
  const TOKENCODE = 'tokencode.json';
  const TOKEN_PATH2 = 'token2.json';
  console.log("drivecall called.")

  // Load client secrets from a local file.
  fs.readFile('credentials2.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Drive API.
    authorize2(JSON.parse(content), listFiles);
  });

  ///**
  // * Create an OAuth2 client with the given credentials, and then execute the
  // * given callback function.
  // * @param {Object} credentials The authorization client credentials.
  // * @param {function} callback The callback to call with the authorized client.
  // */
  function authorize2(credentials, callback) {
    const {client_secret, client_id, redirect_uris} = credentials.web;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);
    listFiles2(oAuth2Client);
    getAccessToken2(oAuth2Client, listFiles2)
  }

  function getAccessToken2(oAuth2Client, callback) {
    fs.readFile(TOKENCODE, (err, code) => {
      if (err) return console.log("error at reading token " + err);
      oAuth2Client.getToken(JSON.parse(code), (err, token) => {
        console.log(token)
        if (err) return console.error('Error retrieving access token', err);
        oAuth2Client.setCredentials(token);
        //console.log(oAuth2Client);
        callback(oAuth2Client);
        listFiles2(oAuth2Client);
      });
    })
  }

  ///**
  // * Lists the names and IDs of up to 10 files.
  // * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
  // */
  async function listFiles2(auth) {
    const drive = google.drive({ version: "v3", auth });
    app.set("drive2", drive)
    const response = await drive.files.list({
      pageSize: 1000,
      fields: "nextPageToken, files(id, name, mimeType, description, properties, parents)",
      orderBy: "folder"});
    const files = response.data.files;
    //console.log(files)
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
      console.log(fileArray)
      res.send(fileArray)
    }
  }
})



// Extension Routes

app.get('/setchromeoauth', (req, res) => {
  // If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/drive'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'tokenExtension.json';

// Load client secrets from a local file.
fs.readFile('credentials2.json', (err, content) => {
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
  getAccessToken(oAuth2Client, callback);
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
  console.log(authUrl);
  res.send(authUrl);
}
})

app.post("/getchrometoken", (req, res) => {
  const TOKEN_PATH3 = 'tokencode_extension.json';
  const TOKENCODE = 'tokencode_extension.json';
  var accessToken = req.body.accessToken
  console.log(accessToken)
  console.log("Something Found.")
  fs.writeFile(TOKEN_PATH3, JSON.stringify(accessToken), (err) => {
    if (err) return console.log(err);
    console.log('Token stored to', TOKEN_PATH3);
  })

  // Load client secrets from a local file.
  fs.readFile('credentials2.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Drive API.
    authorize3(JSON.parse(content), listFiles3);
  });

  ///**
  // * Create an OAuth2 client with the given credentials, and then execute the
  // * given callback function.
  // * @param {Object} credentials The authorization client credentials.
  // * @param {function} callback The callback to call with the authorized client.
  // */
  function authorize3(credentials, callback) {
    const {client_secret, client_id, redirect_uris} = credentials.web;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);
    listFiles3(oAuth2Client);
    getAccessToken3(oAuth2Client, listFiles3)
  }

  function getAccessToken3(oAuth2Client, callback) {
    fs.readFile(TOKENCODE, (err, code) => {
      if (err) return console.log("Error at fs read: " + err);
      oAuth2Client.getToken(JSON.parse(code), (err, token) => {
        if (err) return console.error('Error retrieving access token', err);
        oAuth2Client.setCredentials(token);
        // Store the token to disk for later program executions
        fs.writeFile(TOKEN_PATH3, JSON.stringify(token), (err) => {
          if (err) return console.error(err);
          console.log('Token stored to', TOKEN_PATH3);
        });
        //console.log(oAuth2Client);
        callback(oAuth2Client);
        listFiles3(oAuth2Client);
      });
    })
  }

  ///**
  // * Lists the names and IDs of up to 10 files.
  // * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
  // */
  async function listFiles3(auth) {
    const drive = google.drive({ version: "v3", auth });
    app.set("drive3", drive)
    const response = await drive.files.list({
      pageSize: 1000,
      fields: "nextPageToken, files(id, name, mimeType, description, properties, parents)",
      orderBy: "folder"});
    const files = response.data.files;
    //console.log(files)
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
      console.log(fileArray)
      res.send(fileArray)
    }
  }

})

app.get("/drivecall3", (req, res) => {
  const SCOPES3 = ['https://www.googleapis.com/auth/drive'];
  const TOKENCODE = 'tokencode_extension.json';
  const TOKEN_PATH3 = 'token3.json';
  console.log("drivecall called.")

  // Load client secrets from a local file.
  fs.readFile('credentials2.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Drive API.
    authorize3(JSON.parse(content), listFiles3);
  });

  ///**
  // * Create an OAuth2 client with the given credentials, and then execute the
  // * given callback function.
  // * @param {Object} credentials The authorization client credentials.
  // * @param {function} callback The callback to call with the authorized client.
  // */
  function authorize3(credentials, callback) {
    const {client_secret, client_id, redirect_uris} = credentials.web;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);
    listFiles3(oAuth2Client);
    getAccessToken3(oAuth2Client, listFiles3)
  }

  function getAccessToken3(oAuth2Client, callback) {
    fs.readFile(TOKENCODE, (err, code) => {
      if (err) return console.log("Error at fs read: " + err);
      oAuth2Client.getToken(JSON.parse(code), (err, token) => {
        if (err) return console.error('Error retrieving access token', err);
        oAuth2Client.setCredentials(token);
        // Store the token to disk for later program executions
        fs.writeFile(TOKEN_PATH3, JSON.stringify(token), (err) => {
          if (err) return console.error(err);
          console.log('Token stored to', TOKEN_PATH3);
        });
        //console.log(oAuth2Client);
        callback(oAuth2Client);
        listFiles3(oAuth2Client);
      });
    })
  }

  ///**
  // * Lists the names and IDs of up to 10 files.
  // * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
  // */
  async function listFiles3(auth) {
    const drive = google.drive({ version: "v3", auth });
    app.set("drive3", drive)
    const response = await drive.files.list({
      pageSize: 1000,
      fields: "nextPageToken, files(id, name, mimeType, description, properties, parents)",
      orderBy: "folder"});
    const files = response.data.files;
    //console.log(files)
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
      console.log(fileArray)
      res.send(fileArray)
    }
  }
})

// Push To Drive 

  // Web App Push 

app.post('/classroomexport', async (req, res) => {
  const files = req.body.fileArray;
  console.log(files)
  const parentFolder = req.body.parentId;
  function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }
  const drive = req.app.get('drive2');
  for(var i = 0; i < files.length; i++) {
    if (files[i].type != "folder") {
      const fileName = files[i].name;
      const type = files[i].type;
      const description = files[i].description;
      let newType = ''
      if(type === 'docx') {
        newType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      }
      if(type === 'pptx') {
        newType = 'application/vnd.google-apps.presentation'
      }
      if(type === 'xlsx') {
        newType === 'application/vnd.google-apps.spreadsheet'
      }

      const destSimple = './src/Pages/downloads/' + fileName + '.' + type;
      console.log(destSimple)

      let newId = ''

      var fileMetadata = {
        'name': fileName,
        'description': description,
        'parents': [parentFolder]
      };
      console.log(fileMetadata)
      var media = {
        mimeType: newType,
        body: fs.createReadStream(destSimple)
      };
      console.log("This is the body of topfile " + media)
      await drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id'
      }, function (err, file) {
        if (err) {
          console.log("Error for file creation: " + err);
        } else {
          console.log(file);
          newId = file.id;
        }
      });
      var result = "classroom export complete!"
      app.set('result', result)
    }
    if(files[i].type === "folder") {
      const fileName = files[i].name;
      const description = files[i].description;
      let newType = 'application/vnd.google-apps.folder'

      const destSimple = './src/Pages/downloads/' + fileName;
    
      var fileMetadata = {
        'name': fileName,
        'description': description,
        'parents': [parentFolder],
        'mimeType': newType,
      };
      function driveCreateFolder() {
        return new Promise(function (resolve, reject) { 
          drive.files.create({
            resource: fileMetadata,
            fields: 'id',
          }, function (err, file) {
            if (err) {
              console.log("Error for file creation: " + err);
            } else {
              console.log(file)
              var newIdFolderIn = file.data.id;
              resolve(app.set('newIdFolder', newIdFolderIn));
              console.log("This is the top folder id = " + file.data.id)
            }
          });
        })
      }
      await driveCreateFolder();
      var result = "classroom export complete!"
      app.set('result', result)
      sleep(2000);
      //1
      for(var y = 0; y < files[i].children.length; y++) {
        const level1 = files[i].children[y]; 
        var newIdFolder = req.app.get('newIdFolder');
        if (level1.type != "folder") {
          const fileName1 = level1.name;
          const type1 = level1.type;
          const description1 = level1.description;
          console.log("top folder id in function = " + newIdFolder)
          let newType1 = ''
          if(type1 === 'docx') {
            newType1 = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          }
          if(type1 === 'pptx') {
            newType1 = 'application/vnd.google-apps.presentation'
          }
          if(type1 === 'xlsx') {
            newType1 === 'application/vnd.google-apps.spreadsheet'
          }
    
          const destSimple1 = destSimple + '/' + fileName1 + '.' + type1;
          console.log("This is the first destination: " + destSimple1)
    
          let newId1 = ''
    
          var fileMetadata1 = {
            'name': fileName1,
            'description': description1,
            'parents': [newIdFolder]
          };
          console.log("This is the file metadata for level1 files: " + fileMetadata1)
          var media1 = {
            mimeType: newType1,
            body: fs.createReadStream(destSimple1)
          };
          console.log("This is the body for level1 files: " + media1)
          drive.files.create({
            resource: fileMetadata1,
            media: media1,
            fields: 'id'
          }, function (err, file) {
            if (err) {
              console.log("Error for file creation at 1195: " + err);
            } else {
              //console.log(file);
              newId1 = file.id;
            }
          });
          var result = "classroom export complete!"
          app.set('result', result)
        }
        if(level1.type === "folder") {
          const fileName1 = level1.name;
          const description1 = level1.description;
          let newType = 'application/vnd.google-apps.folder'
        
          var fileMetadata1 = {
            'name': fileName1,
            'description': description1,
            'parents': [newIdFolder],
            'mimeType': newType,
          };
          function driveCreateFolder1() {
            return new Promise(function (resolve, reject) { 
              drive.files.create({
                resource: fileMetadata1,
                fields: 'id',
              }, function (err, file) {
                if (err) {
                  console.log("Error for file creation: " + err);
                } else {
                  console.log(file)
                  var newIdFolderIn1 = file.data.id;
                  resolve(app.set('newIdFolder1', newIdFolderIn1));
                }
              });
            })
          }
          await driveCreateFolder1();
          var result = "classroom export complete!"
          app.set('result', result)
          sleep(2000);
          //2
          for(var a = 0; a < level1.children.length; a++) {
            const level2 = level1.children[a]; 
            var newIdFolder1 = req.app.get('newIdFolder1');
            if (level2.type != "folder") {
              const fileName2 = level2.name;
              const type2 = level2.type;
              const description2 = level2.description;
              let newType2 = ''
              if(type2 === 'docx') {
                newType2 = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
              }
              if(type2 === 'pptx') {
                newType2 = 'application/vnd.google-apps.presentation'
              }
              if(type2 === 'xlsx') {
                newType2 === 'application/vnd.google-apps.spreadsheet'
              }
        
              const destSimple2 = destSimple1 + '/' + fileName2 + '.' + type2;
        
              let newId2 = ''
        
              var fileMetadata2 = {
                'name': fileName2,
                'description': description2,
                'parents': [newIdFolder1]
              };
              console.log(fileMetadata)
              var media2 = {
                mimeType: newType2,
                body: fs.createReadStream(destSimple2, (err) => {if(err) return console.log(err)})
              };
              console.log(media)
              await drive.files.create({
                resource: fileMetadata2,
                media: media2,
                fields: 'id'
              }, function (err, file) {
                if (err) {
                  console.log("Error for file creation: " + err);
                } else {
                  console.log(file.id);
                  newId2 = file.id;
                }
              });
              var result = "classroom export complete!"
              app.set('result', result)
            }
            if(level2.type === "folder") {
              const fileName2 = level2.name;
              const description2 = level2.description;
              let newType2 = 'application/vnd.google-apps.folder'
            
              var fileMetadata2 = {
                'name': fileName2,
                'description': description2,
                'parents': [newIdFolder1],
                'mimeType': newType2,
              };
              function driveCreateFolder2() {
                return new Promise(function (resolve, reject) { 
                  drive.files.create({
                    resource: fileMetadata2,
                    fields: 'id',
                  }, function (err, file) {
                    if (err) {
                      console.log("Error for file creation: " + err);
                    } else {
                      console.log(file)
                      var newIdFolderIn2 = file.data.id;
                      resolve(app.set('newIdFolder2', newIdFolderIn2));
                    }
                  });
                })
              }
              await driveCreateFolder2();
              var result = "classroom export complete!"
              app.set('result', result)
              sleep(2000);
              if(level2.children != []) {
                //3
                for(var b = 0; b < level2.children.length; b++) {
                  const level3 = level2.children[b]; 
                  var newIdFolder2 = req.app.get('newIdFolder2');
                  if (level3.type != "folder") {
                    const fileName3 = level3.name;
                    const type3 = level3.type;
                    const description3 = level3.description;
                    let newType3 = ''
                    if(type3 === 'docx') {
                      newType3 = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                    }
                    if(type3 === 'pptx') {
                      newType3 = 'application/vnd.google-apps.presentation'
                    }
                    if(type3 === 'xlsx') {
                      newType3 === 'application/vnd.google-apps.spreadsheet'
                    }
              
                    const destSimple3 = destSimple2 + '/' + fileName3 + '.' + type3;
              
                    let newId3 = ''
              
                    var fileMetadata3 = {
                      'name': fileName3,
                      'description': description3,
                      'parents': [newIdFolder2]
                    };
                    console.log(fileMetadata)
                    var media3 = {
                      mimeType: newType3,
                      body: fs.createReadStream(destSimple3, (err) => {if(err) return console.log(err)})
                    };
                    console.log(media)
                    await drive.files.create({
                      resource: fileMetadata3,
                      media: media3,
                      fields: 'id'
                    }, function (err, file) {
                      if (err) {
                        console.log("Error for file creation: " + err);
                      } else {
                        console.log(file.id);
                        newId3 = file.id;
                      }
                    });
                    var result = "classroom export complete!"
                    app.set('result', result)
                  }
                  if(level3.type === "folder") {
                    const fileName3 = level3.name;
                    const description3 = level3.description;
                    let newType3 = 'application/vnd.google-apps.folder'
                  
                    var fileMetadata3 = {
                      'name': fileName3,
                      'description': description3,
                      'parents': [newIdFolder2],
                      'mimeType': newType3,
                    };
                    function driveCreateFolder3() {
                      return new Promise(function (resolve, reject) { 
                        drive.files.create({
                          resource: fileMetadata3,
                          fields: 'id',
                        }, function (err, file) {
                          if (err) {
                            console.log("Error for file creation: " + err);
                          } else {
                            var newIdFolderIn3 = file.data.id;
                            resolve(app.set('newIdFolder3', newIdFolderIn3));
                          }
                        });
                      })
                    }
                    await driveCreateFolder3();
                    var result = "classroom export complete!"
                    app.set('result', result)
                    sleep(2000);
                    if(level3.children != []) {
                      //4
                      for(var c = 0; c < level3.children.length; c++) {
                        const level14 = level3.children[c]; 
                        var newIdFolder3 = req.app.get('newIdFolder3');
                        if (level4.type != "folder") {
                          const fileName4 = level4.name;
                          const type4 = level4.type;
                          const description4 = level4.description;
                          let newType4 = ''
                          if(type4 === 'docx') {
                            newType4 = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                          }
                          if(type4 === 'pptx') {
                            newType4 = 'application/vnd.google-apps.presentation'
                          }
                          if(type4 === 'xlsx') {
                            newType4 === 'application/vnd.google-apps.spreadsheet'
                          }
                    
                          const destSimple4 = destSimple3 + "/" + fileName4 + '.' + type4;
                    
                          let newId4 = ''
                    
                          var fileMetadata4 = {
                            'name': fileName4,
                            'description': description4,
                            'parents': [newIdFolder3]
                          };
                          console.log(fileMetadata)
                          var media4 = {
                            mimeType: newType4,
                            body: fs.createReadStream(destSimple4, (err) => {if(err) return console.log(err)})
                          };
                          console.log(media)
                          await drive.files.create({
                            resource: fileMetadata4,
                            media: media4,
                            fields: 'id'
                          }, function (err, file) {
                            if (err) {
                              console.log("Error for file creation: " + err);
                            } else {
                              console.log(file.id);
                              newId4 = file.id;
                            }
                          });
                          var result = "classroom export complete!"
                          app.set('result', result)
                        }
                        if(level4.type === "folder") {
                          const fileName4 = level4.name;
                          const description4 = level4.description;
                          let newType4 = 'application/vnd.google-apps.folder'
                        
                          var fileMetadata4 = {
                            'name': fileName4,
                            'description': description4,
                            'parents': [newIdFolder3],
                            'mimeType': newType4,
                          };
                          function driveCreateFolder4() {
                            return new Promise(function (resolve, reject) { 
                              drive.files.create({
                                resource: fileMetadata4,
                                fields: 'id',
                              }, function (err, file) {
                                if (err) {
                                  console.log("Error for file creation: " + err);
                                } else {
                                  var newIdFolderIn4 = file.data.id;
                                  resolve(app.set('newIdFolder4', newIdFolderIn4));
                                }
                              });
                            })
                          }
                          await driveCreateFolder4();
                          var result = "classroom export complete!"
                          app.set('result', result)
                          sleep(2000);
                          if(level4.children != []) {
                            //5
                            for(var d = 0; d < level4.children.length; d++) {
                              const level5 = level4.children[d]; 
                              var newIdFolder4 = req.app.get('newIdFolder4');
                              if (level5.type != "folder") {
                                const fileName5 = level5.name;
                                const type5 = level5.type;
                                const description5 = level5.description;
                                let newType5 = ''
                                if(type5 === 'docx') {
                                  newType5 = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                                }
                                if(type5 === 'pptx') {
                                  newType5 = 'application/vnd.google-apps.presentation'
                                }
                                if(type5 === 'xlsx') {
                                  newType5 === 'application/vnd.google-apps.spreadsheet'
                                }
                          
                                const destSimple5 = destSimple4 + "/" + fileName5 + '.' + type5;
                          
                                let newId5 = ''
                          
                                var fileMetadata5 = {
                                  'name': fileName5,
                                  'description': description5,
                                  'parents': [newIdFolder4]
                                };
                                console.log(fileMetadata)
                                var media5 = {
                                  mimeType: newType5,
                                  body: fs.createReadStream(destSimple5, (err) => {if(err) return console.log(err)})
                                };
                                console.log(media)
                                await drive.files.create({
                                  resource: fileMetadata5,
                                  media: media5,
                                  fields: 'id'
                                }, function (err, file) {
                                  if (err) {
                                    console.log("Error for file creation: " + err);
                                  } else {
                                    console.log(file.id);
                                    newId5 = file.id;
                                  }
                                });
                                var result = "classroom export complete!"
                                app.set('result', result)
                              }
                              if(level5.type === "folder") {
                                const fileName5 = level5.name;
                                const description5 = level5.description;
                                let newType5 = 'application/vnd.google-apps.folder'
                              
                                var fileMetadata5 = {
                                  'name': fileName5,
                                  'description': description5,
                                  'parents': [newIdFolder4],
                                  'mimeType': newType5,
                                };
                                function driveCreateFolder5() {
                                  return new Promise(function (resolve, reject) { 
                                    drive.files.create({
                                      resource: fileMetadata5,
                                      fields: 'id',
                                    }, function (err, file) {
                                      if (err) {
                                        console.log("Error for file creation: " + err);
                                      } else {
                                        var newIdFolderIn5 = file.data.id;
                                        resolve(app.set('newIdFolder5', newIdFolderIn5));
                                      }
                                    });
                                  })
                                }
                                await driveCreateFolder5();
                                var result = "classroom export complete!"
                                app.set('result', result)
                                sleep(2000);
                                if(level5.children != []) {
                                  //6
                                  for(var e = 0; e < level5.children.length; e++) {
                                    const level6 = level5.children[e]; 
                                    var newIdFolder5 = req.app.get('newIdFolder5');
                                    if (level6.type != "folder") {
                                      const fileName6 = level6.name;
                                      const type6 = level6.type;
                                      const description6 = level6.description;
                                      let newType6 = ''
                                      if(type6 === 'docx') {
                                        newType6 = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                                      }
                                      if(type6 === 'pptx') {
                                        newType6 = 'application/vnd.google-apps.presentation'
                                      }
                                      if(type6 === 'xlsx') {
                                        newType6 === 'application/vnd.google-apps.spreadsheet'
                                      }
                                
                                      const destSimple6 = destSimple5 + "/" + fileName6 + '.' + type6;
                                
                                      let newId6 = ''
                                
                                      var fileMetadata6 = {
                                        'name': fileName6,
                                        'description': description6,
                                        'parents': [newIdFolder5]
                                      };
                                      console.log(fileMetadata)
                                      var media6 = {
                                        mimeType: newType6,
                                        body: fs.createReadStream(destSimple6, (err) => {if(err) return console.log(err)})
                                      };
                                      console.log(media)
                                      await drive.files.create({
                                        resource: fileMetadata6,
                                        media: media6,
                                        fields: 'id'
                                      }, function (err, file) {
                                        if (err) {
                                          console.log("Error for file creation: " + err);
                                        } else {
                                          console.log(file.id);
                                          newId6 = file.id;
                                        }
                                      });
                                      var result = "classroom export complete!"
                                      app.set('result', result)
                                    }
                                    if(level6.type === "folder") {
                                      const fileName6 = level6.name;
                                      const description6 = level6.description;
                                      let newType6 = 'application/vnd.google-apps.folder'
                                    
                                      var fileMetadata6 = {
                                        'name': fileName6,
                                        'description': description6,
                                        'parents': [newIdFolder5],
                                        'mimeType': newType6,
                                      };
                                      function driveCreateFolder6() {
                                        return new Promise(function (resolve, reject) { 
                                          drive.files.create({
                                            resource: fileMetadata6,
                                            fields: 'id',
                                          }, function (err, file) {
                                            if (err) {
                                              console.log("Error for file creation: " + err);
                                            } else {
                                              var newIdFolderIn6 = file.data.id;
                                              resolve(app.set('newIdFolder6', newIdFolderIn6));
                                            }
                                          });
                                        })
                                      }
                                      await driveCreateFolder6();
                                      var result = "classroom export complete!"
                                      app.set('result', result)
                                      sleep(2000);
                                      if(level6.children != []) {
                                        //7
                                        for(var f = 0; f < level6.children.length; f++) {
                                          const level7 = level6.children[f]; 
                                          var newIdFolder6 = req.app.get('newIdFolder6');
                                          if (level7.type != "folder") {
                                            const fileName7 = level7.name;
                                            const type7 = level7.type;
                                            const description7 = level7.description;
                                            let newType7 = ''
                                            if(type7 === 'docx') {
                                              newType7 = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                                            }
                                            if(type7 === 'pptx') {
                                              newType7 = 'application/vnd.google-apps.presentation'
                                            }
                                            if(type7 === 'xlsx') {
                                              newType7 === 'application/vnd.google-apps.spreadsheet'
                                            }
                                      
                                            const destSimple7 = destSimple6 + "/" + fileName7 + '.' + type7;
                                      
                                            let newId7 = ''
                                      
                                            var fileMetadata7 = {
                                              'name': fileName7,
                                              'description': description7,
                                              'parents': [newIdFolder6]
                                            };
                                            console.log(fileMetadata)
                                            var media7 = {
                                              mimeType: newType7,
                                              body: fs.createReadStream(destSimple7, (err) => {if(err) return console.log(err)})
                                            };
                                            console.log(media)
                                            await drive.files.create({
                                              resource: fileMetadata7,
                                              media: media7,
                                              fields: 'id'
                                            }, function (err, file) {
                                              if (err) {
                                                console.log("Error for file creation: " + err);
                                              } else {
                                                console.log(file.id);
                                                newId7 = file.id;
                                              }
                                            });
                                            var result = "classroom export complete!"
                                            app.set('result', result)
                                          }
                                          if(level7.type === "folder") {
                                            const fileName7 = level7.name;
                                            const description7 = level7.description;
                                            let newType7 = 'application/vnd.google-apps.folder'
                                          
                                            var fileMetadata7 = {
                                              'name': fileName7,
                                              'description': description7,
                                              'parents': [newIdFolder6],
                                              'mimeType': newType7,
                                            };
                                            function driveCreateFolder7() {
                                              return new Promise(function (resolve, reject) { 
                                                drive.files.create({
                                                  resource: fileMetadata7,
                                                  fields: 'id',
                                                }, function (err, file) {
                                                  if (err) {
                                                    console.log("Error for file creation: " + err);
                                                  } else {
                                                    var newIdFolderIn7 = file.data.id;
                                                    resolve(app.set('newIdFolder7', newIdFolderIn7));
                                                  }
                                                });
                                              })
                                            }
                                            await driveCreateFolder7();
                                            var result = "classroom export complete!"
                                            app.set('result', result)
                                            sleep(2000);
                                            if(level7.children != []) {
                                              //8
                                              for(var g = 0; g < level7.children.length; g++) {
                                                const level8 = level7.children[g];
                                                var newIdFolder7 = req.app.get('newIdFolder7'); 
                                                if (level8.type != "folder") {
                                                  const fileName8 = level8.name;
                                                  const type8 = level8.type;
                                                  const description8 = level8.description;
                                                  let newType8 = ''
                                                  if(type8 === 'docx') {
                                                    newType8 = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                                                  }
                                                  if(type8 === 'pptx') {
                                                    newType8 = 'application/vnd.google-apps.presentation'
                                                  }
                                                  if(type8 === 'xlsx') {
                                                    newType8 === 'application/vnd.google-apps.spreadsheet'
                                                  }
                                            
                                                  const destSimple8 = destSimple7 + "/" + fileName8 + '.' + type8;
                                            
                                                  let newId8 = ''
                                            
                                                  var fileMetadata8 = {
                                                    'name': fileName8,
                                                    'description': description8,
                                                    'parents': [newIdFolder7]
                                                  };
                                                  console.log(fileMetadata)
                                                  var media8 = {
                                                    mimeType: newType8,
                                                    body: fs.createReadStream(destSimple8, (err) => {if(err) return console.log(err)})
                                                  };
                                                  console.log(media)
                                                  await drive.files.create({
                                                    resource: fileMetadata8,
                                                    media: media8,
                                                    fields: 'id'
                                                  }, function (err, file) {
                                                    if (err) {
                                                      console.log("Error for file creation: " + err);
                                                    } else {
                                                      console.log(file.id);
                                                      newId8 = file.id;
                                                    }
                                                  });
                                                  var result = "classroom export complete!"
                                                  app.set('result', result)
                                                }
                                                if(level8.type === "folder") {
                                                  const fileName8 = level8.name;
                                                  const description8 = level8.description;
                                                  let newType8 = 'application/vnd.google-apps.folder'
                                                
                                                  var fileMetadata8 = {
                                                    'name': fileName8,
                                                    'description': description8,
                                                    'parents': [newIdFolder7],
                                                    'mimeType': newType8,
                                                  };
                                                  function driveCreateFolder8() {
                                                    return new Promise(function (resolve, reject) { 
                                                      drive.files.create({
                                                        resource: fileMetadata8,
                                                        fields: 'id',
                                                      }, function (err, file) {
                                                        if (err) {
                                                          console.log("Error for file creation: " + err);
                                                        } else {
                                                          var newIdFolderIn8 = file.data.id;
                                                          resolve(app.set('newIdFolder8', newIdFolderIn8));
                                                        }
                                                      });
                                                    })
                                                  }
                                                  await driveCreateFolder8();
                                                  var result = "classroom export complete!"
                                                  app.set('result', result)
                                                  sleep(2000);
                                                  if(level8.children != []) {
                                                    //9
                                                    for(var h = 0; h < level8.children.length; h++) {
                                                      const level9 = level8.children[h]; 
                                                      var newIdFolder8 = req.app.get('newIdFolder8');
                                                      if (level9.type != "folder") {
                                                        const fileName9 = level9.name;
                                                        const type9 = level9.type;
                                                        const description9 = level9.description;
                                                        let newType9 = ''
                                                        if(type9 === 'docx') {
                                                          newType9 = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                                                        }
                                                        if(type9 === 'pptx') {
                                                          newType9 = 'application/vnd.google-apps.presentation'
                                                        }
                                                        if(type9 === 'xlsx') {
                                                          newType9 === 'application/vnd.google-apps.spreadsheet'
                                                        }
                                                  
                                                        const destSimple9 = destSimple8 + "/" + fileName9 + '.' + type9;
                                                  
                                                        let newId9 = ''
                                                  
                                                        var fileMetadata9 = {
                                                          'name': fileName9,
                                                          'description': description9,
                                                          'parents': [newIdFolder8]
                                                        };
                                                        console.log(fileMetadata)
                                                        var media9 = {
                                                          mimeType: newType9,
                                                          body: fs.createReadStream(destSimple9, (err) => {if(err) return console.log(err)})
                                                        };
                                                        console.log(media)
                                                        await drive.files.create({
                                                          resource: fileMetadata9,
                                                          media: media9,
                                                          fields: 'id'
                                                        }, function (err, file) {
                                                          if (err) {
                                                            console.log("Error for file creation: " + err);
                                                          } else {
                                                            console.log(file.id);
                                                            newId9 = file.id;
                                                          }
                                                        });
                                                        var result = "classroom export complete!"
                                                        app.set('result', result)
                                                      }
                                                      if(level9.type === "folder") {
                                                        const fileName9 = level9.name;
                                                        const description9 = level9.description;
                                                        let newType9 = 'application/vnd.google-apps.folder'
                                                      
                                                        var fileMetadata9 = {
                                                          'name': fileName9,
                                                          'description': description9,
                                                          'parents': [newIdFolder8],
                                                          'mimeType': newType9,
                                                        };
                                                        function driveCreateFolder9() {
                                                          return new Promise(function (resolve, reject) { 
                                                            drive.files.create({
                                                              resource: fileMetadata9,
                                                              fields: 'id',
                                                            }, function (err, file) {
                                                              if (err) {
                                                                console.log("Error for file creation: " + err);
                                                              } else {
                                                                var newIdFolderIn9 = file.data.id;
                                                                resolve(app.set('newIdFolder9', newIdFolderIn9));
                                                              }
                                                            });
                                                          })
                                                        }
                                                        await driveCreateFolder9();
                                                        var result = "classroom export complete!"
                                                        app.set('result', result)
                                                        if(level9.children != []) {
                                                          console.log("maximum file depth reached.")
                                                        } 
                                                      }
                                                    }
                                                  } 
                                                }
                                              }
                                            } 
                                          }
                                        }
                                      } 
                                    }
                                  }
                                } 
                              }
                            }
                          } 
                        }
                      }
                    } 
                  }
                }
              } 
            }
          } 
        }
      } 
    }
  }
})

app.get('/exportresult', (req, res) => {
  const exportresult = req.app.get('exportresult');
  res.send(exportresult);
})

// Extension Push

app.post('/classroomexport2', async (req, res) => {
  const files = req.body.fileArray;
  console.log("these are the files for export: " + files[0].children[0] + files[0].children[1] + files[0].children[2] + files[0].children[3])
  const parentFolder = req.body.parentId;
  function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }
  const drive = req.app.get('drive3');
  for(var i = 0; i < files.length; i++) {
    if (files[i].type != "folder") {
      const fileName = files[i].name;
      const type = files[i].type;
      const description = files[i].description;
      let newType = ''
      if(type === 'docx') {
        newType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      }
      if(type === 'pptx') {
        newType = 'application/vnd.google-apps.presentation'
      }
      if(type === 'xlsx') {
        newType === 'application/vnd.google-apps.spreadsheet'
      }

      const destSimple = './src/Pages/downloads/' + fileName + '.' + type;
      console.log(destSimple)

      let newId = ''

      var fileMetadata = {
        'name': fileName,
        'description': description,
        'parents': [parentFolder]
      };
      console.log(fileMetadata)
      var media = {
        mimeType: newType,
        body: fs.createReadStream(destSimple)
      };
      console.log("This is the body of topfile " + media)
      await drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id'
      }, function (err, file) {
        if (err) {
          console.log("Error for file creation: " + err);
        } else {
          console.log(file);
          newId = file.id;
        }
      });
    }
    if(files[i].type === "folder") {
      const fileName = files[i].name;
      const description = files[i].description;
      let newType = 'application/vnd.google-apps.folder'

      const destSimple = './src/Pages/downloads/' + fileName;
    
      var fileMetadata = {
        'name': fileName,
        'description': description,
        'parents': [parentFolder],
        'mimeType': newType,
      };
      function driveCreateFolder() {
        return new Promise(function (resolve, reject) { 
          drive.files.create({
            resource: fileMetadata,
            fields: 'id',
          }, function (err, file) {
            if (err) {
              console.log("Error for file creation: " + err);
            } else {
              console.log(file)
              var newIdFolderIn = file.data.id;
              resolve(app.set('newIdFolder', newIdFolderIn));
              console.log("This is the top folder id = " + file.data.id)
            }
          });
        })
      }
      await driveCreateFolder();
      sleep(2000);
      //1
      for(var y = 0; y < files[i].children.length; y++) {
        const level1 = files[i].children[y]; 
        var newIdFolder = req.app.get('newIdFolder');
        if (level1.type != "folder") {
          const fileName1 = level1.name;
          const type1 = level1.type;
          const description1 = level1.description;
          console.log("top folder id in function = " + newIdFolder)
          let newType1 = ''
          if(type1 === 'docx') {
            newType1 = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          }
          if(type1 === 'pptx') {
            newType1 = 'application/vnd.google-apps.presentation'
          }
          if(type1 === 'xlsx') {
            newType1 === 'application/vnd.google-apps.spreadsheet'
          }
    
          const destSimple1 = destSimple + '/' + fileName1 + '.' + type1;
          console.log("This is the first destination: " + destSimple1)
    
          let newId1 = ''
    
          var fileMetadata1 = {
            'name': fileName1,
            'description': description1,
            'parents': [newIdFolder]
          };
          console.log("This is the file metadata for level1 files: " + fileMetadata1)
          var media1 = {
            mimeType: newType1,
            body: fs.createReadStream(destSimple1)
          };
          console.log("This is the body for level1 files: " + media1)
          drive.files.create({
            resource: fileMetadata1,
            media: media1,
            fields: 'id'
          }, function (err, file) {
            if (err) {
              console.log("Error for file creation at 1195: " + err);
            } else {
              //console.log(file);
              newId1 = file.id;
            }
          });
        }
        if(level1.type === "folder") {
          const fileName1 = level1.name;
          const description1 = level1.description;
          let newType = 'application/vnd.google-apps.folder'
        
          var fileMetadata1 = {
            'name': fileName1,
            'description': description1,
            'parents': [newIdFolder],
            'mimeType': newType,
          };
          function driveCreateFolder1() {
            return new Promise(function (resolve, reject) { 
              drive.files.create({
                resource: fileMetadata1,
                fields: 'id',
              }, function (err, file) {
                if (err) {
                  console.log("Error for file creation: " + err);
                } else {
                  console.log(file)
                  var newIdFolderIn1 = file.data.id;
                  resolve(app.set('newIdFolder1', newIdFolderIn1));
                }
              });
            })
          }
          await driveCreateFolder1();
          sleep(2000);
          //2
          for(var a = 0; a < level1.children.length; a++) {
            const level2 = level1.children[a]; 
            var newIdFolder1 = req.app.get('newIdFolder1');
            if (level2.type != "folder") {
              const fileName2 = level2.name;
              const type2 = level2.type;
              const description2 = level2.description;
              let newType2 = ''
              if(type2 === 'docx') {
                newType2 = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
              }
              if(type2 === 'pptx') {
                newType2 = 'application/vnd.google-apps.presentation'
              }
              if(type2 === 'xlsx') {
                newType2 === 'application/vnd.google-apps.spreadsheet'
              }
        
              const destSimple2 = destSimple1 + '/' + fileName2 + '.' + type2;
        
              let newId2 = ''
        
              var fileMetadata2 = {
                'name': fileName2,
                'description': description2,
                'parents': [newIdFolder1]
              };
              console.log(fileMetadata)
              var media2 = {
                mimeType: newType2,
                body: fs.createReadStream(destSimple2, (err) => {if(err) return console.log(err)})
              };
              console.log(media)
              await drive.files.create({
                resource: fileMetadata2,
                media: media2,
                fields: 'id'
              }, function (err, file) {
                if (err) {
                  console.log("Error for file creation: " + err);
                } else {
                  console.log(file.id);
                  newId2 = file.id;
                }
              });
            }
            if(level2.type === "folder") {
              const fileName2 = level2.name;
              const description2 = level2.description;
              let newType2 = 'application/vnd.google-apps.folder'
            
              var fileMetadata2 = {
                'name': fileName2,
                'description': description2,
                'parents': [newIdFolder1],
                'mimeType': newType2,
              };
              function driveCreateFolder2() {
                return new Promise(function (resolve, reject) { 
                  drive.files.create({
                    resource: fileMetadata2,
                    fields: 'id',
                  }, function (err, file) {
                    if (err) {
                      console.log("Error for file creation: " + err);
                    } else {
                      console.log(file)
                      var newIdFolderIn2 = file.data.id;
                      resolve(app.set('newIdFolder2', newIdFolderIn2));
                    }
                  });
                })
              }
              await driveCreateFolder2();
              sleep(2000);
              if(level2.children != []) {
                //3
                for(var b = 0; b < level2.children.length; b++) {
                  const level3 = level2.children[b]; 
                  var newIdFolder2 = req.app.get('newIdFolder2');
                  if (level3.type != "folder") {
                    const fileName3 = level3.name;
                    const type3 = level3.type;
                    const description3 = level3.description;
                    let newType3 = ''
                    if(type3 === 'docx') {
                      newType3 = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                    }
                    if(type3 === 'pptx') {
                      newType3 = 'application/vnd.google-apps.presentation'
                    }
                    if(type3 === 'xlsx') {
                      newType3 === 'application/vnd.google-apps.spreadsheet'
                    }
              
                    const destSimple3 = destSimple2 + '/' + fileName3 + '.' + type3;
              
                    let newId3 = ''
              
                    var fileMetadata3 = {
                      'name': fileName3,
                      'description': description3,
                      'parents': [newIdFolder2]
                    };
                    console.log(fileMetadata)
                    var media3 = {
                      mimeType: newType3,
                      body: fs.createReadStream(destSimple3, (err) => {if(err) return console.log(err)})
                    };
                    console.log(media)
                    await drive.files.create({
                      resource: fileMetadata3,
                      media: media3,
                      fields: 'id'
                    }, function (err, file) {
                      if (err) {
                        console.log("Error for file creation: " + err);
                      } else {
                        console.log(file.id);
                        newId3 = file.id;
                      }
                    });
                  }
                  if(level3.type === "folder") {
                    const fileName3 = level3.name;
                    const description3 = level3.description;
                    let newType3 = 'application/vnd.google-apps.folder'
                  
                    var fileMetadata3 = {
                      'name': fileName3,
                      'description': description3,
                      'parents': [newIdFolder2],
                      'mimeType': newType3,
                    };
                    function driveCreateFolder3() {
                      return new Promise(function (resolve, reject) { 
                        drive.files.create({
                          resource: fileMetadata3,
                          fields: 'id',
                        }, function (err, file) {
                          if (err) {
                            console.log("Error for file creation: " + err);
                          } else {
                            var newIdFolderIn3 = file.data.id;
                            resolve(app.set('newIdFolder3', newIdFolderIn3));
                          }
                        });
                      })
                    }
                    await driveCreateFolder3();
                    sleep(2000);
                    if(level3.children != []) {
                      //4
                      for(var c = 0; c < level3.children.length; c++) {
                        const level14 = level3.children[c]; 
                        var newIdFolder3 = req.app.get('newIdFolder3');
                        if (level4.type != "folder") {
                          const fileName4 = level4.name;
                          const type4 = level4.type;
                          const description4 = level4.description;
                          let newType4 = ''
                          if(type4 === 'docx') {
                            newType4 = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                          }
                          if(type4 === 'pptx') {
                            newType4 = 'application/vnd.google-apps.presentation'
                          }
                          if(type4 === 'xlsx') {
                            newType4 === 'application/vnd.google-apps.spreadsheet'
                          }
                    
                          const destSimple4 = destSimple3 + "/" + fileName4 + '.' + type4;
                    
                          let newId4 = ''
                    
                          var fileMetadata4 = {
                            'name': fileName4,
                            'description': description4,
                            'parents': [newIdFolder3]
                          };
                          console.log(fileMetadata)
                          var media4 = {
                            mimeType: newType4,
                            body: fs.createReadStream(destSimple4, (err) => {if(err) return console.log(err)})
                          };
                          console.log(media)
                          await drive.files.create({
                            resource: fileMetadata4,
                            media: media4,
                            fields: 'id'
                          }, function (err, file) {
                            if (err) {
                              console.log("Error for file creation: " + err);
                            } else {
                              console.log(file.id);
                              newId4 = file.id;
                            }
                          });
                        }
                        if(level4.type === "folder") {
                          const fileName4 = level4.name;
                          const description4 = level4.description;
                          let newType4 = 'application/vnd.google-apps.folder'
                        
                          var fileMetadata4 = {
                            'name': fileName4,
                            'description': description4,
                            'parents': [newIdFolder3],
                            'mimeType': newType4,
                          };
                          function driveCreateFolder4() {
                            return new Promise(function (resolve, reject) { 
                              drive.files.create({
                                resource: fileMetadata4,
                                fields: 'id',
                              }, function (err, file) {
                                if (err) {
                                  console.log("Error for file creation: " + err);
                                } else {
                                  var newIdFolderIn4 = file.data.id;
                                  resolve(app.set('newIdFolder4', newIdFolderIn4));
                                }
                              });
                            })
                          }
                          await driveCreateFolder4();
                          sleep(2000);
                          if(level4.children != []) {
                            //5
                            for(var d = 0; d < level4.children.length; d++) {
                              const level5 = level4.children[d]; 
                              var newIdFolder4 = req.app.get('newIdFolder4');
                              if (level5.type != "folder") {
                                const fileName5 = level5.name;
                                const type5 = level5.type;
                                const description5 = level5.description;
                                let newType5 = ''
                                if(type5 === 'docx') {
                                  newType5 = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                                }
                                if(type5 === 'pptx') {
                                  newType5 = 'application/vnd.google-apps.presentation'
                                }
                                if(type5 === 'xlsx') {
                                  newType5 === 'application/vnd.google-apps.spreadsheet'
                                }
                          
                                const destSimple5 = destSimple4 + "/" + fileName5 + '.' + type5;
                          
                                let newId5 = ''
                          
                                var fileMetadata5 = {
                                  'name': fileName5,
                                  'description': description5,
                                  'parents': [newIdFolder4]
                                };
                                console.log(fileMetadata)
                                var media5 = {
                                  mimeType: newType5,
                                  body: fs.createReadStream(destSimple5, (err) => {if(err) return console.log(err)})
                                };
                                console.log(media)
                                await drive.files.create({
                                  resource: fileMetadata5,
                                  media: media5,
                                  fields: 'id'
                                }, function (err, file) {
                                  if (err) {
                                    console.log("Error for file creation: " + err);
                                  } else {
                                    console.log(file.id);
                                    newId5 = file.id;
                                  }
                                });
                              }
                              if(level5.type === "folder") {
                                const fileName5 = level5.name;
                                const description5 = level5.description;
                                let newType5 = 'application/vnd.google-apps.folder'
                              
                                var fileMetadata5 = {
                                  'name': fileName5,
                                  'description': description5,
                                  'parents': [newIdFolder4],
                                  'mimeType': newType5,
                                };
                                function driveCreateFolder5() {
                                  return new Promise(function (resolve, reject) { 
                                    drive.files.create({
                                      resource: fileMetadata5,
                                      fields: 'id',
                                    }, function (err, file) {
                                      if (err) {
                                        console.log("Error for file creation: " + err);
                                      } else {
                                        var newIdFolderIn5 = file.data.id;
                                        resolve(app.set('newIdFolder5', newIdFolderIn5));
                                      }
                                    });
                                  })
                                }
                                await driveCreateFolder5();
                                sleep(2000);
                                if(level5.children != []) {
                                  //6
                                  for(var e = 0; e < level5.children.length; e++) {
                                    const level6 = level5.children[e]; 
                                    var newIdFolder5 = req.app.get('newIdFolder5');
                                    if (level6.type != "folder") {
                                      const fileName6 = level6.name;
                                      const type6 = level6.type;
                                      const description6 = level6.description;
                                      let newType6 = ''
                                      if(type6 === 'docx') {
                                        newType6 = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                                      }
                                      if(type6 === 'pptx') {
                                        newType6 = 'application/vnd.google-apps.presentation'
                                      }
                                      if(type6 === 'xlsx') {
                                        newType6 === 'application/vnd.google-apps.spreadsheet'
                                      }
                                
                                      const destSimple6 = destSimple5 + "/" + fileName6 + '.' + type6;
                                
                                      let newId6 = ''
                                
                                      var fileMetadata6 = {
                                        'name': fileName6,
                                        'description': description6,
                                        'parents': [newIdFolder5]
                                      };
                                      console.log(fileMetadata)
                                      var media6 = {
                                        mimeType: newType6,
                                        body: fs.createReadStream(destSimple6, (err) => {if(err) return console.log(err)})
                                      };
                                      console.log(media)
                                      await drive.files.create({
                                        resource: fileMetadata6,
                                        media: media6,
                                        fields: 'id'
                                      }, function (err, file) {
                                        if (err) {
                                          console.log("Error for file creation: " + err);
                                        } else {
                                          console.log(file.id);
                                          newId6 = file.id;
                                        }
                                      });
                                    }
                                    if(level6.type === "folder") {
                                      const fileName6 = level6.name;
                                      const description6 = level6.description;
                                      let newType6 = 'application/vnd.google-apps.folder'
                                    
                                      var fileMetadata6 = {
                                        'name': fileName6,
                                        'description': description6,
                                        'parents': [newIdFolder5],
                                        'mimeType': newType6,
                                      };
                                      function driveCreateFolder6() {
                                        return new Promise(function (resolve, reject) { 
                                          drive.files.create({
                                            resource: fileMetadata6,
                                            fields: 'id',
                                          }, function (err, file) {
                                            if (err) {
                                              console.log("Error for file creation: " + err);
                                            } else {
                                              var newIdFolderIn6 = file.data.id;
                                              resolve(app.set('newIdFolder6', newIdFolderIn6));
                                            }
                                          });
                                        })
                                      }
                                      await driveCreateFolder6();
                                      sleep(2000);
                                      if(level6.children != []) {
                                        //7
                                        for(var f = 0; f < level6.children.length; f++) {
                                          const level7 = level6.children[f]; 
                                          var newIdFolder6 = req.app.get('newIdFolder6');
                                          if (level7.type != "folder") {
                                            const fileName7 = level7.name;
                                            const type7 = level7.type;
                                            const description7 = level7.description;
                                            let newType7 = ''
                                            if(type7 === 'docx') {
                                              newType7 = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                                            }
                                            if(type7 === 'pptx') {
                                              newType7 = 'application/vnd.google-apps.presentation'
                                            }
                                            if(type7 === 'xlsx') {
                                              newType7 === 'application/vnd.google-apps.spreadsheet'
                                            }
                                      
                                            const destSimple7 = destSimple6 + "/" + fileName7 + '.' + type7;
                                      
                                            let newId7 = ''
                                      
                                            var fileMetadata7 = {
                                              'name': fileName7,
                                              'description': description7,
                                              'parents': [newIdFolder6]
                                            };
                                            console.log(fileMetadata)
                                            var media7 = {
                                              mimeType: newType7,
                                              body: fs.createReadStream(destSimple7, (err) => {if(err) return console.log(err)})
                                            };
                                            console.log(media)
                                            await drive.files.create({
                                              resource: fileMetadata7,
                                              media: media7,
                                              fields: 'id'
                                            }, function (err, file) {
                                              if (err) {
                                                console.log("Error for file creation: " + err);
                                              } else {
                                                console.log(file.id);
                                                newId7 = file.id;
                                              }
                                            });
                                          }
                                          if(level7.type === "folder") {
                                            const fileName7 = level7.name;
                                            const description7 = level7.description;
                                            let newType7 = 'application/vnd.google-apps.folder'
                                          
                                            var fileMetadata7 = {
                                              'name': fileName7,
                                              'description': description7,
                                              'parents': [newIdFolder6],
                                              'mimeType': newType7,
                                            };
                                            function driveCreateFolder7() {
                                              return new Promise(function (resolve, reject) { 
                                                drive.files.create({
                                                  resource: fileMetadata7,
                                                  fields: 'id',
                                                }, function (err, file) {
                                                  if (err) {
                                                    console.log("Error for file creation: " + err);
                                                  } else {
                                                    var newIdFolderIn7 = file.data.id;
                                                    resolve(app.set('newIdFolder7', newIdFolderIn7));
                                                  }
                                                });
                                              })
                                            }
                                            await driveCreateFolder7();
                                            sleep(2000);
                                            if(level7.children != []) {
                                              //8
                                              for(var g = 0; g < level7.children.length; g++) {
                                                const level8 = level7.children[g];
                                                var newIdFolder7 = req.app.get('newIdFolder7'); 
                                                if (level8.type != "folder") {
                                                  const fileName8 = level8.name;
                                                  const type8 = level8.type;
                                                  const description8 = level8.description;
                                                  let newType8 = ''
                                                  if(type8 === 'docx') {
                                                    newType8 = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                                                  }
                                                  if(type8 === 'pptx') {
                                                    newType8 = 'application/vnd.google-apps.presentation'
                                                  }
                                                  if(type8 === 'xlsx') {
                                                    newType8 === 'application/vnd.google-apps.spreadsheet'
                                                  }
                                            
                                                  const destSimple8 = destSimple7 + "/" + fileName8 + '.' + type8;
                                            
                                                  let newId8 = ''
                                            
                                                  var fileMetadata8 = {
                                                    'name': fileName8,
                                                    'description': description8,
                                                    'parents': [newIdFolder7]
                                                  };
                                                  console.log(fileMetadata)
                                                  var media8 = {
                                                    mimeType: newType8,
                                                    body: fs.createReadStream(destSimple8, (err) => {if(err) return console.log(err)})
                                                  };
                                                  console.log(media)
                                                  await drive.files.create({
                                                    resource: fileMetadata8,
                                                    media: media8,
                                                    fields: 'id'
                                                  }, function (err, file) {
                                                    if (err) {
                                                      console.log("Error for file creation: " + err);
                                                    } else {
                                                      console.log(file.id);
                                                      newId8 = file.id;
                                                    }
                                                  });
                                                }
                                                if(level8.type === "folder") {
                                                  const fileName8 = level8.name;
                                                  const description8 = level8.description;
                                                  let newType8 = 'application/vnd.google-apps.folder'
                                                
                                                  var fileMetadata8 = {
                                                    'name': fileName8,
                                                    'description': description8,
                                                    'parents': [newIdFolder7],
                                                    'mimeType': newType8,
                                                  };
                                                  function driveCreateFolder8() {
                                                    return new Promise(function (resolve, reject) { 
                                                      drive.files.create({
                                                        resource: fileMetadata8,
                                                        fields: 'id',
                                                      }, function (err, file) {
                                                        if (err) {
                                                          console.log("Error for file creation: " + err);
                                                        } else {
                                                          var newIdFolderIn8 = file.data.id;
                                                          resolve(app.set('newIdFolder8', newIdFolderIn8));
                                                        }
                                                      });
                                                    })
                                                  }
                                                  await driveCreateFolder8();
                                                  sleep(2000);
                                                  if(level8.children != []) {
                                                    //9
                                                    for(var h = 0; h < level8.children.length; h++) {
                                                      const level9 = level8.children[h]; 
                                                      var newIdFolder8 = req.app.get('newIdFolder8');
                                                      if (level9.type != "folder") {
                                                        const fileName9 = level9.name;
                                                        const type9 = level9.type;
                                                        const description9 = level9.description;
                                                        let newType9 = ''
                                                        if(type9 === 'docx') {
                                                          newType9 = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                                                        }
                                                        if(type9 === 'pptx') {
                                                          newType9 = 'application/vnd.google-apps.presentation'
                                                        }
                                                        if(type9 === 'xlsx') {
                                                          newType9 === 'application/vnd.google-apps.spreadsheet'
                                                        }
                                                  
                                                        const destSimple9 = destSimple8 + "/" + fileName9 + '.' + type9;
                                                  
                                                        let newId9 = ''
                                                  
                                                        var fileMetadata9 = {
                                                          'name': fileName9,
                                                          'description': description9,
                                                          'parents': [newIdFolder8]
                                                        };
                                                        console.log(fileMetadata)
                                                        var media9 = {
                                                          mimeType: newType9,
                                                          body: fs.createReadStream(destSimple9, (err) => {if(err) return console.log(err)})
                                                        };
                                                        console.log(media)
                                                        await drive.files.create({
                                                          resource: fileMetadata9,
                                                          media: media9,
                                                          fields: 'id'
                                                        }, function (err, file) {
                                                          if (err) {
                                                            console.log("Error for file creation: " + err);
                                                          } else {
                                                            console.log(file.id);
                                                            newId9 = file.id;
                                                          }
                                                        });
                                                      }
                                                      if(level9.type === "folder") {
                                                        const fileName9 = level9.name;
                                                        const description9 = level9.description;
                                                        let newType9 = 'application/vnd.google-apps.folder'
                                                      
                                                        var fileMetadata9 = {
                                                          'name': fileName9,
                                                          'description': description9,
                                                          'parents': [newIdFolder8],
                                                          'mimeType': newType9,
                                                        };
                                                        function driveCreateFolder9() {
                                                          return new Promise(function (resolve, reject) { 
                                                            drive.files.create({
                                                              resource: fileMetadata9,
                                                              fields: 'id',
                                                            }, function (err, file) {
                                                              if (err) {
                                                                console.log("Error for file creation: " + err);
                                                              } else {
                                                                var newIdFolderIn9 = file.data.id;
                                                                resolve(app.set('newIdFolder9', newIdFolderIn9));
                                                              }
                                                            });
                                                          })
                                                        }
                                                        await driveCreateFolder9();
                                                        if(level9.children != []) {
                                                          console.log("maximum file depth reached.")
                                                        } 
                                                      }
                                                    }
                                                  } 
                                                }
                                              }
                                            } 
                                          }
                                        }
                                      } 
                                    }
                                  }
                                } 
                              }
                            }
                          } 
                        }
                      }
                    } 
                  }
                }
              } 
            }
          } 
        }
      } 
    }
  }
})

// Authentication Routes

app.post("/register", (req, res, done) => {
  const email = req.body.email;
  const password = req.body.password;
  const domain = req.body.domain;
  Domains.find({name: "Domains"}, (err, res) => {
    if (err) {
      return console.log(err); 
    }
    var foundDomains = res[0].domains;
    for(var i = 0; i < foundDomains.length; i++) {
      if(foundDomains[i] === domain) {
        bcrypt.hash(password, 10, (err, hash) => {
          if (err) return console.log(err);
          var addedUser = new User ({
              email: email,
              password: hash,
              domain: domain,
              active: false,
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
          if (err) {
            res.send('User does not have verified domain.')
            return console.log(err)
          };
          var specialEmails = res[0].emails;
          for(var y = 0; y < specialEmails.length; y++) {
            if(specialEmails[i] === email) {
              bcrypt.hash(password, 10, (err, hash) => {
                if(err) return console.log(err);
                var addedUser = new User ({
                    email: email,
                    password: hash,
                    domain: domain,
                    active: false
                })
                addedUser.save((err, data) => {
                    if (err) {
                        return done(err); 
                    }
                    const emailClick = 'http://vast-stream-39133.herokuapp.com/verify/' + data._id
                    const message = {
                      from: 'smartpathverification@gmail.com', // Sender address
                      to: req.body.email, // List of recipients
                      subject: 'Email Verification Required - Think Future Workforce Connect', // Subject line
                      text: 'Please click here to verify your email: ' + emailClick // Plain text body
                    };
                    transport.sendMail(message, function(err, info) {
                        if (err) {
                          console.log(err)
                        } else {
                          console.log(info);
                        }
                    });
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

app.post('/verify/*', (req, res) => {
  const wholeurl = req.url;
  const code = wholeurl.slice(8);

  User.find({_id: code}, {$set: {active: true}}, {new: true}, (err, data) => {
    if(err) return console.log(err);
    req.session.sessionID = data._id;
    res.send("Your Email is now authenticated!")
    done(null, data)
  })

})

app.post('/login', (req, res, done) => {
  const email = req.body.email; 
  const password = req.body.password;
  User.find({email: email}, (err, data) => {
      if (err) { 
          done(err); 
          console.log("email not found.")
      }
      if(data.active === false) {
        res.send('email not yet authenticated.')
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
                        res.send(req.session.sessionID);
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
  TagFile.findOneAndUpdate(
    {id: fileId}, 
    {$push: {subject: subject}},
    {$push: {grade: grade}},
    {$push: {industry: industry}},
    {new: true},
    (err, data) => {console.log(data)})
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


// CHROME EXTENSION REQUESTS


app.get('/filewrite', (req, res) => {
  var filePath = req.body.filePath;
  fs.writeFile
})