//edit.js
import React, {useState} from 'react';
import * as moment from 'moment';
import {postFetch} from './utilities.js';
import {Uploader} from './upload.js';

export function EditWindow({person, edit}){
  if(!person) return null;
  var [p, setPerson] = useState(person);

  function close(){
    edit(null);
  }


  function setValue(e){
    let label = e.target.label || e.target.getAttribute('label');
    let value = e.target.value;
    p[label]=value;
    setPerson({...p});
  }
  function save(){
     console.log(p);
     edit(p);
     postFetch('/api/person', p);
     close();
  }

  return(
    <div className="modal is-active">
      <div className="modal-background" onClick={close}></div>
      <div className="modal-content">
        <section className="edit">
            <div className="edit-body">
               <div className="columns is-vcentered is-mobile">
                  <div className="column is-narrow">
                     <EditPicture id={p.id} name={p.name} imageId={p.imageId} onChange={setValue}/>
                  </div>
                  <div className="column">
                     <Input label="id" value={p.id} onChange={setValue} disabled={true}/>
                     <Input label="name" value={p.name} onChange={setValue} />
                     <Input label="location" value={p.location} onChange={setValue} />
                  </div>
               </div>

               <EditDates dates = {p.dates} onChange={setValue} />       

               <EditContact contacts = {p.emails} onChange={setValue}/>

               <div className="buttons is-right padded">
                  <button className="button is-primary" onClick={save}>Save</button>
                  <button className="button " onClick={close}>Discard</button>
               </div>
            </div>
        </section>
      <button className="modal-close is-large" aria-label="close" onClick={close}></button>
      </div>
    </div>
  )
}

function Input({label, value, onChange, disabled}){
  return(
    <div className="field is-horizontal">
      <div className="field-label is-normal">
        <label className="label">{label}</label>
      </div>
      <div className="field-body">
        <div className="field">
          <p className="control">
            <input className="input is-small" type="text" label = {label} placeholder={label} value={value} onChange={onChange} disabled={disabled ? "disabled":""}/>
          </p>
        </div>
      </div>
    </div>
  )
}

function EditDates({dates, onChange}){
   
   function update({name, id, value}){
      if (value===null && name===null)
         dates.splice(id,1); //remove deleted item
      else
         dates[id][name] = value;

      onChange({target: {label: "dates", value: [...dates]}});
   }
   function add(){
      if(!dates) dates = [];
      dates.push({description:'', date:''});
      update({id:dates.length-1, name:"description", value:""})
   }
   return(
    <div className="list-editor">
       
      <div className="list-title">
         <strong>Dates</strong>
      </div>

      <div className="list-items">
         {dates && dates.length ?
            dates.map((d,i)=><DateInput date={d.date} description={d.description} onChange={update} id={i} key={"date"+i}/>)
         : null}
         <div className="buttons is-left">
            <button className="button is-small is-success" onClick={add}><i className="fa fa-plus"></i></button>
         </div>
      </div>
    </div>
   )
}
function DateInput({description, date, id, onChange}){

   function update(e){
      onChange({
         id: id,
         name: e.target.name,
         value: e.target.value
      });
   }
   function remove(){
      onChange({
         id:id,
         name:null,
         value: null
      });
   }

   return(
      <div className='person-date field is-horizontal'> 
         <div className="field-body">
            <div className="field">
               <p className="control has-icons-left">
                  <input className="input is-small" value={description} name="description" placeholder="description"onChange={update}> 
                  </input>
                  <span className="icon is-small is-left">
                     <i className="fa fa-info"></i>
                  </span>
               </p>
            </div>
            <div className="field">
               <p className="control has-icons-left">
                  <input className="input is-small" value={moment(date).format("YYYY-MM-DD")} name="date" type="date" onChange={update}></input>
                  <span className="icon is-small is-left">
                     <i className="fas fa-calendar"></i>
                  </span>
               </p>
            </div>
            <div className="field">
               <p className="control ">
                  <button className="button is-small" onClick={remove}><i className="fa fa-trash"></i></button>
               </p>
            </div>
         </div>
      </div>
   )
}
function EditPicture(props){
   var [img, setImg] = useState("/images/"+props.id+"_"+props.imageId+".jpg");
   function reload(imageId){
      setImg("/images/"+props.id+"_"+imageId+".jpg");
      props.onChange({target:{
         label: 'imageId',
         value: imageId
      }});
   }

   return(
      <Uploader id={props.id} imageId={props.imageId} onChange={reload}>
         <div className="edit-image"> 
            <img src={img} alt={props.name}/> 
         </div>
      </Uploader>
   )
}

function EditContact({contacts,  onChange}){
   function update({id, contact}){
      if (contact===null)
         contacts.splice(id,1); //remove deleted item
      else
         contacts[id]=contact; //set updated data
      onChange({target:{
         label: "emails",
         value: contacts
      }});
   }
   function add() {
      if(!contacts) contacts = [];
      update({id: contacts.length, contact: ""});
   }
   
   return(
    <div className="list-editor">
      <div className="list-title">
         <strong>Contact Info</strong>
      </div>

      <div className="list-items">
         {contacts && contacts.length ? 
            contacts.map((c,i)=><ContactInput contact={c} id={i} onChange={update} key={"contact"+i}/>)
         : null}
         <div className="buttons is-left">
            <button className="button is-small is-success" onClick={add}><i className="fa fa-plus"></i></button>
         </div>
      </div>
    </div>
   )
}
function ContactInput({contact, id, onChange}){
   function update(e){
      onChange({
         id: id,
         contact: e.target.value,
      });
   }
   function remove(){
      onChange({
         id:id,
         contact:null
      });
   }
   return(
      <div className='field'> 
         <div className="field-body">
            <div className="field">
               <p className="control has-icons-left">
                  <input className="input is-small" type="email" value={contact} placeholder="email" onChange={update}>
                  </input>
                  <span className="icon is-small is-left">
                     <i className="fa fa-envelope"></i>
                  </span>
               </p>
            </div>
            <div className="field">
               <p className="control ">
                  <button className="button is-small" onClick={remove}><i className="fa fa-trash"></i></button>
               </p>
            </div>
         </div>
      </div>
   )
}