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
            exportResult: '',
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
      if(event.target.checked === true) {
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
      this.setState({exportFileArray: newArray})
      console.log(newArray);
      }
      if(event.target.checked === false) {
        newArray = [];
      }
      console.log(newArray);
      //this.setState({exportFileArray: newArray})
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

    async classroomExport() {
      await fetch('/classroomexport', {
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

          if (driveFiles[i].properties.subject && driveFiles[i].properties.subject.length === 0) {
            driveFiles[i].properties.subject = ["none"]
          }

          if (driveFiles[i].properties.grade && driveFiles[i].properties.grade.length === 0) {
            driveFiles[i].properties.grade = ["none"]
          }

          if (driveFiles[i].properties.industry && driveFiles[i].properties.industry.length === 0) {
            driveFiles[i].properties.industry = ["none"]
          }
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

          if(driveFiles[i].file.includes(searchTerm) === true 
          && checker(driveFiles[i].properties.subject, subjectArray) === true 
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
                                                <img className = "lesson-pic" ></img>
                                                <input type = "checkbox" name = {folders.file} value = {folders.id} title = {folders.type} onChange = {this.handleChangeCheckFile}></input><h2 className = ""> <a href = {folders.click}> {folders.file} </a> </h2>
                                                <p> {folders.description} </p>
                                                <p> {folders.type} </p>
                                                { folders.children ? (
                                                <Container>
                                                  <Row>
                                                    <h2> Contains: </h2>
                                                  </Row>
                                                    <Row>
                                                      <ul>
                                                        <li>{folders.children[0]}</li>
                                                      </ul>
                                                    </Row>
                                                  </Container>
                                                  )
                                                  : (
                                                  <Row>
                                                  </Row>
                                                  )}

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