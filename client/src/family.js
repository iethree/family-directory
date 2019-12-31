//Inputs
import React, {useState} from 'react';
import * as moment from 'moment';
import {EditWindow} from './edit.js';

const UID = Number(getCookie('level'));

export function Directory(props){
  var family = countChildren(props.family);
  var [person, setPerson] = useState(null);

  function edit(p){
    if(p===null)
      setPerson(null);
    else{
      let idx=family.findIndex(el=>el.id===p.id);
      if(idx===-1)
        window.location.reload();
      else{
        family[idx]=p;
        props.setFamily(family);
      }
    }
  }

  return(
    <div className="directory">
      { family.map(member=> <Person person={member} key={member.id} forceExpand = {props.forceExpand} edit={setPerson}/> ) }
      <EditWindow person={person} edit={edit}/>
    </div>
  );
}

function Person({person, forceExpand, edit, nextChild}){
  var [expanded, setExpanded] = useState(forceExpand);
  var [cache, setCache] = useState(forceExpand);

  //check whether force value has changed
  if(forceExpand !== cache){
    setExpanded(forceExpand);
    setCache(forceExpand);
  }

  var toggleExpanded = ()=>{
    setExpanded(!expanded);    
  };
  function newChild(){
    let newChild = {
      id: Number(person.id+String(person.childCount[0]+1)), 
      imageId: 0, name:"", location:"", dates:[]};
    edit(newChild);
  }

  return(
    <section className={"person " + generation(person.id) + (person.blur ? " blur": "") } id={person.id}>
      <div className="person-title" onClick={toggleExpanded}>
        <span>
          <Expander expanded={expanded} /> &nbsp;
          {person.name}
        </span>
        <ChildCount childCount = {person.childCount} />
      </div>
      {expanded ?
        <div className="person-body">
          <Picture id={person.id} name={person.name} imageId={person.imageId}/>
          <div className="person-details">
            <Location location={person.location} />
            <div className="person-dates">
              {person.dates.map(d=><Date date={d} key={d.date}/>)}
            </div>            
            
            <Contact emails = {person.emails} />
          </div>
          {isAncestor(person.id, UID) ?
          <div className="buttons is-right padded">
            <button className="button is-small editButton" onClick={()=>edit(person)}><i className="fa fa-user-edit"></i></button>
            <button className="button is-small editButton" onClick={newChild}><i className="fa fa-user-plus"></i></button>
          </div>
          : null}
          
        </div>
      : null }
    </section>
  );
}

// determine if an id is in the ancestral lineage of current (includes current)
function isAncestor(id, current){
   while(id>0){
      if(current===id) return true;
      id=Math.floor(id/10);
   }
   return false;
}

function Expander({expanded}){
  if(expanded)
    return <i className="fa fa-caret-down"></i> ;
  else
    return <i className="fa fa-caret-right"></i> ;
}

function countChildren(family){
  for(let i in family){

    let c=0, gc=0, ggc=0;
    let pid = family[i].id;

    for(let s = Number(i)+1; s<family.length; s++){

      let cid = family[s].id;
      if(Math.floor(cid/10)===pid)       c++; //children
      else if(Math.floor(cid/100)===pid)  gc++ //grandchildren
      else if(Math.floor(cid/1000)===pid) ggc++; //great grandchildren

    }
    family[i].childCount = [c, gc, ggc];
  }
  return family;
}
function generation(id){
  if(id===1)
    return "gen-0";
  if(id<19)
    return "gen-1";
  if(id<199)
    return "gen-2";
  if(id<1999)
    return "gen-3";
  if(id<1999)
    return "gen-4";
}



function Location (props){
  if(!props.location)
    return null;
  return(
    <div className="person-location">
      <i title="Current Location" className="fa fa-map-marker-alt"></i> &nbsp;
      <a href={"https://google.com/maps/search/"+props.location}>
        {props.location}
      </a>
    </div>
  );
}
export function Picture(props){
  return(
    <div className="person-image"> 
      <img src={`/images/${props.id}_${props.imageId ||'0'}.jpg`} alt={props.name}/> 
    </div>
  );
}

function Contact(props){
  if(!props.emails || !props.emails.length )
    return null;
  return(
    <div className="person-contact">
      {props.emails.map(e=><p className='person-email' key={e}><i className="fa fa-envelope"></i><a href={'mailto:'+e}> {e} </a></p>)}
    </div>
  );
}

function ChildCount(props){
  if(!props.childCount) return null;

  var baby = <i className='fa fa-baby'></i>;
  return(
    <span className="child-count">
      {props.childCount[0] ? 
        <span title='children'><strong>{baby} {props.childCount[0]} </strong></span> 
        : null}
      {props.childCount[1] ? 
        <span title='grandchildren'><strong>{baby}{baby} {props.childCount[1]} </strong></span> 
        : null}
      {props.childCount[2] ? 
        <span title='great grandchildren'><strong>{baby}{baby}{baby}  {props.childCount[2]} </strong></span> 
        : null}
    </span>
  );
}

function Date(props){
  if(!props || !props.date || !props.date.description || !props.date.date)
    return null;

  return(
    <div className='person-date'> 
      {getDescription(props.date.description)} {formatDate(props.date.date)}
    </div>
  );
}

//gets icon for description
function getDescription(d){
  let l = d.toLowerCase();
  if(l.includes("birthday") || l.includes("bday") || l.includes("born") )
    return <i title={d} className='fa fa-birthday-cake'></i>;
  if(l.includes("married") || l.includes("wedding") || l.includes("anniversary"))
    return <i title={d} className='fas fa-ring'></i>;
}


function formatDate(dt){
  dt = moment(dt);

  var length = moment().diff(dt, 'months');

  //only show decimal for less than 3 years out
  if(length<36)
    length = round1(length/12);
  else
    length = round0(length/12);

  return `${dt.format("M/D/YYYY")} (${length})`;
}

function round0(num){
  return Math.floor(num);
}
function round1(num){
  return(Math.floor(num*10)/10);
}

function getCookie(name){
    var val = document.cookie.match('(^|[^;]+)\\s*' + name + '\\s*=\\s*([^;]+)');
    return val ? val.pop() : '';
}
