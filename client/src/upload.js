// upload.js
import React, {useState} from 'react';

export function Uploader(props) {
  var [dragover, setDragover]=useState("");
  var [uploading, setUploading]=useState("");

  function fileInputClick(e){
    e.preventDefault();
    setDragover(true);
    document.getElementById('fileInput').click();
  }

  function onInputFile(e){
    setDragover(false);
    addFiles(e.target.files);
  }

  function onDrop(e){
    e.preventDefault();
    onNotHover();
    var validFiles=[];

    if(e.dataTransfer.items)// Use DataTransferItemList interface to access the file(s)
      for (var i = 0; i < e.dataTransfer.items.length; i++) {
        if (e.dataTransfer.items[i].kind === 'file'){
          validFiles.push(e.dataTransfer.items[i].getAsFile());
        }
    }
    else{ // Use DataTransfer interface to access the file(s)
      for (i = 0; i < e.dataTransfer.files.length; i++){
        validFiles.push(e.dataTransfer.files[i]);
      }
    }
    if(validFiles.length){
      addFiles(validFiles);
    }
  }

  function addFiles(newFiles){
    var goodFiles = [];

    for (let i of newFiles) { //check if PDF
      if( i.type==="image/jpeg" ){
        goodFiles.push(i);
        setUploading(true);  
      }
      else setDragover('flash-red'); //flash error indication
    }
    //add to formdata object
    if(!goodFiles.length) return;

    var uploadData = new FormData();

    for(let f of goodFiles)
      uploadData.append('file', f);

    //create XHR object
    let xhr = new XMLHttpRequest(),
      method = 'POST',
      url = '/api/image/'+props.id+"/"+(props.imageId+1);

    xhr.open(method, url, true);

    xhr.onload= function(e){
      setUploading(false);
      props.onChange(props.imageId+1);
    }
    xhr.send(uploadData);
  }

  function onHover(e){
    e.preventDefault();
    setDragover('dragover');
  }
  function onNotHover(){
    setDragover('');
  }

  return(
    <div className={"fileDrop "+dragover} onDragOver={onHover} onDrop={onDrop} onDragLeave={onNotHover} >
      <input id="fileInput" type="file" className="hidden" onChange={onInputFile}/>
      <div className="uploadbox" onClick={fileInputClick} > 
        {uploading 
        ? <i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
        : <i className={"fa fa-upload"} /> 
        }
        {props.children}
      </div>
    </div>
  );
}
