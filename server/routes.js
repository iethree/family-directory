const express = require('express');
const router = express.Router();
const log = require('logchalk');
const path = require('path');
const db = require('./db.js');
const fs = require('fs');
const yaml = require('js-yaml');
const settings = yaml.safeLoad(fs.readFileSync('./data/config.yaml', 'utf8'));

const multer = require('multer');
const upload = multer({
	dest: path.join(__dirname, 'temp')
});
const auth = require('stateless-email-auth');

auth.config({
   checkUser: db.checkUser,
   mailServer: settings.mail.server,  //required
   mailUser: settings.mail.username,  //required
	mailSender: settings.mail.sender,
   mailPassword: settings.mail.password,  //required
   tokenUrl: settings.url+'/auth/',  //required, full url to insert into email with generated token
   successPage: "/Directory", //required, path to redirect successful authentication
   failPage: "/login", //required, path to redirect failed authentication
   cryptoKey: settings.mail.cryptokey, //required, will throw an error if you leave default key,
   mailServerPort: settings.mail.port, //optional, defaults to 587
   mailServerSecurity: false, //optional, defaults to false
   mailSubject: settings.name+" Email Login", //optional
   tokenExpiration: settings.mail.tokenExpiration, //optional, defaults to 5
   JWTexpiration: '14d', //optional
});

//login
router.get('/login', (req, res)=>{
	res.sendFile(path.join(__dirname, 'public/login.html'));
});
router.get('/auth/:token', auth.mw.checkToken);

router.post('/login', (req, res, next)=>{
	//send verification email
	auth.sendToken(req.body.email)
	.catch(err=>log.err(err, "at", req.ip))
	.then(log.info);
	res.redirect('/login?submit=Check your email for a login link.')
});

router.get('/logout', auth.mw.logout);

//secure routes with JWT middleware
router.use(['/', '/Directory', '/News', '/Stats', '/api/*'], auth.mw.checkJWT);

//react app
router.get('/', (req, res)=>{
	res.redirect('/Directory');
});
router.get(['/Directory', '/News', '/Stats'], (req, res)=>{
	res.cookie('level', req.level);
	res.sendFile(path.join(__dirname, 'public/react.html'));
});


router.get('/api/family', async (req, res, next)=>{
	res.send(await db.getFamily());
});


router.get('/api/name', async (req, res, next)=>{
	res.send({title: await db.getFamilyName()});
});

//create or update person record
router.post('/api/person', (req, res, next)=>{
	if(db.canEdit(req.level, req.body.id)) //check if this user has proper permissions
		db.writePerson(req.body)
		.then(r=>res.sendStatus(204))
		.catch(log.err);
	else{
		log.err(req.user, "cannot edit", req.body.id);
		res.sendStatus(401);
	}
});

//upload file
router.post('/api/image/:id/:version', upload.single('file'), (req, res, next)=>{
	let filename = path.join(__dirname,`data/pics/${req.params.id}_${req.params.version||'0'}.jpg`);
	
	//save new file
	fs.rename(req.file.path, filename, (err)=>{
		if(!err)
			res.send(req.params.version).status(200);
		else
			res.sendStatus(400);
	});
});

router.get('/images/:id', (req, res, next)=>{
	fs.readFile(path.join(__dirname, 'data/pics',req.params.id), (err, data)=>{
		if(err || !data)
			res.sendFile(path.join(__dirname,'data/pics/placeholder.jpg')); //send placeholder if no image found
		else
			res.send(data);
	});
});


//redirect non-existent to home page
router.get('*', (req, res, next)=>{
	res.status(301).redirect('/');
});

module.exports = router;
