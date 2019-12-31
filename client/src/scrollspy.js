//scrollspy
import React, {useState, useEffect} from 'react';

export function ScrollSpy(props){
   var [children, setChildren] = useState(props.children);
   window.onscroll= scroll;
   
   useEffect(()=>scroll(),[]); //initialize scrollspy
   
   function scroll(){
      let idList = props.children.map(c=>c.props.id);
      let pos = window.scrollY;
      let id = getCurrentId(idList, pos);
      let active;
      let newChildren = [];
      for(let i of props.children){
         active = i.props.id===id;
         if(isAncestor(id, i.props.id) || isSibling(id, i.props.id) || isChild(id, i.props.id))
            newChildren.push(React.cloneElement(i, {active:active}));
      }
      setChildren(newChildren);

      //cleanup scroll listener on unmount
      return ()=>{
         window.onscroll=null;
      };
   };
   return(
      <div className="family-map">
         {children}
      </div>
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

//check if they have the same parent
function isSibling(id, current){
   return Math.floor(id/10)===Math.floor(current/10);
}

function isChild(id, current){
   return Math.floor(current/10)===id;
}

//find the currently scrolled-top item
function getCurrentId(list, pos){
   var tops = [];
   for(let i of list){
      if(document.getElementById(i))
         tops.push({
            id: i,
            top: document.getElementById(i).offsetTop
         });
   }

   tops.sort((i,j)=>i.pos-j.pos);

   for(let i of tops)
      if(i.top>=pos)
         return(i.id)
}