import React from 'react';
import * as moment from 'moment';
import {Picture} from './family.js';
import * as _ from 'lodash';
import { HashLink as Link } from 'react-router-hash-link';

export function News(props){
  
  return(
    <div className="news">
      {sortDates(props.family).map((d)=><DateItem item={d} key={d.id+"_"+d.date} />)}
    </div>
  )
}

function sortDates(family){
  var dates = [];

  for(let i of family){
    for(let j of i.dates){
      let sortDate = Number(moment(j.date).format("DDD"));

      if(sortDate < Number(moment().format("DDD"))-30)
         sortDate+=366;

      dates.push({
        displayDate: moment(j.date).format("MMMM D"),
        date: moment(j.date),
        sortDate: sortDate,
        description: j.description,
        name: i.name,
        id: i.id,
        imageId: i.imageId,
        blur: i.blur
      });
    }
  }
  return _.sortBy(dates, [(i)=>i.sortDate]); //return sorted list
}

function DateItem({item}){

   return(
      <div className={"news-item " + (item.blur ?"blur":"")}>
         <div className="columns is-mobile  is-vcentered">
            <div className="column is-narrow">
              <Picture id={item.id} imageId={item.imageId}/>
            </div>
            <div className="column">
              <div><strong>{item.displayDate}</strong></div>
              <div><Link to={"/Directory/#"+item.id}>{item.name}</Link></div>
              <div>
                {item.description} <strong>{moment().add(335, 'days').diff(item.date, 'years')}</strong>
                {item.description.toLowerCase().includes('married') 
                ? " years"
                : null }
              </div>
            </div>           
            
         </div>
      </div> 
   );
}