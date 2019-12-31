import React from 'react';
import {ScrollSpy} from './scrollspy.js';

export function Sidebar(props){

  return(
    <aside className="navbar">
      <SearchBox onChange={props.search} term={props.term}/>
      <ExpandButton expanded={props.expanded} toggleExpand={props.toggleExpand}/>
      <ScrollSpy items={ props.family.map(m=>m.id.toString()) } currentClassName="active" >
        {props.family.map(m=><NavItem name={m.name} id={m.id} key={m.id}/>)}
      </ScrollSpy>
    </aside>
  );
}
function ExpandButton(props){
  var expandIcon = <i className="fa fa-expand-arrows-alt"></i>;
  var collapseIcon = <i className="fa fa-compress-arrows-alt"></i>;
  return(
    <React.Fragment>
    {props.expanded 
      ? <button title="collapse all" className="button is-small is-fullwidth" onClick={props.toggleExpand}> {collapseIcon} &nbsp; Collapse All</button>
      : <button title="expand all" className="button is-small is-fullwidth" onClick={props.toggleExpand}> {expandIcon} &nbsp;Expand All </button>
    } 
    </React.Fragment>
  );
}
function SearchBox(props){
  return(
    <input className="searchbox input is-small" type="search" placeholder="search" value={props.term} onChange={(e)=>props.onChange(e.target.value)}></input>
  );
}

function NavItem(props){
  let gen=0;
  
  for(let cnt=props.id; cnt>9; cnt=cnt/10)
    gen++;

  return(
    <div className={(props.active ? "active" : "") + " gen-"+gen}><a href={'#'+props.id}> {props.name}</a></div>
  )
}