var express = require ('express'); 
var app = express(); 

require('dotenv').config(); 
const path = require("path"); 

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
  industry: Array,
  contains1: String,
  contains2: String, 
  contains3: String, 
})
var domainSchema = new Schema ({
  name: String,
  domains: Array
})
var specialUsersSchema = new Schema ({
  name: String,
  emails: Array,
})
var imageSchema = new Schema({
  id: String,
  img: {data: Buffer, contentType: String}
});
const User = mongoose.model('User', userSchema);
const TagFile = mongoose.model('TagFile', tagSchema)
const Domains = mongoose.model('Domains', domainSchema)
const SpecialUsers = mongoose.model('SpecialUsers', specialUsersSchema)
const Images = mongoose.model('Images', imageSchema);

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
    cb(null, file.fieldname + '-' + Date.now())
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
const { stringify } = require('querystring');
const { json } = require('body-parser');


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
    contains: {
      contains1: "",
      contains2: "",
      contains3: "",
    },
    parents: [],
  }];
  if (files.length) {
    const fileDisplay = [];
    const fileIdArray = [];
    const description = [];
    const mimeType = [];
    const parents = [];
    const subjectArray = [];
    const gradeArray = [];
    const industryArray = [];
    const imgsrcArray = [];
    var newLoop = [];
    for (var i = 0; i < files.length; i++) {
      //console.log(files[i]);
      //console.log(newLoop.subject);
      fileDisplay.push(files[i].name);
      fileIdArray.push(files[i].id);
      description.push(files[i].description);
      mimeType.push(files[i].mimeType);
      parents.push(files[i].parents);
      
      if (typeof files[i].properties === 'undefined') {
        subjectArray.push('hold');
        gradeArray.push('hold');
        industryArray.push('hold');
      }
      if(files[i].properties) {

        //IMGSRC 
        if(files[i].properties.imgsrc) {
          imgsrcArray.push(files[i].properties.imgsrc);
        }
        if(typeof files[i].properties.imgsrc === "undefined") {
          Images.find({id: files[i].id}, (err, data) => {
          if (err) {
            console.log(err)
            imgsrcArray.push('')
          };
          var imgFile = data[0]
          const rawBuffer = imgFile.toString("base64");
          const imageSrc = "data:image/png;base64," + rawBuffer;
          imgsrcArray.push(imageSrc);
        })
        }

        //IF EQUALS UNDEFINED TAGS
        if(files[i].properties.subject && typeof files[i].properties.grade === "undefined" && typeof files[i].properties.industry === "undefined") {
          subjectArray.push(files[i].properties.subject);
          gradeArray.push('hold');
          industryArray.push('hold');
        }
        if(files[i].properties.subject && files[i].properties.grade && typeof files[i].properties.industry === "undefined") {
          subjectArray.push(files[i].properties.subject);
          gradeArray.push(files[i].properties.grade);
          industryArray.push('hold');
        }
        if(files[i].properties.subject && files[i].properties.grade && files[i].properties.industry) {
          subjectArray.push(files[i].properties.subject);
          gradeArray.push(files[i].properties.grade);
          industryArray.push(files[i].properties.industry);
        }
        if(files[i].properties.subject && typeof files[i].properties.grade === "undefined" && files[i].properties.industry) {
          subjectArray.push(files[i].properties.subject);
          gradeArray.push('hold');
          industryArray.push(files[i].properties.industry);
        }
        if(typeof files[i].properties.subject === "undefined" && files[i].properties.grade && files[i].properties.industry) {
          subjectArray.push('hold');
          gradeArray.push(files[i].properties.grade);
          industryArray.push(files[i].properties.industry);
        }
        if(typeof files[i].properties.subject === "undefined" && files[i].properties.grade && typeof files[i].properties.industry === "undefined") {
          subjectArray.push('hold');
          gradeArray.push(files[i].properties.grade);
          industryArray.push('hold');
        }
        if(typeof files[i].properties.subject === "undefined" && typeof files[i].properties.grade === "undefined" && files[i].properties.industry) {
          subjectArray.push('hold');
          gradeArray.push('hold');
          industryArray.push(files[i].properties.industry);
        }
      }
    }
    for(var j = 0; j < subjectArray.length; j++) {
      if (subjectArray[j] === 'hold') {
        subjectArray[j] = [];
      }
      if(!(subjectArray[j] instanceof Array) && subjectArray[j] !== 'hold'){
        subjectArray[j] = [subjectArray[j]];
      }
    }
    for(var k = 0; k < gradeArray.length; k++) {
      if (gradeArray[k] === 'hold') {
        gradeArray[k] = [];
      }
      if(!(gradeArray[k] instanceof Array) && gradeArray[k] !== 'hold'){
        gradeArray[k] = [gradeArray[k]];
      }
    }
    for(var l = 0; l < industryArray.length; l++) {
      if (industryArray[l] === 'hold') {
        industryArray[l] = [];
      }
      if(!(industryArray[l] instanceof Array) && industryArray[l] !== 'hold'){
        industryArray[l] = [industryArray[l]];
      }
    }
    for (var y = 0; y < fileDisplay.length; y++) {
      fileArray.push({
        file: fileDisplay[y],
        id: fileIdArray[y],
        description: description[y],
        type: mimeType[y],
        properties: {
          subject: subjectArray[y],
          grade: gradeArray[y],
          industry: industryArray[y],
          imgsrc: imgsrcArray[y],
        },
        contains: {
          contains1: "",
          contains2: "",
          contains3: "",
        },
        parents: parents[y],
      });
    }
    //console.log(fileArray)
    for(let k1 = 0; k1 < fileArray.length; k1++) {
      if (typeof fileArray[k1] === 'undefined') {
        fileArray.splice(k, 1)
      }
      if (fileArray[k1].file === '') {
        fileArray.splice(k, 1)
      }
      if (typeof fileArray[k1].properties.subject === "undefined") {
        fileArray[k1].properties.subject = ['none'];
      }
      if (typeof fileArray[k1].properties.grade === "undefined") {
        fileArray[k1].properties.grade = ['none'];
      }
      if (typeof fileArray[k1].properties.industry === "undefined") {
        fileArray[k1].properties.industry = ['none'];
      }
      if(fileArray[k1].properties.subject === [Array]) {
        fileArray[k1].properties.subject === ['none'];
      }
      if(fileArray[k1].properties.grade === [Array]) {
        fileArray[k1].properties.grade === ['none'];
      }
      if(fileArray[k1].properties.industry === [Array]) {
        fileArray[k1].properties.industry === ['none'];
      }
      //if (typeof fileArray[k1].properties.subject === "string") {
      //  fileArray[k1].properties.subject = [fileArray[k1].properties.subject];
      //}
      //if (typeof fileArray[k1].properties.grade === "string") {
      //  fileArray[k1].properties.grade = [fileArray[k1].properties.grade];
      //}
      //if (typeof fileArray[k1].properties.industry === "string") {
      //  fileArray[k1].properties.industry = [fileArray[k1].properties.industry];
      //}
      
      await TagFile.countDocuments({id: fileArray[k1].id}, (err, count) => {
        if(err) return console.log(err);
        //console.log(count);
        //console.log(count + " is the number of results")
        //console.log(fileArray[k1])
        if(count === 0) {
          //ALL
          if(fileArray[k1].properties.subject.length === 0 && fileArray[k1].properties.grade.length === 0 && fileArray[k1].properties.industry.length === 0) {
            //console.log(fileArray[k1])
            var newTags1 = new TagFile({id: fileArray[k1].id});
            newTags1.save((err, res) => {
              if (err) return console.log(err);
              //console.log(res);
            })
          }
          if(fileArray[k1].properties.subject.length >= 1 && fileArray[k1].properties.grade.length >= 1 && fileArray[k1].properties.industry.length >= 1) {
            console.log(fileArray[k1])
            var newTags2 = new TagFile({id: fileArray[k1].id, subject: [fileArray[k1].properties.subject], grade: [fileArray[k1].properties.grade], industry: [fileArray[k1].properties.industry] })
            newTags2.save((err, res) => {
              if (err) return console.log(err);
              //console.log(res);
            })
          }
          ////SUBJECT
          if(fileArray[k1].properties.subject.length >= 1 && fileArray[k1].properties.grade.length === 0 && fileArray[k1].properties.industry.length === 0) {
            var newTags3 = new TagFile({id: fileArray[k1].id, subject: [fileArray[k1].properties.subject]})
            newTags3.save((err, res) => {
              if (err) return console.log(err);
              //console.log(res);
            })
          }
          if(fileArray[k1].properties.subject.length >= 1 && fileArray[k1].properties.grade.length >= 1 && fileArray[k1].properties.industry.length === 0) {
            var newTags4 = new TagFile({id: fileArray[k1].id, subject: [fileArray[k1].properties.subject], grade: [fileArray[k1].properties.grade]})
            newTags4.save((err, res) => {
              if (err) return console.log(err);
              //console.log(res);
            })
          }
          if(fileArray[k1].properties.subject.length >= 1 && fileArray[k1].properties.grade.length === 0 && fileArray[k1].properties.industry.length >= 1) {
            var newTags5 = new TagFile({id: fileArray[k1].id, subject: [fileArray[k1].properties.subject], industry: [fileArray[k1].properties.industry]})
            newTags5.save((err, res) => {
              if (err) return console.log(err);
              //console.log(res);
            })
          }
          ////GRADE
          if(fileArray[k1].properties.subject.length === 0 && fileArray[k1].properties.grade.length >= 1 && fileArray[k1].properties.industry.length === 0) {
            var newTags6 = new TagFile({id: fileArray[k1].id, grade: fileArray[k1].grade})
            newTags6.save((err, res) => {
              if (err) return console.log(err);
              //console.log(res);
            })
          }
          if(fileArray[k1].properties.subject.length === 0 && fileArray[k1].properties.grade.length >= 1 && fileArray[k1].properties.industry.length >= 1) {
            var newTags7 = new TagFile({id: fileArray[k1].id, grade: fileArray[k1].grade, industry: fileArray[k1].industry})
            newTags7.save((err, res) => {
              if (err) return console.log(err);
              //console.log(res);
            })
          }
          ////INDUSTRY
          if(fileArray[k1].properties.subject.length === 0 && fileArray[k1].properties.grade.length === 0 && fileArray[k1].properties.industry.length >= 1) {
            var newTags8 = new TagFile({id: fileArray[k1].id, industry: fileArray[k1].industry})
            newTags8.save((err, res) => {
              if (err) return console.log(err);
              //console.log(res);
            })
          }
          else {
            console.log("not found")
          }
        }
        if(count >= 1) {
          TagFile.findOne({id: fileArray[k1].id}, (err, res) => {
            if(err) return console.log(err);
            //console.log(res);

            // Subject, Grade, Industry //
            if(res.subject.length > 0 && res.subject !== [Array]) {
              for (let k2 = 0; k2 < res.subject.length; k2++) {
                fileArray[k1].properties.subject.push(res.subject[k2])
              }
            }
            if(res.grade.length > 0 && res.grade !== [Array]) {
              for (let k3 = 0; k3 < res.grade.length; k3++) {
                fileArray[k1].properties.grade.push(res.grade[k3])
              }
            }
            if(res.industry.length > 0 && res.industry !== [Array]) {
              for (let k4 = 0; k4 < res.industry.length; k4++) {
                fileArray[k1].properties.industry.push(res.industry[k4])
              }
            }
            // 3 Contains //
            if(res.contains1 !== "") {
              console.log(res);
              fileArray[k1].contains.contains1 = res.contains1; 
            }
            else {
              fileArray[k1].contains.contains1 = "";
            }
            if(res.contains2 !== "") {
              fileArray[k1].contains.contains2 = res.contains2;
            }
            else {
              fileArray[k1].contains.contains2 = "";
            }
            if(res.contains3 !== "") {
              fileArray[k1].contains.contains3 = res.contains3;
            }
            else {
              fileArray[k1].contains.contains2 = "";
            }

            //If still undefined then set to empty string
            if(fileArray[k1].contains.contains1 === undefined) {
              fileArray[k1].contains.contains1 = ""
            }
            if(fileArray[k1].contains.contains2 === undefined) {
              fileArray[k1].contains.contains2 = ""
            }
            if(fileArray[k1].contains.contains3 === undefined) {
              fileArray[k1].contains.contains3 = ""
            }

            //Double check subjects to set to none if empty
            if(fileArray[k1].properties.subject.length === 0) {
              fileArray[k1].properties.subject.push('none');
            }
            if(fileArray[k1].properties.grade.length === 0) {
              fileArray[k1].properties.grade.push('none');
            }
            if(fileArray[k1].properties.industry.length === 0) {
              fileArray[k1].properties.industry.push('none');
            }

            //Double check imgsrcs to set to empty string if undefined
            if(fileArray[k1].properties.imgsrc === undefined) {
              fileArray[k1].properties.imgsrc = ''
            }
          })
        }
        //console.log(fileArray);
      })
    }
    console.log(fileArray)
    app.set('fileArray', fileArray);
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

/// GENERAL REDIRECT 

app.get("https://connect.smartpathed.com", (req, res) => {
  res.redirect("https://www.connect.smartpathed.com");
})

app.get("https://connect.smartpathed.com/privacy", (req, res) => {
  res.redirect('https://www.connect.smartpathed.com/privacy');
})

app.get("https://connect.smartpathed.com/admin", (req, res) => {
  res.redirect('https://www.connect.smartpathed.com/admin');
})


/// GOOGLE DRIVE EXPORT TO CLASSROOMs

// Setting Files to Local 

app.post("/downloaddocument", async (req, res) => {
  const drive = req.app.get('drive');
  const files = req.body.files;
  function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }
  app.set('files', files);
  console.log("these are the files: " + JSON.stringify(files));

  for(var i = 0; i < files.length; i++) {
    if (files[i].type != "folder") {
      const fileId = files[i].id
      const fileName = files[i].name
      const type = files[i].type
      console.log("this is the type that comes in: " + type);
      var newType = ''
      if(type === 'docx') {
        newType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      }
      if(type === 'pptx') {
        newType = 'application/vnd.google-apps.presentation'
      }
      if(type === 'xlsx') {
        newType = 'application/vnd.google-apps.spreadsheet'
      }
      if(type === 'pdf') {
        newType = 'application/pdf'
      }
      if(type === 'mp3') {
        newType = 'audio/mpeg'
      }
      if(type === 'wav') {
        newType = 'audio/wav'
      }
      if(type === 'mp4') {
        newType = 'video/mp4'
      }
      if(type === 'jpg') {
        newType = 'image/jpeg'
      }
      if(type === 'png') {
        newType = 'image/png'
      }
      if(type === 'txt') {
        newType = 'text/plain'
      }

      const dest = await fs.createWriteStream('./src/Pages/downloads/' + fileName + '.' + type);
      const destSimple = './src/Pages/downloads/' + fileName + '.' + type;
      //console.log(destSimple)

      if(type === 'pdf' || type === "mp3" || type === "wav" || type === "mp4" || type === 'jpg' || type === 'png' || type === 'txt') {
        console.log("pdf if statement called")

        await drive.files.get(
        {fileId: fileId, alt: 'media'}, 
        {responseType: 'stream'}, 
        (err, res) => {
          if (err) return console.log(err);
          console.log("file recieved from drive.") 
          res.data
          .pipe(dest, function(err) {
            if(err) return console.log(err);
            console.log("pipe worked")
          })
          .on('end', () => {
            console.log("made file.")
          })
        });
      } 
      if(type === 'docx' || type === 'pptx' || type === 'xlsx') {
        await drive.files.export({
          fileId: fileId, mimeType: newType}, 
          {responseType: 'stream'},
          (err, res) => {
          if(err)return console.log("error in drive.files.export: " + err)
          res.data
          .pipe(dest, function(err) {
            if (err) return console.log(err);
            console.log('file written')
          })
          .on('end', ()=>{
              console.log("made file.")
          })
        });
      }
      //await zip.file(destSimple, fs.readFile(destSimple), () => {if(err) return console.log(err)})
    }

    if(files[i].type === "folder") {
      await fs.mkdir('./src/Pages/downloads/' + files[i].name, { recursive: true }, (err, res) => {
        if (err) return console.log("At 764: " + err);
        console.log("directory 1 made.")
      })
      //1
      for(var y = 0; y < files[i].children.length; y++) {
        const topFolderPath = './src/Pages/downloads/' + files[i].name;
        const level1 = files[i].children[y]
        console.log(level1);
        if(level1.type != 'folder') {
          const fileId1 = level1.id;
          const fileName1 = level1.name;
          const type1 = level1.type;
          const dest1 = await fs.createWriteStream(topFolderPath + "/" + fileName1 + '.' + type1);
          const dest1file = topFolderPath + "/" + fileName1 + '.' + type1;
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
          if(type1 === 'pdf') {
            newType1 === 'application/pdf'
          }
          if(type1 === 'mp3') {
            newType1 = 'audio/mpeg'
          }
          if(type1 === 'wav') {
            newType1 = 'audio/wav'
          }
          if(type1 === 'mp4') {
            newType1 = 'video/mp4'
          }
          if(type1 === 'jpg') {
            newType1 = 'image/jpeg'
          }
          if(type1 === 'png') {
            newType1 = 'image/png'
          }
          if(type1 === 'txt') {
            newType1 = 'text/plain'
          }
          if(type1 === 'pdf' || type1 === "mp3" || type1 === "wav" || type1 === "mp4" || 
             type1 === 'jpg' || type1 === 'png' || type1 === 'txt') {
            console.log("pdf if statement level1 called")
    
            await drive.files.get(
              {fileId: fileId1, alt: 'media'}, 
              {responseType: 'stream'}, 
              (err, res) => {
                if (err) return console.log(err); 
                res.data
                .pipe(dest1, function(err) {
                  if(err) return console.log(err);
                  console.log("pipe worked")
                })
                .on('end', () => {
                  console.log("made file.")
                })
              });
          }
          if(type1 === 'docx' || type1 === 'pptx' || type1 === 'xlsx') {
            await drive.files.export({
              fileId: fileId1, mimeType: newType1}, 
              {responseType: 'stream'},
              (err, res) => {
              if(err)return console.log("error in drive.files.export: " + err)
              res.data
              .pipe(dest1, function(err) {
                if (err) return console.log(err);
                console.log('file written')
              })
              .on('end', ()=>{
                  console.log("made file.")
              })
            });
          }
          //await zip.file(dest1zip, fs.readFile(dest1file, (err) => {if (err) return console.log(err)}));
        }
        if(level1.type === 'folder') {
          console.log("at 808 " + topFolderPath)
          fs.mkdir(topFolderPath + "/" + level1.name, { recursive: true }, (err) => {if (err) return console.log(err)});
          const level1FolderPath = topFolderPath + "/" + level1.name;
          //const level1ZipPath = await zip.folder(topFolderZip + "/" + level1.name);
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
                //const dest2zip = level1ZipPath + "/" + fileName1 + '.' + type1;
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
                if(type2 === 'pdf') {
                  newType2 === 'application/pdf'
                }
                if(type2 === 'mp3') {
                  newType2 = 'audio/mpeg'
                }
                if(type2 === 'wav') {
                  newType2 = 'audio/wav'
                }
                if(type2 === 'mp4') {
                  newType2 = 'video/mp4'
                }
                if(type2 === 'jpg') {
                  newType2 = 'image/jpeg'
                }
                if(type2 === 'png') {
                  newType2 = 'image/png'
                }
                if(type2 === 'txt') {
                  newType2 = 'text/plain'
                }
                if(type2 === 'pdf' || type2 === "mp3" || type2 === "wav" || type2 === "mp4" || 
                  type2 === 'jpg' || type2 === 'png' || type2 === 'txt') {                   
                  await drive.files.get(
                    {fileId: fileId2, alt: 'media'}, 
                    {responseType: 'stream'}, 
                    (err, res) => {
                      if (err) return console.log(err); 
                      res.data
                      .pipe(dest2, function(err) {
                        if(err) return console.log(err);
                        console.log("pipe worked")
                      })
                      .on('end', () => {
                        console.log("made file.")
                      })
                    });
                }
                if(type2 === 'docx' || type2 === 'pptx' || type2 === 'xlsx') {
                  await drive.files.export({
                    fileId: fileId2, mimeType: newType2}, 
                    {responseType: 'stream'},
                    (err, res) => {
                    if(err)return console.log("error in drive.files.export: " + err)
                    res.data
                    .pipe(dest2, function(err) {
                      if (err) return console.log(err);
                      console.log('file written')
                    })
                    .on('end', ()=>{
                        console.log("made file.")
                    })
                  });
                }
                //await zip.file(dest2zip, fs.readFile(dest2file, (err) => {if(err) return console.log(err)}));
              }
              if(level1.type === 'folder') {
                await fs.mkdir(level1FolderPath + "/" + level2.name, { recursive: true }, (err) => {if (err) return console.log(err)});
                const level2FolderPath = level1FolderPath + "/" + level2.name;
                //const level2ZipPath = await zip.folder(level1ZipPath + "/" + level2.name);
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
                      //const dest3zip = level2ZipPath + "/" + fileName3 + '.' + type3;
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
                      if(type3 === 'pdf') {
                        newType3 === 'application/pdf'
                      }
                      if(type3 === 'mp3') {
                        newType3 = 'audio/mpeg'
                      }
                      if(type3 === 'wav') {
                        newType3 = 'audio/wav'
                      }
                      if(type3 === 'mp4') {
                        newType3 = 'video/mp4'
                      }
                      if(type3 === 'jpg') {
                        newType3 = 'image/jpeg'
                      }
                      if(type3 === 'png') {
                        newType3 = 'image/png'
                      }
                      if(type3 === 'txt') {
                        newType3 = 'text/plain'
                      }
                      if(type3 === 'pdf' || type3 === "mp3" || type3 === "wav" || type3 === "mp4" || 
                        type3 === 'jpg' || type3 === 'png' || type3 === 'txt') {                   
                        await drive.files.get(
                          {fileId: fileId3, alt: 'media'}, 
                          {responseType: 'stream'}, 
                          (err, res) => {
                            if (err) return console.log(err); 
                            res.data
                            .pipe(dest3, function(err) {
                              if(err) return console.log(err);
                              console.log("pipe worked")
                            })
                            .on('end', () => {
                              console.log("made file.")
                            })
                          });
                      }
                      if(type3 === 'docx' || type3 === 'pptx' || type3 === 'xlsx') {
                        await drive.files.export({
                          fileId: fileId3, mimeType: newType3}, 
                          {responseType: 'stream'},
                          (err, res) => {
                          if(err)return console.log("error in drive.files.export: " + err)
                          res.data
                          .pipe(dest3, function(err) {
                            if (err) return console.log(err);
                            console.log('file written')
                          })
                          .on('end', ()=>{
                              console.log("made file.")
                          })
                        });
                      }
                      //await zip.file(dest3zip, fs.readFile(dest3file, (err) => {if(err) return console.log(err)}));
                    }
                    if(level3.type === 'folder') {
                      await fs.mkdir(level2FolderPath + "/" + level3.name, { recursive: true }, (err) => {if (err) return console.log(err)});
                      var level3FolderPath = level2FolderPath + "/" + level3.name;
                      //var level3ZipPath = zip.folder(level2ZipPath + "/" + level3.name);
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
                            //var dest4zip = level3ZipPath + "/" + fileName4 + '.' + type4;
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
                            if(type4 === 'pdf') {
                              newType4 === 'application/pdf'
                            }
                            if(type4 === 'mp3') {
                              newType4 = 'audio/mpeg'
                            }
                            if(type4 === 'wav') {
                              newType4 = 'audio/wav'
                            }
                            if(type4 === 'mp4') {
                              newType4 = 'video/mp4'
                            }
                            if(type4 === 'jpg') {
                              newType4 = 'image/jpeg'
                            }
                            if(type4 === 'png') {
                              newType4 = 'image/png'
                            }
                            if(type4 === 'txt') {
                              newType4 = 'text/plain'
                            }
                            if(type4 === 'pdf' || type4 === "mp3" || type4 === "wav" || type4 === "mp4" || 
                              type4 === 'jpg' || type4 === 'png' || type4 === 'txt') {                   
                              await drive.files.get(
                                {fileId: fileId4, alt: 'media'}, 
                                {responseType: 'stream'}, 
                                (err, res) => {
                                  if (err) return console.log(err); 
                                  res.data
                                  .pipe(dest4, function(err) {
                                    if(err) return console.log(err);
                                    console.log("pipe worked")
                                  })
                                  .on('end', () => {
                                    console.log("made file.")
                                  })
                                });
                            }
                            if(type4 === 'docx' || type4 === 'pptx' || type4 === 'xlsx') {
                              await drive.files.export({
                                fileId: fileId4, mimeType: newType4}, 
                                {responseType: 'stream'},
                                (err, res) => {
                                if(err)return console.log("error in drive.files.export: " + err)
                                res.data
                                .pipe(dest4, function(err) {
                                  if (err) return console.log(err);
                                  console.log('file written')
                                })
                                .on('end', ()=>{
                                    console.log("made file.")
                                })
                              });
                            }
                            //zip.file(dest4zip, fs.readFile(dest4file, (err) => {if(err) return console.log(err)}));
                          }
                          if(level4.type === 'folder') {
                            await fs.mkdir(level3FolderPath + "/" + level4.name, { recursive: true }, (err) => {if (err) return console.log(err)});
                            var level4FolderPath = level3FolderPath + "/" + level4.name;
                            //var level4ZipPath = zip.folder(level3ZipPath + "/" + level4.name);
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
                                  //var dest5zip = level4ZipPath + "/" + fileName5 + '.' + type5;
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
                                  if(type5 === 'pdf') {
                                    newType5 === 'application/pdf'
                                  }
                                  if(type5 === 'mp3') {
                                    newType5 = 'audio/mpeg'
                                  }
                                  if(type5 === 'wav') {
                                    newType5 = 'audio/wav'
                                  }
                                  if(type5 === 'mp4') {
                                    newType5 = 'video/mp4'
                                  }
                                  if(type5 === 'jpg') {
                                    newType5 = 'image/jpeg'
                                  }
                                  if(type5 === 'png') {
                                    newType5 = 'image/png'
                                  }
                                  if(type5 === 'txt') {
                                    newType5 = 'text/plain'
                                  }
                                  if(type5 === 'pdf' || type5 === "mp3" || type5 === "wav" || type5 === "mp4" || 
                                    type5 === 'jpg' || type5 === 'png' || type5 === 'txt') {                   
                                    await drive.files.get(
                                      {fileId: fileId5, alt: 'media'}, 
                                      {responseType: 'stream'}, 
                                      (err, res) => {
                                        if (err) return console.log(err); 
                                        res.data
                                        .pipe(dest5, function(err) {
                                          if(err) return console.log(err);
                                          console.log("pipe worked")
                                        })
                                        .on('end', () => {
                                          console.log("made file.")
                                        })
                                      });
                                  }
                                  if(type5 === 'docx' || type5 === 'pptx' || type5 === 'xlsx') {
                                    await drive.files.export({
                                      fileId: fileId5, mimeType: newType5}, 
                                      {responseType: 'stream'},
                                      (err, res) => {
                                      if(err)return console.log("error in drive.files.export: " + err)
                                      res.data
                                      .pipe(dest5, function(err) {
                                        if (err) return console.log(err);
                                        console.log('file written')
                                      })
                                      .on('end', ()=>{
                                          console.log("made file.")
                                      })
                                    });
                                  }
                                  //zip.file(dest4zip, fs.readFile(dest4file, (err) => {if(err) return console.log(err)}));
                                }
                                if(level5.type === 'folder') {
                                  await fs.mkdir(level4FolderPath + "/" + level5.name, { recursive: true }, (err) => {if (err) return console.log(err)});
                                  var level5FolderPath = level4FolderPath + "/" + level5.name;
                                  //var level5ZipPath = zip.folder(level4ZipPath + "/" + level5.name);
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
                                        //var dest6zip = level5ZipPath + "/" + fileName6 + '.' + type6;
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
                                        if(type6 === 'pdf') {
                                          newType6 === 'application/pdf'
                                        }
                                        if(type6 === 'mp3') {
                                          newType6 = 'audio/mpeg'
                                        }
                                        if(type6 === 'wav') {
                                          newType6 = 'audio/wav'
                                        }
                                        if(type6 === 'mp4') {
                                          newType6 = 'video/mp4'
                                        }
                                        if(type6 === 'jpg') {
                                          newType6 = 'image/jpeg'
                                        }
                                        if(type6 === 'png') {
                                          newType6 = 'image/png'
                                        }
                                        if(type6 === 'txt') {
                                          newType6 = 'text/plain'
                                        }
                                        if(type6 === 'pdf' || type6 === "mp3" || type6 === "wav" || type6 === "mp4" || 
                                          type6 === 'jpg' || type6 === 'png' || type6 === 'txt') {                   
                                          await drive.files.get(
                                            {fileId: fileId6, alt: 'media'}, 
                                            {responseType: 'stream'}, 
                                            (err, res) => {
                                              if (err) return console.log(err); 
                                              res.data
                                              .pipe(dest6, function(err) {
                                                if(err) return console.log(err);
                                                console.log("pipe worked")
                                              })
                                              .on('end', () => {
                                                console.log("made file.")
                                              })
                                            });
                                        }
                                        if(type6 === 'docx' || type6 === 'pptx' || type6 === 'xlsx') {
                                          await drive.files.export({
                                            fileId: fileId6, mimeType: newType6}, 
                                            {responseType: 'stream'},
                                            (err, res) => {
                                            if(err)return console.log("error in drive.files.export: " + err)
                                            res.data
                                            .pipe(dest6, function(err) {
                                              if (err) return console.log(err);
                                              console.log('file written')
                                            })
                                            .on('end', ()=>{
                                                console.log("made file.")
                                            })
                                          });
                                        }
                                        //zip.file(dest4zip, fs.readFile(dest4file, (err) => {if(err) return console.log(err)}));
                                      }
                                      if(level6.type === 'folder') {
                                        await fs.mkdir(level5FolderPath + "/" + level6.name, { recursive: true }, (err) => {if (err) return console.log(err)});
                                        var level6FolderPath = level5FolderPath + "/" + level6.name;
                                        //var level6ZipPath = zip.folder(level5ZipPath + "/" + level6.name);
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
                                              //var dest7zip = level6ZipPath + "/" + fileName7 + '.' + type7;
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
                                              if(type7 === 'pdf') {
                                                newType7 === 'application/pdf'
                                              }
                                              if(type7 === 'mp3') {
                                                newType7 = 'audio/mpeg'
                                              }
                                              if(type7 === 'wav') {
                                                newType7 = 'audio/wav'
                                              }
                                              if(type7 === 'mp4') {
                                                newType7 = 'video/mp4'
                                              }
                                              if(type7 === 'jpg') {
                                                newType7 = 'image/jpeg'
                                              }
                                              if(type7 === 'png') {
                                                newType7 = 'image/png'
                                              }
                                              if(type7 === 'txt') {
                                                newType7 = 'text/plain'
                                              }
                                              if(type7 === 'pdf' || type7 === "mp3" || type7 === "wav" || type7 === "mp4" || 
                                                type7 === 'jpg' || type7 === 'png' || type7 === 'txt') {                   
                                                await drive.files.get(
                                                  {fileId: fileId7, alt: 'media'}, 
                                                  {responseType: 'stream'}, 
                                                  (err, res) => {
                                                    if (err) return console.log(err); 
                                                    res.data
                                                    .pipe(dest7, function(err) {
                                                      if(err) return console.log(err);
                                                      console.log("pipe worked")
                                                    })
                                                    .on('end', () => {
                                                      console.log("made file.")
                                                    })
                                                  });
                                              }
                                              if(type7 === 'docx' || type7 === 'pptx' || type7 === 'xlsx') {
                                                await drive.files.export({
                                                  fileId: fileId7, mimeType: newType7}, 
                                                  {responseType: 'stream'},
                                                  (err, res) => {
                                                  if(err)return console.log("error in drive.files.export: " + err)
                                                  res.data
                                                  .pipe(dest7, function(err) {
                                                    if (err) return console.log(err);
                                                    console.log('file written')
                                                  })
                                                  .on('end', ()=>{
                                                      console.log("made file.")
                                                  })
                                                });
                                              }
                                              //zip.file(dest4zip, fs.readFile(dest4file, (err) => {if(err) return console.log(err)}));
                                            }
                                            if(level7.type === 'folder') {
                                              await fs.mkdir(level6FolderPath + "/" + level7.name, { recursive: true }, (err) => {if (err) return console.log(err)});
                                              var level7FolderPath = level6FolderPath + "/" + level7.name;
                                              //var level7ZipPath = zip.folder(level6ZipPath + "/" + level7.name);
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
                                                    //var dest8zip = level7ZipPath + "/" + fileName8 + '.' + type8;
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
                                                    if(type8 === 'pdf') {
                                                      newType8 === 'application/pdf'
                                                    }
                                                    if(type8 === 'mp3') {
                                                      newType8 = 'audio/mpeg'
                                                    }
                                                    if(type8 === 'wav') {
                                                      newType8 = 'audio/wav'
                                                    }
                                                    if(type8 === 'mp4') {
                                                      newType8 = 'video/mp4'
                                                    }
                                                    if(type8 === 'jpg') {
                                                      newType8 = 'image/jpeg'
                                                    }
                                                    if(type8 === 'png') {
                                                      newType8 = 'image/png'
                                                    }
                                                    if(type8 === 'txt') {
                                                      newType8 = 'text/plain'
                                                    }
                                                    if(type8 === 'pdf' || type8 === "mp3" || type8 === "wav" || type8 === "mp4" || 
                                                      type8 === 'jpg' || type8 === 'png' || type8 === 'txt') {                   
                                                      await drive.files.get(
                                                        {fileId: fileId8, alt: 'media'}, 
                                                        {responseType: 'stream'}, 
                                                        (err, res) => {
                                                          if (err) return console.log(err); 
                                                          res.data
                                                          .pipe(dest8, function(err) {
                                                            if(err) return console.log(err);
                                                            console.log("pipe worked")
                                                          })
                                                          .on('end', () => {
                                                            console.log("made file.")
                                                          })
                                                        });
                                                    }
                                                    if(type8 === 'docx' || type8 === 'pptx' || type8 === 'xlsx') {
                                                      await drive.files.export({
                                                        fileId: fileId8, mimeType: newType8}, 
                                                        {responseType: 'stream'},
                                                        (err, res) => {
                                                        if(err)return console.log("error in drive.files.export: " + err)
                                                        res.data
                                                        .pipe(dest8, function(err) {
                                                          if (err) return console.log(err);
                                                          console.log('file written')
                                                        })
                                                        .on('end', ()=>{
                                                            console.log("made file.")
                                                        })
                                                      });
                                                    }
                                                    //zip.file(dest4zip, fs.readFile(dest4file, (err) => {if(err) return console.log(err)}));
                                                  }
                                                  if(level8.type === 'folder') {
                                                    await fs.mkdir(level7FolderPath + "/" + level8.name, { recursive: true }, (err) => {if (err) return console.log(err)});
                                                    var level8FolderPath = level7FolderPath + "/" + level8.name;
                                                    //var level8ZipPath = zip.folder(level7ZipPath + "/" + level8.name);
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
                                                          //var dest9zip = level8ZipPath + "/" + fileName9 + '.' + type9;
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
                                                          if(type9 === 'pdf') {
                                                            newType9 === 'application/pdf'
                                                          }
                                                          if(type9 === 'mp3') {
                                                            newType9 = 'audio/mpeg'
                                                          }
                                                          if(type9 === 'wav') {
                                                            newType9 = 'audio/wav'
                                                          }
                                                          if(type9 === 'mp4') {
                                                            newType9 = 'video/mp4'
                                                          }
                                                          if(type9 === 'jpg') {
                                                            newType9 = 'image/jpeg'
                                                          }
                                                          if(type9 === 'png') {
                                                            newType9 = 'image/png'
                                                          }
                                                          if(type9 === 'txt') {
                                                            newType9 = 'text/plain'
                                                          }
                                                          if(type9 === 'pdf' || type9 === "mp3" || type9 === "wav" || type9 === "mp4" || 
                                                            type9 === 'jpg' || type9 === 'png' || type9 === 'txt') {                   
                                                            await drive.files.get(
                                                              {fileId: fileId9, alt: 'media'}, 
                                                              {responseType: 'stream'}, 
                                                              (err, res) => {
                                                                if (err) return console.log(err); 
                                                                res.data
                                                                .pipe(dest9, function(err) {
                                                                  if(err) return console.log(err);
                                                                  console.log("pipe worked")
                                                                })
                                                                .on('end', () => {
                                                                  console.log("made file.")
                                                                })
                                                              });
                                                          }
                                                          if(type9 === 'docx' || type9 === 'pptx' || type9 === 'xlsx') {
                                                            await drive.files.export({
                                                              fileId: fileId9, mimeType: newType9}, 
                                                              {responseType: 'stream'},
                                                              (err, res) => {
                                                              if(err)return console.log("error in drive.files.export: " + err)
                                                              res.data
                                                              .pipe(dest9, function(err) {
                                                                if (err) return console.log(err);
                                                                console.log('file written')
                                                              })
                                                              .on('end', ()=>{
                                                                  console.log("made file.")
                                                              })
                                                            });
                                                          }
                                                          //zip.file(dest4zip, fs.readFile(dest4file, (err) => {if(err) return console.log(err)}));
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
  //console.log(files)
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
        newType = 'application/vnd.google-apps.spreadsheet'
      }
      if(type === 'pdf') {
        newType = 'application/pdf'
      }
      if(type === 'mp3') {
        newType = 'audio/mpeg'
      }
      if(type === 'wav') {
        newType = 'audio/wav'
      }
      if(type === 'mp4') {
        newType = 'video/mp4'
      }
      if(type === 'jpg') {
        newType = 'image/jpeg'
      }
      if(type === 'png') {
        newType = 'image/png'
      }
      if(type === 'txt') {
        newType = 'text/plain'
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
          if(type1 === 'pdf') {
            newType1 = 'application/pdf'
          }
          if(type1 === 'mp3') {
            newType1 = 'audio/mpeg'
          }
          if(type1 === 'wav') {
            newType1 = 'audio/wav'
          }
          if(type1 === 'mp4') {
            newType1 = 'video/mp4'
          }
          if(type1 === 'jpg') {
            newType1 = 'image/jpeg'
          }
          if(type1 === 'png') {
            newType1 = 'image/png'
          }
          if(type1 === 'txt') {
            newType1 = 'text/plain'
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
              if(type2 === 'pdf') {
                newType2 = 'application/pdf'
              }
              if(type2 === 'mp3') {
                newType2 = 'audio/mpeg'
              }
              if(type2 === 'wav') {
                newType2 = 'audio/wav'
              }
              if(type2 === 'mp4') {
                newType2 = 'video/mp4'
              }
              if(type2 === 'jpg') {
                newType2 = 'image/jpeg'
              }
              if(type2 === 'png') {
                newType2 = 'image/png'
              }
              if(type2 === 'txt') {
                newType2 = 'text/plain'
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
                    if(type3 === 'pdf') {
                      newType3 = 'application/pdf'
                    }
                    if(type3 === 'mp3') {
                      newType3 = 'audio/mpeg'
                    }
                    if(type3 === 'wav') {
                      newType3 = 'audio/wav'
                    }
                    if(type3 === 'mp4') {
                      newType3 = 'video/mp4'
                    }
                    if(type3 === 'jpg') {
                      newType3 = 'image/jpeg'
                    }
                    if(type3 === 'png') {
                      newType3 = 'image/png'
                    }
                    if(type3 === 'txt') {
                      newType3 = 'text/plain'
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
                        const level4 = level3.children[c]; 
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
                          if(type4 === 'pdf') {
                            newType4 = 'application/pdf'
                          }
                          if(type4 === 'mp3') {
                            newType4 = 'audio/mpeg'
                          }
                          if(type4 === 'wav') {
                            newType4 = 'audio/wav'
                          }
                          if(type4 === 'mp4') {
                            newType4 = 'video/mp4'
                          }
                          if(type4 === 'jpg') {
                            newType4 = 'image/jpeg'
                          }
                          if(type4 === 'png') {
                            newType4 = 'image/png'
                          }
                          if(type4 === 'txt') {
                            newType4 = 'text/plain'
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
                                if(type5 === 'pdf') {
                                  newType5 = 'application/pdf'
                                }
                                if(type5 === 'mp3') {
                                  newType5 = 'audio/mpeg'
                                }
                                if(type5 === 'wav') {
                                  newType5 = 'audio/wav'
                                }
                                if(type5 === 'mp4') {
                                  newType5 = 'video/mp4'
                                }
                                if(type5 === 'jpg') {
                                  newType5 = 'image/jpeg'
                                }
                                if(type5 === 'png') {
                                  newType5 = 'image/png'
                                }
                                if(type5 === 'txt') {
                                  newType5 = 'text/plain'
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
                                      if(type6 === 'pdf') {
                                        newType6 = 'application/pdf'
                                      }
                                      if(type6 === 'mp3') {
                                        newType6 = 'audio/mpeg'
                                      }
                                      if(type6 === 'wav') {
                                        newType6 = 'audio/wav'
                                      }
                                      if(type6 === 'mp4') {
                                        newType6 = 'video/mp4'
                                      }
                                      if(type6 === 'jpg') {
                                        newType6 = 'image/jpeg'
                                      }
                                      if(type6 === 'png') {
                                        newType6 = 'image/png'
                                      }
                                      if(type6 === 'txt') {
                                        newType6 = 'text/plain'
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
                                            if(type7 === 'pdf') {
                                              newType7 = 'application/pdf'
                                            }
                                            if(type7 === 'mp3') {
                                              newType7 = 'audio/mpeg'
                                            }
                                            if(type7 === 'wav') {
                                              newType7 = 'audio/wav'
                                            }
                                            if(type7 === 'mp4') {
                                              newType7 = 'video/mp4'
                                            }
                                            if(type7 === 'jpg') {
                                              newType7 = 'image/jpeg'
                                            }
                                            if(type7 === 'png') {
                                              newType7 = 'image/png'
                                            }
                                            if(type7 === 'txt') {
                                              newType7 = 'text/plain'
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
                                                  if(type8 === 'pdf') {
                                                    newType8 = 'application/pdf'
                                                  }
                                                  if(type8 === 'mp3') {
                                                    newType8 = 'audio/mpeg'
                                                  }
                                                  if(type8 === 'wav') {
                                                    newType8 = 'audio/wav'
                                                  }
                                                  if(type8 === 'mp4') {
                                                    newType8 = 'video/mp4'
                                                  }
                                                  if(type8 === 'jpg') {
                                                    newType8 = 'image/jpeg'
                                                  }
                                                  if(type8 === 'png') {
                                                    newType8 = 'image/png'
                                                  }
                                                  if(type8 === 'txt') {
                                                    newType8 = 'text/plain'
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
                                                        if(type9 === 'pdf') {
                                                          newType9 = 'application/pdf'
                                                        }
                                                        if(type9 === 'mp3') {
                                                          newType9 = 'audio/mpeg'
                                                        }
                                                        if(type9 === 'wav') {
                                                          newType9 = 'audio/wav'
                                                        }
                                                        if(type9 === 'mp4') {
                                                          newType9 = 'video/mp4'
                                                        }
                                                        if(type9 === 'jpg') {
                                                          newType9 = 'image/jpeg'
                                                        }
                                                        if(type9 === 'png') {
                                                          newType9 = 'image/png'
                                                        }
                                                        if(type9 === 'txt') {
                                                          newType9 = 'text/plain'
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
  const exportresult = req.app.get('result');
  if (exportresult === "classroom export complete!") {
    res.send(true);
  }
  else{
    res.send(false);
  }
})

app.post('/filedownload', (req, res) => {
  var JSZip = require("jszip");
  var jsZipUtils = require("jszip-utils");
  const files = req.body.fileArray;
  const regDest = './src/Pages/downloads';
  var zip = new JSZip();
  for(var i = 0; i < files.length; i++) {
    if (files[i].type != "folder") {
      const fileName = files[i].name;
      const type = files[i].type;
      const destSimple = './src/Pages/downloads/' + fileName + '.' + type;
      console.log(destSimple)
      JSZipUtils.getBinaryContent(destSimple, function(err, data) {
        if(err) {
            throw err; // or handle the error
        }
        zip.file(fileName + '.' + type, data, {binary:true});
      })

      app.set('result', result)
    }
    if(files[i].type === "folder") {
      const fileName = files[i].name;
      zip.folder(fileName);
      if (typeof files[i].children === 'undefined') {
      }
      //1
      else {
        for(var y = 0; y < files[i].children.length; y++) {
          const level1 = files[i].children[y]; 
          if (level1.type != "folder") {
            const fileName1 = level1.name;
            const destSimple1 = destSimple + '/' + fileName1 + '.' + type1;

            JSZipUtils.getBinaryContent(destSimple1, function(err, data) {
              if(err) {
                  throw err; // or handle the error
              }
              zip.file(fileName1 + '.' + type1, data, {binary:true});
            })   
          }
          if(level1.type === "folder") {
            const fileName1 = level1.name;
            const zipFileDest1 = regDest + "driveDownload" + '_' + fileName1;
            zip.folder(fileName1);
            if (typeof level1.children === 'undefined') {
            }         
            //2
                else {
                  for(var a = 0; a < level1.children.length; a++) {
                    const level2 = level1.children[a]; 
                    var newIdFolder1 = req.app.get('newIdFolder1');
                    if (level2.type != "folder") {
                      const fileName2 = level2.name;
                      const type2 = level2.type;
                      const destSimple2 = destSimple1 + '/' + fileName2 + '.' + type2;

                      JSZipUtils.getBinaryContent(destSimple2, function(err, data) {
                        if(err) {
                            throw err; // or handle the error
                        }
                        zip.file(fileName2 + '.' + type2, data, {binary:true});
                      }) 

                    }
                  if(level2.type === "folder") {
                    const fileName2 = level2.name;
                    zip.folder(fileName2);
                  if(level2.children != []) {
                    //3
                    for(var b = 0; b < level2.children.length; b++) {
                      const level3 = level2.children[b]; 
                      var newIdFolder2 = req.app.get('newIdFolder2');
                      if (level3.type != "folder") {
                        const fileName3 = level3.name;
                        const type3 = level3.type;
                        const destSimple3 = destSimple2 + '/' + fileName3 + '.' + type3;

                        JSZipUtils.getBinaryContent(destSimple3, function(err, data) {
                          if(err) {
                              throw err; // or handle the error
                          }
                          zip.file(fileName3 + '.' + type3, data, {binary:true});
                        }) 
                        
                      }
                      if(level3.type === "folder") {
                        const fileName3 = level3.name;
                        zip.folder(fileName3);
                        if(level3.children != []) {
                          //4
                          for(var c = 0; c < level3.children.length; c++) {
                            const level4 = level3.children[c]; 
                            if (level4.type != "folder") {
                              const fileName4 = level4.name;
                              const type4 = level4.type;
                              const destSimple4 = destSimple3 + "/" + fileName4 + '.' + type4;

                              JSZipUtils.getBinaryContent(destSimple4, function(err, data) {
                                if(err) {
                                    throw err; // or handle the error
                                }
                                zip.file(fileName4 + '.' + type4, data, {binary:true});
                              }) 

                            }
                            if(level4.type === "folder") {
                              const fileName4 = level4.name;
                              zip.folder(fileName4);
                              
                              if(level4.children != []) {
                                //5
                                for(var d = 0; d < level4.children.length; d++) {
                                  const level5 = level4.children[d]; 
                                  if (level5.type != "folder") {
                                    const fileName5 = level5.name;
                                    const type5 = level5.type;                                 

                                    const destSimple5 = destSimple4 + "/" + fileName5 + '.' + type5;

                                    JSZipUtils.getBinaryContent(destSimple5, function(err, data) {
                                      if(err) {
                                          throw err; // or handle the error
                                      }
                                      zip.file(fileName5 + '.' + type5, data, {binary:true});
                                    }) 
                                  }
                                  if(level5.type === "folder") {
                                    const fileName5 = level5.name;
                                    zip.folder(fileName5);
                                    if(level5.children != []) {
                                      //6
                                      for(var e = 0; e < level5.children.length; e++) {
                                        const level6 = level5.children[e]; 
                                        if (level6.type != "folder") {
                                          const fileName6 = level6.name;
                                          const type6 = level6.type;

                                          const destSimple6 = destSimple5 + "/" + fileName6 + '.' + type6;

                                          JSZipUtils.getBinaryContent(destSimple6, function(err, data) {
                                            if(err) {
                                                throw err; // or handle the error
                                            }
                                            zip.file(fileName6 + '.' + type6, data, {binary:true});
                                          }) 
                                        }
                                        if(level6.type === "folder") {
                                          const fileName6 = level6.name;
                                          zip.folder(fileName6);
                                          
                                          if(level6.children != []) {
                                            //7
                                            for(var f = 0; f < level6.children.length; f++) {
                                              const level7 = level6.children[f]; 
                                              if (level7.type != "folder") {
                                                const fileName7 = level7.name;
                                                const type7 = level7.type;                                             

                                                const destSimple7 = destSimple6 + "/" + fileName7 + '.' + type7;

                                                JSZipUtils.getBinaryContent(destSimple7, function(err, data) {
                                                  if(err) {
                                                      throw err; // or handle the error
                                                  }
                                                  zip.file(fileName7 + '.' + type7, data, {binary:true});
                                                }) 
                                              }
                                              if(level7.type === "folder") {
                                                const fileName7 = level7.name;
                                                zip.folder(fileName7);
                                                if(level7.children != []) {
                                                  //8
                                                  for(var g = 0; g < level7.children.length; g++) {
                                                    const level8 = level7.children[g];
                                                    if (level8.type != "folder") {
                                                      const fileName8 = level8.name;
                                                      const type8 = level8.type;                                                   

                                                      const destSimple8 = destSimple7 + "/" + fileName8 + '.' + type8;

                                                      JSZipUtils.getBinaryContent(destSimple8, function(err, data) {
                                                        if(err) {
                                                            throw err; // or handle the error
                                                        }
                                                        zip.file(fileName8 + '.' + type8, data, {binary:true});
                                                      }) 
                                                    }
                                                    if(level8.type === "folder") {
                                                      const fileName8 = level8.name;
                                                      zip.folder(fileName8);
                                                      if(level8.children != []) {
                                                        //9
                                                        for(var h = 0; h < level8.children.length; h++) {
                                                          const level9 = level8.children[h]; 
                                                          if (level9.type != "folder") {
                                                            const fileName9 = level9.name;
                                                            const type9 = level9.type;                                                           

                                                            const destSimple9 = destSimple8 + "/" + fileName9 + '.' + type9;

                                                            JSZipUtils.getBinaryContent(destSimple9, function(err, data) {
                                                              if(err) {
                                                                  throw err; // or handle the error
                                                              }
                                                              zip.file(fileName9 + '.' + type9, data, {binary:true});
                                                            }) 
                                                          }
                                                          if(level9.type === "folder") {
                                                            const fileName9 = level9.name;
                                                            zip.folder(fileName9);
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
    }
  }
  var jsZipExport = regDest + "driveDownload" + files[0].id + "." + 'zip';
  zip
  .generateNodeStream({type:'nodebuffer', streamFiles:true})
  .pipe(fs.createWriteStream(jsZipExport))
  .on('finish', function () {
      // JSZip generates a readable stream with a "end" event,
      // but is piped here in a writable stream which emits a "finish" event.
      console.log("zip file written.");
      res.download(newPath)
  });
})
// Extension Push

app.get('/classroomexport2', async (req, res) => {
  let gapiAuthenticated = req.app.get('gapi');
  let parentFolder = req.app.get("classroomParent");
  let fileArray = req.app.get("fileArray");
  function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }
  for(var i = 0; i < fileArray.length; i++) {
    if (fileArray[i].type != "folder") {
      const fileNameFile = fileArray[i].name;
      const typeFile = fileArray[i].type;
      const descriptionFile = fileArray[i].description;
      let newType = ''
      if(typeFile === 'docx') {
        newType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      }
      if(typeFile === 'pptx') {
        newType = 'application/vnd.google-apps.presentation'
      }
      if(typeFile === 'xlsx') {
        newType === 'application/vnd.google-apps.spreadsheet'
      }
      const destFile = './src/Pages/downloads/' + fileName + '.' + type;
      let newId = ''
      var fileMetadata = {
        'name': fileNameFile,
        'description': descriptionFile,
        'parents': [parentFolder]
      };
      var media = {
        mimeType: newType,
        body: fs.createReadStream(destFile)
      }; 
      console.log("This is the body of topfile " + media)
      await gapiAuthenticated.files.create({
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
    if(fileArray[i].type === "folder") {
      const fileName = fileArray[i].name;
      const description = fileArray[i].description;
      let newType = 'application/vnd.google-apps.folder'
      const destSimple = './src/Pages/downloads/' + fileName;
    
      var fileMetadata = {
        'name': fileName,
        'description': description,
        'parents': [parentFolder],
        'mimeType': newType,
      };
      var newIdFolder = ""
      function driveCreateFolder() {
        return new Promise(function (resolve, reject) { 
          gapiAuthenticated.files.create({
            resource: fileMetadata,
            fields: 'id',
          }, function (err, file) {
            if (err) {
              console.log("Error for file creation: " + err);
            } else {
              console.log(file)
              var newIdFolderIn = file.data.id;
              resolve(newIdFolder = newIdFolderIn);
              console.log("This is the top folder id = " + file.data.id)
            }
          });
        })
      }
      await driveCreateFolder();                    
      sleep(2000);
      //1
      for(var y = 0; y < fileArray[i].children.length; y++) {
        const level1 = fileArray[i].children[y]; 
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
          var media1 = {}
          console.log("This is the file metadata for level1 files: " + fileMetadata1)
          fetch('https://connect.smartpathed.com/makefile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({
              newType: newType1,
              dest: destSimple1,
            }, (err) => {if (err) return console.log(err);})
          }) 
          .then(async function(err) {
            if(err) return console.log(err);
            let url = 'https://connect.smartpathed.com/getfile';
            let responseFetchFile1 = await fetch(url);
            media1 = await responseFetchFile1.json();
            return media1;
          })
          console.log("This is the body for level1 files: " + media1)
          gapiAuthenticated.files.create({
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
          var newIdFolder1 = ""
          function driveCreateFolder1() {
            return new Promise(function (resolve, reject) { 
              gapiAuthenticated.files.create({
                resource: fileMetadata1,
                fields: 'id',
              }, function (err, file) {
                if (err) {
                  console.log("Error for file creation: " + err);
                } else {
                  console.log(file)
                  var newIdFolderIn1 = file.data.id;
                  resolve(newIdFolder1 = newIdFolder);
                }
              });
            })
          }
          await driveCreateFolder1();                            
          sleep(2000);
          //2
          for(var a = 0; a < level1.children.length; a++) {
            const level2 = level1.children[a]; 
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
              var media2 = {};
              fetch('https://connect.smartpathed.com/makefile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify({
                  newType: newType2,
                  dest: destSimple2,
                }, (err) => {if (err) return console.log(err);})
              })
              .then(async function(err) {
                if(err) return console.log(err);
                let url = 'https://connect.smartpathed.com/getfile';
                let responseFetchFile2 = await fetch(url);
                media2 = await responseFetchFile2.json();
                return media2;
              }) 
              console.log(media)
              await gapiAuthenticated.files.create({
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
              var newIdFolder2 = "";
              function driveCreateFolder2() {
                return new Promise(function (resolve, reject) { 
                  gapiAuthenticated.files.create({
                    resource: fileMetadata2,
                    fields: 'id',
                  }, function (err, file) {
                    if (err) {
                      console.log("Error for file creation: " + err);
                    } else {
                      console.log(file)
                      var newIdFolderIn2 = file.data.id;
                      resolve(newIdFolder2 = newIdFolderIn2);
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
                    var media3 = {};
                    fetch('https://connect.smartpathed.com/makefile', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                      body: JSON.stringify({
                        newType: newType3,
                        dest: destSimple3,
                      }, (err) => {if (err) return console.log(err);})
                    })
                    .then(async function(err) {
                      if(err) return console.log(err);
                      let url = 'https://connect.smartpathed.com/getfile';
                      let responseFetchFile3 = await fetch(url);
                      media3 = await responseFetchFile3.json();
                      return media3;
                    }) 
                    await gapiAuthenticated.files.create({
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
                    var newIdFolder3 = "";
                    function driveCreateFolder3() {
                      return new Promise(function (resolve, reject) { 
                        gapiAuthenticated.files.create({
                          resource: fileMetadata3,
                          fields: 'id',
                        }, function (err, file) {
                          if (err) {
                            console.log("Error for file creation: " + err);
                          } else {
                            var newIdFolderIn3 = file.data.id;
                            resolve(newIdFolder3 = newIdFolderIn3);
                          }
                        });
                      })
                    }
                    await driveCreateFolder3();                                                
                    sleep(2000);
                    if(level3.children != []) {
                      //4
                      for(var c = 0; c < level3.children.length; c++) {
                        const level4 = level3.children[c]; 
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
                          var media4 = {};
                          fetch('https://connect.smartpathed.com/makefile', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                            body: JSON.stringify({
                              newType: newType4,
                              dest: destSimple4,
                            }, (err) => {if (err) return console.log(err);})
                          })
                          .then(async function(err) {
                            if(err) return console.log(err);
                            let url = 'https://connect.smartpathed.com/getfile';
                            let responseFetchFile4 = await fetch(url);
                            media4 = await responseFetchFile4.json();
                            return media4;
                          })
                          await gapiAuthenticated.files.create({
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
                          newIdFolder4 = ""
                          function driveCreateFolder4() {
                            return new Promise(function (resolve, reject) { 
                              gapiAuthenticated.files.create({
                                resource: fileMetadata4,
                                fields: 'id',
                              }, function (err, file) {
                                if (err) {
                                  console.log("Error for file creation: " + err);
                                } else {
                                  var newIdFolderIn4 = file.data.id;
                                  resolve(newIdFolder4 = newIdFolderIn4);
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
                                var media5 = {};
                                console.log(media)
                                fetch('https://connect.smartpathed.com/makefile', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                                  body: JSON.stringify({
                                    newType: newType5,
                                    dest: destSimple5,
                                  }, (err) => {if (err) return console.log(err);})
                                })
                                .then(async function(err) {
                                  if(err) return console.log(err);
                                  let url = 'https://connect.smartpathed.com/getfile';
                                  let responseFetchFile5 = await fetch(url);
                                  media5 = await responseFetchFile5.json();
                                  return media5;
                                })
                                await gapiAuthenticated.files.create({
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
                                var newIdFolder5 = ""
                                function driveCreateFolder5() {
                                  return new Promise(function (resolve, reject) { 
                                    gapiAuthenticated.files.create({
                                      resource: fileMetadata5,
                                      fields: 'id',
                                    }, function (err, file) {
                                      if (err) {
                                        console.log("Error for file creation: " + err);
                                      } else {
                                        var newIdFolderIn5 = file.data.id;
                                        resolve(newIdFolder5 = newIdFolderIn5);
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
                                      var media6 = {};
                                      console.log(media)
                                      fetch('https://connect.smartpathed.com/makefile', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                                        body: JSON.stringify({
                                          newType: newType6,
                                          dest: destSimple6,
                                        }, (err) => {if (err) return console.log(err);})
                                      })
                                      .then(async function(err) {
                                        if(err) return console.log(err);
                                        let url = 'https://connect.smartpathed.com/getfile';
                                        let responseFetchFile6 = await fetch(url);
                                        media6 = await responseFetchFile6.json();
                                        return media6;
                                      })
                                      await gapiAuthenticated.files.create({
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
                                      var newIdFolder6 = ""
                                      function driveCreateFolder6() {
                                        return new Promise(function (resolve, reject) { 
                                          gapiAuthenticated.files.create({
                                            resource: fileMetadata6,
                                            fields: 'id',
                                          }, function (err, file) {
                                            if (err) {
                                              console.log("Error for file creation: " + err);
                                            } else {
                                              var newIdFolderIn6 = file.data.id;
                                              resolve(newIdFolder6 = newIdFolderIn6);
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
                                            fetch('https://connect.smartpathed.com/makefile', {
                                              method: 'POST',
                                              headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                                              body: JSON.stringify({
                                                newType: newType7,
                                                dest: destSimple7,
                                              }, (err) => {if (err) return console.log(err);})
                                            })
                                            .then(async function(err) {
                                              if(err) return console.log(err);
                                              let url = 'https://connect.smartpathed.com/getfile';
                                              let responseFetchFile7 = await fetch(url);
                                              media7 = await responseFetchFile7.json();
                                              return media7;
                                            })
                                            await gapiAuthenticated.files.create({
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
                                            var newIdFolder7 = ""
                                            function driveCreateFolder7() {
                                              return new Promise(function (resolve, reject) { 
                                                gapiAuthenticated.files.create({
                                                  resource: fileMetadata7,
                                                  fields: 'id',
                                                }, function (err, file) {
                                                  if (err) {
                                                    console.log("Error for file creation: " + err);
                                                  } else {
                                                    var newIdFolderIn7 = file.data.id;
                                                    resolve(newIdFolder7 = newIdFolderIn7);
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
                                                  var media8 = {};
                                                  fetch('https://connect.smartpathed.com/makefile', {
                                                    method: 'POST',
                                                    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                                                    body: JSON.stringify({
                                                      newType: newType8,
                                                      dest: destSimple8,
                                                    }, (err) => {if (err) return console.log(err);})
                                                  })
                                                  .then(async function(err) {
                                                    if(err) return console.log(err);
                                                    let url = 'https://connect.smartpathed.com/getfile';
                                                    let responseFetchFile8 = await fetch(url);
                                                    media8 = await responseFetchFile8.json();
                                                    return media8;
                                                  })
                                                  await gapiAuthenticated.files.create({
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
                                                  var newIdFolder8 = "";
                                                  function driveCreateFolder8() {
                                                    return new Promise(function (resolve, reject) { 
                                                      gapiAuthenticated.files.create({
                                                        resource: fileMetadata8,
                                                        fields: 'id',
                                                      }, function (err, file) {
                                                        if (err) {
                                                          console.log("Error for file creation: " + err);
                                                        } else {
                                                          var newIdFolderIn8 = file.data.id;
                                                          resolve(newIdFolder8 = newIdFolderIn8);
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
                                                        var media9 = {};
                                                        console.log(media)
                                                        fetch('https://connect.smartpathed.com/makefile', {
                                                          method: 'POST',
                                                          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                                                          body: JSON.stringify({
                                                            newType: newType9,
                                                            dest: destSimple9,
                                                          }, (err) => {if (err) return console.log(err);})
                                                        })
                                                        .then(async function(err) {
                                                          if(err) return console.log(err);
                                                          let url = 'https://connect.smartpathed.com/getfile';
                                                          let responseFetchFile9 = await fetch(url);
                                                          media9 = await responseFetchFile9.json();
                                                          return media9;
                                                        })
                                                        await gapiAuthenticated.files.create({
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
                                                            gapiAuthenticated.files.create({
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

app.post('/makegapi', (req, res) => {
  let gapi = req.body.gapi;
  app.set('gapi', gapi);
  console.log(req.body.gapi);
})

app.get('/getgapi', (req, res) => {
  // The ID of the extension we want to talk to.
})

app.post('/makeclassroomfilearray', (req, res) => {
  let classroomFileArray = req.body.fileArray;
  console.log("from post request: " + classroomFileArray);
  app.set("classroomFileArray", classroomFileArray);
  res.end("classroomFileArray created.")
})

app.get('/getclassroomfilearray', (req, res) => {
  let classroomFileArray = req.app.get("classroomFileArray");
  console.log("from get request - " + classroomFileArray[0]);
  res.send(classroomFileArray);
})

app.post('/makeclassroomparent', (req, res) => {
  let classroomParent = req.body.classroomParent;
  console.log("from classroom parent post request: " + classroomParent);
  app.set("classroomParent", classroomParent);
  res.end("classroom parent created.")
})

app.get('/getclassroomparent', (req, res) => {
  let classroomParent = req.app.get("classroomParent");
  console.log("from classroom parent get request: " + classroomParent);
  res.send(classroomParent);
})

app.post('/makeclassroomarrayselect', (req, res) => {
  let fileArray = req.body.fileArray;
  console.log("from classroomfilearray post request: " + fileArray)
  app.set("fileArray", fileArray);
  res.end("next classroom file array recieved.")
})

app.get('/getclassroomarrayselect', (req, res) => {
  let fileArray = req.app.get("fileArray")
  console.log("from classroomfilearray get request: " + fileArray)
  res.send(fileArray);
})

app.post('/makefile', (req, res) => {
  const newType = req.body.newType;
  console.log("this is the file type in post request: " + newType);
  const dest = req.body.fileDest;
  console.log("this is the file destination: " + dest);

  var media = {
    mimeType: newType,
    body: fs.createReadStream(dest),
  };

  app.set("media", media);

})

app.post("/verifychromeemail", (req, res) => {
  var email = req.body.email;
  console.log("this is from the verify request: " + email)
  function getSecondPart(str) {
    return str.split('@')[1];
  }
  var emailDomain = "@" + getSecondPart(email);
  console.log(emailDomain);
  var message;
  Domains.find({name: "Domains"}, (err, res) => {
    if (err) {
      console.log(err);
      message = false;
      console.log(message)
      app.set('message', message)
    };
    var foundDomains = res[0].domains;
    console.log(foundDomains)
    domains: for(var i = 0; i < foundDomains.length; i++) {
      if(foundDomains[i] === emailDomain) {
        message = true;
        console.log("domain matches.")
        app.set('message', message);
        break domains;
      }
      //else {
      //   SpecialUsers.find({name: "Special Users"}, (err, res) => {
      //    if(err) return console.log(err);
      //    var specialUsers = res[0].emails;
      //    special: for(var y = 0; y < specialUsers.length; y++) {
      //      if(specialUsers[i] === emailDomain) {
      //        message = true;
      //        console.log("special user matches.")
      //        app.set('message', message);
      //        break special;
      //      }
      //      else {
      //        message = false;
      //        console.log("special user does not match.")
      //        app.set('message', message);
      //      }
      //    }
      //  })
      //}
    }
  })
  res.end("verify function ran.")
})

app.get("/getemailmessage", (req, res) => {
  var responsemessage = req.app.get('message');
  console.log("this is from emailMessage: " + responsemessage);
  res.send(responsemessage);
})

app.get("/getfile", (req, res) => {
  const file = req.app.get('media');
  console.log(file);
  res.send(file);
})

app.get("/getfilename/:filename", (req, res) => {
  console.log(req.params['filename']);
  var filePath = req.params['filename'];
  res.sendFile('./src/Pages/downloads/' + filePath, {root: __dirname }, function(err) {
    if(err) return console.log(err);
    else {console.log("sent " + filePath)}
  })
})

app.get('/chrometest', (req, res) => {
  console.log("button pressed")
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
              const emailClick = 'https:/connect.smartpathed.com/verify/' + data._id
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
      if(foundDomains[i] !== domain) {
        SpecialUsers.find({name: "Special Users"}, (err, res) => {
          if (err) {
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
                    const emailClick = 'https:/connect.smartpathed.com/verify/' + data._id
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
            else {
              console.log("user is not found");
            }
          }
        })
      }
    }
  })
  res.end("register function ran.")
}); 

app.get("/registerConfirm", (req, res) => {
  if(req.session.sessionID) {
    res.send(true);
    console.log("registerConfirm ran.")
  }
  else{ 
      res.send(false); 
  }
})

app.post('/verify/*', (req, res) => {
  const wholeurl = req.url;
  var cut = "verify/"
  var code = wholeurl.slice(wholeurl.indexOf(cut) + cut.length);

  User.find({_id: code}, {$set: {active: true}}, {new: true}, (err, data) => {
    if(err) return console.log(err);
    req.session.sessionID = data._id;
    res.send("Your Email is now authenticated!")
    done(null, data)
  })
  res.end("email verify ran.")
})

app.post('/login', async (req, res, done) => {
  const email = req.body.email; 
  const password = req.body.password;
  await User.find({email: email}, (err, data) => {
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
              console.log('passwords do not match.');
              res.end();
          }
          if(result === true) {
            req.session.sessionID = data[0]._id; 
            console.log(data);
            Domains.find({name: "Domains"}, (err, res) => {
              if (err) return console.log(err);
              var foundDomains = res[0].domains;
              for(var i = 0; i < foundDomains.length; i++) {
                if(foundDomains[i] === data[0].domain) {
                  console.log(req.session.sessionID); 
                  done();
                }
                if(foundDomains[i] !== data[0].domain) {
                  SpecialUsers.find({name: "Special Users"}, (err, res) => {
                    if(err) return console.log(err);
                    var specialUsers = res[0].emails;
                    for(var y = 0; y < specialUsers.length; y++) {
                      if(specialUsers[i] === data[0].email) {
                        done(null, req.session.sessionID);
                        console.log(req.session.sessionID);
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
  console.log("this is the session id: " + req.session.sessionID)
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
  if(!req.session.sessionID) {
  console.log("no session id found.")
  }
  res.end();
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
  
  res.end("add domain ran.")
})

app.post('/removedomain', (req, res) => {
  const newDomain = req.body.domain; 
  Domains.findOne({name: "Domains"}, (err, data) => {
    if (err) return console.log(err);
    for(var i = 0; i < data.length; i++) {
      if(data[i] === newDomain) {
        data.splice(i, 1);
        data.save();
      }
    }
  })
  res.end("remove domain ran.")
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
  SpecialUsers.findOneAndUpdate(
    {name: "Special Users"}, 
    {$push: {emails: newUser}},
    {new: true},
    (err, data) => {console.log(data)})

  res.end("add special user ran.")
})

app.post('/removespecialuser', (req, res) => {
  const newUser = req.body.specialUser;
  SpecialUsers.findOne({name: "Special Users"}, (err, data) => {
    if(err) return console.log(err);
    for(var i = 0; i < data.length; i++) {
      if(data[i] === newUser) {
        data.splice(i, 1);
        data.save();
      }
    }
  })
  res.end("remove special user ran.")
})

app.get('/api', (req, res, done) => {
  var fileArray = req.app.get('fileArray');
  res.send(fileArray);
  console.log("sent.");
  done;
})

app.post('/update', async (req, res) => {
  let drive = req.app.get('drive');
  let fileId = req.body.id;
  let description = req.body.description;
  let subject = req.body.subject;
  let grade = req.body.grade;
  let industry = req.body.industry;
  let contains1 = req.body.contains1;
  let contains2 = req.body.contains2;
  let contains3 = req.body.contains3;
  let response = await TagFile.findOne({ id: fileId }, (err, res, done) => {
    if (err) return console.log(err);
    else {
      if (description) {
        drive.files.update({
          fileId: fileId,
          requestBody: {description: description},
        })
      }
      if(subject) {
        for (var i = 0; i < subject.length; i++) {
          if(!res.subject.includes(subject[i])) {
            res.subject.push(subject[i]);
            var newSubjects = res.subject;
            console.log(newSubjects);
            console.log(res);
          }
          else {
            console.log("all subjects included")
          }
        }
        res.save((err, data) => {
          if(err) return console.log(err);
          console.log(data);
        })
      }
      if(grade) {
        for (var i = 0; i < grade.length; i++) {
          if(!res.grade.includes(grade[i])) {
            res.grade.push(grade[i]);
          }
          else {
            console.log("all grades included")
          }
        }
        res.save((err, data) => {
          if(err) return console.log(err);
          console.log(data);
        })
      }
      if(industry) {
        for (var i = 0; i < industry.length; i++) {
          if(!res.industry.includes(industry[i])) {
            res.industry.push(industry[i]);
          }
          else {
            console.log("all industries included")
          }
        }
        res.save((err, data) => {
          if(err) return console.log(err);
          console.log(data);
        })
      }
      if(contains1) {
        res.contains1 = contains1;
        res.save((err, data) => {
          if(err) return console.log(err);
          console.log(data);
        })
      }
      if(contains2) {
        res.contains2 = contains2;
        res.save((err, data) => {
          if(err) return console.log(err);
          console.log(data);
        })
      }
      if(contains3) {
        res.contains3 = contains3;
        res.save((err, data) => {
          if(err) return console.log(err);
          console.log(data);
        })
      }
    }
  });
  console.log(response);
  res.end("update ran.")
})

app.post("/makenew", (req, res) => {
  var drive = req.app.get('drive');
  var name = req.body.name;
  var description = req.body.description;
  var type = 'application/vnd.google-apps.folder';
  var subject = req.body.subjectArray;
  var grade = req.body.gradeArray;
  var industry = req.body.industryArray;
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
      var newTag = new TagFile({id: file.id, subject: subject, grade: grade, industry: industry});
        newTag.save((err, res) => {
          if (err) return console.log(err);
          console.log(res);
        })
    }
  });
  res.end("makenew ran.")
})

app.post('/profile', function (req, res) {
  var drive = req.app.get('drive');
  const id = req.body.fileId; 
  console.log(id);
  const imgurl = req.file.imgurl;
  drive.files.update({
    fileId: id,
    requestBody: {properties: {imgsrc: imgurl}},
  })
  res.end("profile ran.")
})

app.post('/photoupload', uploads.single('image'), (req, res, next) => {
  var obj = {
    id: req.body.fileId,
    img: {
        data: fs.readFileSync('./src/Pages/img/' + req.file.filename),
        contentType: 'image/png'
    }
  }
  Images.create(obj, (err, item) => {
      if (err) return console.log(err)
      console.log(item);
  });
  res.end("photoupload ran.")
});

app.get('/photocall/:photoid', (req, res) => {
  console.log(req.params['id']);
  var photoId = req.params['photoname']
  Images.find({id: photoId}, (err, data) => {
    if (err) return console.log(err);
    var imgFile = data[0]
    const rawBuffer = imgFile.toString("base64");
    const imageSrc = "data:image/png;base64," + rawBuffer;
    res.send(imageSrc);
  })
})


// CHROME EXTENSION REQUESTS


app.get('/filewrite', (req, res) => {
  var filePath = req.body.filePath;
  fs.writeFile
})