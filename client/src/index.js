//LittleFoot Library front-end

import ReactDOM from 'react-dom';
import React, {useState, useEffect} from 'react';
import {
  BrowserRouter as Router,
  Switch, Route, NavLink
} from "react-router-dom";

import {getFetch} from './utilities.js';
import {Directory} from './family.js';
import {News} from './news.js';
import {Stats} from './stats.js';
import {Sidebar} from './sidebar.js';
import './family.sass';

ReactDOM.render(<App />, document.getElementById('root'));

//main app component
export default function App(props){
  
  var [family, setFamily] = useState(null);
  var [term, setTerm] = useState('');
  var [searchResults, setSearchResults] = useState(null);
  var [title, setTitle] = useState(null);
  var [forceExpand, setForceExpand] = useState(true);

  function searchTerm(t){
    setSearchResults(search(t,family));
    setTerm(t);
  }

  useEffect(()=>{
    getFetch('/api/family')
    .then(fam=>{
      if(fam){
        setFamily(fam);
        setSearchResults(fam);
      }
    });
    getFetch('/api/name')
    .then(t=>{
      if(t){
        setTitle(t.title);
        document.title=t.title;
      } 
    });
  },[]);

  return(
    <Wrapper>
      <h1 className="title is-3 has-text-centered has-text-primary"><a href ="/">{title}</a></h1>
        <Router>
          <React.Fragment>
            <TabBar tabs = {["Directory", "News", "Stats"]} />
            <a href="/logout" className="logout"> Logout </a> 

            {searchResults ?
                <Switch>
                  <Route path="/directory">
                    <div className="directory-container">
                      <Sidebar search = {searchTerm} term={term} family={searchResults} expanded = {forceExpand} toggleExpand={()=>setForceExpand(!forceExpand)}/>
                      <Directory family={searchResults} forceExpand={forceExpand} setFamily={setFamily}/>
                    </div>
                  </Route>
                  <Route path="/news">
                    <News family={searchResults} />
                  </Route>
                  <Route path="/stats">
                    <Stats family={searchResults} />
                  </Route>
                </Switch>
            : <Loading /> }
          </React.Fragment>
        </Router>
    </Wrapper> 
  );
}

function TabBar(props){
  return(
    <div className="tabs is-centered">
      <ul>
        {props.tabs.map((t)=>
          <li key={t} className="">
            <NavLink to={"/"+t} activeClassName="is-active">{t}</NavLink>
          </li>
        )}
      </ul>
    </div>
  );
}
function Loading(props){
    return(<div className="is-loading"> Loading ... </div>);
  
}

function Wrapper(props){
  return(
    <div className="main">
      {props.children}
    </div>
  );
}



/**
 * sets blur: true on non-hit family members
 * @param {string} term 
 * @param {Array} family 
 */
function search(term, family){
  for(let i of family){
    if(!term){ //if the term is blank, just set everything to unblur
      i.blur = false;
      continue;
    }
    i.blur=true;
    for(let p in i){
      if(i[p].toString().toLowerCase().includes(term.toLowerCase())){ //not a deep search
        i.blur=false;
      }
      if(!i.blur) break;
    }
  }
  return family;
}