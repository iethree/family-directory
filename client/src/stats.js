//stats.js

import React from 'react';

export function Stats({family}){
   var counts = countFamily(family);
   var total = counts.reduce((a,b)=>a+b);
   return(
      <div className="stats">
         <dl className="dl-horizontal">
            {counts.map(((g,i)=>g>0?<React.Fragment key={"gen_"+i}><dt>Generation {i+1} </dt> <dd> {g} </dd> </React.Fragment>:null))}
            <dt>Total</dt><dd>{total}</dd>
         </dl>
      </div>
   )
}

function countFamily(family){
   var stats = [0,0,0,0,0];
   for(let i of family){
      if(isMarried(i))
         stats[getGen(i.id)]+=2;
      else
         stats[getGen(i.id)]+=1;
   }
   return stats;
}

function getGen(id){
   return String(id).length-1;
}

function isMarried(p){
   if(p.dates && p.dates.length)
      for(let d of p.dates){
         let desc = d.description.toLowerCase();
         if (desc.includes('married') 
            || desc.includes('anniversary')
            || desc.includes('wedding'))
            return true;
      }
   return false;
}