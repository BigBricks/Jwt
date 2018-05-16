const jwt = require('jsonwebtoken');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const User = require('../users/User');
const secret = 'flooooooooooooooooooooooooooooooooooooooooo';

const local = new LocalStrategy(function(username, password, done){
    User.findOne({ username })
    .then(user => {
        if(!user) {
            done(null, false);
        } else{
            user
                .validation(password)
                .then(valid => {
                    if (valid) {
                        const {_id, username} = user;
                        return done(null, {_id, username});
                    } else {
                        return done(null, false);
                    }
                })
                .catch(err => {
                    return done(err);
                });
        }
    })
    .catch(err => {
        return done(err);
    });
});

const jwtOpt = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secret,
};

const globo = new JwtStrategy(jwtOpt, function(payload, done){
    User.findById(payload.sub)
        .then(user => {
            if (user) {
                done(null, user);
            } else done(null, false);
        })
        .catch(err => {
            done(err);
        });
});

passport.use(local);
passport.use(globo);

const passOpt = {session: false};
const auth = passport.authenticate('local', passOpt);
const prot = passport.authenticate('jwt', passOpt);

function tokenForPrez(user) {
const timestamp = new Date().getTime();
const payload = {
    sub: user._id,
    iat: timestamp,
    username: user.username,
};
const options = {
    expiresIn: '12h',
};

return jwt.sign(payload, secret, options);
}

module.exports = function(server) {
    server.get('/', function(req, res) {
        res.send({api: 'is your fridge running?'});
    });
    server.post('/register', function(req, res) {
        const user = new User(req.body);
        user.save()
        .then(user => {
            const token = tokenForPrez(user);
            res.status(201).json({ user, token});
        })
        .catch(err => res.status(500).json(err));
    });
    server.post('/login', auth, (req, res) => {
        res.status(200).json({token: tokenForPrez(req.user), user: req.user});
    });
    server.get('/users', prot, (req, res) => {
        User.find()
        .select('username')
        .then(users => res.json(users))
        .catch(err => {
            return done(err);
        });
    });
};