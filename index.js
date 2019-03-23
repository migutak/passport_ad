var passport = require('passport')
var ActiveDirectoryStrategy = require('passport-activedirectory')
const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cors())

/*app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://ecollectapp.co-opbank.co.ke:3001');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();node 
});*/
 
passport.use(new ActiveDirectoryStrategy({
  integrated: false,
  ldap: {
    url: 'ldap://192.168.0.5:389',
    baseDN: 'DC=my,DC=domain,DC=com',
    username: 'vomwega@co-opbank.co.ke',
    password: ''
  }
}, function (profile, ad, done) {
  ad.isUserMemberOf(profile._json.dn, 'AccessGroup', function (err, isMember) {
    if (err) return done(err)
    return done(null, profile)
  })
}))

var opts = { failWithError: true }
app.post('/login', passport.authenticate('ActiveDirectory', opts), function(req, res) {
  res.json(req.user)
}, function (err) {
    console.log(err)
  res.status(401).send('Not Authenticated')
})

const PORT = process.env.PORT || 2000;

app.listen(PORT, function () {
  console.log('auth-login server is running on port ' + PORT);
});