import React from 'react'; 
import "../App.css"; 
import Container from 'react-bootstrap/Container'; 
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col'; 
import Button from 'react-bootstrap/Button';
import {Form} from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Link from 'react-router-dom/Link';
import Redirect from 'react-router-dom/Redirect'

import TopNavbar from './navbar';
import Footer from './Footer'
import GoogleBtn from './GoogleBtn';
import Register from './register';
import Login from './login';

function importAll(r) {
    let images = [];
    r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
    return images;
  }
  
const images = importAll(require.context('./img', false, /\.(png|jpe?g|svg)$/));
console.log(images)

function loopImages() {
    for(var i = 0; i < images.length; i++) {
        console.log(images[i]);
    }
}

loopImages();

class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = ({
            session: false,
            driveFiles: [],
            downloadLink: '',
            searchTerm: 'Search Here',
            searchRan: false,
            foundFolders: [],
            foundFiles: [],
            subject: '',
            grade: '',
            industry: '',
            id: '',
            contains1: '',
            contains2: '',
            contains3: '',
            fileName: '',
            exportFileType: 'docx',
            exportFolderType: 'zip',
            exportFileArray: [{
              id: '',
              name: '',
              type: '',
              downloadPath: '',
            }],
            downloadPath: '',
            subjectArray: [],
            gradeArray: [],
            industryArray: [],
            classroomFolders: [],
            newClassroomFolders: [],
            classroomParent: '',
            exportResult: 'first',
            visible: true,

            // Search Terms

                // Subjects
                math: false,
                science: false,
                socialStudies: false,
                languageArts: false,
                careers: false,
                technology: false,

                // Grades 
                preK: false,
                K: false, 
                first: false,
                second: false,
                third: false,
                fourth: false,
                fifth: false,
                sixth: false, 
                seventh: false,
                eighth: false,
                ninth: false,
                tenth: false,
                eleventh: false,
                twelveth: false,

                // Industry
                agriculture: false,
                architecture: false,
                arts: false,
                businessManagement: false,
                educationTraining: false,
                finance: false,
                governmentPublic: false,
                healthScience: false,
                hospitality: false,
                humanServices: false,
                informationTechnology: false,
                lawSafety: false,
                manufacturing: false,
                marketingSales: false,
                sTEM: false,
                transportation: false,
                

                
        })
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.organizeFiles = this.organizeFiles.bind(this);
        this.handleChangeSearch = this.handleChangeSearch.bind(this);
        this.handleChangeCheckFile = this.handleChangeCheckFile.bind(this);
        this.exportFunction = this.exportFunction.bind(this);
        this.handleChangeFileType = this.handleChangeFileType.bind(this);
        this.handleChangeSetParent = this.handleChangeSetParent.bind(this);
        this.handleChangeSubject = this.handleChangeSubject.bind(this);
        this.handleChangeGrade = this.handleChangeGrade.bind(this);
        this.handleChangeIndustry = this.handleChangeIndustry.bind(this);
        this.removeTagSubject = this.removeTagSubject.bind(this);
        this.removeTagGrade = this.removeTagGrade.bind(this);
        this.removeTagIndustry = this.removeTagIndustry.bind(this);
        this.searchFunction = this.searchFunction.bind(this);
        this.downloadFile = this.downloadFile.bind(this);
        this.downloadFolder = this.downloadFolder.bind(this);
        this.getFoldersClassroom = this.getFoldersClassroom.bind(this);
        this.organizeClassroomFolders = this.organizeClassroomFolders.bind(this);
        this.classroomExport = this.classroomExport.bind(this); 
        this.fileDownload = this.fileDownload.bind(this);
        this.downloadTest = this.downloadTest.bind(this);
        
    }
    

    openModal = () => this.setState({ isOpen: true });
    closeModal = () => this.setState({ isOpen: false });


    async componentDidMount() {
        fetch('/api')
        .then(res => res.json())
        .then(res => this.setState({driveFiles: res}))
        this.organizeFiles();
        await fetch('/apicall')
        .then(res => res.json())
        .then(res => this.setState({session: res}))
    }

    organizeFiles() {
        var driveFiles = this.state.driveFiles;
        console.log(driveFiles);
        for (var i = 0; i < driveFiles.length; i++) {
          if(driveFiles[i].parents === undefined) {continue}
            for(var y = 0; y < driveFiles.length; y++) {
              if(driveFiles[i].parents === undefined) {continue}
              if(driveFiles[y].parents === undefined) {continue}
                if(driveFiles[i].id === driveFiles[y].parents[0]) {
                    if (!driveFiles[i].children) {
                        driveFiles[i].children = [driveFiles[y].id]
                    }
                    else {
                        driveFiles[i].children.push(driveFiles[y].id)
                    }
                }
            }
            if (driveFiles[i].type === 'application/vnd.google-apps.folder') {
                driveFiles[i].click = 'https://drive.google.com/drive/folders/' + driveFiles[i].id;
            }
            if (driveFiles[i].type === 'application/vnd.google-apps.document') {
                driveFiles[i].click = 'https://docs.google.com/document/d/' + driveFiles[i].id;
            }
        }
        console.log(driveFiles);
        return driveFiles;
        
    }

    handleChangeSearch(event) {
        this.setState({
          searchTerm: event.target.value
        })
    }

    exportFunction() {
      this.openModal();
      this.downloadFile();
    }

    handleChangeCheckFile(event) {
      var fileArray = this.organizeFiles();
      console.log("checkfile called")
      var exportFileArray = this.state.exportFileArray;
      var newArray = [];
      var newType = '';
      console.log(event.target.title);
      console.log(event.target.value);
      if(event.target.title === 'application/vnd.google-apps.document') {
        newType = "docx"
        newArray.push({id: event.target.value, name: event.target.name, type: newType})
      }
      if(event.target.title === 'application/vnd.google-apps.presentation') {
        newType = "pptx"
        newArray.push({id: event.target.value, name: event.target.name, type: newType})
      }
      if(event.target.title === 'application/vnd.google-apps.spreadsheet') {
        newType = "xlsx"
        newArray.push({id: event.target.value, name: event.target.name, type: newType})
      }
      if(event.target.title === 'application/pdf') {
        newType = "pdf"
        newArray.push({id: event.target.value, name: event.target.name, type: newType})
      }
      if(event.target.title === 'audio/mpeg') {
        newType = "mp3"
        newArray.push({id: event.target.value, name: event.target.name, type: newType})
      }
      if(event.target.title === 'audio/wav') {
        newType = "wav"
        newArray.push({id: event.target.value, name: event.target.name, type: newType})
      }
      if(event.target.title === 'video/mp4') {
        newType = "mp4"
        newArray.push({id: event.target.value, name: event.target.name, type: newType})
      }
      if(event.target.title === 'image/jpg') {
        newType = "jpg"
        newArray.push({id: event.target.value, name: event.target.name, type: newType})
      }
      if(event.target.title === 'image/png') {
        newType = "png"
        newArray.push({id: event.target.value, name: event.target.name, type: newType})
      }
      if(event.target.title === 'application/msword') {
        newType = "doc"
        newArray.push({id: event.target.value, name: event.target.name, type: newType})
      }
      if(event.target.title === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        newType = "docx"
        newArray.push({id: event.target.value, name: event.target.name, type: newType})
      }
      if(event.target.title === 'application/vnd.ms-powerpoint') {
        newType = "ppt"
        newArray.push({id: event.target.value, name: event.target.name, type: newType})
      }
      if(event.target.title === 'text/plain') {
        newType = "txt"
        newArray.push({id: event.target.value, name: event.target.name, type: newType})
      }
      if(event.target.title === 'application/x-zip-compressed') {
        newType = "zip"
        newArray.push({id: event.target.value, name: event.target.name, type: newType})
      }
      if(event.target.title === 'application/vnd.google-apps.folder') {
        newType = "folder";
        newArray.push({id: event.target.value, name: event.target.name, type: newType, children: []})
        console.log(newArray)
        // 1 
        for (var y = 0; y < fileArray.length; y++) {
          if (fileArray[y].parents[0] === event.target.value) {
            console.log(fileArray[y]);
            var parent = fileArray[y].parents[0]
            if(fileArray[y].type === 'application/vnd.google-apps.document') {
              console.log(fileArray[y]);
              newType = "docx";
              for(var y1 = 0; y1 < newArray.length; y1++) {
                if(newArray[y1].id === event.target.value) {
                  newArray[y1].children.push({id: fileArray[y].id, name: fileArray[y].file, type: newType, parent: parent})
                }
              }
            }
            if(fileArray[y].type === 'application/vnd.google-apps.presentation') {
              newType = "pptx"
              for(var y2 = 0; y2 < newArray.length; y2++) {
                if(newArray[y2].id === event.target.value) {
                  newArray[y2].children.push({id: fileArray[y].id, name: fileArray[y].file, type: newType, parent: parent})
                }
              }
            }
            if(fileArray[y].type === 'application/vnd.google-apps.spreadsheet') {
              newType = "xlsx"
              for(var y3 = 0; y3 < newArray.length; y3++) {
                if(newArray[y3].id === event.target.value) {
                  newArray[y3].children.push({id: fileArray[y].id, name: fileArray[y].file, type: newType, parent: parent})
                }
              }
            }
            if(fileArray[y].type === 'application/pdf') {
              newType = "pdf"
              for(var y32 = 0; y32 < newArray.length; y32++) {
                if(newArray[y32].id === event.target.value) {
                  newArray[y32].children.push({id: fileArray[y].id, name: fileArray[y].file, type: newType, parent: parent})
                }
              }
            }
            if(fileArray[y].type === 'audio/mpeg') {
              newType = "mp3"
              for(var y33 = 0; y33 < newArray.length; y33++) {
                if(newArray[y33].id === event.target.value) {
                  newArray[y33].children.push({id: fileArray[y].id, name: fileArray[y].file, type: newType, parent: parent})
                }
              }
            }
            if(fileArray[y].type === 'audio/wav') {
              newType = "wav"
              for(var y34 = 0; y34 < newArray.length; y34++) {
                if(newArray[y34].id === event.target.value) {
                  newArray[y34].children.push({id: fileArray[y].id, name: fileArray[y].file, type: newType, parent: parent})
                }
              }
            }
            if(fileArray[y].type === 'video/mp4') {
              newType = "mp4"
              for(var y35 = 0; y35 < newArray.length; y35++) {
                if(newArray[y35].id === event.target.value) {
                  newArray[y35].children.push({id: fileArray[y].id, name: fileArray[y].file, type: newType, parent: parent})
                }
              }
            }
            if(fileArray[y].type === 'image/jpeg') {
              newType = "jpg"
              for(var y36 = 0; y36 < newArray.length; y36++) {
                if(newArray[y36].id === event.target.value) {
                  newArray[y36].children.push({id: fileArray[y].id, name: fileArray[y].file, type: newType, parent: parent})
                }
              }
            }
            if(fileArray[y].type === 'image/png') {
              newType = "png"
              for(var y37 = 0; y37 < newArray.length; y37++) {
                if(newArray[y37].id === event.target.value) {
                  newArray[y37].children.push({id: fileArray[y].id, name: fileArray[y].file, type: newType, parent: parent})
                }
              }
            }
            if(fileArray[y].type === 'application/msword') {
              newType = "doc"
              for(var y38 = 0; y38 < newArray.length; y38++) {
                if(newArray[y38].id === event.target.value) {
                  newArray[y38].children.push({id: fileArray[y].id, name: fileArray[y].file, type: newType, parent: parent})
                }
              }
            }
            if(fileArray[y].type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
              newType = "docx"
              for(var y39 = 0; y39 < newArray.length; y39++) {
                if(newArray[y39].id === event.target.value) {
                  newArray[y39].children.push({id: fileArray[y].id, name: fileArray[y].file, type: newType, parent: parent})
                }
              }
            }
            if(fileArray[y].type === 'application/vnd.ms-powerpoint') {
              newType = "ppt"
              for(var y391 = 0; y391 < newArray.length; y391++) {
                if(newArray[y391].id === event.target.value) {
                  newArray[y391].children.push({id: fileArray[y].id, name: fileArray[y].file, type: newType, parent: parent})
                }
              }
            }
            if(fileArray[y].type === 'text/plain') {
              newType = "txt"
              for(var y392 = 0; y392 < newArray.length; y392++) {
                if(newArray[y392].id === event.target.value) {
                  newArray[y392].children.push({id: fileArray[y].id, name: fileArray[y].file, type: newType, parent: parent})
                }
              }
            }
            if(fileArray[y].type === 'application/vnd.google-apps.folder') {
              console.log(fileArray[y])
              newType = "folder";
              for (var y4 = 0; y4 < newArray.length; y4++) {
                if(newArray[y4].id === event.target.value) {
                  newArray[y4].children.push({id: fileArray[y].id, name: fileArray[y].file, type: newType, parent: parent, children: []})
                  console.log(newArray[y4].children);
                }
              }
              //2
              for (var a = 0; a < fileArray.length; a++) {
                if (fileArray[a].parents[0] === fileArray[y].id) {
                  console.log(fileArray[y]);
                  console.log(fileArray[a])
                  var parent = fileArray[a].parents[0]
                  if(fileArray[a].type === 'application/vnd.google-apps.document') {
                    newType = "docx";
                    // level 1
                    for(var a1 = 0; a1 < newArray.length; a1++) {
                      if(newArray[a1].id === event.target.value) {
                        // level 2
                        for(var aa1; aa1 < newArray[a1].children.length; aa1++) {
                          if(newArray[a1].children[aa1].id === fileArray[y].id) {
                            newArray[a1].children[aa1].children.push({id: fileArray[a].id, name: fileArray[a].file, type: newType, parent: parent})
                          }
                        } 
                      }
                    }
                  }
                  if(fileArray[a].type === 'application/vnd.google-apps.presentation') {
                    newType = "pptx"
                     // level 1
                     for(var a2 = 0; a2 < newArray.length; a2++) {
                      if(newArray[a2].id === event.target.value) {
                        // level 2
                        for(var aa2; aa2 < newArray[a2].children.length; aa2++) {
                          if(newArray[a2].children[aa2].id === fileArray[y].id) {
                            newArray[a2].children[aa2].children.push({id: fileArray[a].id, name: fileArray[a].file, type: newType, parent: parent})
                          }
                        } 
                      }
                    }
                  }
                  if(fileArray[a].type === 'application/vnd.google-apps.spreadsheet') {
                    newType = "xlsx"
                    // level 1
                    for(var a3 = 0; a3 < newArray.length; a3++) {
                      if(newArray[a3].id === event.target.value) {
                        // level 2
                        for(var aa3; aa3 < newArray[a3].children.length; aa3++) {
                          if(newArray[a3].children[aa3].id === fileArray[y].id) {
                            newArray[a3].children[aa3].children.push({id: fileArray[a].id, name: fileArray[a].file, type: newType, parent: parent})
                          }
                        } 
                      }
                    }
                  }
                  if(fileArray[a].type === 'application/pdf') {
                    newType = "pdf"
                    // level 1
                    for(var a32 = 0; a32 < newArray.length; a32++) {
                      if(newArray[a32].id === event.target.value) {
                        // level 2
                        for(var aa32; aa32 < newArray[a32].children.length; aa32++) {
                          if(newArray[a32].children[aa32].id === fileArray[y].id) {
                            newArray[a32].children[aa32].children.push({id: fileArray[a].id, name: fileArray[a].file, type: newType, parent: parent})
                          }
                        } 
                      }
                    }
                  }
                  if(fileArray[a].type === 'audio/mpeg') {
                    newType = "mp3"
                    // level 1
                    for(var a33 = 0; a33 < newArray.length; a33++) {
                      if(newArray[a33].id === event.target.value) {
                        // level 2
                        for(var aa33; aa33 < newArray[a33].children.length; aa33++) {
                          if(newArray[a33].children[aa33].id === fileArray[y].id) {
                            newArray[a33].children[aa33].children.push({id: fileArray[a].id, name: fileArray[a].file, type: newType, parent: parent})
                          }
                        } 
                      }
                    }
                  }
                  if(fileArray[a].type === 'audio/wav') {
                    newType = "wav"
                    // level 1
                    for(var a34 = 0; a34 < newArray.length; a34++) {
                      if(newArray[a34].id === event.target.value) {
                        // level 2
                        for(var aa34; aa34 < newArray[a34].children.length; aa34++) {
                          if(newArray[a34].children[aa34].id === fileArray[y].id) {
                            newArray[a34].children[aa34].children.push({id: fileArray[a].id, name: fileArray[a].file, type: newType, parent: parent})
                          }
                        } 
                      }
                    }
                  }
                  if(fileArray[a].type === 'video/mp4') {
                    newType = "mp4"
                    // level 1
                    for(var a35 = 0; a35 < newArray.length; a35++) {
                      if(newArray[a35].id === event.target.value) {
                        // level 2
                        for(var aa35; aa35 < newArray[a35].children.length; aa35++) {
                          if(newArray[a35].children[aa35].id === fileArray[y].id) {
                            newArray[a35].children[aa35].children.push({id: fileArray[a].id, name: fileArray[a].file, type: newType, parent: parent})
                          }
                        } 
                      }
                    }
                  }
                  if(fileArray[a].type === 'image/jpeg') {
                    newType = "jpg"
                    // level 1
                    for(var a36 = 0; a36 < newArray.length; a36++) {
                      if(newArray[a36].id === event.target.value) {
                        // level 2
                        for(var aa36; aa36 < newArray[a36].children.length; aa36++) {
                          if(newArray[a36].children[aa36].id === fileArray[y].id) {
                            newArray[a36].children[aa36].children.push({id: fileArray[a].id, name: fileArray[a].file, type: newType, parent: parent})
                          }
                        } 
                      }
                    }
                  }
                  if(fileArray[a].type === 'image/png') {
                    newType = "png"
                    // level 1
                    for(var a37 = 0; a37 < newArray.length; a37++) {
                      if(newArray[a37].id === event.target.value) {
                        // level 2
                        for(var aa37; aa37 < newArray[a37].children.length; aa37++) {
                          if(newArray[a37].children[aa37].id === fileArray[y].id) {
                            newArray[a37].children[aa37].children.push({id: fileArray[a].id, name: fileArray[a].file, type: newType, parent: parent})
                          }
                        } 
                      }
                    }
                  }
                  if(fileArray[a].type === 'application/msword') {
                    newType = "doc"
                    // level 1
                    for(var a38 = 0; a38 < newArray.length; a38++) {
                      if(newArray[a38].id === event.target.value) {
                        // level 2
                        for(var aa38; aa38 < newArray[a38].children.length; aa38++) {
                          if(newArray[a38].children[aa38].id === fileArray[y].id) {
                            newArray[a38].children[aa38].children.push({id: fileArray[a].id, name: fileArray[a].file, type: newType, parent: parent})
                          }
                        } 
                      }
                    }
                  }
                  if(fileArray[a].type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                    newType = "docx"
                    // level 1
                    for(var a39 = 0; a39 < newArray.length; a39++) {
                      if(newArray[a39].id === event.target.value) {
                        // level 2
                        for(var aa39; aa39 < newArray[a39].children.length; aa39++) {
                          if(newArray[a39].children[aa39].id === fileArray[y].id) {
                            newArray[a39].children[aa39].children.push({id: fileArray[a].id, name: fileArray[a].file, type: newType, parent: parent})
                          }
                        } 
                      }
                    }
                  }
                  if(fileArray[a].type === 'application/vnd.ms-powerpoint') {
                    newType = "ppt"
                    // level 1
                    for(var a391 = 0; a391 < newArray.length; a391++) {
                      if(newArray[a391].id === event.target.value) {
                        // level 2
                        for(var aa391; aa391 < newArray[a391].children.length; aa391++) {
                          if(newArray[a391].children[aa391].id === fileArray[y].id) {
                            newArray[a391].children[aa391].children.push({id: fileArray[a].id, name: fileArray[a].file, type: newType, parent: parent})
                          }
                        } 
                      }
                    }
                  }
                  if(fileArray[a].type === 'txt/plain') {
                    newType = "txt"
                    // level 1
                    for(var a392 = 0; a392 < newArray.length; a392++) {
                      if(newArray[a392].id === event.target.value) {
                        // level 2
                        for(var aa392; aa392 < newArray[a392].children.length; aa392++) {
                          if(newArray[a392].children[aa392].id === fileArray[y].id) {
                            newArray[a392].children[aa392].children.push({id: fileArray[a].id, name: fileArray[a].file, type: newType, parent: parent})
                          }
                        } 
                      }
                    }
                  }
                  if(fileArray[a].type === 'application/x-zip-compressed') {
                    newType = "zip"
                    // level 1
                    for(var a393 = 0; a393 < newArray.length; a393++) {
                      if(newArray[a393].id === event.target.value) {
                        // level 2
                        for(var aa393; aa393 < newArray[a393].children.length; aa393++) {
                          if(newArray[a393].children[aa393].id === fileArray[y].id) {
                            newArray[a393].children[aa393].children.push({id: fileArray[a].id, name: fileArray[a].file, type: newType, parent: parent})
                          }
                        } 
                      }
                    }
                  }
                  if(fileArray[a].type === 'application/vnd.google-apps.folder') {                    
                    newType = "folder";
                    // level 1
                    for(var a4 = 0; a4 < newArray.length; a4++) {
                      if(newArray[a4].id === event.target.value) {
                        console.log(newArray[a4].children)
                        // level 2
                        for(var aa4 = 0; aa4 < newArray[a4].children.length; aa4++) {
                          console.log(newArray[a4].children[aa4])
                          console.log(fileArray[y]);
                          if(newArray[a4].children[aa4].id === fileArray[y].id) {
                            console.log(fileArray[y])
                            newArray[a4].children[aa4].children.push({id: fileArray[a].id, name: fileArray[a].file, type: newType, parent: parent, children: []})
                          }
                        } 
                      }
                    }
                    //3
                    for (var b = 0; b < fileArray.length; b++) {
                      if (fileArray[b].parents[0] === fileArray[a].id) {
                        var parent = fileArray[b].parents[0]
                        if(fileArray[b].type === 'application/vnd.google-apps.document') {
                          newType = "docx";
                          // level 1
                          for(var b1 = 0; b1 < newArray.length; b1++) {
                            if(newArray[b1].id === event.target.value) {
                              // level 2
                              for(var bb1 = 0; bb1 < newArray[b1].children.length; bb1++) {
                                if(newArray[b1].children[bb1].id === fileArray[y].id) {
                                  // level 3
                                  for(var bbb1 = 0; bbb1 < newArray[b1].children[bb1].children.length; bbb1++) {
                                    if(newArray[b1].children[bb1].children[bbb1].id === fileArray[a].id) {
                                      newArray[b1].children[bb1].children[bbb1].children.push({id: fileArray[b].id, name: fileArray[b].file, type: newType, parent: parent})
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                        if(fileArray[b].type === 'application/vnd.google-apps.presentation') {
                          newType = "pptx"
                          //level 1
                          for(var b2 = 0; b2 < newArray.length; b2++) {
                            if(newArray[b2].id === event.target.value) {
                              // level 2
                              for(var bb2 = 0; bb2 < newArray[b2].children.length; bb2++) {
                                if(newArray[b2].children[bb2].id === fileArray[y].id) {
                                  // level 3
                                  for(var bbb2 = 0; bbb2 < newArray[b2].children[bb2].children.length; bbb2++) {
                                    if(newArray[b2].children[bb2].children[bbb2].id === fileArray[a].id) {
                                      newArray[b2].children[bb2].children[bbb2].children
                                      .push({id: fileArray[b].id, name: fileArray[b].file, type: newType, parent: parent})
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                        if(fileArray[b].type === 'application/vnd.google-apps.spreadsheet') {
                          newType = "xlsx"
                          //level 1
                          for(var b3 = 0; b3 < newArray.length; b3++) {
                            if(newArray[b3].id === event.target.value) {
                              // level 2
                              for(var bb3 = 0; bb3 < newArray[b3].children.length; bb3++) {
                                if(newArray[b3].children[bb3] === fileArray[y].id) {
                                  // level 3
                                  for(var bbb3 = 0; bbb3 < newArray[b3].children[bb3].children.length; bbb3++) {
                                    if(newArray[b3].children[bb3].children[bbb3].id === fileArray[a].id) {
                                      newArray[b3].children[bb3].children[bbb3].children
                                      .push({id: fileArray[b].id, name: fileArray[b].file, type: newType, parent: parent})
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                        if(fileArray[b].type === 'application/pdf') {
                          newType = "pdf"
                          //level 1
                          for(var b32 = 0; b32 < newArray.length; b32++) {
                            if(newArray[b32].id === event.target.value) {
                              // level 2
                              for(var bb32 = 0; bb32 < newArray[b32].children.length; bb32++) {
                                if(newArray[b32].children[bb32] === fileArray[y].id) {
                                  // level 3
                                  for(var bbb32 = 0; bbb32 < newArray[b32].children[bb32].children.length; bbb32++) {
                                    if(newArray[b32].children[bb32].children[bbb32].id === fileArray[a].id) {
                                      newArray[b32].children[bb32].children[bbb32].children
                                      .push({id: fileArray[b].id, name: fileArray[b].file, type: newType, parent: parent})
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                        if(fileArray[b].type === 'audio/mpeg') {
                          newType = "mp3"
                          //level 1
                          for(var b33 = 0; b33 < newArray.length; b33++) {
                            if(newArray[b33].id === event.target.value) {
                              // level 2
                              for(var bb33 = 0; bb33 < newArray[b33].children.length; bb33++) {
                                if(newArray[b33].children[bb33] === fileArray[y].id) {
                                  // level 3
                                  for(var bbb33 = 0; bbb33 < newArray[b33].children[bb33].children.length; bbb33++) {
                                    if(newArray[b33].children[bb33].children[bbb33].id === fileArray[a].id) {
                                      newArray[b33].children[bb33].children[bbb33].children
                                      .push({id: fileArray[b].id, name: fileArray[b].file, type: newType, parent: parent})
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                        if(fileArray[b].type === 'audio/wav') {
                          newType = "wav"
                          //level 1
                          for(var b34 = 0; b34 < newArray.length; b34++) {
                            if(newArray[b34].id === event.target.value) {
                              // level 2
                              for(var bb34 = 0; bb34 < newArray[b34].children.length; bb34++) {
                                if(newArray[b34].children[bb34] === fileArray[y].id) {
                                  // level 3
                                  for(var bbb34 = 0; bbb34 < newArray[b34].children[bb34].children.length; bbb34++) {
                                    if(newArray[b34].children[bb34].children[bbb34].id === fileArray[a].id) {
                                      newArray[b34].children[bb34].children[bbb34].children
                                      .push({id: fileArray[b].id, name: fileArray[b].file, type: newType, parent: parent})
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                        if(fileArray[b].type === 'video/mp4') {
                          newType = "mp4"
                          //level 1
                          for(var b35 = 0; b35 < newArray.length; b35++) {
                            if(newArray[b35].id === event.target.value) {
                              // level 2
                              for(var bb35 = 0; bb35 < newArray[b35].children.length; bb35++) {
                                if(newArray[b35].children[bb35] === fileArray[y].id) {
                                  // level 3
                                  for(var bbb35 = 0; bbb35 < newArray[b35].children[bb35].children.length; bbb35++) {
                                    if(newArray[b35].children[bb35].children[bbb35].id === fileArray[a].id) {
                                      newArray[b35].children[bb35].children[bbb35].children
                                      .push({id: fileArray[b].id, name: fileArray[b].file, type: newType, parent: parent})
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                        if(fileArray[b].type === 'image/jpeg') {
                          newType = "jpg"
                          //level 1
                          for(var b36 = 0; b36 < newArray.length; b36++) {
                            if(newArray[b36].id === event.target.value) {
                              // level 2
                              for(var bb36 = 0; bb36 < newArray[b36].children.length; bb36++) {
                                if(newArray[b36].children[bb36] === fileArray[y].id) {
                                  // level 3
                                  for(var bbb36 = 0; bbb36 < newArray[b36].children[bb36].children.length; bbb36++) {
                                    if(newArray[b36].children[bb36].children[bbb36].id === fileArray[a].id) {
                                      newArray[b36].children[bb36].children[bbb36].children
                                      .push({id: fileArray[b].id, name: fileArray[b].file, type: newType, parent: parent})
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                        if(fileArray[b].type === 'image/png') {
                          newType = "png"
                          //level 1
                          for(var b37 = 0; b37 < newArray.length; b37++) {
                            if(newArray[b37].id === event.target.value) {
                              // level 2
                              for(var bb37 = 0; bb37 < newArray[b37].children.length; bb37++) {
                                if(newArray[b37].children[bb37] === fileArray[y].id) {
                                  // level 3
                                  for(var bbb37 = 0; bbb37 < newArray[b37].children[bb37].children.length; bbb37++) {
                                    if(newArray[b37].children[bb37].children[bbb37].id === fileArray[a].id) {
                                      newArray[b37].children[bb37].children[bbb37].children
                                      .push({id: fileArray[b].id, name: fileArray[b].file, type: newType, parent: parent})
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                        if(fileArray[b].type === 'application/msword') {
                          newType = "doc"
                          //level 1
                          for(var b38 = 0; b38 < newArray.length; b38++) {
                            if(newArray[b38].id === event.target.value) {
                              // level 2
                              for(var bb38 = 0; bb38 < newArray[b38].children.length; bb38++) {
                                if(newArray[b38].children[bb38] === fileArray[y].id) {
                                  // level 3
                                  for(var bbb38 = 0; bbb38 < newArray[b38].children[bb38].children.length; bbb38++) {
                                    if(newArray[b38].children[bb38].children[bbb38].id === fileArray[a].id) {
                                      newArray[b38].children[bb38].children[bbb38].children
                                      .push({id: fileArray[b].id, name: fileArray[b].file, type: newType, parent: parent})
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                        if(fileArray[b].type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                          newType = "docx"
                          //level 1
                          for(var b39 = 0; b39 < newArray.length; b39++) {
                            if(newArray[b39].id === event.target.value) {
                              // level 2
                              for(var bb39 = 0; bb39 < newArray[b39].children.length; bb39++) {
                                if(newArray[b39].children[bb39] === fileArray[y].id) {
                                  // level 3
                                  for(var bbb39 = 0; bbb39 < newArray[b39].children[bb39].children.length; bbb39++) {
                                    if(newArray[b39].children[bb39].children[bbb39].id === fileArray[a].id) {
                                      newArray[b39].children[bb39].children[bbb39].children
                                      .push({id: fileArray[b].id, name: fileArray[b].file, type: newType, parent: parent})
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                        if(fileArray[b].type === 'application/vnd.ms-powerpoint') {
                          newType = "ppt"
                          //level 1
                          for(var b391 = 0; b391 < newArray.length; b391++) {
                            if(newArray[b391].id === event.target.value) {
                              // level 2
                              for(var bb391 = 0; bb391 < newArray[b391].children.length; bb391++) {
                                if(newArray[b391].children[bb391] === fileArray[y].id) {
                                  // level 3
                                  for(var bbb391 = 0; bbb391 < newArray[b391].children[bb391].children.length; bbb391++) {
                                    if(newArray[b391].children[bb391].children[bbb391].id === fileArray[a].id) {
                                      newArray[b391].children[bb391].children[bbb391].children
                                      .push({id: fileArray[b].id, name: fileArray[b].file, type: newType, parent: parent})
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                        if(fileArray[b].type === 'text/plain') {
                          newType = "txt"
                          //level 1
                          for(var b392 = 0; b392 < newArray.length; b392++) {
                            if(newArray[b392].id === event.target.value) {
                              // level 2
                              for(var bb392 = 0; bb392 < newArray[b392].children.length; bb392++) {
                                if(newArray[b392].children[bb392] === fileArray[y].id) {
                                  // level 3
                                  for(var bbb392 = 0; bbb392 < newArray[b392].children[bb392].children.length; bbb392++) {
                                    if(newArray[b392].children[bb392].children[bbb392].id === fileArray[a].id) {
                                      newArray[b392].children[bb392].children[bbb392].children
                                      .push({id: fileArray[b].id, name: fileArray[b].file, type: newType, parent: parent})
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                        if(fileArray[b].type === 'application/x-zip-compressed') {
                          newType = "zip"
                          //level 1
                          for(var b393 = 0; b393 < newArray.length; b393++) {
                            if(newArray[b393].id === event.target.value) {
                              // level 2
                              for(var bb393 = 0; bb393 < newArray[b393].children.length; bb393++) {
                                if(newArray[b393].children[bb393] === fileArray[y].id) {
                                  // level 3
                                  for(var bbb393 = 0; bbb393 < newArray[b393].children[bb393].children.length; bbb393++) {
                                    if(newArray[b393].children[bb393].children[bbb393].id === fileArray[a].id) {
                                      newArray[b393].children[bb393].children[bbb393].children
                                      .push({id: fileArray[b].id, name: fileArray[b].file, type: newType, parent: parent})
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                        if(fileArray[b].type === 'application/vnd.google-apps.folder') {
                          newType = "folder";
                          //level 1
                          for (var b4 = 0; b4 < newArray.length; b4++) {
                            if(newArray[b4].id === event.target.value) {
                              // level 2
                              for(var bb4 = 0; bb4 < newArray[b4].children.length; bb4++) {
                                if(newArray[b4].children[bb4].id === fileArray[y].id) {
                                  // level 3
                                  for(var bbb4 = 0; bbb4 < newArray[b4].children[bb4].children.length; bbb4++) {
                                    if(newArray[b4].children[bb4].children[bbb4].id === fileArray[a].id) {
                                      newArray[b4].children[bb4].children[bbb4].children
                                      .push({id: fileArray[b].id, name: fileArray[b].file, type: newType, parent: parent, children: []})
                                    }
                                  }
                                }
                              }
                            }
                          }
                          //4
                          for (var c = 0; c < fileArray.length; c++) {
                            if (fileArray[c].parents[0] === fileArray[b].id) {
                              var parent = fileArray[c].parents[0]
                              if(fileArray[c].type === 'application/vnd.google-apps.document') {
                                newType = "docx";
                                //level 1 
                                for(var c1 = 0; c1 < newArray.length; c1++) {
                                  if(newArray[c1].id === event.target.value) {
                                    // level 2
                                    for(var cc1 = 0; cc1 < newArray[c1].children.length; cc1++) {
                                      if(newArray[c1].children[cc1].id === fileArray[y].id) {
                                        // level 3
                                        for(var ccc1 = 0; ccc1 < newArray[c1].children[cc1].children.length; ccc1++) {
                                          if(newArray[c1].children[cc1].children[ccc1].id === fileArray[a].id) {
                                            //level 4
                                            for(var cccc1 = 0; cccc1 < newArray[c1].children[cc1].children[ccc1].children.length; cccc1++) {
                                              if(newArray[c1].children[cc1].children[ccc1].children[cccc1].id === fileArray[b].id) {
                                                newArray[c1].children[cc1].children[ccc1].children[cccc1].children
                                                .push({id: fileArray[c].id, name: fileArray[c].file, type: newType, parent: parent})
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                              if(fileArray[c].type === 'application/vnd.google-apps.presentation') {
                                newType = "pptx"
                                //level 1
                                for(var c2 = 0; c2 < newArray.length; c2++) {
                                  if(newArray[c2].id === event.target.value) {
                                    // level 2
                                    for(var cc2 = 0; cc2 < newArray[c2].children.length; cc2++) {
                                      if(newArray[c2].children[cc2].id === fileArray[y].id) {
                                        // level 3
                                        for(var ccc2 = 0; ccc2 < newArray[c2].children[cc2].children.length; ccc2++) {
                                          if(newArray[c2].children[cc2].children[ccc2].id === fileArray[a].id) {
                                            //level 4
                                            for(var cccc2 = 0; cccc2 < newArray[c2].children[cc2].children[ccc2].children.length; cccc2++) {
                                              if(newArray[c2].children[cc2].children[ccc2].children[cccc2].id === fileArray[b].id) {
                                                newArray[c2].children[cc2].children[ccc2].children[cccc2].children
                                                .push({id: fileArray[c].id, name: fileArray[c].file, type: newType, parent: parent})
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                              if(fileArray[c].type === 'application/vnd.google-apps.spreadsheet') {
                                newType = "xlsx"
                                //level 1
                                for(var c3 = 0; c3 < newArray.length; c3++) {
                                  if(newArray[c3].id === event.target.value) {
                                    // level 2
                                    for(var cc3 = 0; cc3 < newArray[c3].children.length; cc3++) {
                                      if(newArray[c3].children[cc3].id === fileArray[y].id) {
                                        // level 3
                                        for(var ccc3 = 0; ccc3 < newArray[c3].children[cc3].children.length; ccc3++) {
                                          if(newArray[c3].children[cc3].children[ccc3].id === fileArray[a].id) {
                                            //level 4
                                            for(var cccc3 = 0; cccc3 < newArray[c3].children[cc3].children[ccc3].children.length; cccc3++) {
                                              if(newArray[c3].children[cc3].children[ccc3].children[cccc3].id === fileArray[b].id) {
                                                newArray[c3].children[cc3].children[ccc3].children[cccc3].children
                                                .push({id: fileArray[c].id, name: fileArray[c].file, type: newType, parent: parent})
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                              if(fileArray[c].type === 'application/pdf') {
                                newType = "pdf"
                                //level 1
                                for(var c32 = 0; c32 < newArray.length; c32++) {
                                  if(newArray[c32].id === event.target.value) {
                                    // level 2
                                    for(var cc32 = 0; cc32 < newArray[c32].children.length; cc32++) {
                                      if(newArray[c32].children[cc32].id === fileArray[y].id) {
                                        // level 3
                                        for(var ccc32 = 0; ccc32 < newArray[c32].children[cc32].children.length; ccc32++) {
                                          if(newArray[c32].children[cc32].children[ccc32].id === fileArray[a].id) {
                                            //level 4
                                            for(var cccc32 = 0; cccc32 < newArray[c32].children[cc32].children[ccc32].children.length; cccc32++) {
                                              if(newArray[c32].children[cc32].children[ccc32].children[cccc32].id === fileArray[b].id) {
                                                newArray[c32].children[cc32].children[ccc32].children[cccc32].children
                                                .push({id: fileArray[c].id, name: fileArray[c].file, type: newType, parent: parent})
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                              if(fileArray[c].type === 'audio/mpeg') {
                                newType = "mp3"
                                //level 1
                                for(var c33 = 0; c33 < newArray.length; c33++) {
                                  if(newArray[c33].id === event.target.value) {
                                    // level 2
                                    for(var cc33 = 0; cc33 < newArray[c33].children.length; cc33++) {
                                      if(newArray[c33].children[cc33].id === fileArray[y].id) {
                                        // level 3
                                        for(var ccc33 = 0; ccc33 < newArray[c33].children[cc33].children.length; ccc33++) {
                                          if(newArray[c33].children[cc33].children[ccc33].id === fileArray[a].id) {
                                            //level 4
                                            for(var cccc33 = 0; cccc33 < newArray[c33].children[cc33].children[ccc33].children.length; cccc33++) {
                                              if(newArray[c33].children[cc33].children[ccc33].children[cccc33].id === fileArray[b].id) {
                                                newArray[c33].children[cc33].children[ccc33].children[cccc33].children
                                                .push({id: fileArray[c].id, name: fileArray[c].file, type: newType, parent: parent})
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                              if(fileArray[c].type === 'audio/wav') {
                                newType = "wav"
                                //level 1
                                for(var c34 = 0; c34 < newArray.length; c34++) {
                                  if(newArray[c34].id === event.target.value) {
                                    // level 2
                                    for(var cc34 = 0; cc34 < newArray[c34].children.length; cc34++) {
                                      if(newArray[c34].children[cc34].id === fileArray[y].id) {
                                        // level 3
                                        for(var ccc34 = 0; ccc34 < newArray[c34].children[cc34].children.length; ccc34++) {
                                          if(newArray[c34].children[cc34].children[ccc34].id === fileArray[a].id) {
                                            //level 4
                                            for(var cccc34 = 0; cccc34 < newArray[c34].children[cc34].children[ccc34].children.length; cccc34++) {
                                              if(newArray[c34].children[cc34].children[ccc34].children[cccc34].id === fileArray[b].id) {
                                                newArray[c34].children[cc34].children[ccc34].children[cccc34].children
                                                .push({id: fileArray[c].id, name: fileArray[c].file, type: newType, parent: parent})
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                              if(fileArray[c].type === 'image/jpeg') {
                                newType = "jpg"
                                //level 1
                                for(var c35 = 0; c35 < newArray.length; c35++) {
                                  if(newArray[c35].id === event.target.value) {
                                    // level 2
                                    for(var cc35 = 0; cc35 < newArray[c35].children.length; cc35++) {
                                      if(newArray[c35].children[cc35].id === fileArray[y].id) {
                                        // level 3
                                        for(var ccc35 = 0; ccc35 < newArray[c35].children[cc35].children.length; ccc35++) {
                                          if(newArray[c35].children[cc35].children[ccc35].id === fileArray[a].id) {
                                            //level 4
                                            for(var cccc35 = 0; cccc35 < newArray[c35].children[cc35].children[ccc35].children.length; cccc35++) {
                                              if(newArray[c35].children[cc35].children[ccc35].children[cccc35].id === fileArray[b].id) {
                                                newArray[c35].children[cc35].children[ccc35].children[cccc35].children
                                                .push({id: fileArray[c].id, name: fileArray[c].file, type: newType, parent: parent})
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                              if(fileArray[c].type === 'image/png') {
                                newType = "png"
                                //level 1
                                for(var c36 = 0; c36 < newArray.length; c36++) {
                                  if(newArray[c36].id === event.target.value) {
                                    // level 2
                                    for(var cc36 = 0; cc36 < newArray[c36].children.length; cc36++) {
                                      if(newArray[c36].children[cc36].id === fileArray[y].id) {
                                        // level 3
                                        for(var ccc36 = 0; ccc36 < newArray[c36].children[cc36].children.length; ccc36++) {
                                          if(newArray[c36].children[cc36].children[ccc36].id === fileArray[a].id) {
                                            //level 4
                                            for(var cccc36 = 0; cccc36 < newArray[c36].children[cc36].children[ccc36].children.length; cccc36++) {
                                              if(newArray[c36].children[cc36].children[ccc36].children[cccc36].id === fileArray[b].id) {
                                                newArray[c36].children[cc36].children[ccc36].children[cccc36].children
                                                .push({id: fileArray[c].id, name: fileArray[c].file, type: newType, parent: parent})
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                              if(fileArray[c].type === 'application/msword') {
                                newType = "doc"
                                //level 1
                                for(var c37 = 0; c37 < newArray.length; c37++) {
                                  if(newArray[c37].id === event.target.value) {
                                    // level 2
                                    for(var cc37 = 0; cc37 < newArray[c37].children.length; cc37++) {
                                      if(newArray[c37].children[cc37].id === fileArray[y].id) {
                                        // level 3
                                        for(var ccc37 = 0; ccc37 < newArray[c37].children[cc37].children.length; ccc37++) {
                                          if(newArray[c37].children[cc37].children[ccc37].id === fileArray[a].id) {
                                            //level 4
                                            for(var cccc37 = 0; cccc37 < newArray[c37].children[cc37].children[ccc37].children.length; cccc37++) {
                                              if(newArray[c37].children[cc37].children[ccc37].children[cccc37].id === fileArray[b].id) {
                                                newArray[c37].children[cc37].children[ccc37].children[cccc37].children
                                                .push({id: fileArray[c].id, name: fileArray[c].file, type: newType, parent: parent})
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                              if(fileArray[c].type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                                newType = "docx"
                                //level 1
                                for(var c38 = 0; c38 < newArray.length; c38++) {
                                  if(newArray[c38].id === event.target.value) {
                                    // level 2
                                    for(var cc38 = 0; cc38 < newArray[c38].children.length; cc38++) {
                                      if(newArray[c38].children[cc38].id === fileArray[y].id) {
                                        // level 3
                                        for(var ccc38 = 0; ccc38 < newArray[c38].children[cc38].children.length; ccc38++) {
                                          if(newArray[c38].children[cc38].children[ccc38].id === fileArray[a].id) {
                                            //level 4
                                            for(var cccc38 = 0; cccc38 < newArray[c38].children[cc38].children[ccc38].children.length; cccc38++) {
                                              if(newArray[c38].children[cc38].children[ccc38].children[cccc38].id === fileArray[b].id) {
                                                newArray[c38].children[cc38].children[ccc38].children[cccc38].children
                                                .push({id: fileArray[c].id, name: fileArray[c].file, type: newType, parent: parent})
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                              if(fileArray[c].type === 'application/vnd.ms-powerpoint') {
                                newType = "ppt"
                                //level 1
                                for(var c39 = 0; c39 < newArray.length; c39++) {
                                  if(newArray[c39].id === event.target.value) {
                                    // level 2
                                    for(var cc39 = 0; cc39 < newArray[c39].children.length; cc39++) {
                                      if(newArray[c39].children[cc39].id === fileArray[y].id) {
                                        // level 3
                                        for(var ccc39 = 0; ccc39 < newArray[c39].children[cc39].children.length; ccc39++) {
                                          if(newArray[c39].children[cc39].children[ccc39].id === fileArray[a].id) {
                                            //level 4
                                            for(var cccc39 = 0; cccc39 < newArray[c39].children[cc39].children[ccc39].children.length; cccc39++) {
                                              if(newArray[c39].children[cc39].children[ccc39].children[cccc39].id === fileArray[b].id) {
                                                newArray[c39].children[cc39].children[ccc39].children[cccc39].children
                                                .push({id: fileArray[c].id, name: fileArray[c].file, type: newType, parent: parent})
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                              if(fileArray[c].type === 'text/plain') {
                                newType = "txt"
                                //level 1
                                for(var c391 = 0; c391 < newArray.length; c391++) {
                                  if(newArray[c391].id === event.target.value) {
                                    // level 2
                                    for(var cc391 = 0; cc391 < newArray[c391].children.length; cc391++) {
                                      if(newArray[c391].children[cc391].id === fileArray[y].id) {
                                        // level 3
                                        for(var ccc391 = 0; ccc391 < newArray[c391].children[cc391].children.length; ccc391++) {
                                          if(newArray[c391].children[cc391].children[ccc391].id === fileArray[a].id) {
                                            //level 4
                                            for(var cccc391 = 0; cccc391 < newArray[c391].children[cc391].children[ccc391].children.length; cccc391++) {
                                              if(newArray[c391].children[cc391].children[ccc391].children[cccc391].id === fileArray[b].id) {
                                                newArray[c391].children[cc391].children[ccc391].children[cccc391].children
                                                .push({id: fileArray[c].id, name: fileArray[c].file, type: newType, parent: parent})
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                              if(fileArray[c].type === 'application/x-zip-compressed') {
                                newType = "zip"
                                //level 1
                                for(var c392 = 0; c392 < newArray.length; c392++) {
                                  if(newArray[c392].id === event.target.value) {
                                    // level 2
                                    for(var cc392 = 0; cc392 < newArray[c392].children.length; cc392++) {
                                      if(newArray[c392].children[cc392].id === fileArray[y].id) {
                                        // level 3
                                        for(var ccc392 = 0; ccc392 < newArray[c392].children[cc392].children.length; ccc392++) {
                                          if(newArray[c392].children[cc392].children[ccc392].id === fileArray[a].id) {
                                            //level 4
                                            for(var cccc392 = 0; cccc392 < newArray[c392].children[cc392].children[ccc392].children.length; cccc392++) {
                                              if(newArray[c392].children[cc392].children[ccc392].children[cccc392].id === fileArray[b].id) {
                                                newArray[c392].children[cc392].children[ccc392].children[cccc392].children
                                                .push({id: fileArray[c].id, name: fileArray[c].file, type: newType, parent: parent})
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                              if(fileArray[c].type === 'application/vnd.google-apps.folder') {
                                newType = "folder";
                                //level 1
                                for (var c4 = 0; c4 < newArray.length; c4++) {
                                  if(newArray[c4].id === event.target.value) {
                                    // level 2
                                    for(var cc4 = 0; cc4 < newArray[c4].children.length; cc4++) {
                                      if(newArray[c4].children[cc4].id === fileArray[y].id) {
                                        // level 3
                                        for(var ccc4 = 0; ccc4 < newArray[c4].children[cc4].children.length; ccc4++) {
                                          if(newArray[c4].children[cc4].children[ccc4].id === fileArray[a].id) {
                                            //level 4
                                            for(var cccc4 = 0; cccc4 < newArray[c4].children[cc4].children[ccc4].children.length; cccc4++) {
                                              if(newArray[c4].children[cc4].children[ccc4].children[cccc4].id === fileArray[b].id) {
                                                newArray[c4].children[cc4].children[ccc4].children[cccc4].children
                                                .push({id: fileArray[c].id, name: fileArray[c].file, type: newType, parent: parent, children: []})
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                                //5
                                for (var d = 0; d < fileArray.length; d++) {
                                  if (fileArray[d].parents[0] === fileArray[c].id) {
                                    var parent = fileArray[d].parents[0]
                                    if(fileArray[d].type === 'application/vnd.google-apps.document') {
                                      newType = "docx";
                                      //level 1
                                      for(var d1 = 0; d1 < newArray.length; d1++) {
                                        if(newArray[d1].id === event.target.value) {
                                          // level 2
                                          for(var dd1 = 0; dd1 < newArray[d1].children.length; dd1++) {
                                            if(newArray[d1].children[dd1].id === fileArray[y].id) {
                                              // level 3
                                              for(var ddd1 = 0; ddd1 < newArray[d1].children[dd1].children.length; ddd1++) {
                                                if(newArray[d1].children[dd1].children[ddd1].id === fileArray[a].id) {
                                                  //level 4
                                                  for(var dddd1 = 0; dddd1 < newArray[d1].children[dd1].children[ddd1].children.length; dddd1++) {
                                                    if(newArray[d1].children[dd1].children[ddd1].children[dddd1].id === fileArray[b].id) {
                                                      //level 5
                                                      for(var ddddd1 = 0; ddddd1 < newArray[d1].children[dd1].children[ddd1].children[dddd1].length; ddddd1++) {
                                                        if(newArray[d1].children[dd1].children[ddd1].children[dddd1].children[ddddd1].id === fileArray[c].id) {
                                                          newArray[d1].children[dd1].children[ddd1].children[dddd1].children[ddddd1].children
                                                          .push({id: fileArray[d].id, name: fileArray[d].file, type: newType, parent: parent})
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
                                    if(fileArray[d].type === 'application/vnd.google-apps.presentation') {
                                      //level 1
                                      newType = "pptx"
                                      for(var d2 = 0; d2 < newArray.length; d2++) {
                                        if(newArray[d2].id === event.target.value) {
                                          // level 2
                                          for(var dd2 = 0; dd2 < newArray[d2].children.length; dd2++) {
                                            if(newArray[d2].children[dd2].id === fileArray[y].id) {
                                              // level 3
                                              for(var ddd2 = 0; ddd2 < newArray[d2].children[dd2].children.length; ddd2++) {
                                                if(newArray[d2].children[dd2].children[ddd2].id === fileArray[a].id) {
                                                  //level 4
                                                  for(var dddd2 = 0; dddd2 < newArray[d2].children[dd2].children[ddd2].children.length; dddd2++) {
                                                    if(newArray[d2].children[dd2].children[ddd2].children[dddd2].id === fileArray[b].id) {
                                                      //level 5
                                                      for(var ddddd2 = 0; ddddd2 < newArray[d2].children[dd2].children[ddd2].children[dddd2].length; ddddd2++) {
                                                        if(newArray[d2].children[dd2].children[ddd2].children[dddd2].children[ddddd2].id === fileArray[c].id) {
                                                          newArray[d2].children[dd2].children[ddd2].children[dddd2].children[ddddd2].children
                                                          .push({id: fileArray[d].id, name: fileArray[d].file, type: newType, parent: parent})
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
                                    if(fileArray[d].type === 'application/vnd.google-apps.spreadsheet') {
                                      newType = "xlsx"
                                      //level 1
                                      for(var d3 = 0; d3 < newArray.length; d3++) {
                                        if(newArray[d3].id === event.target.value) {
                                          // level 2
                                          for(var dd3 = 0; dd3 < newArray[d3].children.length; dd3++) {
                                            if(newArray[d3].children[dd3].id === fileArray[y].id) {
                                              // level 3
                                              for(var ddd3 = 0; ddd3 < newArray[d3].children[dd3].children.length; ddd3++) {
                                                if(newArray[d3].children[dd3].children[ddd3].id === fileArray[a].id) {
                                                  //level 4
                                                  for(var dddd3 = 0; dddd3 < newArray[d3].children[dd3].children[ddd3].children.length; dddd3++) {
                                                    if(newArray[d3].children[dd3].children[ddd3].children[dddd3].id === fileArray[b].id) {
                                                      //level 5
                                                      for(var ddddd3 = 0; ddddd3 < newArray[d3].children[dd3].children[ddd3].children[dddd3].length; ddddd3++) {
                                                        if(newArray[d3].children[dd3].children[ddd3].children[dddd3].children[ddddd3].id === fileArray[c].id) {
                                                          newArray[d3].children[dd3].children[ddd3].children[dddd3].children[ddddd3].children
                                                          .push({id: fileArray[d].id, name: fileArray[d].file, type: newType, parent: parent})
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
                                    if(fileArray[d].type === 'application/pdf') {
                                      newType = "pdf"
                                      //level 1
                                      for(var d32 = 0; d32 < newArray.length; d32++) {
                                        if(newArray[d32].id === event.target.value) {
                                          // level 2
                                          for(var dd32 = 0; dd32 < newArray[d32].children.length; dd32++) {
                                            if(newArray[d32].children[dd32].id === fileArray[y].id) {
                                              // level 3
                                              for(var ddd32 = 0; ddd32 < newArray[d32].children[dd32].children.length; ddd32++) {
                                                if(newArray[d32].children[dd32].children[ddd32].id === fileArray[a].id) {
                                                  //level 4
                                                  for(var dddd32 = 0; dddd32 < newArray[d32].children[dd32].children[ddd32].children.length; dddd32++) {
                                                    if(newArray[d32].children[dd32].children[ddd32].children[dddd32].id === fileArray[b].id) {
                                                      //level 5
                                                      for(var ddddd32 = 0; ddddd32 < newArray[d32].children[dd32].children[ddd32].children[dddd32].length; ddddd32++) {
                                                        if(newArray[d32].children[dd32].children[ddd32].children[dddd32].children[ddddd32].id === fileArray[c].id) {
                                                          newArray[d32].children[dd32].children[ddd32].children[dddd32].children[ddddd32].children
                                                          .push({id: fileArray[d].id, name: fileArray[d].file, type: newType, parent: parent})
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
                                    if(fileArray[d].type === 'audio/mpeg') {
                                      newType = "mp3"
                                      //level 1
                                      for(var d33 = 0; d33 < newArray.length; d33++) {
                                        if(newArray[d33].id === event.target.value) {
                                          // level 2
                                          for(var dd33 = 0; dd33 < newArray[d33].children.length; dd33++) {
                                            if(newArray[d33].children[dd33].id === fileArray[y].id) {
                                              // level 3
                                              for(var ddd33 = 0; ddd33 < newArray[d33].children[dd33].children.length; ddd33++) {
                                                if(newArray[d33].children[dd33].children[ddd33].id === fileArray[a].id) {
                                                  //level 4
                                                  for(var dddd33 = 0; dddd33 < newArray[d33].children[dd33].children[ddd33].children.length; dddd33++) {
                                                    if(newArray[d33].children[dd33].children[ddd33].children[dddd33].id === fileArray[b].id) {
                                                      //level 5
                                                      for(var ddddd33 = 0; ddddd33 < newArray[d33].children[dd33].children[ddd33].children[dddd33].length; ddddd33++) {
                                                        if(newArray[d33].children[dd33].children[ddd33].children[dddd33].children[ddddd33].id === fileArray[c].id) {
                                                          newArray[d33].children[dd33].children[ddd33].children[dddd33].children[ddddd33].children
                                                          .push({id: fileArray[d].id, name: fileArray[d].file, type: newType, parent: parent})
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
                                    if(fileArray[d].type === 'audio/wav') {
                                      newType = "wav"
                                      //level 1
                                      for(var d34 = 0; d34 < newArray.length; d34++) {
                                        if(newArray[d34].id === event.target.value) {
                                          // level 2
                                          for(var dd34 = 0; dd34 < newArray[d34].children.length; dd34++) {
                                            if(newArray[d34].children[dd34].id === fileArray[y].id) {
                                              // level 3
                                              for(var ddd34 = 0; ddd34 < newArray[d34].children[dd34].children.length; ddd34++) {
                                                if(newArray[d34].children[dd34].children[ddd34].id === fileArray[a].id) {
                                                  //level 4
                                                  for(var dddd34 = 0; dddd34 < newArray[d34].children[dd34].children[ddd34].children.length; dddd34++) {
                                                    if(newArray[d34].children[dd34].children[ddd34].children[dddd34].id === fileArray[b].id) {
                                                      //level 5
                                                      for(var ddddd34 = 0; ddddd34 < newArray[d34].children[dd34].children[ddd34].children[dddd34].length; ddddd34++) {
                                                        if(newArray[d34].children[dd34].children[ddd34].children[dddd34].children[ddddd34].id === fileArray[c].id) {
                                                          newArray[d34].children[dd34].children[ddd34].children[dddd34].children[ddddd34].children
                                                          .push({id: fileArray[d].id, name: fileArray[d].file, type: newType, parent: parent})
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
                                    if(fileArray[d].type === 'image/jpeg') {
                                      newType = "jpg"
                                      //level 1
                                      for(var d35 = 0; d35 < newArray.length; d35++) {
                                        if(newArray[d35].id === event.target.value) {
                                          // level 2
                                          for(var dd35 = 0; dd35 < newArray[d35].children.length; dd35++) {
                                            if(newArray[d35].children[dd35].id === fileArray[y].id) {
                                              // level 3
                                              for(var ddd35 = 0; ddd35 < newArray[d35].children[dd35].children.length; ddd35++) {
                                                if(newArray[d35].children[dd35].children[ddd35].id === fileArray[a].id) {
                                                  //level 4
                                                  for(var dddd35 = 0; dddd35 < newArray[d35].children[dd35].children[ddd35].children.length; dddd35++) {
                                                    if(newArray[d35].children[dd35].children[ddd35].children[dddd35].id === fileArray[b].id) {
                                                      //level 5
                                                      for(var ddddd35 = 0; ddddd35 < newArray[d35].children[dd35].children[ddd35].children[dddd35].length; ddddd35++) {
                                                        if(newArray[d35].children[dd35].children[ddd35].children[dddd35].children[ddddd35].id === fileArray[c].id) {
                                                          newArray[d35].children[dd35].children[ddd35].children[dddd35].children[ddddd35].children
                                                          .push({id: fileArray[d].id, name: fileArray[d].file, type: newType, parent: parent})
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
                                    if(fileArray[d].type === 'image/png') {
                                      newType = "png"
                                      //level 1
                                      for(var d36 = 0; d36 < newArray.length; d36++) {
                                        if(newArray[d36].id === event.target.value) {
                                          // level 2
                                          for(var dd36 = 0; dd36 < newArray[d36].children.length; dd36++) {
                                            if(newArray[d36].children[dd36].id === fileArray[y].id) {
                                              // level 3
                                              for(var ddd36 = 0; ddd36 < newArray[d36].children[dd36].children.length; ddd36++) {
                                                if(newArray[d36].children[dd36].children[ddd36].id === fileArray[a].id) {
                                                  //level 4
                                                  for(var dddd36 = 0; dddd36 < newArray[d36].children[dd36].children[ddd36].children.length; dddd36++) {
                                                    if(newArray[d36].children[dd36].children[ddd36].children[dddd36].id === fileArray[b].id) {
                                                      //level 5
                                                      for(var ddddd36 = 0; ddddd36 < newArray[d36].children[dd36].children[ddd36].children[dddd36].length; ddddd36++) {
                                                        if(newArray[d36].children[dd36].children[ddd36].children[dddd36].children[ddddd36].id === fileArray[c].id) {
                                                          newArray[d36].children[dd36].children[ddd36].children[dddd36].children[ddddd36].children
                                                          .push({id: fileArray[d].id, name: fileArray[d].file, type: newType, parent: parent})
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
                                    if(fileArray[d].type === 'video/mp4') {
                                      newType = "mp4"
                                      //level 1
                                      for(var d37 = 0; d37 < newArray.length; d37++) {
                                        if(newArray[d37].id === event.target.value) {
                                          // level 2
                                          for(var dd37 = 0; dd37 < newArray[d37].children.length; dd37++) {
                                            if(newArray[d37].children[dd37].id === fileArray[y].id) {
                                              // level 3
                                              for(var ddd37 = 0; ddd37 < newArray[d37].children[dd37].children.length; ddd37++) {
                                                if(newArray[d37].children[dd37].children[ddd37].id === fileArray[a].id) {
                                                  //level 4
                                                  for(var dddd37 = 0; dddd37 < newArray[d37].children[dd37].children[ddd37].children.length; dddd37++) {
                                                    if(newArray[d37].children[dd37].children[ddd37].children[dddd37].id === fileArray[b].id) {
                                                      //level 5
                                                      for(var ddddd37 = 0; ddddd37 < newArray[d37].children[dd37].children[ddd37].children[dddd37].length; ddddd37++) {
                                                        if(newArray[d37].children[dd37].children[ddd37].children[dddd37].children[ddddd37].id === fileArray[c].id) {
                                                          newArray[d37].children[dd37].children[ddd37].children[dddd37].children[ddddd37].children
                                                          .push({id: fileArray[d].id, name: fileArray[d].file, type: newType, parent: parent})
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
                                    if(fileArray[d].type === 'application/msword') {
                                      newType = "doc"
                                      //level 1
                                      for(var d38 = 0; d38 < newArray.length; d38++) {
                                        if(newArray[d38].id === event.target.value) {
                                          // level 2
                                          for(var dd38 = 0; dd38 < newArray[d38].children.length; dd38++) {
                                            if(newArray[d38].children[dd38].id === fileArray[y].id) {
                                              // level 3
                                              for(var ddd38 = 0; ddd38 < newArray[d38].children[dd38].children.length; ddd38++) {
                                                if(newArray[d38].children[dd38].children[ddd38].id === fileArray[a].id) {
                                                  //level 4
                                                  for(var dddd38 = 0; dddd38 < newArray[d38].children[dd38].children[ddd38].children.length; dddd38++) {
                                                    if(newArray[d38].children[dd38].children[ddd38].children[dddd38].id === fileArray[b].id) {
                                                      //level 5
                                                      for(var ddddd38 = 0; ddddd38 < newArray[d38].children[dd38].children[ddd38].children[dddd38].length; ddddd38++) {
                                                        if(newArray[d38].children[dd38].children[ddd38].children[dddd38].children[ddddd38].id === fileArray[c].id) {
                                                          newArray[d38].children[dd38].children[ddd38].children[dddd38].children[ddddd38].children
                                                          .push({id: fileArray[d].id, name: fileArray[d].file, type: newType, parent: parent})
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
                                    if(fileArray[d].type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                                      newType = "docx"
                                      //level 1
                                      for(var d39 = 0; d39 < newArray.length; d39++) {
                                        if(newArray[d39].id === event.target.value) {
                                          // level 2
                                          for(var dd39 = 0; dd39 < newArray[d39].children.length; dd39++) {
                                            if(newArray[d39].children[dd39].id === fileArray[y].id) {
                                              // level 3
                                              for(var ddd39 = 0; ddd39 < newArray[d39].children[dd39].children.length; ddd39++) {
                                                if(newArray[d39].children[dd39].children[ddd39].id === fileArray[a].id) {
                                                  //level 4
                                                  for(var dddd39 = 0; dddd39 < newArray[d39].children[dd39].children[ddd39].children.length; dddd39++) {
                                                    if(newArray[d39].children[dd39].children[ddd39].children[dddd39].id === fileArray[b].id) {
                                                      //level 5
                                                      for(var ddddd39 = 0; ddddd39 < newArray[d39].children[dd39].children[ddd39].children[dddd39].length; ddddd39++) {
                                                        if(newArray[d39].children[dd39].children[ddd39].children[dddd39].children[ddddd39].id === fileArray[c].id) {
                                                          newArray[d39].children[dd39].children[ddd39].children[dddd39].children[ddddd39].children
                                                          .push({id: fileArray[d].id, name: fileArray[d].file, type: newType, parent: parent})
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
                                    if(fileArray[d].type === 'application/vnd.ms-powerpoint') {
                                      newType = "ppt"
                                      //level 1
                                      for(var d391 = 0; d391 < newArray.length; d391++) {
                                        if(newArray[d391].id === event.target.value) {
                                          // level 2
                                          for(var dd391 = 0; dd391 < newArray[d391].children.length; dd391++) {
                                            if(newArray[d391].children[dd391].id === fileArray[y].id) {
                                              // level 3
                                              for(var ddd391 = 0; ddd391 < newArray[d391].children[dd391].children.length; ddd391++) {
                                                if(newArray[d391].children[dd391].children[ddd391].id === fileArray[a].id) {
                                                  //level 4
                                                  for(var dddd391 = 0; dddd391 < newArray[d391].children[dd391].children[ddd391].children.length; dddd391++) {
                                                    if(newArray[d391].children[dd391].children[ddd391].children[dddd391].id === fileArray[b].id) {
                                                      //level 5
                                                      for(var ddddd391 = 0; ddddd391 < newArray[d391].children[dd391].children[ddd391].children[dddd391].length; ddddd391++) {
                                                        if(newArray[d391].children[dd391].children[ddd391].children[dddd391].children[ddddd391].id === fileArray[c].id) {
                                                          newArray[d391].children[dd391].children[ddd391].children[dddd391].children[ddddd391].children
                                                          .push({id: fileArray[d].id, name: fileArray[d].file, type: newType, parent: parent})
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
                                    if(fileArray[d].type === 'text/plain') {
                                      newType = "txt"
                                      //level 1
                                      for(var d392 = 0; d392 < newArray.length; d392++) {
                                        if(newArray[d392].id === event.target.value) {
                                          // level 2
                                          for(var dd392 = 0; dd392 < newArray[d392].children.length; dd392++) {
                                            if(newArray[d392].children[dd392].id === fileArray[y].id) {
                                              // level 3
                                              for(var ddd392 = 0; ddd392 < newArray[d392].children[dd392].children.length; ddd392++) {
                                                if(newArray[d392].children[dd392].children[ddd392].id === fileArray[a].id) {
                                                  //level 4
                                                  for(var dddd392 = 0; dddd392 < newArray[d392].children[dd392].children[ddd392].children.length; dddd392++) {
                                                    if(newArray[d392].children[dd392].children[ddd392].children[dddd392].id === fileArray[b].id) {
                                                      //level 5
                                                      for(var ddddd392 = 0; ddddd392 < newArray[d392].children[dd392].children[ddd392].children[dddd392].length; ddddd392++) {
                                                        if(newArray[d392].children[dd392].children[ddd392].children[dddd392].children[ddddd392].id === fileArray[c].id) {
                                                          newArray[d392].children[dd392].children[ddd392].children[dddd392].children[ddddd392].children
                                                          .push({id: fileArray[d].id, name: fileArray[d].file, type: newType, parent: parent})
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
                                    if(fileArray[d].type === 'application/x-zip-compressed') {
                                      newType = "zip"
                                      //level 1
                                      for(var d393 = 0; d393 < newArray.length; d393++) {
                                        if(newArray[d393].id === event.target.value) {
                                          // level 2
                                          for(var dd393 = 0; dd393 < newArray[d393].children.length; dd393++) {
                                            if(newArray[d393].children[dd393].id === fileArray[y].id) {
                                              // level 3
                                              for(var ddd393 = 0; ddd393 < newArray[d393].children[dd393].children.length; ddd393++) {
                                                if(newArray[d393].children[dd393].children[ddd393].id === fileArray[a].id) {
                                                  //level 4
                                                  for(var dddd393 = 0; dddd393 < newArray[d393].children[dd393].children[ddd393].children.length; dddd393++) {
                                                    if(newArray[d393].children[dd393].children[ddd393].children[dddd393].id === fileArray[b].id) {
                                                      //level 5
                                                      for(var ddddd393 = 0; ddddd393 < newArray[d393].children[dd393].children[ddd393].children[dddd393].length; ddddd393++) {
                                                        if(newArray[d393].children[dd393].children[ddd393].children[dddd393].children[ddddd393].id === fileArray[c].id) {
                                                          newArray[d393].children[dd393].children[ddd393].children[dddd393].children[ddddd393].children
                                                          .push({id: fileArray[d].id, name: fileArray[d].file, type: newType, parent: parent})
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
                                    if(fileArray[d].type === 'application/vnd.google-apps.folder') {
                                      newType = "folder";
                                      //level 1
                                      for(var d4 = 0; d4 < newArray.length; d4++) {
                                        if(newArray[d4].id === event.target.value) {
                                          // level 2
                                          for(var dd4 = 0; dd4 < newArray[d4].children.length; dd4++) {
                                            if(newArray[d4].children[dd4].id === fileArray[y].id) {
                                              // level 3
                                              for(var ddd4 = 0; ddd4 < newArray[d4].children[dd4].children.length; ddd4++) {
                                                if(newArray[d4].children[dd4].children[ddd4].id === fileArray[a].id) {
                                                  //level 4
                                                  for(var dddd4 = 0; dddd4 < newArray[d4].children[dd4].children[ddd4].children.length; dddd4++) {
                                                    if(newArray[d4].children[dd4].children[ddd4].children[dddd4].id === fileArray[b].id) {
                                                      //level 5
                                                      for(var ddddd4 = 0; ddddd4 < newArray[d4].children[dd4].children[ddd4].children[dddd4].length; ddddd4++) {
                                                        if(newArray[d4].children[dd4].children[ddd4].children[dddd4].children[ddddd4].id === fileArray[c].id) {
                                                          newArray[d4].children[dd4].children[ddd4].children[dddd4].children[ddddd4].children
                                                          .push({id: fileArray[d].id, name: fileArray[d].file, type: newType, parent: parent, children: []})
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
                                      //6
                                      for (var e = 0; e < fileArray.length; e++) {
                                        if (fileArray[e].parents[0] === fileArray[d].id) {
                                          var parent = fileArray[e].parents[0]
                                          if(fileArray[e].type === 'application/vnd.google-apps.document') {
                                            newType = "docx";
                                            //level 1
                                            for(var e1 = 0; e1 < newArray.length; e1++) {
                                              if(newArray[e1].id === event.target.value) {
                                                //level 2
                                                for(var ee1 = 0; ee1 < newArray[e1].children.length; ee1++) {
                                                  if(newArray[e1].children[ee1].id === fileArray[y].id) {
                                                    // level 3
                                                    for(var eee1 = 0; eee1 < newArray[e1].children[ee1].children.length; eee1++) {
                                                      if(newArray[e1].children[ee1].children[eee1].id === fileArray[a].id) {
                                                        //level 4
                                                        for(var eeee1 = 0; eeee1 < newArray[e1].children[ee1].children[eee1].children.length; eeee1++) {
                                                          if(newArray[e1].children[ee1].children[eee1].children[eeee1].id === fileArray[b].id) {
                                                            //level 5
                                                            for(var eeeee1 = 0; eeeee1 < newArray[e1].children[ee1].children[eee1].children[eeee1].length; eeeee1++) {
                                                              if(newArray[e1].children[ee1].children[eee1].children[eeee1].children[eeeee1].id === fileArray[c].id) {
                                                                //level 6
                                                                for(var eeeeee1 = 0; eeeeee1 < newArray[e1].children[ee1].children[eee1].children[eeee1].children[eeeee1].length; eeeeee1++) {
                                                                  if(newArray[e1].children[ee1].children[eee1].children[eeee1].children[eeeee1].children[eeeeee1].id === fileArray[d].id) {
                                                                    newArray[e1].children[ee1].children[eee1].children[eeee1].children[eeeee1].children[eeeeee1].children
                                                                    .push({id: fileArray[e].id, name: fileArray[e].file, type: newType, parent: parent})
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
                                          if(fileArray[e].type === 'application/vnd.google-apps.presentation') {
                                            newType = "pptx"
                                            //level 1
                                            for(var e2 = 0; e2 < newArray.length; e2++) {
                                              if(newArray[e2].id === event.target.value) {
                                                //level 2
                                                for(var ee2 = 0; ee2 < newArray[e2].children.length; ee2++) {
                                                  if(newArray[e2].children[ee2].id === fileArray[y].id) {
                                                    // level 3
                                                    for(var eee2 = 0; eee2 < newArray[e2].children[ee2].children.length; eee2++) {
                                                      if(newArray[e2].children[ee2].children[eee2].id === fileArray[a].id) {
                                                        //level 4
                                                        for(var eeee2 = 0; eeee2 < newArray[e2].children[ee2].children[eee2].children.length; eeee2++) {
                                                          if(newArray[e2].children[ee2].children[eee2].children[eeee2].id === fileArray[b].id) {
                                                            //level 5
                                                            for(var eeeee2 = 0; eeeee2 < newArray[e2].children[ee2].children[eee2].children[eeee2].length; eeeee2++) {
                                                              if(newArray[e2].children[ee2].children[eee2].children[eeee2].children[eeeee2].id === fileArray[c].id) {
                                                                //level 6
                                                                for(var eeeeee2 = 0; eeeeee2 < newArray[e2].children[ee2].children[eee2].children[eeee2].children[eeeee2].length; eeeeee2++) {
                                                                  if(newArray[e2].children[ee2].children[eee2].children[eeee2].children[eeeee2].children[eeeeee2].id === fileArray[d].id) {
                                                                    newArray[e2].children[ee2].children[eee2].children[eeee2].children[eeeee2].children[eeeeee2].children
                                                                    .push({id: fileArray[e].id, name: fileArray[e].file, type: newType, parent: parent})
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
                                          if(fileArray[e].type === 'application/vnd.google-apps.spreadsheet') {
                                            newType = "xlsx"
                                            //level 1
                                            for(var e3 = 0; e3 < newArray.length; e3++) {
                                              if(newArray[e3].id === event.target.value) {
                                                //level 2
                                                for(var ee3 = 0; ee3 < newArray[e3].children.length; ee3++) {
                                                  if(newArray[e3].children[ee3].id === fileArray[y].id) {
                                                    // level 3
                                                    for(var eee3 = 0; eee3 < newArray[e3].children[ee3].children.length; eee3++) {
                                                      if(newArray[e3].children[ee3].children[eee3].id === fileArray[a].id) {
                                                        //level 4
                                                        for(var eeee3 = 0; eeee3 < newArray[e3].children[ee3].children[eee3].children.length; eeee3++) {
                                                          if(newArray[e3].children[ee3].children[eee3].children[eeee3].id === fileArray[b].id) {
                                                            //level 5
                                                            for(var eeeee3 = 0; eeeee3 < newArray[e3].children[ee3].children[eee3].children[eeee3].length; eeeee3++) {
                                                              if(newArray[e3].children[ee3].children[eee3].children[eeee3].children[eeeee3].id === fileArray[c].id) {
                                                                //level 6
                                                                for(var eeeeee3 = 0; eeeeee3 < newArray[e3].children[ee3].children[eee3].children[eeee3].children[eeeee3].length; eeeeee3++) {
                                                                  if(newArray[e3].children[ee3].children[eee3].children[eeee3].children[eeeee3].children[eeeeee3].id === fileArray[d].id) {
                                                                    newArray[e3].children[ee3].children[eee3].children[eeee3].children[eeeee3].children[eeeeee3].children
                                                                    .push({id: fileArray[e].id, name: fileArray[e].file, type: newType, parent: parent})
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
                                          if(fileArray[e].type === 'application/pdf') {
                                            newType = "pdf"
                                            //level 1
                                            for(var e32 = 0; e32 < newArray.length; e32++) {
                                              if(newArray[e32].id === event.target.value) {
                                                //level 2
                                                for(var ee32 = 0; ee32 < newArray[e32].children.length; ee32++) {
                                                  if(newArray[e32].children[ee32].id === fileArray[y].id) {
                                                    // level 3
                                                    for(var eee32 = 0; eee32 < newArray[e32].children[ee32].children.length; eee32++) {
                                                      if(newArray[e32].children[ee32].children[eee32].id === fileArray[a].id) {
                                                        //level 4
                                                        for(var eeee32 = 0; eeee32 < newArray[e32].children[ee32].children[eee32].children.length; eeee32++) {
                                                          if(newArray[e32].children[ee32].children[eee32].children[eeee32].id === fileArray[b].id) {
                                                            //level 5
                                                            for(var eeeee32 = 0; eeeee32 < newArray[e32].children[ee32].children[eee32].children[eeee32].length; eeeee32++) {
                                                              if(newArray[e32].children[ee32].children[eee32].children[eeee32].children[eeeee32].id === fileArray[c].id) {
                                                                //level 6
                                                                for(var eeeeee32 = 0; eeeeee32 < newArray[e32].children[ee32].children[eee32].children[eeee32].children[eeeee32].length; eeeeee32++) {
                                                                  if(newArray[e32].children[ee32].children[eee32].children[eeee32].children[eeeee32].children[eeeeee32].id === fileArray[d].id) {
                                                                    newArray[e32].children[ee32].children[eee32].children[eeee32].children[eeeee32].children[eeeeee32].children
                                                                    .push({id: fileArray[e].id, name: fileArray[e].file, type: newType, parent: parent})
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
                                          if(fileArray[e].type === 'audio/mpeg') {
                                            newType = "mp3"
                                            //level 1
                                            for(var e33 = 0; e33 < newArray.length; e33++) {
                                              if(newArray[e33].id === event.target.value) {
                                                //level 2
                                                for(var ee33 = 0; ee33 < newArray[e33].children.length; ee33++) {
                                                  if(newArray[e33].children[ee33].id === fileArray[y].id) {
                                                    // level 3
                                                    for(var eee33 = 0; eee33 < newArray[e33].children[ee33].children.length; eee33++) {
                                                      if(newArray[e33].children[ee33].children[eee33].id === fileArray[a].id) {
                                                        //level 4
                                                        for(var eeee33 = 0; eeee33 < newArray[e33].children[ee33].children[eee33].children.length; eeee33++) {
                                                          if(newArray[e33].children[ee33].children[eee33].children[eeee33].id === fileArray[b].id) {
                                                            //level 5
                                                            for(var eeeee33 = 0; eeeee33 < newArray[e33].children[ee33].children[eee33].children[eeee33].length; eeeee33++) {
                                                              if(newArray[e33].children[ee33].children[eee33].children[eeee33].children[eeeee33].id === fileArray[c].id) {
                                                                //level 6
                                                                for(var eeeeee33 = 0; eeeeee33 < newArray[e33].children[ee33].children[eee33].children[eeee33].children[eeeee33].length; eeeeee33++) {
                                                                  if(newArray[e33].children[ee33].children[eee33].children[eeee33].children[eeeee33].children[eeeeee33].id === fileArray[d].id) {
                                                                    newArray[e33].children[ee33].children[eee33].children[eeee33].children[eeeee33].children[eeeeee33].children
                                                                    .push({id: fileArray[e].id, name: fileArray[e].file, type: newType, parent: parent})
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
                                          if(fileArray[e].type === 'audio/wav') {
                                            newType = "wav"
                                            //level 1
                                            for(var e34 = 0; e34 < newArray.length; e34++) {
                                              if(newArray[e34].id === event.target.value) {
                                                //level 2
                                                for(var ee34 = 0; ee34 < newArray[e34].children.length; ee34++) {
                                                  if(newArray[e34].children[ee34].id === fileArray[y].id) {
                                                    // level 3
                                                    for(var eee34 = 0; eee34 < newArray[e34].children[ee34].children.length; eee34++) {
                                                      if(newArray[e34].children[ee34].children[eee34].id === fileArray[a].id) {
                                                        //level 4
                                                        for(var eeee34 = 0; eeee34 < newArray[e34].children[ee34].children[eee34].children.length; eeee34++) {
                                                          if(newArray[e34].children[ee34].children[eee34].children[eeee34].id === fileArray[b].id) {
                                                            //level 5
                                                            for(var eeeee34 = 0; eeeee34 < newArray[e34].children[ee34].children[eee34].children[eeee34].length; eeeee34++) {
                                                              if(newArray[e34].children[ee34].children[eee34].children[eeee34].children[eeeee34].id === fileArray[c].id) {
                                                                //level 6
                                                                for(var eeeeee34 = 0; eeeeee34 < newArray[e34].children[ee34].children[eee34].children[eeee34].children[eeeee34].length; eeeeee34++) {
                                                                  if(newArray[e34].children[ee34].children[eee34].children[eeee34].children[eeeee34].children[eeeeee34].id === fileArray[d].id) {
                                                                    newArray[e34].children[ee34].children[eee34].children[eeee34].children[eeeee34].children[eeeeee34].children
                                                                    .push({id: fileArray[e].id, name: fileArray[e].file, type: newType, parent: parent})
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
                                          if(fileArray[e].type === 'video/mp4') {
                                            newType = "mp4"
                                            //level 1
                                            for(var e35 = 0; e35 < newArray.length; e35++) {
                                              if(newArray[e35].id === event.target.value) {
                                                //level 2
                                                for(var ee35 = 0; ee35 < newArray[e35].children.length; ee35++) {
                                                  if(newArray[e35].children[ee35].id === fileArray[y].id) {
                                                    // level 3
                                                    for(var eee35 = 0; eee35 < newArray[e35].children[ee35].children.length; eee35++) {
                                                      if(newArray[e35].children[ee35].children[eee35].id === fileArray[a].id) {
                                                        //level 4
                                                        for(var eeee35 = 0; eeee35 < newArray[e35].children[ee35].children[eee35].children.length; eeee35++) {
                                                          if(newArray[e35].children[ee35].children[eee35].children[eeee35].id === fileArray[b].id) {
                                                            //level 5
                                                            for(var eeeee35 = 0; eeeee35 < newArray[e35].children[ee35].children[eee35].children[eeee35].length; eeeee35++) {
                                                              if(newArray[e35].children[ee35].children[eee35].children[eeee35].children[eeeee35].id === fileArray[c].id) {
                                                                //level 6
                                                                for(var eeeeee35 = 0; eeeeee35 < newArray[e35].children[ee35].children[eee35].children[eeee35].children[eeeee35].length; eeeeee35++) {
                                                                  if(newArray[e35].children[ee35].children[eee35].children[eeee35].children[eeeee35].children[eeeeee35].id === fileArray[d].id) {
                                                                    newArray[e35].children[ee35].children[eee35].children[eeee35].children[eeeee35].children[eeeeee35].children
                                                                    .push({id: fileArray[e].id, name: fileArray[e].file, type: newType, parent: parent})
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
                                          if(fileArray[e].type === 'image/jpeg') {
                                            newType = "jpg"
                                            //level 1
                                            for(var e36 = 0; e36 < newArray.length; e36++) {
                                              if(newArray[e36].id === event.target.value) {
                                                //level 2
                                                for(var ee36 = 0; ee36 < newArray[e36].children.length; ee36++) {
                                                  if(newArray[e36].children[ee36].id === fileArray[y].id) {
                                                    // level 3
                                                    for(var eee36 = 0; eee36 < newArray[e36].children[ee36].children.length; eee36++) {
                                                      if(newArray[e36].children[ee36].children[eee36].id === fileArray[a].id) {
                                                        //level 4
                                                        for(var eeee36 = 0; eeee36 < newArray[e36].children[ee36].children[eee36].children.length; eeee36++) {
                                                          if(newArray[e36].children[ee36].children[eee36].children[eeee36].id === fileArray[b].id) {
                                                            //level 5
                                                            for(var eeeee36 = 0; eeeee36 < newArray[e36].children[ee36].children[eee36].children[eeee36].length; eeeee36++) {
                                                              if(newArray[e36].children[ee36].children[eee36].children[eeee36].children[eeeee36].id === fileArray[c].id) {
                                                                //level 6
                                                                for(var eeeeee36 = 0; eeeeee36 < newArray[e36].children[ee36].children[eee36].children[eeee36].children[eeeee36].length; eeeeee36++) {
                                                                  if(newArray[e36].children[ee36].children[eee36].children[eeee36].children[eeeee36].children[eeeeee36].id === fileArray[d].id) {
                                                                    newArray[e36].children[ee36].children[eee36].children[eeee36].children[eeeee36].children[eeeeee36].children
                                                                    .push({id: fileArray[e].id, name: fileArray[e].file, type: newType, parent: parent})
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
                                          if(fileArray[e].type === 'image/png') {
                                            newType = "png"
                                            //level 1
                                            for(var e37 = 0; e37 < newArray.length; e37++) {
                                              if(newArray[e37].id === event.target.value) {
                                                //level 2
                                                for(var ee37 = 0; ee37 < newArray[e37].children.length; ee37++) {
                                                  if(newArray[e37].children[ee37].id === fileArray[y].id) {
                                                    // level 3
                                                    for(var eee37 = 0; eee37 < newArray[e37].children[ee37].children.length; eee37++) {
                                                      if(newArray[e37].children[ee37].children[eee37].id === fileArray[a].id) {
                                                        //level 4
                                                        for(var eeee37 = 0; eeee37 < newArray[e37].children[ee37].children[eee37].children.length; eeee37++) {
                                                          if(newArray[e37].children[ee37].children[eee37].children[eeee37].id === fileArray[b].id) {
                                                            //level 5
                                                            for(var eeeee37 = 0; eeeee37 < newArray[e37].children[ee37].children[eee37].children[eeee37].length; eeeee37++) {
                                                              if(newArray[e37].children[ee37].children[eee37].children[eeee37].children[eeeee37].id === fileArray[c].id) {
                                                                //level 6
                                                                for(var eeeeee37 = 0; eeeeee37 < newArray[e37].children[ee37].children[eee37].children[eeee37].children[eeeee37].length; eeeeee37++) {
                                                                  if(newArray[e37].children[ee37].children[eee37].children[eeee37].children[eeeee37].children[eeeeee37].id === fileArray[d].id) {
                                                                    newArray[e37].children[ee37].children[eee37].children[eeee37].children[eeeee37].children[eeeeee37].children
                                                                    .push({id: fileArray[e].id, name: fileArray[e].file, type: newType, parent: parent})
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
                                          if(fileArray[e].type === 'application/msword') {
                                            newType = "doc"
                                            //level 1
                                            for(var e38 = 0; e38 < newArray.length; e38++) {
                                              if(newArray[e38].id === event.target.value) {
                                                //level 2
                                                for(var ee38 = 0; ee38 < newArray[e38].children.length; ee38++) {
                                                  if(newArray[e38].children[ee38].id === fileArray[y].id) {
                                                    // level 3
                                                    for(var eee38 = 0; eee38 < newArray[e38].children[ee38].children.length; eee38++) {
                                                      if(newArray[e38].children[ee38].children[eee38].id === fileArray[a].id) {
                                                        //level 4
                                                        for(var eeee38 = 0; eeee38 < newArray[e38].children[ee38].children[eee38].children.length; eeee38++) {
                                                          if(newArray[e38].children[ee38].children[eee38].children[eeee38].id === fileArray[b].id) {
                                                            //level 5
                                                            for(var eeeee38 = 0; eeeee38 < newArray[e38].children[ee38].children[eee38].children[eeee38].length; eeeee38++) {
                                                              if(newArray[e38].children[ee38].children[eee38].children[eeee38].children[eeeee38].id === fileArray[c].id) {
                                                                //level 6
                                                                for(var eeeeee38 = 0; eeeeee38 < newArray[e38].children[ee38].children[eee38].children[eeee38].children[eeeee38].length; eeeeee38++) {
                                                                  if(newArray[e38].children[ee38].children[eee38].children[eeee38].children[eeeee38].children[eeeeee38].id === fileArray[d].id) {
                                                                    newArray[e38].children[ee38].children[eee38].children[eeee38].children[eeeee38].children[eeeeee38].children
                                                                    .push({id: fileArray[e].id, name: fileArray[e].file, type: newType, parent: parent})
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
                                          if(fileArray[e].type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                                            newType = "docx"
                                            //level 1
                                            for(var e39 = 0; e39 < newArray.length; e39++) {
                                              if(newArray[e39].id === event.target.value) {
                                                //level 2
                                                for(var ee39 = 0; ee39 < newArray[e39].children.length; ee39++) {
                                                  if(newArray[e39].children[ee39].id === fileArray[y].id) {
                                                    // level 3
                                                    for(var eee39 = 0; eee39 < newArray[e39].children[ee39].children.length; eee39++) {
                                                      if(newArray[e39].children[ee39].children[eee39].id === fileArray[a].id) {
                                                        //level 4
                                                        for(var eeee39 = 0; eeee39 < newArray[e39].children[ee39].children[eee39].children.length; eeee39++) {
                                                          if(newArray[e39].children[ee39].children[eee39].children[eeee39].id === fileArray[b].id) {
                                                            //level 5
                                                            for(var eeeee39 = 0; eeeee39 < newArray[e39].children[ee39].children[eee39].children[eeee39].length; eeeee39++) {
                                                              if(newArray[e39].children[ee39].children[eee39].children[eeee39].children[eeeee39].id === fileArray[c].id) {
                                                                //level 6
                                                                for(var eeeeee39 = 0; eeeeee39 < newArray[e39].children[ee39].children[eee39].children[eeee39].children[eeeee39].length; eeeeee39++) {
                                                                  if(newArray[e39].children[ee39].children[eee39].children[eeee39].children[eeeee39].children[eeeeee39].id === fileArray[d].id) {
                                                                    newArray[e39].children[ee39].children[eee39].children[eeee39].children[eeeee39].children[eeeeee39].children
                                                                    .push({id: fileArray[e].id, name: fileArray[e].file, type: newType, parent: parent})
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
                                          if(fileArray[e].type === 'application/vnd.ms-powerpoint') {
                                            newType = "docx"
                                            //level 1
                                            for(var e391 = 0; e391 < newArray.length; e391++) {
                                              if(newArray[e391].id === event.target.value) {
                                                //level 2
                                                for(var ee391 = 0; ee391 < newArray[e391].children.length; ee391++) {
                                                  if(newArray[e391].children[ee391].id === fileArray[y].id) {
                                                    // level 3
                                                    for(var eee391 = 0; eee391 < newArray[e391].children[ee391].children.length; eee391++) {
                                                      if(newArray[e391].children[ee391].children[eee391].id === fileArray[a].id) {
                                                        //level 4
                                                        for(var eeee391 = 0; eeee391 < newArray[e391].children[ee391].children[eee391].children.length; eeee391++) {
                                                          if(newArray[e391].children[ee391].children[eee391].children[eeee391].id === fileArray[b].id) {
                                                            //level 5
                                                            for(var eeeee391 = 0; eeeee391 < newArray[e391].children[ee391].children[eee391].children[eeee391].length; eeeee391++) {
                                                              if(newArray[e391].children[ee391].children[eee391].children[eeee391].children[eeeee391].id === fileArray[c].id) {
                                                                //level 6
                                                                for(var eeeeee391 = 0; eeeeee391 < newArray[e391].children[ee391].children[eee391].children[eeee391].children[eeeee391].length; eeeeee391++) {
                                                                  if(newArray[e391].children[ee391].children[eee391].children[eeee391].children[eeeee391].children[eeeeee391].id === fileArray[d].id) {
                                                                    newArray[e391].children[ee391].children[eee391].children[eeee391].children[eeeee391].children[eeeeee391].children
                                                                    .push({id: fileArray[e].id, name: fileArray[e].file, type: newType, parent: parent})
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
                                          if(fileArray[e].type === 'text/plain') {
                                            newType = "txt"
                                            //level 1
                                            for(var e392 = 0; e392 < newArray.length; e392++) {
                                              if(newArray[e392].id === event.target.value) {
                                                //level 2
                                                for(var ee392 = 0; ee392 < newArray[e392].children.length; ee392++) {
                                                  if(newArray[e392].children[ee392].id === fileArray[y].id) {
                                                    // level 3
                                                    for(var eee392 = 0; eee392 < newArray[e392].children[ee392].children.length; eee392++) {
                                                      if(newArray[e392].children[ee392].children[eee392].id === fileArray[a].id) {
                                                        //level 4
                                                        for(var eeee392 = 0; eeee392 < newArray[e392].children[ee392].children[eee392].children.length; eeee392++) {
                                                          if(newArray[e392].children[ee392].children[eee392].children[eeee392].id === fileArray[b].id) {
                                                            //level 5
                                                            for(var eeeee392 = 0; eeeee392 < newArray[e392].children[ee392].children[eee392].children[eeee392].length; eeeee392++) {
                                                              if(newArray[e392].children[ee392].children[eee392].children[eeee392].children[eeeee392].id === fileArray[c].id) {
                                                                //level 6
                                                                for(var eeeeee392 = 0; eeeeee392 < newArray[e392].children[ee392].children[eee392].children[eeee392].children[eeeee392].length; eeeeee392++) {
                                                                  if(newArray[e392].children[ee392].children[eee392].children[eeee392].children[eeeee392].children[eeeeee392].id === fileArray[d].id) {
                                                                    newArray[e392].children[ee392].children[eee392].children[eeee392].children[eeeee392].children[eeeeee392].children
                                                                    .push({id: fileArray[e].id, name: fileArray[e].file, type: newType, parent: parent})
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
                                          if(fileArray[e].type === 'application/x-zip-compressed') {
                                            newType = "zip"
                                            //level 1
                                            for(var e393 = 0; e393 < newArray.length; e393++) {
                                              if(newArray[e393].id === event.target.value) {
                                                //level 2
                                                for(var ee393 = 0; ee393 < newArray[e393].children.length; ee393++) {
                                                  if(newArray[e393].children[ee393].id === fileArray[y].id) {
                                                    // level 3
                                                    for(var eee393 = 0; eee393 < newArray[e393].children[ee393].children.length; eee393++) {
                                                      if(newArray[e393].children[ee393].children[eee393].id === fileArray[a].id) {
                                                        //level 4
                                                        for(var eeee393 = 0; eeee393 < newArray[e393].children[ee393].children[eee393].children.length; eeee393++) {
                                                          if(newArray[e393].children[ee393].children[eee393].children[eeee393].id === fileArray[b].id) {
                                                            //level 5
                                                            for(var eeeee393 = 0; eeeee393 < newArray[e393].children[ee393].children[eee393].children[eeee393].length; eeeee393++) {
                                                              if(newArray[e393].children[ee393].children[eee393].children[eeee393].children[eeeee393].id === fileArray[c].id) {
                                                                //level 6
                                                                for(var eeeeee393 = 0; eeeeee393 < newArray[e393].children[ee393].children[eee393].children[eeee393].children[eeeee393].length; eeeeee393++) {
                                                                  if(newArray[e393].children[ee393].children[eee393].children[eeee393].children[eeeee393].children[eeeeee393].id === fileArray[d].id) {
                                                                    newArray[e393].children[ee393].children[eee393].children[eeee393].children[eeeee393].children[eeeeee393].children
                                                                    .push({id: fileArray[e].id, name: fileArray[e].file, type: newType, parent: parent})
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
                                          if(fileArray[e].type === 'application/vnd.google-apps.folder') {
                                            newType = "folder";
                                            //level 1
                                            for(var e4 = 0; e4 < newArray.length; e4++) {
                                              if(newArray[e4].id === event.target.value) {
                                                //level 2
                                                for(var ee4 = 0; ee4 < newArray[e4].children.length; ee4++) {
                                                  if(newArray[e4].children[ee4].id === fileArray[y].id) {
                                                    // level 3
                                                    for(var eee4 = 0; eee4 < newArray[e4].children[ee4].children.length; eee4++) {
                                                      if(newArray[e4].children[ee4].children[eee4].id === fileArray[a].id) {
                                                        //level 4
                                                        for(var eeee4 = 0; eeee4 < newArray[e4].children[ee4].children[eee4].children.length; eeee4++) {
                                                          if(newArray[e4].children[ee4].children[eee4].children[eeee4].id === fileArray[b].id) {
                                                            //level 5
                                                            for(var eeeee4 = 0; eeeee4 < newArray[e4].children[ee4].children[eee4].children[eeee4].length; eeeee4++) {
                                                              if(newArray[e4].children[ee4].children[eee4].children[eeee4].children[eeeee4].id === fileArray[c].id) {
                                                                //level 6
                                                                for(var eeeeee4 = 0; eeeeee4 < newArray[e4].children[ee4].children[eee4].children[eeee4].children[eeeee4].length; eeeeee4++) {
                                                                  if(newArray[e4].children[ee4].children[eee4].children[eeee4].children[eeeee4].children[eeeeee4].id === fileArray[d].id) {
                                                                    newArray[e4].children[ee4].children[eee4].children[eeee4].children[eeeee4].children[eeeeee4].children
                                                                    .push({id: fileArray[e].id, name: fileArray[e].file, type: newType, parent: parent, children: []})
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
                                            //7
                                            for (var f = 0; f < fileArray.length; f++) {
                                              if (fileArray[f].parents[0] === fileArray[e].id) {
                                                var parent = fileArray[f].parents[0]
                                                if(fileArray[f].type === 'application/vnd.google-apps.document') {
                                                  newType = "docx";
                                                  //level 1
                                                  for(var f1 = 0; f1 < newArray.length; f1++) {
                                                    if(newArray[f1].id === event.target.value) {
                                                      //level 2
                                                      for(var ff1 = 0; ff1 < newArray[f1].children.length; ff1++) {
                                                        if(newArray[f1].children[ff1].id === fileArray[y].id) {
                                                          // level 3
                                                          for(var fff1 = 0; fff1 < newArray[f1].children[ff1].children.length; fff1++) {
                                                            if(newArray[f1].children[ff1].children[fff1].id === fileArray[a].id) {
                                                              //level 4
                                                              for(var ffff1 = 0; ffff1 < newArray[f1].children[ff1].children[fff1].children.length; ffff1++) {
                                                                if(newArray[f1].children[ff1].children[fff1].children[ffff1].id === fileArray[b].id) {
                                                                  //level 5
                                                                  for(var fffff1 = 0; fffff1 < newArray[f1].children[ff1].children[fff1].children[ffff1].length; fffff1++) {
                                                                    if(newArray[f1].children[ff1].children[fff1].children[ffff1].children[fffff1].id === fileArray[c].id) {
                                                                      //level 6
                                                                      for(var ffffff1 = 0; ffffff1 < newArray[f1].children[ff1].children[fff1].children[ffff1].children[fffff1].length; ffffff1++) {
                                                                        if(newArray[f1].children[ff1].children[fff1].children[ffff1].children[fffff1].children[ffffff1].id === fileArray[d].id) {
                                                                          //level 7
                                                                          for(var fffffff1 = 0; fffffff1 < newArray[f1].children[ff1].children[fff1].children[ffff1].children[fffff1].children[ffffff1].length; fffffff1++) {
                                                                            if(newArray[f1].children[ff1].children[fff1].children[ffff1].children[fffff1].children[ffffff1].children[fffffff1].id === fileArray[e].id) {
                                                                              newArray[f1].children[ff1].children[fff1].children[ffff1].children[fffff1].children[ffffff1].children[fffffff1].children
                                                                              .push({id: fileArray[f].id, name: fileArray[f].file, type: newType, parent: parent})
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
                                                if(fileArray[f].type === 'application/vnd.google-apps.presentation') {
                                                  newType = "pptx"
                                                  //level 1
                                                  for(var f2 = 0; f2 < newArray.length; f2++) {
                                                    if(newArray[f2].id === event.target.value) {
                                                      //level 2
                                                      for(var ff2 = 0; ff2 < newArray[f2].children.length; ff2++) {
                                                        if(newArray[f2].children[ff2].id === fileArray[y].id) {
                                                          // level 3
                                                          for(var fff2 = 0; fff2 < newArray[f2].children[ff2].children.length; fff2++) {
                                                            if(newArray[f2].children[ff2].children[fff2].id === fileArray[a].id) {
                                                              //level 4
                                                              for(var ffff2 = 0; ffff2 < newArray[f2].children[ff2].children[fff2].children.length; ffff2++) {
                                                                if(newArray[f2].children[ff2].children[fff2].children[ffff2].id === fileArray[b].id) {
                                                                  //level 5
                                                                  for(var fffff2 = 0; fffff2 < newArray[f2].children[ff2].children[fff2].children[ffff2].length; fffff2++) {
                                                                    if(newArray[f2].children[ff2].children[ffff2].children[ffff2].children[fffff2].id === fileArray[c].id) {
                                                                      //level 6
                                                                      for(var ffffff2 = 0; ffffff2 < newArray[f2].children[ff2].children[fff2].children[ffff2].children[fffff2].length; ffffff2++) {
                                                                        if(newArray[f2].children[ff2].children[fff2].children[ffff2].children[fffff2].children[ffffff2].id === fileArray[d].id) {
                                                                          //level 7
                                                                          for(var fffffff2 = 0; fffffff2 < newArray[f2].children[ff2].children[fff2].children[ffff2].children[fffff2].children[ffffff2].length; fffffff2++) {
                                                                            if(newArray[f2].children[ff2].children[fff2].children[ffff2].children[fffff2].children[ffffff2].children[fffffff2].id === fileArray[e].id) {
                                                                              newArray[f2].children[ff2].children[fff2].children[ffff2].children[fffff2].children[ffffff2].children[fffffff2].children
                                                                              .push({id: fileArray[f].id, name: fileArray[f].file, type: newType, parent: parent})
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
                                                if(fileArray[f].type === 'application/vnd.google-apps.spreadsheet') {
                                                  newType = "xlsx"
                                                  //level 1
                                                  for(var f3 = 0; f3 < newArray.length; f3++) {
                                                    if(newArray[f3].id === event.target.value) {
                                                      //level 2
                                                      for(var ff3 = 0; ff3 < newArray[f3].children.length; ff3++) {
                                                        if(newArray[f3].children[ff3].id === fileArray[y].id) {
                                                          // level 3
                                                          for(var fff3 = 0; fff3 < newArray[f3].children[ff3].children.length; fff3++) {
                                                            if(newArray[f3].children[ff3].children[fff3].id === fileArray[a].id) {
                                                              //level 4
                                                              for(var ffff3 = 0; ffff3 < newArray[f3].children[ff3].children[fff3].children.length; ffff3++) {
                                                                if(newArray[f3].children[ff3].children[fff3].children[ffff3].id === fileArray[b].id) {
                                                                  //level 5
                                                                  for(var fffff3 = 0; fffff3 < newArray[f3].children[ff3].children[fff3].children[ffff3].length; fffff3++) {
                                                                    if(newArray[f3].children[ff3].children[ffff3].children[ffff3].children[fffff3].id === fileArray[c].id) {
                                                                      //level 6
                                                                      for(var ffffff3 = 0; ffffff3 < newArray[f3].children[ff3].children[fff3].children[ffff3].children[fffff3].length; ffffff3++) {
                                                                        if(newArray[f3].children[ff3].children[fff3].children[ffff3].children[fffff3].children[ffffff3].id === fileArray[d].id) {
                                                                          //level 7
                                                                          for(var fffffff3 = 0; fffffff3 < newArray[f3].children[ff3].children[fff3].children[ffff3].children[fffff3].children[ffffff3].length; fffffff3++) {
                                                                            if(newArray[f3].children[ff3].children[fff3].children[ffff3].children[fffff3].children[ffffff3].children[fffffff3].id === fileArray[e].id) {
                                                                              newArray[f3].children[ff3].children[fff3].children[ffff3].children[fffff3].children[ffffff3].children[fffffff3].children
                                                                              .push({id: fileArray[f].id, name: fileArray[f].file, type: newType, parent: parent})
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
                                                if(fileArray[f].type === 'application/pdf') {
                                                  newType = "pdf"
                                                  //level 1
                                                  for(var f32 = 0; f32 < newArray.length; f32++) {
                                                    if(newArray[f32].id === event.target.value) {
                                                      //level 2
                                                      for(var ff32 = 0; ff32 < newArray[f32].children.length; ff32++) {
                                                        if(newArray[f32].children[ff32].id === fileArray[y].id) {
                                                          // level 3
                                                          for(var fff32 = 0; fff32 < newArray[f32].children[ff32].children.length; fff32++) {
                                                            if(newArray[f32].children[ff32].children[fff32].id === fileArray[a].id) {
                                                              //level 4
                                                              for(var ffff32 = 0; ffff32 < newArray[f32].children[ff32].children[fff32].children.length; ffff32++) {
                                                                if(newArray[f32].children[ff32].children[fff32].children[ffff32].id === fileArray[b].id) {
                                                                  //level 5
                                                                  for(var fffff32 = 0; fffff32 < newArray[f32].children[ff32].children[fff32].children[ffff32].length; fffff32++) {
                                                                    if(newArray[f32].children[ff32].children[ffff32].children[ffff32].children[fffff32].id === fileArray[c].id) {
                                                                      //level 6
                                                                      for(var ffffff32 = 0; ffffff32 < newArray[f32].children[ff32].children[fff32].children[ffff32].children[fffff32].length; ffffff32++) {
                                                                        if(newArray[f32].children[ff32].children[fff32].children[ffff32].children[fffff32].children[ffffff32].id === fileArray[d].id) {
                                                                          //level 7
                                                                          for(var fffffff32 = 0; fffffff32 < newArray[f32].children[ff32].children[fff32].children[ffff32].children[fffff32].children[ffffff32].length; fffffff32++) {
                                                                            if(newArray[f32].children[ff32].children[fff32].children[ffff32].children[fffff32].children[ffffff32].children[fffffff32].id === fileArray[e].id) {
                                                                              newArray[f32].children[ff32].children[fff32].children[ffff32].children[fffff32].children[ffffff32].children[fffffff32].children
                                                                              .push({id: fileArray[f].id, name: fileArray[f].file, type: newType, parent: parent})
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
                                                if(fileArray[f].type === 'audio/mpeg') {
                                                  newType = "mp3"
                                                  //level 1
                                                  for(var f33 = 0; f33 < newArray.length; f33++) {
                                                    if(newArray[f33].id === event.target.value) {
                                                      //level 2
                                                      for(var ff33 = 0; ff33 < newArray[f33].children.length; ff33++) {
                                                        if(newArray[f33].children[ff33].id === fileArray[y].id) {
                                                          // level 3
                                                          for(var fff33 = 0; fff33 < newArray[f33].children[ff33].children.length; fff33++) {
                                                            if(newArray[f33].children[ff33].children[fff33].id === fileArray[a].id) {
                                                              //level 4
                                                              for(var ffff33 = 0; ffff33 < newArray[f33].children[ff33].children[fff33].children.length; ffff33++) {
                                                                if(newArray[f33].children[ff33].children[fff33].children[ffff33].id === fileArray[b].id) {
                                                                  //level 5
                                                                  for(var fffff33 = 0; fffff33 < newArray[f33].children[ff33].children[fff33].children[ffff33].length; fffff33++) {
                                                                    if(newArray[f33].children[ff33].children[ffff33].children[ffff33].children[fffff33].id === fileArray[c].id) {
                                                                      //level 6
                                                                      for(var ffffff33 = 0; ffffff33 < newArray[f33].children[ff33].children[fff33].children[ffff33].children[fffff33].length; ffffff33++) {
                                                                        if(newArray[f33].children[ff33].children[fff33].children[ffff33].children[fffff33].children[ffffff33].id === fileArray[d].id) {
                                                                          //level 7
                                                                          for(var fffffff33 = 0; fffffff33 < newArray[f33].children[ff33].children[fff33].children[ffff33].children[fffff33].children[ffffff33].length; fffffff33++) {
                                                                            if(newArray[f33].children[ff33].children[fff33].children[ffff33].children[fffff33].children[ffffff33].children[fffffff33].id === fileArray[e].id) {
                                                                              newArray[f33].children[ff33].children[fff33].children[ffff33].children[fffff33].children[ffffff33].children[fffffff33].children
                                                                              .push({id: fileArray[f].id, name: fileArray[f].file, type: newType, parent: parent})
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
                                                if(fileArray[f].type === 'audio/wav') {
                                                  newType = "wav"
                                                  //level 1
                                                  for(var f34 = 0; f34 < newArray.length; f34++) {
                                                    if(newArray[f34].id === event.target.value) {
                                                      //level 2
                                                      for(var ff34 = 0; ff34 < newArray[f34].children.length; ff34++) {
                                                        if(newArray[f34].children[ff34].id === fileArray[y].id) {
                                                          // level 3
                                                          for(var fff34 = 0; fff34 < newArray[f34].children[ff34].children.length; fff34++) {
                                                            if(newArray[f34].children[ff34].children[fff34].id === fileArray[a].id) {
                                                              //level 4
                                                              for(var ffff34 = 0; ffff34 < newArray[f34].children[ff34].children[fff34].children.length; ffff34++) {
                                                                if(newArray[f34].children[ff34].children[fff34].children[ffff34].id === fileArray[b].id) {
                                                                  //level 5
                                                                  for(var fffff34 = 0; fffff34 < newArray[f34].children[ff34].children[fff34].children[ffff34].length; fffff34++) {
                                                                    if(newArray[f34].children[ff34].children[ffff34].children[ffff34].children[fffff34].id === fileArray[c].id) {
                                                                      //level 6
                                                                      for(var ffffff34 = 0; ffffff34 < newArray[f34].children[ff34].children[fff34].children[ffff34].children[fffff34].length; ffffff34++) {
                                                                        if(newArray[f34].children[ff34].children[fff34].children[ffff34].children[fffff34].children[ffffff34].id === fileArray[d].id) {
                                                                          //level 7
                                                                          for(var fffffff34 = 0; fffffff34 < newArray[f34].children[ff34].children[fff34].children[ffff34].children[fffff34].children[ffffff34].length; fffffff34++) {
                                                                            if(newArray[f34].children[ff34].children[fff34].children[ffff34].children[fffff34].children[ffffff34].children[fffffff34].id === fileArray[e].id) {
                                                                              newArray[f34].children[ff34].children[fff34].children[ffff34].children[fffff34].children[ffffff34].children[fffffff34].children
                                                                              .push({id: fileArray[f].id, name: fileArray[f].file, type: newType, parent: parent})
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
                                                if(fileArray[f].type === 'video/mp4') {
                                                  newType = "mp4"
                                                  //level 1
                                                  for(var f35 = 0; f35 < newArray.length; f35++) {
                                                    if(newArray[f35].id === event.target.value) {
                                                      //level 2
                                                      for(var ff35 = 0; ff35 < newArray[f35].children.length; ff35++) {
                                                        if(newArray[f35].children[ff35].id === fileArray[y].id) {
                                                          // level 3
                                                          for(var fff35 = 0; fff35 < newArray[f35].children[ff35].children.length; fff35++) {
                                                            if(newArray[f35].children[ff35].children[fff35].id === fileArray[a].id) {
                                                              //level 4
                                                              for(var ffff35 = 0; ffff35 < newArray[f35].children[ff35].children[fff35].children.length; ffff35++) {
                                                                if(newArray[f35].children[ff35].children[fff35].children[ffff35].id === fileArray[b].id) {
                                                                  //level 5
                                                                  for(var fffff35 = 0; fffff35 < newArray[f35].children[ff35].children[fff35].children[ffff35].length; fffff35++) {
                                                                    if(newArray[f35].children[ff35].children[ffff35].children[ffff35].children[fffff35].id === fileArray[c].id) {
                                                                      //level 6
                                                                      for(var ffffff35 = 0; ffffff35 < newArray[f35].children[ff35].children[fff35].children[ffff35].children[fffff35].length; ffffff35++) {
                                                                        if(newArray[f35].children[ff35].children[fff35].children[ffff35].children[fffff35].children[ffffff35].id === fileArray[d].id) {
                                                                          //level 7
                                                                          for(var fffffff35 = 0; fffffff35 < newArray[f35].children[ff35].children[fff35].children[ffff35].children[fffff35].children[ffffff35].length; fffffff35++) {
                                                                            if(newArray[f35].children[ff35].children[fff35].children[ffff35].children[fffff35].children[ffffff35].children[fffffff35].id === fileArray[e].id) {
                                                                              newArray[f35].children[ff35].children[fff35].children[ffff35].children[fffff35].children[ffffff35].children[fffffff35].children
                                                                              .push({id: fileArray[f].id, name: fileArray[f].file, type: newType, parent: parent})
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
                                                if(fileArray[f].type === 'image/jpeg') {
                                                  newType = "jpg"
                                                  //level 1
                                                  for(var f36 = 0; f36 < newArray.length; f36++) {
                                                    if(newArray[f36].id === event.target.value) {
                                                      //level 2
                                                      for(var ff36 = 0; ff36 < newArray[f36].children.length; ff36++) {
                                                        if(newArray[f36].children[ff36].id === fileArray[y].id) {
                                                          // level 3
                                                          for(var fff36 = 0; fff36 < newArray[f36].children[ff36].children.length; fff36++) {
                                                            if(newArray[f36].children[ff36].children[fff36].id === fileArray[a].id) {
                                                              //level 4
                                                              for(var ffff36 = 0; ffff36 < newArray[f36].children[ff36].children[fff36].children.length; ffff36++) {
                                                                if(newArray[f36].children[ff36].children[fff36].children[ffff36].id === fileArray[b].id) {
                                                                  //level 5
                                                                  for(var fffff36 = 0; fffff36 < newArray[f36].children[ff36].children[fff36].children[ffff36].length; fffff36++) {
                                                                    if(newArray[f36].children[ff36].children[ffff36].children[ffff36].children[fffff36].id === fileArray[c].id) {
                                                                      //level 6
                                                                      for(var ffffff36 = 0; ffffff36 < newArray[f36].children[ff36].children[fff36].children[ffff36].children[fffff36].length; ffffff36++) {
                                                                        if(newArray[f36].children[ff36].children[fff36].children[ffff36].children[fffff36].children[ffffff36].id === fileArray[d].id) {
                                                                          //level 7
                                                                          for(var fffffff36 = 0; fffffff36 < newArray[f36].children[ff36].children[fff36].children[ffff36].children[fffff36].children[ffffff36].length; fffffff36++) {
                                                                            if(newArray[f36].children[ff36].children[fff36].children[ffff36].children[fffff36].children[ffffff36].children[fffffff36].id === fileArray[e].id) {
                                                                              newArray[f36].children[ff36].children[fff36].children[ffff36].children[fffff36].children[ffffff36].children[fffffff36].children
                                                                              .push({id: fileArray[f].id, name: fileArray[f].file, type: newType, parent: parent})
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
                                                if(fileArray[f].type === 'image/png') {
                                                  newType = "png"
                                                  //level 1
                                                  for(var f37 = 0; f37 < newArray.length; f37++) {
                                                    if(newArray[f37].id === event.target.value) {
                                                      //level 2
                                                      for(var ff37 = 0; ff37 < newArray[f37].children.length; ff37++) {
                                                        if(newArray[f37].children[ff37].id === fileArray[y].id) {
                                                          // level 3
                                                          for(var fff37 = 0; fff37 < newArray[f37].children[ff37].children.length; fff37++) {
                                                            if(newArray[f37].children[ff37].children[fff37].id === fileArray[a].id) {
                                                              //level 4
                                                              for(var ffff37 = 0; ffff37 < newArray[f37].children[ff37].children[fff37].children.length; ffff37++) {
                                                                if(newArray[f37].children[ff37].children[fff37].children[ffff37].id === fileArray[b].id) {
                                                                  //level 5
                                                                  for(var fffff37 = 0; fffff37 < newArray[f37].children[ff37].children[fff37].children[ffff37].length; fffff37++) {
                                                                    if(newArray[f37].children[ff37].children[ffff37].children[ffff37].children[fffff37].id === fileArray[c].id) {
                                                                      //level 6
                                                                      for(var ffffff37 = 0; ffffff37 < newArray[f37].children[ff37].children[fff37].children[ffff37].children[fffff37].length; ffffff37++) {
                                                                        if(newArray[f37].children[ff37].children[fff37].children[ffff37].children[fffff37].children[ffffff37].id === fileArray[d].id) {
                                                                          //level 7
                                                                          for(var fffffff37 = 0; fffffff37 < newArray[f37].children[ff37].children[fff37].children[ffff37].children[fffff37].children[ffffff37].length; fffffff37++) {
                                                                            if(newArray[f37].children[ff37].children[fff37].children[ffff37].children[fffff37].children[ffffff37].children[fffffff37].id === fileArray[e].id) {
                                                                              newArray[f37].children[ff37].children[fff37].children[ffff37].children[fffff37].children[ffffff37].children[fffffff37].children
                                                                              .push({id: fileArray[f].id, name: fileArray[f].file, type: newType, parent: parent})
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
                                                if(fileArray[f].type === 'application/msword') {
                                                  newType = "doc"
                                                  //level 1
                                                  for(var f38 = 0; f38 < newArray.length; f38++) {
                                                    if(newArray[f38].id === event.target.value) {
                                                      //level 2
                                                      for(var ff38 = 0; ff38 < newArray[f38].children.length; ff38++) {
                                                        if(newArray[f38].children[ff38].id === fileArray[y].id) {
                                                          // level 3
                                                          for(var fff38 = 0; fff38 < newArray[f38].children[ff38].children.length; fff38++) {
                                                            if(newArray[f38].children[ff38].children[fff38].id === fileArray[a].id) {
                                                              //level 4
                                                              for(var ffff38 = 0; ffff38 < newArray[f38].children[ff38].children[fff38].children.length; ffff38++) {
                                                                if(newArray[f38].children[ff38].children[fff38].children[ffff38].id === fileArray[b].id) {
                                                                  //level 5
                                                                  for(var fffff38 = 0; fffff38 < newArray[f38].children[ff38].children[fff38].children[ffff38].length; fffff38++) {
                                                                    if(newArray[f38].children[ff38].children[ffff38].children[ffff38].children[fffff38].id === fileArray[c].id) {
                                                                      //level 6
                                                                      for(var ffffff38 = 0; ffffff38 < newArray[f38].children[ff38].children[fff38].children[ffff38].children[fffff38].length; ffffff38++) {
                                                                        if(newArray[f38].children[ff38].children[fff38].children[ffff38].children[fffff38].children[ffffff38].id === fileArray[d].id) {
                                                                          //level 7
                                                                          for(var fffffff38 = 0; fffffff38 < newArray[f38].children[ff38].children[fff38].children[ffff38].children[fffff38].children[ffffff38].length; fffffff38++) {
                                                                            if(newArray[f38].children[ff38].children[fff38].children[ffff38].children[fffff38].children[ffffff38].children[fffffff38].id === fileArray[e].id) {
                                                                              newArray[f38].children[ff38].children[fff38].children[ffff38].children[fffff38].children[ffffff38].children[fffffff38].children
                                                                              .push({id: fileArray[f].id, name: fileArray[f].file, type: newType, parent: parent})
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
                                                if(fileArray[f].type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                                                  newType = "docx"
                                                  //level 1
                                                  for(var f39 = 0; f39 < newArray.length; f39++) {
                                                    if(newArray[f39].id === event.target.value) {
                                                      //level 2
                                                      for(var ff39 = 0; ff39 < newArray[f39].children.length; ff39++) {
                                                        if(newArray[f39].children[ff39].id === fileArray[y].id) {
                                                          // level 3
                                                          for(var fff39 = 0; fff39 < newArray[f39].children[ff39].children.length; fff39++) {
                                                            if(newArray[f39].children[ff39].children[fff39].id === fileArray[a].id) {
                                                              //level 4
                                                              for(var ffff39 = 0; ffff39 < newArray[f39].children[ff39].children[fff39].children.length; ffff39++) {
                                                                if(newArray[f39].children[ff39].children[fff39].children[ffff39].id === fileArray[b].id) {
                                                                  //level 5
                                                                  for(var fffff39 = 0; fffff39 < newArray[f39].children[ff39].children[fff39].children[ffff39].length; fffff39++) {
                                                                    if(newArray[f39].children[ff39].children[ffff39].children[ffff39].children[fffff39].id === fileArray[c].id) {
                                                                      //level 6
                                                                      for(var ffffff39 = 0; ffffff39 < newArray[f39].children[ff39].children[fff39].children[ffff39].children[fffff39].length; ffffff39++) {
                                                                        if(newArray[f39].children[ff39].children[fff39].children[ffff39].children[fffff39].children[ffffff39].id === fileArray[d].id) {
                                                                          //level 7
                                                                          for(var fffffff39 = 0; fffffff39 < newArray[f39].children[ff39].children[fff39].children[ffff39].children[fffff39].children[ffffff39].length; fffffff39++) {
                                                                            if(newArray[f39].children[ff39].children[fff39].children[ffff39].children[fffff39].children[ffffff39].children[fffffff39].id === fileArray[e].id) {
                                                                              newArray[f39].children[ff39].children[fff39].children[ffff39].children[fffff39].children[ffffff39].children[fffffff39].children
                                                                              .push({id: fileArray[f].id, name: fileArray[f].file, type: newType, parent: parent})
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
                                                if(fileArray[f].type === 'application/vnd.ms-powerpoint') {
                                                  newType = "ppt"
                                                  //level 1
                                                  for(var f391 = 0; f391 < newArray.length; f391++) {
                                                    if(newArray[f391].id === event.target.value) {
                                                      //level 2
                                                      for(var ff391 = 0; ff391 < newArray[f391].children.length; ff391++) {
                                                        if(newArray[f391].children[ff391].id === fileArray[y].id) {
                                                          // level 3
                                                          for(var fff391 = 0; fff391 < newArray[f391].children[ff391].children.length; fff391++) {
                                                            if(newArray[f391].children[ff391].children[fff391].id === fileArray[a].id) {
                                                              //level 4
                                                              for(var ffff391 = 0; ffff391 < newArray[f391].children[ff391].children[fff391].children.length; ffff391++) {
                                                                if(newArray[f391].children[ff391].children[fff391].children[ffff391].id === fileArray[b].id) {
                                                                  //level 5
                                                                  for(var fffff391 = 0; fffff391 < newArray[f391].children[ff391].children[fff391].children[ffff391].length; fffff391++) {
                                                                    if(newArray[f391].children[ff391].children[ffff391].children[ffff391].children[fffff391].id === fileArray[c].id) {
                                                                      //level 6
                                                                      for(var ffffff391 = 0; ffffff391 < newArray[f391].children[ff391].children[fff391].children[ffff391].children[fffff391].length; ffffff391++) {
                                                                        if(newArray[f391].children[ff391].children[fff391].children[ffff391].children[fffff391].children[ffffff391].id === fileArray[d].id) {
                                                                          //level 7
                                                                          for(var fffffff391 = 0; fffffff391 < newArray[f391].children[ff391].children[fff391].children[ffff391].children[fffff391].children[ffffff391].length; fffffff391++) {
                                                                            if(newArray[f391].children[ff391].children[fff391].children[ffff391].children[fffff391].children[ffffff391].children[fffffff391].id === fileArray[e].id) {
                                                                              newArray[f391].children[ff391].children[fff391].children[ffff391].children[fffff391].children[ffffff391].children[fffffff391].children
                                                                              .push({id: fileArray[f].id, name: fileArray[f].file, type: newType, parent: parent})
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
                                                if(fileArray[f].type === 'text/plain') {
                                                  newType = "txt"
                                                  //level 1
                                                  for(var f392 = 0; f392 < newArray.length; f392++) {
                                                    if(newArray[f392].id === event.target.value) {
                                                      //level 2
                                                      for(var ff392 = 0; ff392 < newArray[f392].children.length; ff392++) {
                                                        if(newArray[f392].children[ff392].id === fileArray[y].id) {
                                                          // level 3
                                                          for(var fff392 = 0; fff392 < newArray[f392].children[ff392].children.length; fff392++) {
                                                            if(newArray[f392].children[ff392].children[fff392].id === fileArray[a].id) {
                                                              //level 4
                                                              for(var ffff392 = 0; ffff392 < newArray[f392].children[ff392].children[fff392].children.length; ffff392++) {
                                                                if(newArray[f392].children[ff392].children[fff392].children[ffff392].id === fileArray[b].id) {
                                                                  //level 5
                                                                  for(var fffff392 = 0; fffff392 < newArray[f392].children[ff392].children[fff392].children[ffff392].length; fffff392++) {
                                                                    if(newArray[f392].children[ff392].children[ffff392].children[ffff392].children[fffff392].id === fileArray[c].id) {
                                                                      //level 6
                                                                      for(var ffffff392 = 0; ffffff392 < newArray[f392].children[ff392].children[fff392].children[ffff392].children[fffff392].length; ffffff392++) {
                                                                        if(newArray[f392].children[ff392].children[fff392].children[ffff392].children[fffff392].children[ffffff392].id === fileArray[d].id) {
                                                                          //level 7
                                                                          for(var fffffff392 = 0; fffffff392 < newArray[f392].children[ff392].children[fff392].children[ffff392].children[fffff392].children[ffffff392].length; fffffff392++) {
                                                                            if(newArray[f392].children[ff392].children[fff392].children[ffff392].children[fffff392].children[ffffff392].children[fffffff392].id === fileArray[e].id) {
                                                                              newArray[f392].children[ff392].children[fff392].children[ffff392].children[fffff392].children[ffffff392].children[fffffff392].children
                                                                              .push({id: fileArray[f].id, name: fileArray[f].file, type: newType, parent: parent})
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
                                                if(fileArray[f].type === 'application/x-zip-compressed') {
                                                  newType = "zip"
                                                  //level 1
                                                  for(var f393 = 0; f393 < newArray.length; f393++) {
                                                    if(newArray[f393].id === event.target.value) {
                                                      //level 2
                                                      for(var ff393 = 0; ff393 < newArray[f393].children.length; ff393++) {
                                                        if(newArray[f393].children[ff393].id === fileArray[y].id) {
                                                          // level 3
                                                          for(var fff393 = 0; fff393 < newArray[f393].children[ff393].children.length; fff393++) {
                                                            if(newArray[f393].children[ff393].children[fff393].id === fileArray[a].id) {
                                                              //level 4
                                                              for(var ffff393 = 0; ffff393 < newArray[f393].children[ff393].children[fff393].children.length; ffff393++) {
                                                                if(newArray[f393].children[ff393].children[fff393].children[ffff393].id === fileArray[b].id) {
                                                                  //level 5
                                                                  for(var fffff393 = 0; fffff393 < newArray[f393].children[ff393].children[fff393].children[ffff393].length; fffff393++) {
                                                                    if(newArray[f393].children[ff393].children[ffff393].children[ffff393].children[fffff393].id === fileArray[c].id) {
                                                                      //level 6
                                                                      for(var ffffff393 = 0; ffffff393 < newArray[f393].children[ff393].children[fff393].children[ffff393].children[fffff393].length; ffffff393++) {
                                                                        if(newArray[f393].children[ff393].children[fff393].children[ffff393].children[fffff393].children[ffffff393].id === fileArray[d].id) {
                                                                          //level 7
                                                                          for(var fffffff393 = 0; fffffff393 < newArray[f393].children[ff393].children[fff393].children[ffff393].children[fffff393].children[ffffff393].length; fffffff393++) {
                                                                            if(newArray[f393].children[ff393].children[fff393].children[ffff393].children[fffff393].children[ffffff393].children[fffffff393].id === fileArray[e].id) {
                                                                              newArray[f393].children[ff393].children[fff393].children[ffff393].children[fffff393].children[ffffff393].children[fffffff393].children
                                                                              .push({id: fileArray[f].id, name: fileArray[f].file, type: newType, parent: parent})
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
                                                if(fileArray[f].type === 'application/vnd.google-apps.folder') {
                                                  newType = "folder";
                                                  //level 1
                                                  for(var f4 = 0; f4 < newArray.length; f4++) {
                                                    if(newArray[f4].id === event.target.value) {
                                                      //level 2
                                                      for(var ff4 = 0; ff4 < newArray[f4].children.length; ff4++) {
                                                        if(newArray[f4].children[ff4].id === fileArray[y].id) {
                                                          // level 3
                                                          for(var fff4 = 0; fff4 < newArray[f4].children[ff4].children.length; fff4++) {
                                                            if(newArray[f4].children[ff4].children[fff4].id === fileArray[a].id) {
                                                              //level 4
                                                              for(var ffff4 = 0; ffff4 < newArray[f4].children[ff4].children[fff4].children.length; ffff4++) {
                                                                if(newArray[f4].children[ff4].children[fff4].children[ffff4].id === fileArray[b].id) {
                                                                  //level 5
                                                                  for(var fffff4 = 0; fffff4 < newArray[f4].children[ff4].children[fff4].children[ffff4].length; fffff4++) {
                                                                    if(newArray[f4].children[ff4].children[ffff4].children[ffff4].children[fffff4].id === fileArray[c].id) {
                                                                      //level 6
                                                                      for(var ffffff4 = 0; ffffff4 < newArray[f4].children[ff4].children[fff4].children[ffff4].children[fffff4].length; ffffff4++) {
                                                                        if(newArray[f4].children[ff4].children[fff4].children[ffff4].children[fffff4].children[ffffff4].id === fileArray[d].id) {
                                                                          //level 7
                                                                          for(var fffffff4 = 0; fffffff4 < newArray[f4].children[ff4].children[fff4].children[ffff4].children[fffff4].children[ffffff4].length; fffffff4++) {
                                                                            if(newArray[f4].children[ff4].children[fff4].children[ffff4].children[fffff4].children[ffffff4].children[fffffff4].id === fileArray[e].id) {
                                                                              newArray[f4].children[ff4].children[fff4].children[ffff4].children[fffff4].children[ffffff4].children[fffffff4].children
                                                                              .push({id: fileArray[f].id, name: fileArray[f].file, type: newType, parent: parent})
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
                                                  //8
                                                  for (var g = 0; g < fileArray.length; g++) {
                                                    if (fileArray[g].parents[0] === fileArray[f].id) {
                                                      var parent = fileArray[g].parents[0]
                                                      if(fileArray[g].type === 'application/vnd.google-apps.document') {
                                                        newType = "docx";
                                                        //level 1
                                                        for(var g1 = 0; g1 < newArray.length; g1++) {
                                                          if(newArray[g1].id === event.target.value) {
                                                            //level 2
                                                            for(var gg1 = 0; gg1 < newArray[g1].children.length; gg1++) {
                                                              if(newArray[g1].children[gg1].id === fileArray[y].id) {
                                                                // level 3
                                                                for(var ggg1 = 0; ggg1 < newArray[g1].children[gg1].children.length; ggg1++) {
                                                                  if(newArray[g1].children[gg1].children[ggg1].id === fileArray[a].id) {
                                                                    //level 4
                                                                    for(var gggg1 = 0; gggg1 < newArray[g1].children[gg1].children[ggg1].children.length; gggg1++) {
                                                                      if(newArray[g1].children[gg1].children[ggg1].children[gggg1].id === fileArray[b].id) {
                                                                        //level 5
                                                                        for(var ggggg1 = 0; ggggg1 < newArray[g1].children[gg1].children[ggg1].children[gggg1].length; ggggg1++) {
                                                                          if(newArray[g1].children[gg1].children[ggg1].children[gggg1].children[ggggg1].id === fileArray[c].id) {
                                                                            //level 6
                                                                            for(var gggggg1 = 0; gggggg1 < newArray[g1].children[gg1].children[ggg1].children[gggg1].children[ggggg1].length; gggggg1++) {
                                                                              if(newArray[g1].children[gg1].children[ggg1].children[gggg1].children[ggggg1].children[gggggg1].id === fileArray[d].id) {
                                                                                //level 7
                                                                                for(var ggggggg1 = 0; ggggggg1 < newArray[g1].children[gg1].children[ggg1].children[gggg1].children[ggggg1].children[gggggg1].length; ggggggg1++) {
                                                                                  if(newArray[g1].children[gg1].children[ggg1].children[gggg1].children[ggggg1].children[gggggg1].children[ggggggg1].id === fileArray[e].id) {
                                                                                    //level 8
                                                                                    for(var gggggggg1 = 0; gggggggg1 < newArray[g1].children[gg1].children[ggg1].children[gggg1].children[ggggg1].children[gggggg1].children[ggggggg1].length; gggggggg1) {
                                                                                      if(newArray[g1].children[gg1].children[ggg1].children[gggg1].children[ggggg1].children[gggggg1].children[ggggggg1].children[gggggggg1].id === fileArray[f].id) {
                                                                                        newArray[g1].children[gg1].children[ggg1].children[gggg1].children[ggggg1].children[gggggg1].children[ggggggg1].children[gggggggg1].children
                                                                                        .push({id: fileArray[g].id, name: fileArray[g].file, type: newType, parent: parent})
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
                                                      if(fileArray[g].type === 'application/vnd.google-apps.presentation') {
                                                        newType = "pptx"
                                                        //level 1
                                                        for(var g2 = 0; g2 < newArray.length; g2++) {
                                                          if(newArray[g2].id === event.target.value) {
                                                            //level 2
                                                            for(var gg2 = 0; gg2 < newArray[g2].children.length; gg2++) {
                                                              if(newArray[g2].children[gg2].id === fileArray[y].id) {
                                                                // level 3
                                                                for(var ggg2 = 0; ggg2 < newArray[g2].children[gg2].children.length; ggg2++) {
                                                                  if(newArray[g2].children[gg2].children[ggg2].id === fileArray[a].id) {
                                                                    //level 4
                                                                    for(var gggg2 = 0; gggg2 < newArray[g2].children[gg2].children[ggg2].children.length; gggg2++) {
                                                                      if(newArray[g2].children[gg2].children[ggg2].children[gggg2].id === fileArray[b].id) {
                                                                        //level 5
                                                                        for(var ggggg2 = 0; ggggg2 < newArray[g2].children[gg2].children[ggg2].children[gggg2].length; ggggg2++) {
                                                                          if(newArray[g2].children[gg2].children[ggg2].children[gggg2].children[ggggg2].id === fileArray[c].id) {
                                                                            //level 6
                                                                            for(var gggggg2 = 0; gggggg2 < newArray[g2].children[gg2].children[ggg2].children[gggg2].children[ggggg2].length; gggggg2++) {
                                                                              if(newArray[g2].children[gg2].children[ggg2].children[gggg2].children[ggggg2].children[gggggg2].id === fileArray[d].id) {
                                                                                //level 7
                                                                                for(var ggggggg2 = 0; ggggggg2 < newArray[g2].children[gg2].children[ggg2].children[gggg2].children[ggggg2].children[gggggg2].length; ggggggg2++) {
                                                                                  if(newArray[g2].children[gg2].children[ggg2].children[gggg2].children[ggggg2].children[gggggg2].children[ggggggg2].id === fileArray[e].id) {
                                                                                    //level 8
                                                                                    for(var gggggggg2 = 0; gggggggg2 < newArray[g2].children[gg2].children[ggg2].children[gggg2].children[ggggg2].children[gggggg2].children[ggggggg2].length; gggggggg2) {
                                                                                      if(newArray[g2].children[gg2].children[ggg2].children[gggg2].children[ggggg2].children[gggggg2].children[ggggggg2].children[gggggggg2].id === fileArray[f].id) {
                                                                                        newArray[g2].children[gg2].children[ggg2].children[gggg2].children[ggggg2].children[gggggg2].children[ggggggg2].children[gggggggg2].children
                                                                                        .push({id: fileArray[g].id, name: fileArray[g].file, type: newType, parent: parent})
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
                                                      if(fileArray[g].type === 'application/vnd.google-apps.spreadsheet') {
                                                        newType = "xlsx"
                                                        //level 1
                                                        for(var g3 = 0; g3 < newArray.length; g3++) {
                                                          if(newArray[g3].id === event.target.value) {
                                                            //level 2
                                                            for(var gg3 = 0; gg3 < newArray[g3].children.length; gg3++) {
                                                              if(newArray[g3].children[gg3].id === fileArray[y].id) {
                                                                // level 3
                                                                for(var ggg3 = 0; ggg3 < newArray[g3].children[gg3].children.length; ggg3++) {
                                                                  if(newArray[g3].children[gg3].children[ggg3].id === fileArray[a].id) {
                                                                    //level 3
                                                                    for(var gggg3 = 0; gggg3 < newArray[g3].children[gg3].children[ggg3].children.length; gggg3++) {
                                                                      if(newArray[g3].children[gg3].children[ggg3].children[gggg3].id === fileArray[b].id) {
                                                                        //level 5
                                                                        for(var ggggg3 = 0; ggggg3 < newArray[g3].children[gg3].children[ggg3].children[gggg3].length; ggggg3++) {
                                                                          if(newArray[g3].children[gg3].children[ggg3].children[gggg3].children[ggggg3].id === fileArray[c].id) {
                                                                            //level 6
                                                                            for(var gggggg3 = 0; gggggg3 < newArray[g3].children[gg3].children[ggg3].children[gggg3].children[ggggg3].length; gggggg3++) {
                                                                              if(newArray[g3].children[gg3].children[ggg3].children[gggg3].children[ggggg3].children[gggggg3].id === fileArray[d].id) {
                                                                                //level 7
                                                                                for(var ggggggg3 = 0; ggggggg3 < newArray[g3].children[gg3].children[ggg3].children[gggg3].children[ggggg3].children[gggggg3].length; ggggggg3++) {
                                                                                  if(newArray[g3].children[gg3].children[ggg3].children[gggg3].children[ggggg3].children[gggggg3].children[ggggggg3].id === fileArray[e].id) {
                                                                                    //level 8
                                                                                    for(var gggggggg3 = 0; gggggggg3 < newArray[g3].children[gg3].children[ggg3].children[gggg3].children[ggggg3].children[gggggg3].children[ggggggg3].length; gggggggg3) {
                                                                                      if(newArray[g3].children[gg3].children[ggg3].children[gggg3].children[ggggg3].children[gggggg3].children[ggggggg3].children[gggggggg3].id === fileArray[f].id) {
                                                                                        newArray[g3].children[gg3].children[ggg3].children[gggg3].children[ggggg3].children[gggggg3].children[ggggggg3].children[gggggggg3].children
                                                                                        .push({id: fileArray[g].id, name: fileArray[g].file, type: newType, parent: parent})
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
                                                      if(fileArray[g].type === 'application/pdf') {
                                                        newType = "pdf"
                                                        //level 1
                                                        for(var g32 = 0; g32 < newArray.length; g32++) {
                                                          if(newArray[g32].id === event.target.value) {
                                                            //level 2
                                                            for(var gg32 = 0; gg32 < newArray[g32].children.length; gg32++) {
                                                              if(newArray[g32].children[gg32].id === fileArray[y].id) {
                                                                // level 3
                                                                for(var ggg32 = 0; ggg32 < newArray[g32].children[gg32].children.length; ggg32++) {
                                                                  if(newArray[g32].children[gg32].children[ggg32].id === fileArray[a].id) {
                                                                    //level 32
                                                                    for(var gggg32 = 0; gggg32 < newArray[g32].children[gg32].children[ggg32].children.length; gggg32++) {
                                                                      if(newArray[g32].children[gg32].children[ggg32].children[gggg32].id === fileArray[b].id) {
                                                                        //level 5
                                                                        for(var ggggg32 = 0; ggggg32 < newArray[g32].children[gg32].children[ggg32].children[gggg32].length; ggggg32++) {
                                                                          if(newArray[g32].children[gg32].children[ggg32].children[gggg32].children[ggggg32].id === fileArray[c].id) {
                                                                            //level 6
                                                                            for(var gggggg32 = 0; gggggg32 < newArray[g32].children[gg32].children[ggg32].children[gggg32].children[ggggg32].length; gggggg32++) {
                                                                              if(newArray[g32].children[gg32].children[ggg32].children[gggg32].children[ggggg32].children[gggggg32].id === fileArray[d].id) {
                                                                                //level 7
                                                                                for(var ggggggg32 = 0; ggggggg32 < newArray[g32].children[gg32].children[ggg32].children[gggg32].children[ggggg32].children[gggggg32].length; ggggggg32++) {
                                                                                  if(newArray[g32].children[gg32].children[ggg32].children[gggg32].children[ggggg32].children[gggggg32].children[ggggggg32].id === fileArray[e].id) {
                                                                                    //level 8
                                                                                    for(var gggggggg32 = 0; gggggggg32 < newArray[g32].children[gg32].children[ggg32].children[gggg32].children[ggggg32].children[gggggg32].children[ggggggg32].length; gggggggg32) {
                                                                                      if(newArray[g32].children[gg32].children[ggg32].children[gggg32].children[ggggg32].children[gggggg32].children[ggggggg32].children[gggggggg32].id === fileArray[f].id) {
                                                                                        newArray[g32].children[gg32].children[ggg32].children[gggg32].children[ggggg32].children[gggggg32].children[ggggggg32].children[gggggggg32].children
                                                                                        .push({id: fileArray[g].id, name: fileArray[g].file, type: newType, parent: parent})
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
                                                      if(fileArray[g].type === 'audio/mpeg') {
                                                        newType = "mp3"
                                                        //level 1
                                                        for(var g33 = 0; g33 < newArray.length; g33++) {
                                                          if(newArray[g33].id === event.target.value) {
                                                            //level 2
                                                            for(var gg33 = 0; gg33 < newArray[g33].children.length; gg33++) {
                                                              if(newArray[g33].children[gg33].id === fileArray[y].id) {
                                                                // level 3
                                                                for(var ggg33 = 0; ggg33 < newArray[g33].children[gg33].children.length; ggg33++) {
                                                                  if(newArray[g33].children[gg33].children[ggg33].id === fileArray[a].id) {
                                                                    //level 33
                                                                    for(var gggg33 = 0; gggg33 < newArray[g33].children[gg33].children[ggg33].children.length; gggg33++) {
                                                                      if(newArray[g33].children[gg33].children[ggg33].children[gggg33].id === fileArray[b].id) {
                                                                        //level 5
                                                                        for(var ggggg33 = 0; ggggg33 < newArray[g33].children[gg33].children[ggg33].children[gggg33].length; ggggg33++) {
                                                                          if(newArray[g33].children[gg33].children[ggg33].children[gggg33].children[ggggg33].id === fileArray[c].id) {
                                                                            //level 6
                                                                            for(var gggggg33 = 0; gggggg33 < newArray[g33].children[gg33].children[ggg33].children[gggg33].children[ggggg33].length; gggggg33++) {
                                                                              if(newArray[g33].children[gg33].children[ggg33].children[gggg33].children[ggggg33].children[gggggg33].id === fileArray[d].id) {
                                                                                //level 7
                                                                                for(var ggggggg33 = 0; ggggggg33 < newArray[g33].children[gg33].children[ggg33].children[gggg33].children[ggggg33].children[gggggg33].length; ggggggg33++) {
                                                                                  if(newArray[g33].children[gg33].children[ggg33].children[gggg33].children[ggggg33].children[gggggg33].children[ggggggg33].id === fileArray[e].id) {
                                                                                    //level 8
                                                                                    for(var gggggggg33 = 0; gggggggg33 < newArray[g33].children[gg33].children[ggg33].children[gggg33].children[ggggg33].children[gggggg33].children[ggggggg33].length; gggggggg33) {
                                                                                      if(newArray[g33].children[gg33].children[ggg33].children[gggg33].children[ggggg33].children[gggggg33].children[ggggggg33].children[gggggggg33].id === fileArray[f].id) {
                                                                                        newArray[g33].children[gg33].children[ggg33].children[gggg33].children[ggggg33].children[gggggg33].children[ggggggg33].children[gggggggg33].children
                                                                                        .push({id: fileArray[g].id, name: fileArray[g].file, type: newType, parent: parent})
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
                                                      if(fileArray[g].type === 'audio/wav') {
                                                        newType = "wav"
                                                        //level 1
                                                        for(var g34 = 0; g34 < newArray.length; g34++) {
                                                          if(newArray[g34].id === event.target.value) {
                                                            //level 2
                                                            for(var gg34 = 0; gg34 < newArray[g34].children.length; gg34++) {
                                                              if(newArray[g34].children[gg34].id === fileArray[y].id) {
                                                                // level 3
                                                                for(var ggg34 = 0; ggg34 < newArray[g34].children[gg34].children.length; ggg34++) {
                                                                  if(newArray[g34].children[gg34].children[ggg34].id === fileArray[a].id) {
                                                                    //level 34
                                                                    for(var gggg34 = 0; gggg34 < newArray[g34].children[gg34].children[ggg34].children.length; gggg34++) {
                                                                      if(newArray[g34].children[gg34].children[ggg34].children[gggg34].id === fileArray[b].id) {
                                                                        //level 5
                                                                        for(var ggggg34 = 0; ggggg34 < newArray[g34].children[gg34].children[ggg34].children[gggg34].length; ggggg34++) {
                                                                          if(newArray[g34].children[gg34].children[ggg34].children[gggg34].children[ggggg34].id === fileArray[c].id) {
                                                                            //level 6
                                                                            for(var gggggg34 = 0; gggggg34 < newArray[g34].children[gg34].children[ggg34].children[gggg34].children[ggggg34].length; gggggg34++) {
                                                                              if(newArray[g34].children[gg34].children[ggg34].children[gggg34].children[ggggg34].children[gggggg34].id === fileArray[d].id) {
                                                                                //level 7
                                                                                for(var ggggggg34 = 0; ggggggg34 < newArray[g34].children[gg34].children[ggg34].children[gggg34].children[ggggg34].children[gggggg34].length; ggggggg34++) {
                                                                                  if(newArray[g34].children[gg34].children[ggg34].children[gggg34].children[ggggg34].children[gggggg34].children[ggggggg34].id === fileArray[e].id) {
                                                                                    //level 8
                                                                                    for(var gggggggg34 = 0; gggggggg34 < newArray[g34].children[gg34].children[ggg34].children[gggg34].children[ggggg34].children[gggggg34].children[ggggggg34].length; gggggggg34) {
                                                                                      if(newArray[g34].children[gg34].children[ggg34].children[gggg34].children[ggggg34].children[gggggg34].children[ggggggg34].children[gggggggg34].id === fileArray[f].id) {
                                                                                        newArray[g34].children[gg34].children[ggg34].children[gggg34].children[ggggg34].children[gggggg34].children[ggggggg34].children[gggggggg34].children
                                                                                        .push({id: fileArray[g].id, name: fileArray[g].file, type: newType, parent: parent})
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
                                                      if(fileArray[g].type === 'video/mp4') {
                                                        newType = "mp4"
                                                        //level 1
                                                        for(var g35 = 0; g35 < newArray.length; g35++) {
                                                          if(newArray[g35].id === event.target.value) {
                                                            //level 2
                                                            for(var gg35 = 0; gg35 < newArray[g35].children.length; gg35++) {
                                                              if(newArray[g35].children[gg35].id === fileArray[y].id) {
                                                                // level 3
                                                                for(var ggg35 = 0; ggg35 < newArray[g35].children[gg35].children.length; ggg35++) {
                                                                  if(newArray[g35].children[gg35].children[ggg35].id === fileArray[a].id) {
                                                                    //level 35
                                                                    for(var gggg35 = 0; gggg35 < newArray[g35].children[gg35].children[ggg35].children.length; gggg35++) {
                                                                      if(newArray[g35].children[gg35].children[ggg35].children[gggg35].id === fileArray[b].id) {
                                                                        //level 5
                                                                        for(var ggggg35 = 0; ggggg35 < newArray[g35].children[gg35].children[ggg35].children[gggg35].length; ggggg35++) {
                                                                          if(newArray[g35].children[gg35].children[ggg35].children[gggg35].children[ggggg35].id === fileArray[c].id) {
                                                                            //level 6
                                                                            for(var gggggg35 = 0; gggggg35 < newArray[g35].children[gg35].children[ggg35].children[gggg35].children[ggggg35].length; gggggg35++) {
                                                                              if(newArray[g35].children[gg35].children[ggg35].children[gggg35].children[ggggg35].children[gggggg35].id === fileArray[d].id) {
                                                                                //level 7
                                                                                for(var ggggggg35 = 0; ggggggg35 < newArray[g35].children[gg35].children[ggg35].children[gggg35].children[ggggg35].children[gggggg35].length; ggggggg35++) {
                                                                                  if(newArray[g35].children[gg35].children[ggg35].children[gggg35].children[ggggg35].children[gggggg35].children[ggggggg35].id === fileArray[e].id) {
                                                                                    //level 8
                                                                                    for(var gggggggg35 = 0; gggggggg35 < newArray[g35].children[gg35].children[ggg35].children[gggg35].children[ggggg35].children[gggggg35].children[ggggggg35].length; gggggggg35) {
                                                                                      if(newArray[g35].children[gg35].children[ggg35].children[gggg35].children[ggggg35].children[gggggg35].children[ggggggg35].children[gggggggg35].id === fileArray[f].id) {
                                                                                        newArray[g35].children[gg35].children[ggg35].children[gggg35].children[ggggg35].children[gggggg35].children[ggggggg35].children[gggggggg35].children
                                                                                        .push({id: fileArray[g].id, name: fileArray[g].file, type: newType, parent: parent})
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
                                                      if(fileArray[g].type === 'image/jpg') {
                                                        newType = "jpg"
                                                        //level 1
                                                        for(var g36 = 0; g36 < newArray.length; g36++) {
                                                          if(newArray[g36].id === event.target.value) {
                                                            //level 2
                                                            for(var gg36 = 0; gg36 < newArray[g36].children.length; gg36++) {
                                                              if(newArray[g36].children[gg36].id === fileArray[y].id) {
                                                                // level 3
                                                                for(var ggg36 = 0; ggg36 < newArray[g36].children[gg36].children.length; ggg36++) {
                                                                  if(newArray[g36].children[gg36].children[ggg36].id === fileArray[a].id) {
                                                                    //level 36
                                                                    for(var gggg36 = 0; gggg36 < newArray[g36].children[gg36].children[ggg36].children.length; gggg36++) {
                                                                      if(newArray[g36].children[gg36].children[ggg36].children[gggg36].id === fileArray[b].id) {
                                                                        //level 5
                                                                        for(var ggggg36 = 0; ggggg36 < newArray[g36].children[gg36].children[ggg36].children[gggg36].length; ggggg36++) {
                                                                          if(newArray[g36].children[gg36].children[ggg36].children[gggg36].children[ggggg36].id === fileArray[c].id) {
                                                                            //level 6
                                                                            for(var gggggg36 = 0; gggggg36 < newArray[g36].children[gg36].children[ggg36].children[gggg36].children[ggggg36].length; gggggg36++) {
                                                                              if(newArray[g36].children[gg36].children[ggg36].children[gggg36].children[ggggg36].children[gggggg36].id === fileArray[d].id) {
                                                                                //level 7
                                                                                for(var ggggggg36 = 0; ggggggg36 < newArray[g36].children[gg36].children[ggg36].children[gggg36].children[ggggg36].children[gggggg36].length; ggggggg36++) {
                                                                                  if(newArray[g36].children[gg36].children[ggg36].children[gggg36].children[ggggg36].children[gggggg36].children[ggggggg36].id === fileArray[e].id) {
                                                                                    //level 8
                                                                                    for(var gggggggg36 = 0; gggggggg36 < newArray[g36].children[gg36].children[ggg36].children[gggg36].children[ggggg36].children[gggggg36].children[ggggggg36].length; gggggggg36) {
                                                                                      if(newArray[g36].children[gg36].children[ggg36].children[gggg36].children[ggggg36].children[gggggg36].children[ggggggg36].children[gggggggg36].id === fileArray[f].id) {
                                                                                        newArray[g36].children[gg36].children[ggg36].children[gggg36].children[ggggg36].children[gggggg36].children[ggggggg36].children[gggggggg36].children
                                                                                        .push({id: fileArray[g].id, name: fileArray[g].file, type: newType, parent: parent})
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
                                                      if(fileArray[g].type === 'image/png') {
                                                        newType = "png"
                                                        //level 1
                                                        for(var g37 = 0; g37 < newArray.length; g37++) {
                                                          if(newArray[g37].id === event.target.value) {
                                                            //level 2
                                                            for(var gg37 = 0; gg37 < newArray[g37].children.length; gg37++) {
                                                              if(newArray[g37].children[gg37].id === fileArray[y].id) {
                                                                // level 3
                                                                for(var ggg37 = 0; ggg37 < newArray[g37].children[gg37].children.length; ggg37++) {
                                                                  if(newArray[g37].children[gg37].children[ggg37].id === fileArray[a].id) {
                                                                    //level 37
                                                                    for(var gggg37 = 0; gggg37 < newArray[g37].children[gg37].children[ggg37].children.length; gggg37++) {
                                                                      if(newArray[g37].children[gg37].children[ggg37].children[gggg37].id === fileArray[b].id) {
                                                                        //level 5
                                                                        for(var ggggg37 = 0; ggggg37 < newArray[g37].children[gg37].children[ggg37].children[gggg37].length; ggggg37++) {
                                                                          if(newArray[g37].children[gg37].children[ggg37].children[gggg37].children[ggggg37].id === fileArray[c].id) {
                                                                            //level 6
                                                                            for(var gggggg37 = 0; gggggg37 < newArray[g37].children[gg37].children[ggg37].children[gggg37].children[ggggg37].length; gggggg37++) {
                                                                              if(newArray[g37].children[gg37].children[ggg37].children[gggg37].children[ggggg37].children[gggggg37].id === fileArray[d].id) {
                                                                                //level 7
                                                                                for(var ggggggg37 = 0; ggggggg37 < newArray[g37].children[gg37].children[ggg37].children[gggg37].children[ggggg37].children[gggggg37].length; ggggggg37++) {
                                                                                  if(newArray[g37].children[gg37].children[ggg37].children[gggg37].children[ggggg37].children[gggggg37].children[ggggggg37].id === fileArray[e].id) {
                                                                                    //level 8
                                                                                    for(var gggggggg37 = 0; gggggggg37 < newArray[g37].children[gg37].children[ggg37].children[gggg37].children[ggggg37].children[gggggg37].children[ggggggg37].length; gggggggg37) {
                                                                                      if(newArray[g37].children[gg37].children[ggg37].children[gggg37].children[ggggg37].children[gggggg37].children[ggggggg37].children[gggggggg37].id === fileArray[f].id) {
                                                                                        newArray[g37].children[gg37].children[ggg37].children[gggg37].children[ggggg37].children[gggggg37].children[ggggggg37].children[gggggggg37].children
                                                                                        .push({id: fileArray[g].id, name: fileArray[g].file, type: newType, parent: parent})
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
                                                      if(fileArray[g].type === 'application/msword') {
                                                        newType = "doc"
                                                        //level 1
                                                        for(var g38 = 0; g38 < newArray.length; g38++) {
                                                          if(newArray[g38].id === event.target.value) {
                                                            //level 2
                                                            for(var gg38 = 0; gg38 < newArray[g38].children.length; gg38++) {
                                                              if(newArray[g38].children[gg38].id === fileArray[y].id) {
                                                                // level 3
                                                                for(var ggg38 = 0; ggg38 < newArray[g38].children[gg38].children.length; ggg38++) {
                                                                  if(newArray[g38].children[gg38].children[ggg38].id === fileArray[a].id) {
                                                                    //level 38
                                                                    for(var gggg38 = 0; gggg38 < newArray[g38].children[gg38].children[ggg38].children.length; gggg38++) {
                                                                      if(newArray[g38].children[gg38].children[ggg38].children[gggg38].id === fileArray[b].id) {
                                                                        //level 5
                                                                        for(var ggggg38 = 0; ggggg38 < newArray[g38].children[gg38].children[ggg38].children[gggg38].length; ggggg38++) {
                                                                          if(newArray[g38].children[gg38].children[ggg38].children[gggg38].children[ggggg38].id === fileArray[c].id) {
                                                                            //level 6
                                                                            for(var gggggg38 = 0; gggggg38 < newArray[g38].children[gg38].children[ggg38].children[gggg38].children[ggggg38].length; gggggg38++) {
                                                                              if(newArray[g38].children[gg38].children[ggg38].children[gggg38].children[ggggg38].children[gggggg38].id === fileArray[d].id) {
                                                                                //level 7
                                                                                for(var ggggggg38 = 0; ggggggg38 < newArray[g38].children[gg38].children[ggg38].children[gggg38].children[ggggg38].children[gggggg38].length; ggggggg38++) {
                                                                                  if(newArray[g38].children[gg38].children[ggg38].children[gggg38].children[ggggg38].children[gggggg38].children[ggggggg38].id === fileArray[e].id) {
                                                                                    //level 8
                                                                                    for(var gggggggg38 = 0; gggggggg38 < newArray[g38].children[gg38].children[ggg38].children[gggg38].children[ggggg38].children[gggggg38].children[ggggggg38].length; gggggggg38) {
                                                                                      if(newArray[g38].children[gg38].children[ggg38].children[gggg38].children[ggggg38].children[gggggg38].children[ggggggg38].children[gggggggg38].id === fileArray[f].id) {
                                                                                        newArray[g38].children[gg38].children[ggg38].children[gggg38].children[ggggg38].children[gggggg38].children[ggggggg38].children[gggggggg38].children
                                                                                        .push({id: fileArray[g].id, name: fileArray[g].file, type: newType, parent: parent})
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
                                                      if(fileArray[g].type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                                                        newType = "docx"
                                                        //level 1
                                                        for(var g39 = 0; g39 < newArray.length; g39++) {
                                                          if(newArray[g39].id === event.target.value) {
                                                            //level 2
                                                            for(var gg39 = 0; gg39 < newArray[g39].children.length; gg39++) {
                                                              if(newArray[g39].children[gg39].id === fileArray[y].id) {
                                                                // level 3
                                                                for(var ggg39 = 0; ggg39 < newArray[g39].children[gg39].children.length; ggg39++) {
                                                                  if(newArray[g39].children[gg39].children[ggg39].id === fileArray[a].id) {
                                                                    //level 39
                                                                    for(var gggg39 = 0; gggg39 < newArray[g39].children[gg39].children[ggg39].children.length; gggg39++) {
                                                                      if(newArray[g39].children[gg39].children[ggg39].children[gggg39].id === fileArray[b].id) {
                                                                        //level 5
                                                                        for(var ggggg39 = 0; ggggg39 < newArray[g39].children[gg39].children[ggg39].children[gggg39].length; ggggg39++) {
                                                                          if(newArray[g39].children[gg39].children[ggg39].children[gggg39].children[ggggg39].id === fileArray[c].id) {
                                                                            //level 6
                                                                            for(var gggggg39 = 0; gggggg39 < newArray[g39].children[gg39].children[ggg39].children[gggg39].children[ggggg39].length; gggggg39++) {
                                                                              if(newArray[g39].children[gg39].children[ggg39].children[gggg39].children[ggggg39].children[gggggg39].id === fileArray[d].id) {
                                                                                //level 7
                                                                                for(var ggggggg39 = 0; ggggggg39 < newArray[g39].children[gg39].children[ggg39].children[gggg39].children[ggggg39].children[gggggg39].length; ggggggg39++) {
                                                                                  if(newArray[g39].children[gg39].children[ggg39].children[gggg39].children[ggggg39].children[gggggg39].children[ggggggg39].id === fileArray[e].id) {
                                                                                    //level 8
                                                                                    for(var gggggggg39 = 0; gggggggg39 < newArray[g39].children[gg39].children[ggg39].children[gggg39].children[ggggg39].children[gggggg39].children[ggggggg39].length; gggggggg39) {
                                                                                      if(newArray[g39].children[gg39].children[ggg39].children[gggg39].children[ggggg39].children[gggggg39].children[ggggggg39].children[gggggggg39].id === fileArray[f].id) {
                                                                                        newArray[g39].children[gg39].children[ggg39].children[gggg39].children[ggggg39].children[gggggg39].children[ggggggg39].children[gggggggg39].children
                                                                                        .push({id: fileArray[g].id, name: fileArray[g].file, type: newType, parent: parent})
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
                                                      if(fileArray[g].type === 'application/vnd.ms-powerpoint') {
                                                        newType = "ppt"
                                                        //level 1
                                                        for(var g391 = 0; g391 < newArray.length; g391++) {
                                                          if(newArray[g391].id === event.target.value) {
                                                            //level 2
                                                            for(var gg391 = 0; gg391 < newArray[g391].children.length; gg391++) {
                                                              if(newArray[g391].children[gg391].id === fileArray[y].id) {
                                                                // level 3
                                                                for(var ggg391 = 0; ggg391 < newArray[g391].children[gg391].children.length; ggg391++) {
                                                                  if(newArray[g391].children[gg391].children[ggg391].id === fileArray[a].id) {
                                                                    //level 391
                                                                    for(var gggg391 = 0; gggg391 < newArray[g391].children[gg391].children[ggg391].children.length; gggg391++) {
                                                                      if(newArray[g391].children[gg391].children[ggg391].children[gggg391].id === fileArray[b].id) {
                                                                        //level 5
                                                                        for(var ggggg391 = 0; ggggg391 < newArray[g391].children[gg391].children[ggg391].children[gggg391].length; ggggg391++) {
                                                                          if(newArray[g391].children[gg391].children[ggg391].children[gggg391].children[ggggg391].id === fileArray[c].id) {
                                                                            //level 6
                                                                            for(var gggggg391 = 0; gggggg391 < newArray[g391].children[gg391].children[ggg391].children[gggg391].children[ggggg391].length; gggggg391++) {
                                                                              if(newArray[g391].children[gg391].children[ggg391].children[gggg391].children[ggggg391].children[gggggg391].id === fileArray[d].id) {
                                                                                //level 7
                                                                                for(var ggggggg391 = 0; ggggggg391 < newArray[g391].children[gg391].children[ggg391].children[gggg391].children[ggggg391].children[gggggg391].length; ggggggg391++) {
                                                                                  if(newArray[g391].children[gg391].children[ggg391].children[gggg391].children[ggggg391].children[gggggg391].children[ggggggg391].id === fileArray[e].id) {
                                                                                    //level 8
                                                                                    for(var gggggggg391 = 0; gggggggg391 < newArray[g391].children[gg391].children[ggg391].children[gggg391].children[ggggg391].children[gggggg391].children[ggggggg391].length; gggggggg391) {
                                                                                      if(newArray[g391].children[gg391].children[ggg391].children[gggg391].children[ggggg391].children[gggggg391].children[ggggggg391].children[gggggggg391].id === fileArray[f].id) {
                                                                                        newArray[g391].children[gg391].children[ggg391].children[gggg391].children[ggggg391].children[gggggg391].children[ggggggg391].children[gggggggg391].children
                                                                                        .push({id: fileArray[g].id, name: fileArray[g].file, type: newType, parent: parent})
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
                                                      if(fileArray[g].type === 'text/plain') {
                                                        newType = "txt"
                                                        //level 1
                                                        for(var g392 = 0; g392 < newArray.length; g392++) {
                                                          if(newArray[g392].id === event.target.value) {
                                                            //level 2
                                                            for(var gg392 = 0; gg392 < newArray[g392].children.length; gg392++) {
                                                              if(newArray[g392].children[gg392].id === fileArray[y].id) {
                                                                // level 3
                                                                for(var ggg392 = 0; ggg392 < newArray[g392].children[gg392].children.length; ggg392++) {
                                                                  if(newArray[g392].children[gg392].children[ggg392].id === fileArray[a].id) {
                                                                    //level 392
                                                                    for(var gggg392 = 0; gggg392 < newArray[g392].children[gg392].children[ggg392].children.length; gggg392++) {
                                                                      if(newArray[g392].children[gg392].children[ggg392].children[gggg392].id === fileArray[b].id) {
                                                                        //level 5
                                                                        for(var ggggg392 = 0; ggggg392 < newArray[g392].children[gg392].children[ggg392].children[gggg392].length; ggggg392++) {
                                                                          if(newArray[g392].children[gg392].children[ggg392].children[gggg392].children[ggggg392].id === fileArray[c].id) {
                                                                            //level 6
                                                                            for(var gggggg392 = 0; gggggg392 < newArray[g392].children[gg392].children[ggg392].children[gggg392].children[ggggg392].length; gggggg392++) {
                                                                              if(newArray[g392].children[gg392].children[ggg392].children[gggg392].children[ggggg392].children[gggggg392].id === fileArray[d].id) {
                                                                                //level 7
                                                                                for(var ggggggg392 = 0; ggggggg392 < newArray[g392].children[gg392].children[ggg392].children[gggg392].children[ggggg392].children[gggggg392].length; ggggggg392++) {
                                                                                  if(newArray[g392].children[gg392].children[ggg392].children[gggg392].children[ggggg392].children[gggggg392].children[ggggggg392].id === fileArray[e].id) {
                                                                                    //level 8
                                                                                    for(var gggggggg392 = 0; gggggggg392 < newArray[g392].children[gg392].children[ggg392].children[gggg392].children[ggggg392].children[gggggg392].children[ggggggg392].length; gggggggg392) {
                                                                                      if(newArray[g392].children[gg392].children[ggg392].children[gggg392].children[ggggg392].children[gggggg392].children[ggggggg392].children[gggggggg392].id === fileArray[f].id) {
                                                                                        newArray[g392].children[gg392].children[ggg392].children[gggg392].children[ggggg392].children[gggggg392].children[ggggggg392].children[gggggggg392].children
                                                                                        .push({id: fileArray[g].id, name: fileArray[g].file, type: newType, parent: parent})
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
                                                      if(fileArray[g].type === 'application/x-zip-compressed') {
                                                        newType = "zip"
                                                        //level 1
                                                        for(var g393 = 0; g393 < newArray.length; g393++) {
                                                          if(newArray[g393].id === event.target.value) {
                                                            //level 2
                                                            for(var gg393 = 0; gg393 < newArray[g393].children.length; gg393++) {
                                                              if(newArray[g393].children[gg393].id === fileArray[y].id) {
                                                                // level 3
                                                                for(var ggg393 = 0; ggg393 < newArray[g393].children[gg393].children.length; ggg393++) {
                                                                  if(newArray[g393].children[gg393].children[ggg393].id === fileArray[a].id) {
                                                                    //level 393
                                                                    for(var gggg393 = 0; gggg393 < newArray[g393].children[gg393].children[ggg393].children.length; gggg393++) {
                                                                      if(newArray[g393].children[gg393].children[ggg393].children[gggg393].id === fileArray[b].id) {
                                                                        //level 5
                                                                        for(var ggggg393 = 0; ggggg393 < newArray[g393].children[gg393].children[ggg393].children[gggg393].length; ggggg393++) {
                                                                          if(newArray[g393].children[gg393].children[ggg393].children[gggg393].children[ggggg393].id === fileArray[c].id) {
                                                                            //level 6
                                                                            for(var gggggg393 = 0; gggggg393 < newArray[g393].children[gg393].children[ggg393].children[gggg393].children[ggggg393].length; gggggg393++) {
                                                                              if(newArray[g393].children[gg393].children[ggg393].children[gggg393].children[ggggg393].children[gggggg393].id === fileArray[d].id) {
                                                                                //level 7
                                                                                for(var ggggggg393 = 0; ggggggg393 < newArray[g393].children[gg393].children[ggg393].children[gggg393].children[ggggg393].children[gggggg393].length; ggggggg393++) {
                                                                                  if(newArray[g393].children[gg393].children[ggg393].children[gggg393].children[ggggg393].children[gggggg393].children[ggggggg393].id === fileArray[e].id) {
                                                                                    //level 8
                                                                                    for(var gggggggg393 = 0; gggggggg393 < newArray[g393].children[gg393].children[ggg393].children[gggg393].children[ggggg393].children[gggggg393].children[ggggggg393].length; gggggggg393) {
                                                                                      if(newArray[g393].children[gg393].children[ggg393].children[gggg393].children[ggggg393].children[gggggg393].children[ggggggg393].children[gggggggg393].id === fileArray[f].id) {
                                                                                        newArray[g393].children[gg393].children[ggg393].children[gggg393].children[ggggg393].children[gggggg393].children[ggggggg393].children[gggggggg393].children
                                                                                        .push({id: fileArray[g].id, name: fileArray[g].file, type: newType, parent: parent})
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
                                                      if(fileArray[g].type === 'application/vnd.google-apps.folder') {
                                                        newType = "folder";
                                                        //level 1
                                                        for(var g4 = 0; g4 < newArray.length; g4++) {
                                                          if(newArray[g4].id === event.target.value) {
                                                            //level 2
                                                            for(var gg4 = 0; gg4 < newArray[g4].children.length; gg4++) {
                                                              if(newArray[g4].children[gg4].id === fileArray[y].id) {
                                                                // level 3
                                                                for(var ggg4 = 0; ggg4 < newArray[g4].children[gg4].children.length; ggg4++) {
                                                                  if(newArray[g4].children[gg4].children[ggg4].id === fileArray[a].id) {
                                                                    //level 4
                                                                    for(var gggg4 = 0; gggg4 < newArray[g4].children[gg4].children[ggg4].children.length; gggg4++) {
                                                                      if(newArray[g4].children[gg4].children[ggg4].children[gggg4].id === fileArray[b].id) {
                                                                        //level 5
                                                                        for(var ggggg4 = 0; ggggg4 < newArray[g4].children[gg4].children[ggg4].children[gggg4].length; ggggg4++) {
                                                                          if(newArray[g4].children[gg4].children[ggg4].children[gggg4].children[ggggg4].id === fileArray[c].id) {
                                                                            //level 6
                                                                            for(var gggggg4 = 0; gggggg4 < newArray[g4].children[gg4].children[ggg4].children[gggg4].children[ggggg4].length; gggggg4++) {
                                                                              if(newArray[g4].children[gg4].children[ggg4].children[gggg4].children[ggggg4].children[gggggg4].id === fileArray[d].id) {
                                                                                //level 7
                                                                                for(var ggggggg4 = 0; ggggggg4 < newArray[g4].children[gg4].children[ggg4].children[gggg4].children[ggggg4].children[gggggg4].length; ggggggg4++) {
                                                                                  if(newArray[g4].children[gg4].children[ggg4].children[gggg4].children[ggggg4].children[gggggg4].children[ggggggg4].id === fileArray[e].id) {
                                                                                    //level 8
                                                                                    for(var gggggggg4 = 0; gggggggg4 < newArray[g4].children[gg4].children[ggg4].children[gggg4].children[ggggg4].children[gggggg4].children[ggggggg4].length; gggggggg4) {
                                                                                      if(newArray[g4].children[gg4].children[ggg4].children[gggg4].children[ggggg4].children[gggggg4].children[ggggggg4].children[gggggggg4].id === fileArray[f].id) {
                                                                                        newArray[g4].children[gg4].children[ggg4].children[gggg4].children[ggggg4].children[gggggg4].children[ggggggg4].children[gggggggg4].children
                                                                                        .push({id: fileArray[g].id, name: fileArray[g].file, type: newType, parent: parent, children: []})
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
                                                        //9
                                                        for (var h = 0; h < fileArray.length; h++) {
                                                          if (fileArray[h].parents[0] === fileArray[g].id) {
                                                            var parent = fileArray[h].parents[0]
                                                            if(fileArray[h].type === 'application/vnd.google-apps.document') {
                                                              newType = "docx";
                                                              //level 1
                                                              for(var h1 = 0; h1 < newArray.length; h1++) {
                                                                if(newArray[h1].id === event.target.value) {
                                                                  //level 2
                                                                  for(var hh1 = 0; hh1 < newArray[h1].children.length; hh1++) {
                                                                    if(newArray[h1].children[hh1].id === fileArray[y].id) {
                                                                      // level 3
                                                                      for(var hhh1 = 0; hhh1 < newArray[h1].children[hh1].children.length; hhh1++) {
                                                                        if(newArray[h1].children[hh1].children[hhh1].id === fileArray[a].id) {
                                                                          //level 4
                                                                          for(var hhhh1 = 0; hhhh1 < newArray[h1].children[hh1].children[hhh1].children.length; hhhh1++) {
                                                                            if(newArray[h1].children[hh1].children[hhh1].children[hhhh1].id === fileArray[b].id) {
                                                                              //level 5
                                                                              for(var hhhhh1 = 0; hhhhh1 < newArray[h1].children[hh1].children[hhh1].children[hhhh1].length; hhhhh1++) {
                                                                                if(newArray[h1].children[hh1].children[hhh1].children[hhhh1].children[hhhhh1].id === fileArray[c].id) {
                                                                                  //level 6
                                                                                  for(var hhhhhh1 = 0; hhhhhh1 < newArray[h1].children[hh1].children[hhh1].children[hhhh1].children[hhhhh1].length; hhhhhh1++) {
                                                                                    if(newArray[h1].children[hh1].children[hhh1].children[hhhh1].children[hhhhh1].children[hhhhhh1].id === fileArray[d].id) {
                                                                                      //level 7
                                                                                      for(var hhhhhhh1 = 0; hhhhhhh1 < newArray[h1].children[hh1].children[hhh1].children[hhhh1].children[hhhhh1].children[hhhhhh1].length; hhhhhhh1++) {
                                                                                        if(newArray[h1].children[hh1].children[hhh1].children[hhhh1].children[hhhhh1].children[hhhhhh1].children[hhhhhhh1].id === fileArray[e].id) {
                                                                                          //level 8
                                                                                          for(var hhhhhhhh1 = 0; hhhhhhhh1 < newArray[h1].children[hh1].children[hhh1].children[hhhh1].children[hhhhh1].children[hhhhhh1].children[hhhhhhh1].length; hhhhhhhh1) {
                                                                                            if(newArray[h1].children[hh1].children[hhh1].children[hhhh1].children[hhhhh1].children[hhhhhh1].children[hhhhhhh1].children[hhhhhhhh1].id === fileArray[f].id) {
                                                                                              //level 9
                                                                                              for(var hhhhhhhhh1 = 0; hhhhhhhhh1 < newArray[h1].children[hh1].children[hhh1].children[hhhh1].children[hhhhh1].children[hhhhhh1].children[hhhhhhh1].children[hhhhhhhh1].length; hhhhhhhhh1++) {
                                                                                                if(newArray[h1].children[hh1].children[hhh1].children[hhhh1].children[hhhhh1].children[hhhhhh1].children[hhhhhhh1].children[hhhhhhhh1].children[hhhhhhhhh1].id === fileArray[g].id) {
                                                                                                  newArray[h1].children[hh1].children[hhh1].children[hhhh1].children[hhhhh1].children[hhhhhh1].children[hhhhhhh1].children[hhhhhhhh1].children[hhhhhhhhh1].children
                                                                                                  .push({id: fileArray[h].id, name: fileArray[h].file, type: newType, parent: parent})
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
                                                            if(fileArray[h].type === 'application/vnd.google-apps.presentation') {
                                                              newType = "pptx"
                                                              //level 1 
                                                              for(var h2 = 0; h2 < newArray.length; h2++) {
                                                                if(newArray[h2].id === event.target.value) {
                                                                  //level 2
                                                                  for(var hh2; hh2 < newArray[h2].children.length; hh2++) {
                                                                    if(newArray[h2].children[hh2].id === fileArray[y].id) {
                                                                      // level 3
                                                                      for(var hhh2; hhh2 < newArray[h2].children[hh2].children.length; hhh2++) {
                                                                        if(newArray[h2].children[hh2].children[hhh2].id === fileArray[a].id) {
                                                                          //level 4
                                                                          for(var hhhh2; hhhh2 < newArray[h2].children[hh2].children[hhh2].children.length; hhhh2++) {
                                                                            if(newArray[h2].children[hh2].children[hhh2].children[hhhh2].id === fileArray[b].id) {
                                                                              //level 5
                                                                              for(var hhhhh2; hhhhh2 < newArray[h2].children[hh2].children[hhh2].children[hhhh2].length; hhhhh2++) {
                                                                                if(newArray[h2].children[hh2].children[hhh2].children[hhhh2].children[hhhhh2].id === fileArray[c].id) {
                                                                                  //level 6
                                                                                  for(var hhhhhh2; hhhhhh2 < newArray[h2].children[hh2].children[hhh2].children[hhhh2].children[hhhhh2].length; hhhhhh2++) {
                                                                                    if(newArray[h2].children[hh2].children[hhh2].children[hhhh2].children[hhhhh2].children[hhhhhh2].id === fileArray[d].id) {
                                                                                      //level 7
                                                                                      for(var hhhhhhh2; hhhhhhh2 < newArray[h2].children[hh2].children[hhh2].children[hhhh2].children[hhhhh2].children[hhhhhh2].length; hhhhhhh2++) {
                                                                                        if(newArray[h2].children[hh2].children[hhh2].children[hhhh2].children[hhhhh2].children[hhhhhh2].children[hhhhhhh2].id === fileArray[e].id) {
                                                                                          //level 8
                                                                                          for(var hhhhhhhh2; hhhhhhhh2 < newArray[h2].children[hh2].children[hhh2].children[hhhh2].children[hhhhh2].children[hhhhhh2].children[hhhhhhh2].length; hhhhhhhh2) {
                                                                                            if(newArray[h2].children[hh2].children[hhh2].children[hhhh2].children[hhhhh2].children[hhhhhh2].children[hhhhhhh2].children[hhhhhhhh2].id === fileArray[f].id) {
                                                                                              //level 9
                                                                                              for(var hhhhhhhhh2; hhhhhhhhh2 < newArray[h2].children[hh2].children[hhh2].children[hhhh2].children[hhhhh2].children[hhhhhh2].children[hhhhhhh2].children[hhhhhhhh2].length; hhhhhhhhh2++) {
                                                                                                if(newArray[h2].children[hh2].children[hhh2].children[hhhh2].children[hhhhh2].children[hhhhhh2].children[hhhhhhh2].children[hhhhhhhh2].children[hhhhhhhhh2].id === fileArray[g].id) {
                                                                                                  newArray[h2].children[hh2].children[hhh2].children[hhhh2].children[hhhhh2].children[hhhhhh2].children[hhhhhhh2].children[hhhhhhhh2].children[hhhhhhhhh2].children
                                                                                                  .push({id: fileArray[h].id, name: fileArray[h].file, type: newType, parent: parent})
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
                                                            if(fileArray[h].type === 'application/vnd.google-apps.spreadsheet') {
                                                              newType = "xlsx"
                                                              //level 1
                                                              for(var h3 = 0; h3 < newArray.length; h3++) {
                                                                if(newArray[h3].id === event.target.value) {
                                                                  //level 2
                                                                  for(var hh3; hh3 < newArray[h3].children.length; hh3++) {
                                                                    if(newArray[h3].children[hh3].id === fileArray[y].id) {
                                                                      // level 3
                                                                      for(var hhh3; hhh3 < newArray[h3].children[hh3].children.length; hhh3++) {
                                                                        if(newArray[h3].children[hh3].children[hhh3].id === fileArray[a].id) {
                                                                          //level 4
                                                                          for(var hhhh3; hhhh3 < newArray[h3].children[hh3].children[hhh3].children.length; hhhh3++) {
                                                                            if(newArray[h3].children[hh3].children[hhh3].children[hhhh3].id === fileArray[b].id) {
                                                                              //level 5
                                                                              for(var hhhhh3; hhhhh3 < newArray[h3].children[hh3].children[hhh3].children[hhhh3].length; hhhhh3++) {
                                                                                if(newArray[h3].children[hh3].children[hhh3].children[hhhh3].children[hhhhh3].id === fileArray[c].id) {
                                                                                  //level 6
                                                                                  for(var hhhhhh3; hhhhhh3 < newArray[h3].children[hh3].children[hhh3].children[hhhh3].children[hhhhh3].length; hhhhhh3++) {
                                                                                    if(newArray[h3].children[hh3].children[hhh3].children[hhhh3].children[hhhhh3].children[hhhhhh3].id === fileArray[d].id) {
                                                                                      //level 7
                                                                                      for(var hhhhhhh3; hhhhhhh3 < newArray[h3].children[hh3].children[hhh3].children[hhhh3].children[hhhhh3].children[hhhhhh3].length; hhhhhhh3++) {
                                                                                        if(newArray[h3].children[hh3].children[hhh3].children[hhhh3].children[hhhhh3].children[hhhhhh3].children[hhhhhhh3].id === fileArray[e].id) {
                                                                                          //level 8
                                                                                          for(var hhhhhhhh3; hhhhhhhh3 < newArray[h3].children[hh3].children[hhh3].children[hhhh3].children[hhhhh3].children[hhhhhh3].children[hhhhhhh3].length; hhhhhhhh3) {
                                                                                            if(newArray[h3].children[hh3].children[hhh3].children[hhhh3].children[hhhhh3].children[hhhhhh3].children[hhhhhhh3].children[hhhhhhhh3].id === fileArray[f].id) {
                                                                                              //level 9
                                                                                              for(var hhhhhhhhh3; hhhhhhhhh3 < newArray[h3].children[hh3].children[hhh3].children[hhhh3].children[hhhhh3].children[hhhhhh3].children[hhhhhhh3].children[hhhhhhhh3].length; hhhhhhhhh3++) {
                                                                                                if(newArray[h3].children[hh3].children[hhh3].children[hhhh3].children[hhhhh3].children[hhhhhh3].children[hhhhhhh3].children[hhhhhhhh3].children[hhhhhhhhh3].id === fileArray[g].id) {
                                                                                                  newArray[h3].children[hh3].children[hhh3].children[hhhh3].children[hhhhh3].children[hhhhhh3].children[hhhhhhh3].children[hhhhhhhh3].children[hhhhhhhhh3].children
                                                                                                  .push({id: fileArray[h].id, name: fileArray[h].file, type: newType, parent: parent})
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
                                                            if(fileArray[h].type === 'application/pdf') {
                                                              newType = "pdf"
                                                              //level 1
                                                              for(var h32 = 0; h32 < newArray.length; h32++) {
                                                                if(newArray[h32].id === event.target.value) {
                                                                  //level 2
                                                                  for(var hh32; hh32 < newArray[h32].children.length; hh32++) {
                                                                    if(newArray[h32].children[hh32].id === fileArray[y].id) {
                                                                      // level 32
                                                                      for(var hhh32; hhh32 < newArray[h32].children[hh32].children.length; hhh32++) {
                                                                        if(newArray[h32].children[hh32].children[hhh32].id === fileArray[a].id) {
                                                                          //level 4
                                                                          for(var hhhh32; hhhh32 < newArray[h32].children[hh32].children[hhh32].children.length; hhhh32++) {
                                                                            if(newArray[h32].children[hh32].children[hhh32].children[hhhh32].id === fileArray[b].id) {
                                                                              //level 5
                                                                              for(var hhhhh32; hhhhh32 < newArray[h32].children[hh32].children[hhh32].children[hhhh32].length; hhhhh32++) {
                                                                                if(newArray[h32].children[hh32].children[hhh32].children[hhhh32].children[hhhhh32].id === fileArray[c].id) {
                                                                                  //level 6
                                                                                  for(var hhhhhh32; hhhhhh32 < newArray[h32].children[hh32].children[hhh32].children[hhhh32].children[hhhhh32].length; hhhhhh32++) {
                                                                                    if(newArray[h32].children[hh32].children[hhh32].children[hhhh32].children[hhhhh32].children[hhhhhh32].id === fileArray[d].id) {
                                                                                      //level 7
                                                                                      for(var hhhhhhh32; hhhhhhh32 < newArray[h32].children[hh32].children[hhh32].children[hhhh32].children[hhhhh32].children[hhhhhh32].length; hhhhhhh32++) {
                                                                                        if(newArray[h32].children[hh32].children[hhh32].children[hhhh32].children[hhhhh32].children[hhhhhh32].children[hhhhhhh32].id === fileArray[e].id) {
                                                                                          //level 8
                                                                                          for(var hhhhhhhh32; hhhhhhhh32 < newArray[h32].children[hh32].children[hhh32].children[hhhh32].children[hhhhh32].children[hhhhhh32].children[hhhhhhh32].length; hhhhhhhh32) {
                                                                                            if(newArray[h32].children[hh32].children[hhh32].children[hhhh32].children[hhhhh32].children[hhhhhh32].children[hhhhhhh32].children[hhhhhhhh32].id === fileArray[f].id) {
                                                                                              //level 9
                                                                                              for(var hhhhhhhhh32; hhhhhhhhh32 < newArray[h32].children[hh32].children[hhh32].children[hhhh32].children[hhhhh32].children[hhhhhh32].children[hhhhhhh32].children[hhhhhhhh32].length; hhhhhhhhh32++) {
                                                                                                if(newArray[h32].children[hh32].children[hhh32].children[hhhh32].children[hhhhh32].children[hhhhhh32].children[hhhhhhh32].children[hhhhhhhh32].children[hhhhhhhhh32].id === fileArray[g].id) {
                                                                                                  newArray[h32].children[hh32].children[hhh32].children[hhhh32].children[hhhhh32].children[hhhhhh32].children[hhhhhhh32].children[hhhhhhhh32].children[hhhhhhhhh32].children
                                                                                                  .push({id: fileArray[h].id, name: fileArray[h].file, type: newType, parent: parent})
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
                                                            if(fileArray[h].type === 'audio/mpeg') {
                                                              newType = "mp3"
                                                              //level 1
                                                              for(var h33 = 0; h33 < newArray.length; h33++) {
                                                                if(newArray[h33].id === event.target.value) {
                                                                  //level 2
                                                                  for(var hh33; hh33 < newArray[h33].children.length; hh33++) {
                                                                    if(newArray[h33].children[hh33].id === fileArray[y].id) {
                                                                      // level 33
                                                                      for(var hhh33; hhh33 < newArray[h33].children[hh33].children.length; hhh33++) {
                                                                        if(newArray[h33].children[hh33].children[hhh33].id === fileArray[a].id) {
                                                                          //level 4
                                                                          for(var hhhh33; hhhh33 < newArray[h33].children[hh33].children[hhh33].children.length; hhhh33++) {
                                                                            if(newArray[h33].children[hh33].children[hhh33].children[hhhh33].id === fileArray[b].id) {
                                                                              //level 5
                                                                              for(var hhhhh33; hhhhh33 < newArray[h33].children[hh33].children[hhh33].children[hhhh33].length; hhhhh33++) {
                                                                                if(newArray[h33].children[hh33].children[hhh33].children[hhhh33].children[hhhhh33].id === fileArray[c].id) {
                                                                                  //level 6
                                                                                  for(var hhhhhh33; hhhhhh33 < newArray[h33].children[hh33].children[hhh33].children[hhhh33].children[hhhhh33].length; hhhhhh33++) {
                                                                                    if(newArray[h33].children[hh33].children[hhh33].children[hhhh33].children[hhhhh33].children[hhhhhh33].id === fileArray[d].id) {
                                                                                      //level 7
                                                                                      for(var hhhhhhh33; hhhhhhh33 < newArray[h33].children[hh33].children[hhh33].children[hhhh33].children[hhhhh33].children[hhhhhh33].length; hhhhhhh33++) {
                                                                                        if(newArray[h33].children[hh33].children[hhh33].children[hhhh33].children[hhhhh33].children[hhhhhh33].children[hhhhhhh33].id === fileArray[e].id) {
                                                                                          //level 8
                                                                                          for(var hhhhhhhh33; hhhhhhhh33 < newArray[h33].children[hh33].children[hhh33].children[hhhh33].children[hhhhh33].children[hhhhhh33].children[hhhhhhh33].length; hhhhhhhh33) {
                                                                                            if(newArray[h33].children[hh33].children[hhh33].children[hhhh33].children[hhhhh33].children[hhhhhh33].children[hhhhhhh33].children[hhhhhhhh33].id === fileArray[f].id) {
                                                                                              //level 9
                                                                                              for(var hhhhhhhhh33; hhhhhhhhh33 < newArray[h33].children[hh33].children[hhh33].children[hhhh33].children[hhhhh33].children[hhhhhh33].children[hhhhhhh33].children[hhhhhhhh33].length; hhhhhhhhh33++) {
                                                                                                if(newArray[h33].children[hh33].children[hhh33].children[hhhh33].children[hhhhh33].children[hhhhhh33].children[hhhhhhh33].children[hhhhhhhh33].children[hhhhhhhhh33].id === fileArray[g].id) {
                                                                                                  newArray[h33].children[hh33].children[hhh33].children[hhhh33].children[hhhhh33].children[hhhhhh33].children[hhhhhhh33].children[hhhhhhhh33].children[hhhhhhhhh33].children
                                                                                                  .push({id: fileArray[h].id, name: fileArray[h].file, type: newType, parent: parent})
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
                                                            if(fileArray[h].type === 'audio/wav') {
                                                              newType = "wav"
                                                              //level 1
                                                              for(var h34 = 0; h34 < newArray.length; h34++) {
                                                                if(newArray[h34].id === event.target.value) {
                                                                  //level 2
                                                                  for(var hh34; hh34 < newArray[h34].children.length; hh34++) {
                                                                    if(newArray[h34].children[hh34].id === fileArray[y].id) {
                                                                      // level 34
                                                                      for(var hhh34; hhh34 < newArray[h34].children[hh34].children.length; hhh34++) {
                                                                        if(newArray[h34].children[hh34].children[hhh34].id === fileArray[a].id) {
                                                                          //level 4
                                                                          for(var hhhh34; hhhh34 < newArray[h34].children[hh34].children[hhh34].children.length; hhhh34++) {
                                                                            if(newArray[h34].children[hh34].children[hhh34].children[hhhh34].id === fileArray[b].id) {
                                                                              //level 5
                                                                              for(var hhhhh34; hhhhh34 < newArray[h34].children[hh34].children[hhh34].children[hhhh34].length; hhhhh34++) {
                                                                                if(newArray[h34].children[hh34].children[hhh34].children[hhhh34].children[hhhhh34].id === fileArray[c].id) {
                                                                                  //level 6
                                                                                  for(var hhhhhh34; hhhhhh34 < newArray[h34].children[hh34].children[hhh34].children[hhhh34].children[hhhhh34].length; hhhhhh34++) {
                                                                                    if(newArray[h34].children[hh34].children[hhh34].children[hhhh34].children[hhhhh34].children[hhhhhh34].id === fileArray[d].id) {
                                                                                      //level 7
                                                                                      for(var hhhhhhh34; hhhhhhh34 < newArray[h34].children[hh34].children[hhh34].children[hhhh34].children[hhhhh34].children[hhhhhh34].length; hhhhhhh34++) {
                                                                                        if(newArray[h34].children[hh34].children[hhh34].children[hhhh34].children[hhhhh34].children[hhhhhh34].children[hhhhhhh34].id === fileArray[e].id) {
                                                                                          //level 8
                                                                                          for(var hhhhhhhh34; hhhhhhhh34 < newArray[h34].children[hh34].children[hhh34].children[hhhh34].children[hhhhh34].children[hhhhhh34].children[hhhhhhh34].length; hhhhhhhh34) {
                                                                                            if(newArray[h34].children[hh34].children[hhh34].children[hhhh34].children[hhhhh34].children[hhhhhh34].children[hhhhhhh34].children[hhhhhhhh34].id === fileArray[f].id) {
                                                                                              //level 9
                                                                                              for(var hhhhhhhhh34; hhhhhhhhh34 < newArray[h34].children[hh34].children[hhh34].children[hhhh34].children[hhhhh34].children[hhhhhh34].children[hhhhhhh34].children[hhhhhhhh34].length; hhhhhhhhh34++) {
                                                                                                if(newArray[h34].children[hh34].children[hhh34].children[hhhh34].children[hhhhh34].children[hhhhhh34].children[hhhhhhh34].children[hhhhhhhh34].children[hhhhhhhhh34].id === fileArray[g].id) {
                                                                                                  newArray[h34].children[hh34].children[hhh34].children[hhhh34].children[hhhhh34].children[hhhhhh34].children[hhhhhhh34].children[hhhhhhhh34].children[hhhhhhhhh34].children
                                                                                                  .push({id: fileArray[h].id, name: fileArray[h].file, type: newType, parent: parent})
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
                                                            if(fileArray[h].type === 'video/mp4') {
                                                              newType = "mp4"
                                                              //level 1
                                                              for(var h35 = 0; h35 < newArray.length; h35++) {
                                                                if(newArray[h35].id === event.target.value) {
                                                                  //level 2
                                                                  for(var hh35; hh35 < newArray[h35].children.length; hh35++) {
                                                                    if(newArray[h35].children[hh35].id === fileArray[y].id) {
                                                                      // level 35
                                                                      for(var hhh35; hhh35 < newArray[h35].children[hh35].children.length; hhh35++) {
                                                                        if(newArray[h35].children[hh35].children[hhh35].id === fileArray[a].id) {
                                                                          //level 4
                                                                          for(var hhhh35; hhhh35 < newArray[h35].children[hh35].children[hhh35].children.length; hhhh35++) {
                                                                            if(newArray[h35].children[hh35].children[hhh35].children[hhhh35].id === fileArray[b].id) {
                                                                              //level 5
                                                                              for(var hhhhh35; hhhhh35 < newArray[h35].children[hh35].children[hhh35].children[hhhh35].length; hhhhh35++) {
                                                                                if(newArray[h35].children[hh35].children[hhh35].children[hhhh35].children[hhhhh35].id === fileArray[c].id) {
                                                                                  //level 6
                                                                                  for(var hhhhhh35; hhhhhh35 < newArray[h35].children[hh35].children[hhh35].children[hhhh35].children[hhhhh35].length; hhhhhh35++) {
                                                                                    if(newArray[h35].children[hh35].children[hhh35].children[hhhh35].children[hhhhh35].children[hhhhhh35].id === fileArray[d].id) {
                                                                                      //level 7
                                                                                      for(var hhhhhhh35; hhhhhhh35 < newArray[h35].children[hh35].children[hhh35].children[hhhh35].children[hhhhh35].children[hhhhhh35].length; hhhhhhh35++) {
                                                                                        if(newArray[h35].children[hh35].children[hhh35].children[hhhh35].children[hhhhh35].children[hhhhhh35].children[hhhhhhh35].id === fileArray[e].id) {
                                                                                          //level 8
                                                                                          for(var hhhhhhhh35; hhhhhhhh35 < newArray[h35].children[hh35].children[hhh35].children[hhhh35].children[hhhhh35].children[hhhhhh35].children[hhhhhhh35].length; hhhhhhhh35) {
                                                                                            if(newArray[h35].children[hh35].children[hhh35].children[hhhh35].children[hhhhh35].children[hhhhhh35].children[hhhhhhh35].children[hhhhhhhh35].id === fileArray[f].id) {
                                                                                              //level 9
                                                                                              for(var hhhhhhhhh35; hhhhhhhhh35 < newArray[h35].children[hh35].children[hhh35].children[hhhh35].children[hhhhh35].children[hhhhhh35].children[hhhhhhh35].children[hhhhhhhh35].length; hhhhhhhhh35++) {
                                                                                                if(newArray[h35].children[hh35].children[hhh35].children[hhhh35].children[hhhhh35].children[hhhhhh35].children[hhhhhhh35].children[hhhhhhhh35].children[hhhhhhhhh35].id === fileArray[g].id) {
                                                                                                  newArray[h35].children[hh35].children[hhh35].children[hhhh35].children[hhhhh35].children[hhhhhh35].children[hhhhhhh35].children[hhhhhhhh35].children[hhhhhhhhh35].children
                                                                                                  .push({id: fileArray[h].id, name: fileArray[h].file, type: newType, parent: parent})
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
                                                            if(fileArray[h].type === 'image/jpeg') {
                                                              newType = "jpg"
                                                              //level 1
                                                              for(var h36 = 0; h36 < newArray.length; h36++) {
                                                                if(newArray[h36].id === event.target.value) {
                                                                  //level 2
                                                                  for(var hh36; hh36 < newArray[h36].children.length; hh36++) {
                                                                    if(newArray[h36].children[hh36].id === fileArray[y].id) {
                                                                      // level 36
                                                                      for(var hhh36; hhh36 < newArray[h36].children[hh36].children.length; hhh36++) {
                                                                        if(newArray[h36].children[hh36].children[hhh36].id === fileArray[a].id) {
                                                                          //level 4
                                                                          for(var hhhh36; hhhh36 < newArray[h36].children[hh36].children[hhh36].children.length; hhhh36++) {
                                                                            if(newArray[h36].children[hh36].children[hhh36].children[hhhh36].id === fileArray[b].id) {
                                                                              //level 5
                                                                              for(var hhhhh36; hhhhh36 < newArray[h36].children[hh36].children[hhh36].children[hhhh36].length; hhhhh36++) {
                                                                                if(newArray[h36].children[hh36].children[hhh36].children[hhhh36].children[hhhhh36].id === fileArray[c].id) {
                                                                                  //level 6
                                                                                  for(var hhhhhh36; hhhhhh36 < newArray[h36].children[hh36].children[hhh36].children[hhhh36].children[hhhhh36].length; hhhhhh36++) {
                                                                                    if(newArray[h36].children[hh36].children[hhh36].children[hhhh36].children[hhhhh36].children[hhhhhh36].id === fileArray[d].id) {
                                                                                      //level 7
                                                                                      for(var hhhhhhh36; hhhhhhh36 < newArray[h36].children[hh36].children[hhh36].children[hhhh36].children[hhhhh36].children[hhhhhh36].length; hhhhhhh36++) {
                                                                                        if(newArray[h36].children[hh36].children[hhh36].children[hhhh36].children[hhhhh36].children[hhhhhh36].children[hhhhhhh36].id === fileArray[e].id) {
                                                                                          //level 8
                                                                                          for(var hhhhhhhh36; hhhhhhhh36 < newArray[h36].children[hh36].children[hhh36].children[hhhh36].children[hhhhh36].children[hhhhhh36].children[hhhhhhh36].length; hhhhhhhh36) {
                                                                                            if(newArray[h36].children[hh36].children[hhh36].children[hhhh36].children[hhhhh36].children[hhhhhh36].children[hhhhhhh36].children[hhhhhhhh36].id === fileArray[f].id) {
                                                                                              //level 9
                                                                                              for(var hhhhhhhhh36; hhhhhhhhh36 < newArray[h36].children[hh36].children[hhh36].children[hhhh36].children[hhhhh36].children[hhhhhh36].children[hhhhhhh36].children[hhhhhhhh36].length; hhhhhhhhh36++) {
                                                                                                if(newArray[h36].children[hh36].children[hhh36].children[hhhh36].children[hhhhh36].children[hhhhhh36].children[hhhhhhh36].children[hhhhhhhh36].children[hhhhhhhhh36].id === fileArray[g].id) {
                                                                                                  newArray[h36].children[hh36].children[hhh36].children[hhhh36].children[hhhhh36].children[hhhhhh36].children[hhhhhhh36].children[hhhhhhhh36].children[hhhhhhhhh36].children
                                                                                                  .push({id: fileArray[h].id, name: fileArray[h].file, type: newType, parent: parent})
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
                                                            if(fileArray[h].type === 'image/png') {
                                                              newType = "png"
                                                              //level 1
                                                              for(var h37 = 0; h37 < newArray.length; h37++) {
                                                                if(newArray[h37].id === event.target.value) {
                                                                  //level 2
                                                                  for(var hh37; hh37 < newArray[h37].children.length; hh37++) {
                                                                    if(newArray[h37].children[hh37].id === fileArray[y].id) {
                                                                      // level 37
                                                                      for(var hhh37; hhh37 < newArray[h37].children[hh37].children.length; hhh37++) {
                                                                        if(newArray[h37].children[hh37].children[hhh37].id === fileArray[a].id) {
                                                                          //level 4
                                                                          for(var hhhh37; hhhh37 < newArray[h37].children[hh37].children[hhh37].children.length; hhhh37++) {
                                                                            if(newArray[h37].children[hh37].children[hhh37].children[hhhh37].id === fileArray[b].id) {
                                                                              //level 5
                                                                              for(var hhhhh37; hhhhh37 < newArray[h37].children[hh37].children[hhh37].children[hhhh37].length; hhhhh37++) {
                                                                                if(newArray[h37].children[hh37].children[hhh37].children[hhhh37].children[hhhhh37].id === fileArray[c].id) {
                                                                                  //level 6
                                                                                  for(var hhhhhh37; hhhhhh37 < newArray[h37].children[hh37].children[hhh37].children[hhhh37].children[hhhhh37].length; hhhhhh37++) {
                                                                                    if(newArray[h37].children[hh37].children[hhh37].children[hhhh37].children[hhhhh37].children[hhhhhh37].id === fileArray[d].id) {
                                                                                      //level 7
                                                                                      for(var hhhhhhh37; hhhhhhh37 < newArray[h37].children[hh37].children[hhh37].children[hhhh37].children[hhhhh37].children[hhhhhh37].length; hhhhhhh37++) {
                                                                                        if(newArray[h37].children[hh37].children[hhh37].children[hhhh37].children[hhhhh37].children[hhhhhh37].children[hhhhhhh37].id === fileArray[e].id) {
                                                                                          //level 8
                                                                                          for(var hhhhhhhh37; hhhhhhhh37 < newArray[h37].children[hh37].children[hhh37].children[hhhh37].children[hhhhh37].children[hhhhhh37].children[hhhhhhh37].length; hhhhhhhh37) {
                                                                                            if(newArray[h37].children[hh37].children[hhh37].children[hhhh37].children[hhhhh37].children[hhhhhh37].children[hhhhhhh37].children[hhhhhhhh37].id === fileArray[f].id) {
                                                                                              //level 9
                                                                                              for(var hhhhhhhhh37; hhhhhhhhh37 < newArray[h37].children[hh37].children[hhh37].children[hhhh37].children[hhhhh37].children[hhhhhh37].children[hhhhhhh37].children[hhhhhhhh37].length; hhhhhhhhh37++) {
                                                                                                if(newArray[h37].children[hh37].children[hhh37].children[hhhh37].children[hhhhh37].children[hhhhhh37].children[hhhhhhh37].children[hhhhhhhh37].children[hhhhhhhhh37].id === fileArray[g].id) {
                                                                                                  newArray[h37].children[hh37].children[hhh37].children[hhhh37].children[hhhhh37].children[hhhhhh37].children[hhhhhhh37].children[hhhhhhhh37].children[hhhhhhhhh37].children
                                                                                                  .push({id: fileArray[h].id, name: fileArray[h].file, type: newType, parent: parent})
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
                                                            if(fileArray[h].type === 'application/msword') {
                                                              newType = "doc"
                                                              //level 1
                                                              for(var h38 = 0; h38 < newArray.length; h38++) {
                                                                if(newArray[h38].id === event.target.value) {
                                                                  //level 2
                                                                  for(var hh38; hh38 < newArray[h38].children.length; hh38++) {
                                                                    if(newArray[h38].children[hh38].id === fileArray[y].id) {
                                                                      // level 38
                                                                      for(var hhh38; hhh38 < newArray[h38].children[hh38].children.length; hhh38++) {
                                                                        if(newArray[h38].children[hh38].children[hhh38].id === fileArray[a].id) {
                                                                          //level 4
                                                                          for(var hhhh38; hhhh38 < newArray[h38].children[hh38].children[hhh38].children.length; hhhh38++) {
                                                                            if(newArray[h38].children[hh38].children[hhh38].children[hhhh38].id === fileArray[b].id) {
                                                                              //level 5
                                                                              for(var hhhhh38; hhhhh38 < newArray[h38].children[hh38].children[hhh38].children[hhhh38].length; hhhhh38++) {
                                                                                if(newArray[h38].children[hh38].children[hhh38].children[hhhh38].children[hhhhh38].id === fileArray[c].id) {
                                                                                  //level 6
                                                                                  for(var hhhhhh38; hhhhhh38 < newArray[h38].children[hh38].children[hhh38].children[hhhh38].children[hhhhh38].length; hhhhhh38++) {
                                                                                    if(newArray[h38].children[hh38].children[hhh38].children[hhhh38].children[hhhhh38].children[hhhhhh38].id === fileArray[d].id) {
                                                                                      //level 7
                                                                                      for(var hhhhhhh38; hhhhhhh38 < newArray[h38].children[hh38].children[hhh38].children[hhhh38].children[hhhhh38].children[hhhhhh38].length; hhhhhhh38++) {
                                                                                        if(newArray[h38].children[hh38].children[hhh38].children[hhhh38].children[hhhhh38].children[hhhhhh38].children[hhhhhhh38].id === fileArray[e].id) {
                                                                                          //level 8
                                                                                          for(var hhhhhhhh38; hhhhhhhh38 < newArray[h38].children[hh38].children[hhh38].children[hhhh38].children[hhhhh38].children[hhhhhh38].children[hhhhhhh38].length; hhhhhhhh38) {
                                                                                            if(newArray[h38].children[hh38].children[hhh38].children[hhhh38].children[hhhhh38].children[hhhhhh38].children[hhhhhhh38].children[hhhhhhhh38].id === fileArray[f].id) {
                                                                                              //level 9
                                                                                              for(var hhhhhhhhh38; hhhhhhhhh38 < newArray[h38].children[hh38].children[hhh38].children[hhhh38].children[hhhhh38].children[hhhhhh38].children[hhhhhhh38].children[hhhhhhhh38].length; hhhhhhhhh38++) {
                                                                                                if(newArray[h38].children[hh38].children[hhh38].children[hhhh38].children[hhhhh38].children[hhhhhh38].children[hhhhhhh38].children[hhhhhhhh38].children[hhhhhhhhh38].id === fileArray[g].id) {
                                                                                                  newArray[h38].children[hh38].children[hhh38].children[hhhh38].children[hhhhh38].children[hhhhhh38].children[hhhhhhh38].children[hhhhhhhh38].children[hhhhhhhhh38].children
                                                                                                  .push({id: fileArray[h].id, name: fileArray[h].file, type: newType, parent: parent})
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
                                                            if(fileArray[h].type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                                                              newType = "docx"
                                                              //level 1
                                                              for(var h39 = 0; h39 < newArray.length; h39++) {
                                                                if(newArray[h39].id === event.target.value) {
                                                                  //level 2
                                                                  for(var hh39; hh39 < newArray[h39].children.length; hh39++) {
                                                                    if(newArray[h39].children[hh39].id === fileArray[y].id) {
                                                                      // level 39
                                                                      for(var hhh39; hhh39 < newArray[h39].children[hh39].children.length; hhh39++) {
                                                                        if(newArray[h39].children[hh39].children[hhh39].id === fileArray[a].id) {
                                                                          //level 4
                                                                          for(var hhhh39; hhhh39 < newArray[h39].children[hh39].children[hhh39].children.length; hhhh39++) {
                                                                            if(newArray[h39].children[hh39].children[hhh39].children[hhhh39].id === fileArray[b].id) {
                                                                              //level 5
                                                                              for(var hhhhh39; hhhhh39 < newArray[h39].children[hh39].children[hhh39].children[hhhh39].length; hhhhh39++) {
                                                                                if(newArray[h39].children[hh39].children[hhh39].children[hhhh39].children[hhhhh39].id === fileArray[c].id) {
                                                                                  //level 6
                                                                                  for(var hhhhhh39; hhhhhh39 < newArray[h39].children[hh39].children[hhh39].children[hhhh39].children[hhhhh39].length; hhhhhh39++) {
                                                                                    if(newArray[h39].children[hh39].children[hhh39].children[hhhh39].children[hhhhh39].children[hhhhhh39].id === fileArray[d].id) {
                                                                                      //level 7
                                                                                      for(var hhhhhhh39; hhhhhhh39 < newArray[h39].children[hh39].children[hhh39].children[hhhh39].children[hhhhh39].children[hhhhhh39].length; hhhhhhh39++) {
                                                                                        if(newArray[h39].children[hh39].children[hhh39].children[hhhh39].children[hhhhh39].children[hhhhhh39].children[hhhhhhh39].id === fileArray[e].id) {
                                                                                          //level 8
                                                                                          for(var hhhhhhhh39; hhhhhhhh39 < newArray[h39].children[hh39].children[hhh39].children[hhhh39].children[hhhhh39].children[hhhhhh39].children[hhhhhhh39].length; hhhhhhhh39) {
                                                                                            if(newArray[h39].children[hh39].children[hhh39].children[hhhh39].children[hhhhh39].children[hhhhhh39].children[hhhhhhh39].children[hhhhhhhh39].id === fileArray[f].id) {
                                                                                              //level 9
                                                                                              for(var hhhhhhhhh39; hhhhhhhhh39 < newArray[h39].children[hh39].children[hhh39].children[hhhh39].children[hhhhh39].children[hhhhhh39].children[hhhhhhh39].children[hhhhhhhh39].length; hhhhhhhhh39++) {
                                                                                                if(newArray[h39].children[hh39].children[hhh39].children[hhhh39].children[hhhhh39].children[hhhhhh39].children[hhhhhhh39].children[hhhhhhhh39].children[hhhhhhhhh39].id === fileArray[g].id) {
                                                                                                  newArray[h39].children[hh39].children[hhh39].children[hhhh39].children[hhhhh39].children[hhhhhh39].children[hhhhhhh39].children[hhhhhhhh39].children[hhhhhhhhh39].children
                                                                                                  .push({id: fileArray[h].id, name: fileArray[h].file, type: newType, parent: parent})
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
                                                            if(fileArray[h].type === 'application/vnd.ms-powerpoint') {
                                                              newType = "ppt"
                                                              //level 1
                                                              for(var h391 = 0; h391 < newArray.length; h391++) {
                                                                if(newArray[h391].id === event.target.value) {
                                                                  //level 2
                                                                  for(var hh391; hh391 < newArray[h391].children.length; hh391++) {
                                                                    if(newArray[h391].children[hh391].id === fileArray[y].id) {
                                                                      // level 391
                                                                      for(var hhh391; hhh391 < newArray[h391].children[hh391].children.length; hhh391++) {
                                                                        if(newArray[h391].children[hh391].children[hhh391].id === fileArray[a].id) {
                                                                          //level 4
                                                                          for(var hhhh391; hhhh391 < newArray[h391].children[hh391].children[hhh391].children.length; hhhh391++) {
                                                                            if(newArray[h391].children[hh391].children[hhh391].children[hhhh391].id === fileArray[b].id) {
                                                                              //level 5
                                                                              for(var hhhhh391; hhhhh391 < newArray[h391].children[hh391].children[hhh391].children[hhhh391].length; hhhhh391++) {
                                                                                if(newArray[h391].children[hh391].children[hhh391].children[hhhh391].children[hhhhh391].id === fileArray[c].id) {
                                                                                  //level 6
                                                                                  for(var hhhhhh391; hhhhhh391 < newArray[h391].children[hh391].children[hhh391].children[hhhh391].children[hhhhh391].length; hhhhhh391++) {
                                                                                    if(newArray[h391].children[hh391].children[hhh391].children[hhhh391].children[hhhhh391].children[hhhhhh391].id === fileArray[d].id) {
                                                                                      //level 7
                                                                                      for(var hhhhhhh391; hhhhhhh391 < newArray[h391].children[hh391].children[hhh391].children[hhhh391].children[hhhhh391].children[hhhhhh391].length; hhhhhhh391++) {
                                                                                        if(newArray[h391].children[hh391].children[hhh391].children[hhhh391].children[hhhhh391].children[hhhhhh391].children[hhhhhhh391].id === fileArray[e].id) {
                                                                                          //level 8
                                                                                          for(var hhhhhhhh391; hhhhhhhh391 < newArray[h391].children[hh391].children[hhh391].children[hhhh391].children[hhhhh391].children[hhhhhh391].children[hhhhhhh391].length; hhhhhhhh391) {
                                                                                            if(newArray[h391].children[hh391].children[hhh391].children[hhhh391].children[hhhhh391].children[hhhhhh391].children[hhhhhhh391].children[hhhhhhhh391].id === fileArray[f].id) {
                                                                                              //level 9
                                                                                              for(var hhhhhhhhh391; hhhhhhhhh391 < newArray[h391].children[hh391].children[hhh391].children[hhhh391].children[hhhhh391].children[hhhhhh391].children[hhhhhhh391].children[hhhhhhhh391].length; hhhhhhhhh391++) {
                                                                                                if(newArray[h391].children[hh391].children[hhh391].children[hhhh391].children[hhhhh391].children[hhhhhh391].children[hhhhhhh391].children[hhhhhhhh391].children[hhhhhhhhh391].id === fileArray[g].id) {
                                                                                                  newArray[h391].children[hh391].children[hhh391].children[hhhh391].children[hhhhh391].children[hhhhhh391].children[hhhhhhh391].children[hhhhhhhh391].children[hhhhhhhhh391].children
                                                                                                  .push({id: fileArray[h].id, name: fileArray[h].file, type: newType, parent: parent})
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
                                                            if(fileArray[h].type === 'text/plain') {
                                                              newType = "txt"
                                                              //level 1
                                                              for(var h392 = 0; h392 < newArray.length; h392++) {
                                                                if(newArray[h392].id === event.target.value) {
                                                                  //level 2
                                                                  for(var hh392; hh392 < newArray[h392].children.length; hh392++) {
                                                                    if(newArray[h392].children[hh392].id === fileArray[y].id) {
                                                                      // level 392
                                                                      for(var hhh392; hhh392 < newArray[h392].children[hh392].children.length; hhh392++) {
                                                                        if(newArray[h392].children[hh392].children[hhh392].id === fileArray[a].id) {
                                                                          //level 4
                                                                          for(var hhhh392; hhhh392 < newArray[h392].children[hh392].children[hhh392].children.length; hhhh392++) {
                                                                            if(newArray[h392].children[hh392].children[hhh392].children[hhhh392].id === fileArray[b].id) {
                                                                              //level 5
                                                                              for(var hhhhh392; hhhhh392 < newArray[h392].children[hh392].children[hhh392].children[hhhh392].length; hhhhh392++) {
                                                                                if(newArray[h392].children[hh392].children[hhh392].children[hhhh392].children[hhhhh392].id === fileArray[c].id) {
                                                                                  //level 6
                                                                                  for(var hhhhhh392; hhhhhh392 < newArray[h392].children[hh392].children[hhh392].children[hhhh392].children[hhhhh392].length; hhhhhh392++) {
                                                                                    if(newArray[h392].children[hh392].children[hhh392].children[hhhh392].children[hhhhh392].children[hhhhhh392].id === fileArray[d].id) {
                                                                                      //level 7
                                                                                      for(var hhhhhhh392; hhhhhhh392 < newArray[h392].children[hh392].children[hhh392].children[hhhh392].children[hhhhh392].children[hhhhhh392].length; hhhhhhh392++) {
                                                                                        if(newArray[h392].children[hh392].children[hhh392].children[hhhh392].children[hhhhh392].children[hhhhhh392].children[hhhhhhh392].id === fileArray[e].id) {
                                                                                          //level 8
                                                                                          for(var hhhhhhhh392; hhhhhhhh392 < newArray[h392].children[hh392].children[hhh392].children[hhhh392].children[hhhhh392].children[hhhhhh392].children[hhhhhhh392].length; hhhhhhhh392) {
                                                                                            if(newArray[h392].children[hh392].children[hhh392].children[hhhh392].children[hhhhh392].children[hhhhhh392].children[hhhhhhh392].children[hhhhhhhh392].id === fileArray[f].id) {
                                                                                              //level 9
                                                                                              for(var hhhhhhhhh392; hhhhhhhhh392 < newArray[h392].children[hh392].children[hhh392].children[hhhh392].children[hhhhh392].children[hhhhhh392].children[hhhhhhh392].children[hhhhhhhh392].length; hhhhhhhhh392++) {
                                                                                                if(newArray[h392].children[hh392].children[hhh392].children[hhhh392].children[hhhhh392].children[hhhhhh392].children[hhhhhhh392].children[hhhhhhhh392].children[hhhhhhhhh392].id === fileArray[g].id) {
                                                                                                  newArray[h392].children[hh392].children[hhh392].children[hhhh392].children[hhhhh392].children[hhhhhh392].children[hhhhhhh392].children[hhhhhhhh392].children[hhhhhhhhh392].children
                                                                                                  .push({id: fileArray[h].id, name: fileArray[h].file, type: newType, parent: parent})
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
                                                            if(fileArray[h].type === 'application/x-zip-compressed') {
                                                              newType = "zip"
                                                              //level 1
                                                              for(var h393 = 0; h393 < newArray.length; h393++) {
                                                                if(newArray[h393].id === event.target.value) {
                                                                  //level 2
                                                                  for(var hh393; hh393 < newArray[h393].children.length; hh393++) {
                                                                    if(newArray[h393].children[hh393].id === fileArray[y].id) {
                                                                      // level 393
                                                                      for(var hhh393; hhh393 < newArray[h393].children[hh393].children.length; hhh393++) {
                                                                        if(newArray[h393].children[hh393].children[hhh393].id === fileArray[a].id) {
                                                                          //level 4
                                                                          for(var hhhh393; hhhh393 < newArray[h393].children[hh393].children[hhh393].children.length; hhhh393++) {
                                                                            if(newArray[h393].children[hh393].children[hhh393].children[hhhh393].id === fileArray[b].id) {
                                                                              //level 5
                                                                              for(var hhhhh393; hhhhh393 < newArray[h393].children[hh393].children[hhh393].children[hhhh393].length; hhhhh393++) {
                                                                                if(newArray[h393].children[hh393].children[hhh393].children[hhhh393].children[hhhhh393].id === fileArray[c].id) {
                                                                                  //level 6
                                                                                  for(var hhhhhh393; hhhhhh393 < newArray[h393].children[hh393].children[hhh393].children[hhhh393].children[hhhhh393].length; hhhhhh393++) {
                                                                                    if(newArray[h393].children[hh393].children[hhh393].children[hhhh393].children[hhhhh393].children[hhhhhh393].id === fileArray[d].id) {
                                                                                      //level 7
                                                                                      for(var hhhhhhh393; hhhhhhh393 < newArray[h393].children[hh393].children[hhh393].children[hhhh393].children[hhhhh393].children[hhhhhh393].length; hhhhhhh393++) {
                                                                                        if(newArray[h393].children[hh393].children[hhh393].children[hhhh393].children[hhhhh393].children[hhhhhh393].children[hhhhhhh393].id === fileArray[e].id) {
                                                                                          //level 8
                                                                                          for(var hhhhhhhh393; hhhhhhhh393 < newArray[h393].children[hh393].children[hhh393].children[hhhh393].children[hhhhh393].children[hhhhhh393].children[hhhhhhh393].length; hhhhhhhh393) {
                                                                                            if(newArray[h393].children[hh393].children[hhh393].children[hhhh393].children[hhhhh393].children[hhhhhh393].children[hhhhhhh393].children[hhhhhhhh393].id === fileArray[f].id) {
                                                                                              //level 9
                                                                                              for(var hhhhhhhhh393; hhhhhhhhh393 < newArray[h393].children[hh393].children[hhh393].children[hhhh393].children[hhhhh393].children[hhhhhh393].children[hhhhhhh393].children[hhhhhhhh393].length; hhhhhhhhh393++) {
                                                                                                if(newArray[h393].children[hh393].children[hhh393].children[hhhh393].children[hhhhh393].children[hhhhhh393].children[hhhhhhh393].children[hhhhhhhh393].children[hhhhhhhhh393].id === fileArray[g].id) {
                                                                                                  newArray[h393].children[hh393].children[hhh393].children[hhhh393].children[hhhhh393].children[hhhhhh393].children[hhhhhhh393].children[hhhhhhhh393].children[hhhhhhhhh393].children
                                                                                                  .push({id: fileArray[h].id, name: fileArray[h].file, type: newType, parent: parent})
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
                                                            if(fileArray[h].type === 'application/vnd.google-apps.folder') {
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
      console.log(newArray);
      this.setState({exportFileArray: newArray})
    }

    handleChangeSetParent(event) {
      this.setState({
        classroomParent: event.target.value
      })
    }

    handleChangeFileType (event) {
        this.setState({
            exportFileType: event.target.value
        })
    }

    handleChangeFolderType (event) {
        this.setState({
            exportFolderType: event.target.value
        })
    }

    handleChangeSubject(event) {
        var subjectArrayVar = [];
        this.setState({subject: event.target.value})

        if(event.target.value === 'math') {
            if (this.state.math === false) {
              this.setState({math: true})
              subjectArrayVar.push('Math');
              for (var i = 0; i < subjectArrayVar.length; i++) {
                this.setState({subjectArray: [...this.state.subjectArray, subjectArrayVar[i]]})
              }
            }
            if (this.state.math === true) {
              this.setState({math: false})
              subjectArrayVar = subjectArrayVar.filter(e => e !== 'Math');
            }
            console.log(this.state.subjectArray)
        }
        if(event.target.value === 'science') {
            if (this.state.science === false) {
              this.setState({science: true})
              subjectArrayVar.push('Science');
              for (var i = 0; i < subjectArrayVar.length; i++) {
                this.setState({subjectArray: [...this.state.subjectArray, subjectArrayVar[i]]})
              }
            }
            if (this.state.science === true) {
              this.setState({science: false})
              subjectArrayVar = subjectArrayVar.filter(e => e !== 'Science');
            }
            console.log(this.state.subjectArray)
        }
        if(event.target.value === 'socialStudies') {
            if (this.state.socialStudies === false) {
              this.setState({socialStudies: true})
              subjectArrayVar.push('Social Studies');
              for (var i = 0; i < subjectArrayVar.length; i++) {
                this.setState({subjectArray: [...this.state.subjectArray, subjectArrayVar[i]]})
              }
            }
            if (this.state.socialStudies === true) {
              this.setState({socialStudies: false})
              subjectArrayVar = subjectArrayVar.filter(e => e !== 'Social Studies');
            }
        }
        if(event.target.value === 'languageArts') {
            if (this.state.languageArts === false) {
              this.setState({languageArts: true})
              subjectArrayVar.push('Language Arts');
              for (var i = 0; i < subjectArrayVar.length; i++) {
                this.setState({subjectArray: [...this.state.subjectArray, subjectArrayVar[i]]})
              }
            }
            if (this.state.languageArts === true) {
              this.setState({languageArts: false})
              subjectArrayVar = subjectArrayVar.filter(e => e !== 'Language Arts');
            }
        }
        if(event.target.value === 'careers') {
            if (this.state.careers === false) {
              this.setState({careers: true})
              subjectArrayVar.push('Careers');
              for (var i = 0; i < subjectArrayVar.length; i++) {
                this.setState({subjectArray: [...this.state.subjectArray, subjectArrayVar[i]]})
              }
            }
            if (this.state.careers === true) {
              this.setState({careers: false})
              subjectArrayVar = subjectArrayVar.filter(e => e !== 'Careers');
            }
        }
        if(event.target.value === 'technology') {
            if (this.state.technology === false) {
              this.setState({technology: true})
              subjectArrayVar.push('Technology');
              for (var i = 0; i < subjectArrayVar.length; i++) {
                this.setState({subjectArray: [...this.state.subjectArray, subjectArrayVar[i]]})
              }
            }
            if (this.state.technology === true) {
              this.setState({technology: false})
              subjectArrayVar = subjectArrayVar.filter(e => e !== 'Technology');
            }
        }
        this.setState({visible: true})
        console.log(this.state.subjectArray)
    }

    handleChangeGrade(event) {
        this.setState({grade: event.target.value});
        var gradeArrayVar = [];
        if(event.target.value === 'pre-k') {
            if (this.state.preK === false) {
              this.setState({preK: true})
              gradeArrayVar.push('Pre-K');
              for (var i = 0; i < gradeArrayVar.length; i++) {
                this.setState({gradeArray: [...this.state.gradeArray, gradeArrayVar[i]]})
              }
            }
            if (this.state.preK === true) {
              this.setState({preK: false})
            }
        }
        if(event.target.value === 'k') {
            if (this.state.K === false) {
              this.setState({K: true})
              gradeArrayVar.push('K');
              for (var i = 0; i < gradeArrayVar.length; i++) {
                this.setState({gradeArray: [...this.state.gradeArray, gradeArrayVar[i]]})
              }
            }
            if (this.state.K === true) {
              this.setState({K: false})
            }
        }
        if(event.target.value === 'first') {
            if (this.state.first === false) {
              this.setState({first: true})
              gradeArrayVar.push('1st');
              for (var i = 0; i < gradeArrayVar.length; i++) {
                this.setState({gradeArray: [...this.state.gradeArray, gradeArrayVar[i]]})
              }
            }
            if (this.state.first === true) {
              this.setState({first: false})
            }
        }
        if(event.target.value === 'second') {
            if (this.state.second === false) {
              this.setState({second: true})
              gradeArrayVar.push('2nd');
              for (var i = 0; i < gradeArrayVar.length; i++) {
                this.setState({gradeArray: [...this.state.gradeArray, gradeArrayVar[i]]})
              }
            }
            if (this.state.second === true) {
              this.setState({second: false})
            }
        }
        if(event.target.value === 'third') {
            if (this.state.third === false) {
              this.setState({third: true})
              gradeArrayVar.push('3rd');
              for (var i = 0; i < gradeArrayVar.length; i++) {
                this.setState({gradeArray: [...this.state.gradeArray, gradeArrayVar[i]]})
              }
            }
            if (this.state.third === true) {
              this.setState({third: false})
            }
        }
        if(event.target.value === 'fourth') {
            if (this.state.fourth === false) {
              this.setState({fourth: true})
              gradeArrayVar.push('4th');
              for (var i = 0; i < gradeArrayVar.length; i++) {
                this.setState({gradeArray: [...this.state.gradeArray, gradeArrayVar[i]]})
              }
            }
            if (this.state.fourth === true) {
              this.setState({fourth: false})
            }
        }
        if(event.target.value === 'fifth') {
            if (this.state.fifth === false) {
              this.setState({fifth: true})
              gradeArrayVar.push('5th');
              for (var i = 0; i < gradeArrayVar.length; i++) {
                this.setState({gradeArray: [...this.state.gradeArray, gradeArrayVar[i]]})
              }
            }
            if (this.state.fifth === true) {
              this.setState({fifth: false})
            }
        }
        if(event.target.value === 'sixth') {
            if (this.state.sixth === false) {
              this.setState({sixth: true})
              gradeArrayVar.push('6th');
              for (var i = 0; i < gradeArrayVar.length; i++) {
                this.setState({gradeArray: [...this.state.gradeArray, gradeArrayVar[i]]})
              }
            }
            if (this.state.sixth === true) {
              this.setState({sixth: false})
            }
        }
        if(event.target.value === 'seventh') {
            if (this.state.seventh === false) {
              this.setState({seventh: true})
              gradeArrayVar.push('7th');
              for (var i = 0; i < gradeArrayVar.length; i++) {
                this.setState({gradeArray: [...this.state.gradeArray, gradeArrayVar[i]]})
              }
            }
            if (this.state.seventh === true) {
              this.setState({seventh: false})
            }
        }
        if(event.target.value === 'eighth') {
            if (this.state.eighth === false) {
              this.setState({eighth: true})
              gradeArrayVar.push('8th');
              for (var i = 0; i < gradeArrayVar.length; i++) {
                this.setState({gradeArray: [...this.state.gradeArray, gradeArrayVar[i]]})
              }
            }
            if (this.state.eighth === true) {
              this.setState({eighth: false})
            }
        }
        if(event.target.value === 'ninth') {
            if (this.state.ninth === false) {
              this.setState({ninth: true})
              gradeArrayVar.push('9th');
              for (var i = 0; i < gradeArrayVar.length; i++) {
                this.setState({gradeArray: [...this.state.gradeArray, gradeArrayVar[i]]})
              }
            }
            if (this.state.ninth === true) {
              this.setState({ninth: false})
            }
        }
        if(event.target.value === 'tenth') {
            if (this.state.tenth === false) {
              this.setState({tenth: true})
              gradeArrayVar.push('10th');
              for (var i = 0; i < gradeArrayVar.length; i++) {
                this.setState({gradeArray: [...this.state.gradeArray, gradeArrayVar[i]]})
              }
            }
            if (this.state.tenth === true) {
              this.setState({tenth: false})
            }
        }
        if(event.target.value === 'eleventh') {
            if (this.state.eleventh === false) {
              this.setState({eleventh: true})
              gradeArrayVar.push('11th');
              for (var i = 0; i < gradeArrayVar.length; i++) {
                this.setState({gradeArray: [...this.state.gradeArray, gradeArrayVar[i]]})
              }
            }
            if (this.state.eleventh === true) {
              this.setState({eleventh: false})
            }
        }
        if(event.target.value === 'twelveth') {
            if (this.state.twelveth === false) {
              this.setState({twelveth: true})
              gradeArrayVar.push('12th');
              for (var i = 0; i < gradeArrayVar.length; i++) {
                this.setState({gradeArray: [...this.state.gradeArray, gradeArrayVar[i]]})
              }
            }
            if (this.state.twelveth === true) {
              this.setState({twelveth: false})
            }
        }
        this.setState({visible: true})
    }

    handleChangeIndustry(event) {
        this.setState({industry: event.target.value})
        var industryArrayVar = [];
        if(event.target.value === "Agriculture, Food and Natural Resources") {
            if (this.state.agriculture === false) {
              this.setState({agriculture: true})
              industryArrayVar.push("Agriculture, Food and Natural Resources");
              for (var i = 0; i < industryArrayVar.length; i++) {
                this.setState({industryArray: [...this.state.industryArray, industryArrayVar[i]]})
              }
            }
            if (this.state.agriculture === true) {
              this.setState({agriculture: false})
              industryArrayVar = industryArrayVar.filter(e => e !== 'Agriculture, Food and Natural Resources');
            }
        }
        if(event.target.value === "Architecture and Construction") {
            if (this.state.architecture === false) {
              this.setState({architecture: true})
              industryArrayVar.push("Architecture and Construction");
              for (var i = 0; i < industryArrayVar.length; i++) {
                this.setState({industryArray: [...this.state.industryArray, industryArrayVar[i]]})
              }
            }
            if (this.state.architecture === true) {
              this.setState({architecture: false})
              industryArrayVar = industryArrayVar.filter(e => e !== 'Architecture and Construction');
            }
        }
        if(event.target.value === "Arts, Audio/Video Technology and Communications") {
            if (this.state.arts === false) {
              this.setState({arts: true})
              industryArrayVar.push("Arts, Audio/Video Technology and Communications");
              for (var i = 0; i < industryArrayVar.length; i++) {
                this.setState({industryArray: [...this.state.industryArray, industryArrayVar[i]]})
              }
            }
            if (this.state.arts === true) {
              this.setState({arts: false})
              industryArrayVar = industryArrayVar.filter(e => e !== 'Arts, Audio/Video Technology and Communications');
            }
        }
        if(event.target.value === "Business Management and Administration") {
            if (this.state.businessManagement === false) {
              this.setState({businessManagement: true})
              industryArrayVar.push("Business Management and Administration");
              for (var i = 0; i < industryArrayVar.length; i++) {
                this.setState({industryArray: [...this.state.industryArray, industryArrayVar[i]]})
              }
            }
            if (this.state.businessManagement === true) {
              this.setState({businessManagement: false})
              industryArrayVar = industryArrayVar.filter(e => e !== 'Business Management and Administration');
            }
        }
        if(event.target.value === "Education and Training") {
            if (this.state.educationTraining === false) {
              this.setState({educationTraining: true})
              industryArrayVar.push("Education and Training");
              for (var i = 0; i < industryArrayVar.length; i++) {
                this.setState({industryArray: [...this.state.industryArray, industryArrayVar[i]]})
              }
            }
            if (this.state.educationTraining === true) {
              this.setState({educationTraining: false})
              industryArrayVar = industryArrayVar.filter(e => e !== 'Education and Training');
            }
        }
        if(event.target.value === "Finance") {
            if (this.state.finance === false) {
              this.setState({finance: true})
              industryArrayVar.push("Finance");
              for (var i = 0; i < industryArrayVar.length; i++) {
                this.setState({industryArray: [...this.state.industryArray, industryArrayVar[i]]})
              }
            }
            if (this.state.finance === true) {
              this.setState({finance: false})
              industryArrayVar = industryArrayVar.filter(e => e !== 'Finance');
            }
        }
        if(event.target.value === "Government and Public Administration") {
            if (this.state.governmentPublic === false) {
              this.setState({governmentPublic: true})
              industryArrayVar.push("Government and Public Administration");
              for (var i = 0; i < industryArrayVar.length; i++) {
                this.setState({industryArray: [...this.state.industryArray, industryArrayVar[i]]})
              }
            }
            if (this.state.governmentPublic === true) {
              this.setState({governmentPublic: false})
              industryArrayVar = industryArrayVar.filter(e => e !== 'Government and Public Administration');
            }
        }
        if(event.target.value === "Health Science") {
            if (this.state.healthScience === false) {
              this.setState({healthScience: true})
              industryArrayVar.push("Health Science");
              for (var i = 0; i < industryArrayVar.length; i++) {
                this.setState({industryArray: [...this.state.industryArray, industryArrayVar[i]]})
              }
            }
            if (this.state.healthScience === true) {
              this.setState({healthScience: false})
              industryArrayVar = industryArrayVar.filter(e => e !== 'Health Science');
            }
        }
        if(event.target.value === "Hospitality and Tourism") {
            if (this.state.hospitality === false) {
              this.setState({hospitality: true})
              industryArrayVar.push("Hospitality and Tourism");
              for (var i = 0; i < industryArrayVar.length; i++) {
                this.setState({industryArray: [...this.state.industryArray, industryArrayVar[i]]})
              }
            }
            if (this.state.hospitality === true) {
              this.setState({hospitality: false})
              industryArrayVar = industryArrayVar.filter(e => e !== 'Hospitality and Tourism');
            }
        }
        if(event.target.value === "Human Services") {
            if (this.state.humanServices === false) {
              this.setState({humanServices: true})
              industryArrayVar.push("Human Services");
              for (var i = 0; i < industryArrayVar.length; i++) {
                this.setState({industryArray: [...this.state.industryArray, industryArrayVar[i]]})
              }
            }
            if (this.state.humanServices === true) {
              this.setState({humanServices: false})
              industryArrayVar = industryArrayVar.filter(e => e !== 'Human Services');
            }
        }
        if(event.target.value === "Information Technology") {
            if (this.state.informationTechnology === false) {
              this.setState({informationTechnology: true})
              industryArrayVar.push("Information Technology");
              for (var i = 0; i < industryArrayVar.length; i++) {
                this.setState({industryArray: [...this.state.industryArray, industryArrayVar[i]]})
              }
            }
            if (this.state.informationTechnology === true) {
              this.setState({informationTechnology: false})
              industryArrayVar = industryArrayVar.filter(e => e !== 'Information Technology');
            }
        }
        if(event.target.value === "Law, Public Safety, Corrections and Security") {
            if (this.state.lawSafety === false) {
              this.setState({lawSafety: true})
              industryArrayVar.push("Law, Public Safety, Corrections and Security");
              for (var i = 0; i < industryArrayVar.length; i++) {
                this.setState({industryArray: [...this.state.industryArray, industryArrayVar[i]]})
              }
            }
            if (this.state.lawSafety === true) {
              this.setState({lawSafety: false})
              industryArrayVar = industryArrayVar.filter(e => e !== 'Law, Public Safety, Corrections and Security');
            }
        }
        if(event.target.value === "Manufacturing") {
            if (this.state.manufacturing === false) {
              this.setState({manufacturing: true})
              industryArrayVar.push("Manufacturing");
              for (var i = 0; i < industryArrayVar.length; i++) {
                this.setState({industryArray: [...this.state.industryArray, industryArrayVar[i]]})
              }
            }
            if (this.state.manufacturing === true) {
              this.setState({manufacturing: false})
              industryArrayVar = industryArrayVar.filter(e => e !== 'Manufacturing');
            }
        }
        if(event.target.value === "Marketing, Sales and Service") {
            if (this.state.marketingSales === false) {
              this.setState({marketingSales: true})
              industryArrayVar.push("Marketing, Sales and Service");
              for (var i = 0; i < industryArrayVar.length; i++) {
                this.setState({industryArray: [...this.state.industryArray, industryArrayVar[i]]})
              }
            }
            if (this.state.marketingSales === true) {
              this.setState({marketingSales: false})
              industryArrayVar = industryArrayVar.filter(e => e !== 'Marketing, Sales and Service');
            }
        }
        if(event.target.value === "Science, Technology, Engineering and Math") {
            if (this.state.sTEM === false) {
              this.setState({sTEM: true})
              industryArrayVar.push("Science, Technology, Engineering and Math");
              for (var i = 0; i < industryArrayVar.length; i++) {
                this.setState({industryArray: [...this.state.industryArray, industryArrayVar[i]]})
              }
            }
            if (this.state.sTEM === true) {
              this.setState({sTEM: false})
              industryArrayVar = industryArrayVar.filter(e => e !== 'Science, Technology, Engineering and Math');
            }
        }
        if(event.target.value === "Transportation, Distribution and Logistics") {
            if (this.state.transportation === false) {
              this.setState({transportation: true})
              industryArrayVar.push("Transportation, Distribution and Logistics");
              for (var i = 0; i < industryArrayVar.length; i++) {
                this.setState({industryArray: [...this.state.industryArray, industryArrayVar[i]]})
              }
            }
            if (this.state.transportation === true) {
              this.setState({transportation: false})
              industryArrayVar = industryArrayVar.filter(e => e !== 'Transportation, Distribution and Logistics');
            }
        }
        this.setState({visible: true})
    }

    removeTagSubject(event) {
      const subject = event.target.value;
      const array = this.state.subjectArray;
      for (var i = 0; i < array.length; i++) {
        if(array[i] === subject) {
          array.splice(i, 1);
          this.setState({subjectArray: array})
        }
      }
      this.setState({visible: false})
    }

    removeTagGrade(event) {
      const grade = event.target.value;
      const array = this.state.gradeArray;
      for (var i = 0; i < array.length; i++) {
        if(array[i] === grade) {
          array.splice(i, 1);
          this.setState({gradeArray: array})
        }
      }
      this.setState({visible: false})
    }

    removeTagIndustry(event) {
      const industry = event.target.value;
      const array = this.state.industryArray;
      for (var i = 0; i < array.length; i++) {
        if(array[i] === industry) {
          array.splice(i, 1);
          this.setState({industryArray: array})
        }
      }
      this.setState({visible: false})
    }

    downloadTest() {
        fetch('/profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          }) 
    }

    downloadFile() {
      var exportFileArray = this.state.exportFileArray;
      fetch('/downloaddocument', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          files: exportFileArray,
        })
      }) 
    }

    downloadFolder(event) {
        event.preventDefault();
        var pathStart = './downloads/'
        var newPath = pathStart.concat(this.state.fileName + '.' + this.state.exportFolderType)
        this.setState({newPath : newPath})
        fetch('/downloadfolder', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({
              id: this.state.id,
              name: this.state.fileName,
              type: this.state.exportFolderType,
            })
          }) 
    }

    async getFoldersClassroom() {
      let classroomFiles = [];
      var response = await fetch('/drivecall2');
      var data = await response.json();
      console.log(data);
      classroomFiles = data;
      console.log(classroomFiles)
      this.organizeClassroomFolders(data)
      console.log("classroom has been called.")
    }

    organizeClassroomFolders (res) {
      console.log(res);
      for(var i = 0; i < res.length; i++) {
        if(res[i].file === "Classroom" && res[i].type === 'application/vnd.google-apps.folder') {
          var classroom = res[i].id;
          console.log("This is the classroom folder. " + classroom)
          var newArray = [];
          for(var y = 0; y < res.length; y++) {
            if(res[y].parents[0] === classroom) {
              newArray.push(res[y]);
              console.log(newArray)
              this.setState({newClassroomFolders: newArray})
            }
          }
        }
      }
    }

    classroomExport() {
      fetch('/classroomexport', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            fileArray: this.state.exportFileArray,
            parentId: this.state.classroomParent,
          })
       }) 
       fetch('/exportresult')
       .then(res => res.json())
       .then(res => this.setState({exportResult: res}))
    }

    fileDownload() {
      fetch('/filedownload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          fileArray: this.state.exportFileArray,
          parentId: this.state.classroomParent,
        })
      })
    }

    searchFunction() {
        console.log("search function run");
        var searchTerm = this.state.searchTerm;
        var driveFiles = this.organizeFiles();
        //console.log(driveFiles)
        this.setState({searchRan: false});
        this.setState({foundFolders: []})
        this.setState({foundFiles: []})
        var foundFiles = [];
        var foundFolders = [];
        var subjectArray = this.state.subjectArray;
        var gradeArray = this.state.gradeArray;
        var industryArray = this.state.industryArray;
        console.log(subjectArray);
        for(var i = 0; i < driveFiles.length; i++) {
          if (subjectArray.length === 0) {
            subjectArray = ['none']
          }
          if (gradeArray.length === 0) {
            gradeArray = ['none']
          }
          if (industryArray.length === 0) {
            industryArray = ['none']
          }

        }
        //console.log(driveFiles)

        for(var i = 0; i < driveFiles.length; i++) {

        // Plain search terms

            if(this.state.searchTerm === "Search Here" && !this.state.math && !this.state.science && !this.state.socialStudies && !this.state.languageArts && !this.state.careers && !this.state.technology
            && !this.state.preK && !this.state.K && !this.state.first && !this.state.second && !this.state.third && !this.state.fourth && !this.state.fifth && !this.state.sixth && !this.state.seventh && !this.state.eighth && !this.state.ninth && !this.state.tenth && !this.state.eleventh && !this.state.twelveth 
            && !this.state.agriculture && !this.state.architecture && !this.state.arts && !this.state.businessManagement && !this.state.educationTraining && !this.state.finance && !this.state.governmentPublic && !this.state.healthScience && !this.state.hospitality && !this.state.humanServices && !this.state.informationTechnology && !this.state.lawSafety && !this.state.manufacturing && !this.state.marketingSales && !this.state.sTEM && !this.state.transportation) {
                this.setState({foundFolders: "Please enter a valid search term."})
                this.setState({foundFiles: "Please enter a valid search term."})
                this.setState({searchRan: true})
                return console.log("searched.")
            }

            if(driveFiles[i].file.includes(searchTerm) === true 
            && subjectArray === ["none"]
            && gradeArray === ["none"]
            && industryArray === ["none"]) {
              if (driveFiles[i].type === "application/vnd.google-apps.folder") {
                foundFolders.push(driveFiles[i])
                console.log(driveFiles[i])
                this.setState({foundFolders: foundFolders})
              }
              if (driveFiles[i].type === 'application/vnd.google-apps.document') {
                //console.log(driveFiles[i]);
                foundFiles.push(driveFiles[i])
                console.log(foundFiles)
                this.setState({foundFiles: foundFiles})
              }
            }

        //// Subject search terms 
          let checker = (arr, target) => target.every(v => arr.includes(v));

          if(driveFiles[i].file.includes(searchTerm) === true &&
          //subjectArray[0] !== "none" || gradeArray[0] !== "none" || industryArray[0] !== "none"
           checker(driveFiles[i].properties.subject, subjectArray) === true 
          && checker(driveFiles[i].properties.grade, gradeArray) === true 
          && checker(driveFiles[i].properties.industry, industryArray) === true
          ) {
              //console.log("the file is found.")
              if (driveFiles[i].type === "application/vnd.google-apps.folder") {
                  foundFolders.push(driveFiles[i])
                  console.log(driveFiles[i])
                  this.setState({foundFolders: foundFolders})
              }
              if (driveFiles[i].type === 'application/vnd.google-apps.document') {
                  //console.log(driveFiles[i]);
                  foundFiles.push(driveFiles[i])
                  console.log(foundFiles)
                  this.setState({foundFiles: foundFiles})
              }
          }       
        }
        this.setState({searchRan: true})
        this.setState({subjectArray: []})
        this.setState({gradeArray: []})
        this.setState({industryArray: []})
        console.log("searchRan changed")
    }



    //Rendered Component

    render() {
      let buttonClass = this.state.visible ? "visibleYes" : "visibleNo";
        if(this.state.session === true && this.state.searchRan === false) {
            return (
                <div>
                    <TopNavbar />
                    <Container fluid>
                        <div className = "whole"> </div>
                        <Row className = "searchPage"> 
                           <Col md = {3} className = "search-col">
                               <Row>
                                 <div className = "searchBar">
                                    <input type = "text" className = "searchBarBar" value = {this.state.searchTerm || ''} onChange = {this.handleChangeSearch} />
                                    <Button className = "btn btn-primary submitButton" onClick = {this.searchFunction}> Submit </Button> 
                                  </div>
                                </Row>
                                <hr />
                                <Row className = "search-box subject-area">
                                    <h2>Subject Area</h2>
                                    <Form.Control as="select" onChange = {this.handleChangeSubject} value = {this.state.subject || ''} multiple>
                                        <option value = "math">Math</option>
                                        <option value = "science">Science</option>
                                        <option value = "socialStudies">Social Studies</option>
                                        <option value = "languageArts">Language Arts</option>
                                        <option value = "careers">Careers</option>
                                        <option value = "technology">Technology</option>
                                    </Form.Control>
                                    {this.state.subjectArray.map(subject => (
                                                <Button className = {buttonClass} value = {subject} onClick = {this.removeTagSubject}>
                                                  {subject}
                                                </Button>))}
                                </Row>
                                <hr />
                                <Row className = "search-box grade-level">
                                    <h2> Grade Level </h2>
                                    <Form.Control as="select" onChange = {this.handleChangeGrade} value = {this.state.grade || ''} multiple>
                                        <option value = "pre-k">Pre-K</option>
                                        <option value = "k">K</option>
                                        <option value = "first">1st</option>
                                        <option value = "second">2nd</option>
                                        <option value = "third">3rd</option>
                                        <option value = "fourth">4th</option>
                                        <option value = "fifth">5th</option>
                                        <option value = "sixth">6th</option>
                                        <option value = "seventh">7th</option>
                                        <option value = "eighth">8th</option>
                                        <option value = "ninth">9th</option>
                                        <option value = "tenth">10th</option>
                                        <option value = "eleventh">11th</option>
                                        <option value = "twelveth">12th</option>
                                    </Form.Control>
                                    {this.state.gradeArray.map(grades => (
                                                <Button className = {buttonClass} value = {grades} onClick = {this.removeTagGrade}>
                                                {grades}
                                              </Button>))}
                                </Row>
                                <hr />
                                <Row className = "search-box industry">
                                    <h2> Industry </h2>
                                    <Form.Control as="select" onChange = {this.handleChangeIndustry} value = {this.state.industry || ''} multiple>
                                      <option value = "Agriculture, Food and Natural Resources"> Agriculture, Food and Natural Resources </option>
                                      <option value = "Architecture and Construction"> Architecture and Construction </option>
                                      <option value = "Arts, Audio/Video Technology and Communications"> Arts, Audio/Video Technology and Communications </option>
                                      <option value = "Business Management and Administration" > Business Managment and Administration </option>
                                      <option value = "Education and Training"> Education and Training </option>
                                      <option value = "Finance"> Finance </option>
                                      <option value = "Government and Public Administration"> Government and Public Administration </option>
                                      <option value = "Health Science"> Health Science </option>
                                      <option value = "Information Technology"> Information Technology </option>
                                      <option value = "Law, Public Safety, Corrections and Security"> Law, Public Safety, Corrections and Security </option>
                                      <option value = "Manufacturing"> Manufacturing </option>
                                      <option value = "Marketing, Sales and Service"> Marketing, Sales and Service </option>
                                      <option value = "Science, Technology, Engineering and Math"> Science, Technology, Engineering and Math </option>
                                      <option value = "Transportation, Distribution and Logistics"> Transportation, Distribution and Logistics </option>
                                    </Form.Control>
                                    {this.state.industryArray.map(industry => (
                                                <Button className = {buttonClass} value = {industry} onClick = {this.removeTagIndustry}>
                                                {industry}
                                              </Button>))}
                                </Row>
                           </Col>
                           <Col md = {9} className = "course-col">
                           </Col>  
                        </Row>
                    </Container>
                    <Footer />
                </div>
            )
        }
        if(this.state.session === true && this.state.searchRan === true) {
            return (
                <div>
                   <TopNavbar />
                   <Container fluid>
                       <div className = "whole"> </div>
                        <Row className = "searchPage"> 
                           <Col md = {3} className = "search-col">
                               <Row>
                                  <div className = "searchBar">
                                    <input type = "text" className = "searchBarBar" value = {this.state.searchTerm || ''} onChange = {this.handleChangeSearch} />
                                    <Button className = "btn btn-primary submitButton" onClick = {this.searchFunction}> Submit </Button> 
                                  </div>
                               </Row>
                               <hr />
                               <div className = "search-options">
                                <Row className = "search-box subject-area">
                                <h2>Subject Area</h2>
                                    <Form.Control as="select" onChange = {this.handleChangeSubject} value = {this.state.subject || ''} multiple>
                                        <option value = "math">Math</option>
                                        <option value = "science">Science</option>
                                        <option value = "socialStudies">Social Studies</option>
                                        <option value = "languageArts">Language Arts</option>
                                        <option value = "careers">Careers</option>
                                        <option value = "technology">Technology</option>
                                    </Form.Control>
                                    {this.state.subjectArray.map(subject => (
                                                <Button className = {buttonClass} value = {subject} onClick = {this.removeTagSubject}>
                                                  {subject}
                                                </Button>))}
                                </Row>
                                <hr />
                                <Row className = "search-box grade-level">
                                    <h2> Grade Level </h2>
                                    <Form.Control as="select" onChange = {this.handleChangeGrade} value = {this.state.grade || ''} multiple>
                                        <option value = "pre-k">Pre-K</option>
                                        <option value = "k">K</option>
                                        <option value = "first">1st</option>
                                        <option value = "second">2nd</option>
                                        <option value = "third">3rd</option>
                                        <option value = "fourth">4th</option>
                                        <option value = "fifth">5th</option>
                                        <option value = "sixth">6th</option>
                                        <option value = "seventh">7th</option>
                                        <option value = "eighth">8th</option>
                                        <option value = "ninth">9th</option>
                                        <option value = "tenth">10th</option>
                                        <option value = "eleventh">11th</option>
                                        <option value = "twelveth">12th</option>
                                    </Form.Control>
                                    {this.state.gradeArray.map(grades => (
                                                <Button className = {buttonClass} value = {grades} onClick = {this.removeTagGrade}>
                                                {grades}
                                              </Button>))}
                                </Row>
                                <hr />
                                <Row className = "search-box industry">
                                    <h2> Industry </h2>
                                    <Form.Control as="select" onChange = {this.handleChangeIndustry} value = {this.state.industry || ''} multiple>
                                      <option value = "Agriculture, Food and Natural Resources"> Agriculture, Food and Natural Resources </option>
                                      <option value = "Architecture and Construction"> Architecture and Construction </option>
                                      <option value = "Arts, Audio/Video Technology and Communications"> Arts, Audio/Video Technology and Communications </option>
                                      <option value = "Business Management and Administration" > Business Managment and Administration </option>
                                      <option value = "Education and Training"> Education and Training </option>
                                      <option value = "Finance"> Finance </option>
                                      <option value = "Government and Public Administration"> Government and Public Administration </option>
                                      <option value = "Health Science"> Health Science </option>
                                      <option value = "Information Technology"> Information Technology </option>
                                      <option value = "Law, Public Safety, Corrections and Security"> Law, Public Safety, Corrections and Security </option>
                                      <option value = "Manufacturing"> Manufacturing </option>
                                      <option value = "Marketing, Sales and Service"> Marketing, Sales and Service </option>
                                      <option value = "Science, Technology, Engineering and Math"> Science, Technology, Engineering and Math </option>
                                      <option value = "Transportation, Distribution and Logistics"> Transportation, Distribution and Logistics </option>
                                    </Form.Control>
                                    {this.state.industryArray.map(industry => (
                                                <Button className = {buttonClass} value = {industry} onClick = {this.removeTagIndustry}>
                                                {industry}
                                              </Button>))}
                                </Row>
                                </div>
                           </Col>
                           <Col md = {9} className = "course-col">
                               <Row className = "top-row-course">
                                    <Button className = "btn-primary export-btn" onClick = {this.exportFunction} value = {this.state.exportFileType || ''}> Export </Button>
                               </Row>
                                <br />
                                <Row className = "course-box-search">
                                   <Col>
                                        <Row>
                                            <Col>
                                            <h2> Found Lessons </h2>
                                                {this.state.foundFolders.map(folders => (
                                                <div className = "file-box-search" key={folders}>
                                                <img className = "lesson-pic" src = {"./img/" + folders.imgsrc} ></img>
                                                <input type = "checkbox" name = {folders.file} value = {folders.id} title = {folders.type} onChange = {this.handleChangeCheckFile}></input><h2 className = ""> <a href = {folders.click}> {folders.file} </a> </h2>
                                                <p> {folders.description} </p>
                                                <Container>
                                                  <Row>
                                                    <h2> Contains: </h2>
                                                  </Row>
                                                    <Row>
                                                      <ul>
                                                        <li>{folders.contains.contains1}</li>
                                                        <li>{folders.contains.contains2}</li>
                                                        <li>{folders.contains.contains3}</li>
                                                      </ul>
                                                    </Row>
                                                    <Row> {folders.id} </Row>
                                                  </Container>

                                                </div>))}
                                            </Col>
                                        </Row>
                                        <hr />
                                        <Row>
                                            <Col>
                                            <h2> Found Files </h2>
                                                {this.state.foundFiles.map(files => (
                                                <div className = "file-box-search" key={files}>
                                                    <input type = "checkbox" name = {files.file} value = {files.id} title = {files.type} onChange = {this.handleChangeCheckFile}></input> <p className = ""> <a href = {files.click}> {files.file} </a> </p>
                                                    <p> {files.description} </p>
                                                    <Row>
                                                    </Row>
                                                    <Row>
                                                    <p><small>Doc id: {files.id}</small></p>
                                                    </Row>
                                                </div>
                                                ))}
                                            </Col>
                                        </Row>
                                   </Col>
                               </Row>
                               <Modal className = "export-modal" show={this.state.isOpen} onHide={this.closeModal}>
                                 {(this.state.exportresult == 'first') ? 
                                    <div>
                                    <Modal.Header className = "modal-top" closeButton>
                                      <Modal.Title>Export</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Header>Current File(s) selected: </Modal.Header>
                                    <Modal.Body> {this.state.fileName} </Modal.Body>
                                    <Modal.Header> <strong> Export to Google Classroom: </strong> </Modal.Header>
                                    <Modal.Body> <GoogleBtn/> </Modal.Body>
                                    <Modal.Body> <Button className = "btn btn-primary" onClick = {this.getFoldersClassroom}> Pick Course to Export To: </Button> </Modal.Body>
                                    <Modal.Body> Courses </Modal.Body>
                                    <Modal.Body>
                                    {this.state.newClassroomFolders.map(folders => (
                                      <div className = "file-box-search" key={folders}>
                                      <input type = "checkbox" name = {folders.file} value = {folders.id} onChange = {this.handleChangeSetParent}></input><h2 className = ""> <a href = {folders.click}> {folders.file} </a> </h2>
                                      <p> {folders.description} </p>
                                      </div>))}
                                    </Modal.Body>
                                    <Modal.Body>
                                      <Form onSubmit = {this.classroomExport}>
                                        <Button type = "submit" className = "btn btn-primary"> Export to Classroom </Button>
                                      </Form>
                                    </Modal.Body>
                                    <Modal.Body> {this.state.exportResult} </Modal.Body>
                                    <Modal.Header> <strong> Local Download: </strong> </Modal.Header>
                                    <Modal.Body> <Button onClick = {this.fileDownload} className = "btn-primary"> Download </Button> </Modal.Body>
                                    <Modal.Footer>
                                      <Button variant="secondary" onClick={this.closeModal}>
                                        Close
                                      </Button>
                                    </Modal.Footer>
                                    </div>
                                    :
                                    (this.state.exportresult === true) ?
                                    <div>
                                      <Modal.Header className = "modal-top" closeButton>
                                        <Modal.Title>Export</Modal.Title>
                                      </Modal.Header>
                                      <Modal.Body>
                                        File Transfer Complete!
                                      </Modal.Body>
                                      <Modal.Body>
                                        Check your Drive classroom folder to see the new files!
                                      </Modal.Body>
                                      <Modal.Footer>
                                      <Button variant="secondary" onClick={this.closeModal}>
                                        Close
                                      </Button>
                                      </Modal.Footer>
                                    </div>
                                    : (this.state.exportresult === false) ?
                                    <div>
                                      <Modal.Header className = "modal-top" closeButton>
                                        <Modal.Title>Export</Modal.Title>
                                      </Modal.Header>
                                      <Modal.Body>
                                        File Transfer was not able to complete.
                                      </Modal.Body>
                                      <Modal.Body>
                                        Try again, or report to admin if problem persists.
                                      </Modal.Body>
                                      <Modal.Footer>
                                      <Button variant="secondary" onClick={this.closeModal}>
                                        Close
                                      </Button>
                                      </Modal.Footer>
                                    </div>
                                    :
                                    <div>
                                    <Modal.Header className = "modal-top" closeButton>
                                      <Modal.Title>Export</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Header>Current File(s) selected: </Modal.Header>
                                    <Modal.Body> {this.state.fileName} </Modal.Body>
                                    <Modal.Header> <strong> Export to Google Classroom: </strong> </Modal.Header>
                                    <Modal.Body> <GoogleBtn/> </Modal.Body>
                                    <Modal.Body> <Button className = "btn btn-primary" onClick = {this.getFoldersClassroom}> Pick Course to Export To: </Button> </Modal.Body>
                                    <Modal.Body> Courses </Modal.Body>
                                    <Modal.Body>
                                    {this.state.newClassroomFolders.map(folders => (
                                      <div className = "file-box-search" key={folders}>
                                      <input type = "checkbox" name = {folders.file} value = {folders.id} onChange = {this.handleChangeSetParent}></input><h2 className = ""> <a href = {folders.click}> {folders.file} </a> </h2>
                                      <p> {folders.description} </p>
                                      </div>))}
                                    </Modal.Body>
                                    <Modal.Body>
                                      <Form onSubmit = {this.classroomExport}>
                                        <Button type = "submit" className = "btn btn-primary"> Export to Classroom </Button>
                                      </Form>
                                    </Modal.Body>
                                    <Modal.Body> {this.state.exportResult} </Modal.Body>
                                    <Modal.Header> <strong> Local Download: </strong> </Modal.Header>
                                    <Modal.Body> <a href = "https://connect.smartpathed.com/download"> <Button className = "btn-primary"> Download </Button> </a> </Modal.Body>
                                    <Modal.Footer>
                                      <Button variant="secondary" onClick={this.closeModal}>
                                        Close
                                      </Button>
                                    </Modal.Footer>
                                    </div>
                                    }
                                </Modal>
                           </Col>  
                        </Row>
                    </Container>
                    <Footer />
                </div>
            )
        }
        else {
            return (
                <div>
                    <TopNavbar />
                      <div className = "whole"> </div>
                        <Container>
                        <Row>
                          <div class = "limited-use">
                            <p> Think. Future. Workforce. Connect.'s' use of information received from Google APIs will adhere to the Google API Services User Data Policy, including the Limited Use requirements. </p>
                          </div>
                        </Row>
                        <Row>
                          <Col className = "front-title">
                            <h2> <strong> Welcome! </strong> </h2>
                          </Col>
                        </Row>
                        <Row>
                          <Col className = "front-image-container">
                          <img className = "front-image" src = "http://www.smartpathed.com/hosted/images/db/a51ca08e9d4eb0b53283d95f743cc4/shutterstock_565675849.jpg"></img>
                          </Col>
                        </Row>
                        <Row className = "front-descrip">
                          <Col>
                            <h2> With the Smart. Future. Workforce. Connect. app, you can transfer engaging and exciting smartpath lessons to your Google Drive.</h2>
                          </Col>
                        </Row>
                        <Row className = "front-descrip">
                          <Col>
                            <h2> <strong> Easily. </strong> </h2>
                          </Col>
                        </Row>
                        <Row className = "features-section">
                          <Col className = "feature text-center">
                            <h5> <strong> Search </strong> </h5>
                            <p> With our engaging and tag-based search system, you can find the lesson you need within seconds.</p>
                            <ul>
                              <li> Innovative Tag System </li>
                              <li> Find Lessons by Grade, Subject, or Industry </li>
                              <li> No pain of searching the whole drive manually! </li>
                            </ul>
                          </Col>
                          <Col className = "feature text-center">
                          <h5> <strong> Download </strong> </h5> 
                          <p> Download access to a wide range of courses. </p>
                          <ul>
                            <li> Quick Login Download </li>
                            <li> Choice of Export or Local Download! </li>
                            <li> Microsoft Word, Powerpoint, and Excel Supported </li>
                          </ul>
                          </Col>
                          <Col className = "feature text-center">
                          <h5> <strong> Export </strong> </h5>
                          <p> Once you have selected your course, and logged into your google account, we will:</p>
                          <ul>
                            <li> Find your Google Drive classroom folders, </li>
                            <li> You pick the one that you want to export to, </li>
                            <li> and we will write the file to your folder, making it easily accessible within Google Classroom! </li>
                          </ul>
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <p> <small> <strong> *If you have just logged in, please refresh the page. Otherwise, please login. </strong> </small> </p> <div type = "button"> <Link to = "/login"> Login </Link> </div>
                          </Col>
                        </Row>
                        </Container>
                        <Footer />                  
                </div>
            )
        }
    }
}

export default Search; 