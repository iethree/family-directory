//db.js

//config file
const yaml = require('js-yaml');
const fs   = require('fs');
const log  = require('logchalk');
var config = yaml.safeLoad(fs.readFileSync('./data/config.yaml', 'utf8'));

//family db
const nedb = require('nedb');
const db = new nedb({filename: './data/family.db', autoload: true});

module.exports= {getFamily, writePerson, getFamilyName, checkUser, canEdit};

async function getFamily(){
   return find({});
}

async function writePerson(newPerson){
   return update(newPerson);
}

async function getFamilyName(){
   return Promise.resolve(config.name);
}
/**
 * promisified nedb query function
 * @param {object} query 
 */
function find(query){
   return new Promise((resolve, reject)=>{
      db.find(query, (err, docs)=>{
         if(err || !docs || !docs.length)
            reject(err || "no results");
         else
            resolve(sort(docs));
      });
   });
}
/**
 * promisified nedb update function
 * @param {object} doc 
 */
function update(doc){
   return new Promise((resolve, reject)=>{
      db.update({id:doc.id}, doc, {upsert: true}, (err, update)=>{
         if(err || !update )
            reject(err || "update error for id: "+doc.id);
         else
            resolve(update);
      });
   });
}

/**
 * sort family members in string order
 * @param {array} family 
 */
function sort(family){
   return family.sort((i,j)=>{
      if(String(i.id)<String(j.id))
         return -1;
      else
         return 1;
   });
}

/**
 * checks if given editor can edit user info for given editee
 */
function canEdit(editor, editee){
   return isAncestor(editee, editor);
}

function isAncestor(id, current){
   while(id>0){
      if(current===id) return true;
      id=Math.floor(id/10);
   }
   return false;
}

/**
 * checks user validity and returns authorization level in a resolved promise
 * @param {string} email user email to check
 */
async function checkUser(email){
   if(config.admins && config.admins.length) //check if admin first
      for(let e of config.admins)
         if(isSameEmail(e, email))
            return Promise.resolve(1);

	var all = await find({}); //check users
   for(let i of all)
      if(i.emails && i.emails.length)
         for(let e of i.emails)
            if(isSameEmail(e, email))
               return Promise.resolve(i.id);

   //for demo purposes let anyone in 
   return Promise.resolve(1);
}

//check if lower case, dotless emails are the same
function isSameEmail(a,b){
   a = a.toLowerCase().replace(/\./g,'');
   b = b.toLowerCase().replace(/\./g,'');
   return (b===a);
}

function loadJSON(file){
   let data = JSON.parse(fs.readFileSync(file));
   data = sort(data);
   for(i of data){
      update(i).catch(log.err);
   }
}
//loadJSON('./data/newdata.json');