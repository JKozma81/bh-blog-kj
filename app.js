const express = require('express');
const path = require('path');
const hbs = require('express-handlebars');
const cookieParser = require('cookie-parser');

const users = [
    {
        username: 'admin',
        password: 'admin'
    }
];

const LoginController = require('./controllers/LoginController');
const AdminController = require('./controllers/AdminController');
const SessionController = require('./controllers/SessionController');
const CookieController = require('./controllers/CookieController');
const Authentication = require('./middlewares/Authentication');

const adminContreller = new AdminController();
const sessionCotroller = new SessionController();
const cookieController = new CookieController();
const loginCotroller = new LoginController(users, sessionCotroller, cookieController);
const authMiddleware = new Authentication(users, sessionCotroller, cookieController)

const app = express();
const port = 3000

const postList = [
    {
        author: 'John Doe',
        date: '2020.03.14',
        title: 'First Post',
        text: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eaque, ea! Animi, et. Magni dolorem esse recusandae architecto deserunt. Consectetur tempore soluta ex sunt suscipit deserunt reprehenderit minus nihil, commodi quae.'
    },
    {
        author: 'John Davis',
        date: '2020.03.12',
        title: 'Second Post',
        text: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eaque, ea! Animi, et. Magni dolorem esse recusandae architecto deserunt. Consectetur tempore soluta ex sunt suscipit deserunt reprehenderit minus nihil, commodi quae.'
    },
    {
        author: 'Jimmy Doe',
        date: '2020.03.10',
        title: 'Lorem Post',
        text: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eaque, ea! Animi, et. Magni dolorem esse recusandae architecto deserunt. Consectetur tempore soluta ex sunt suscipit deserunt reprehenderit minus nihil, commodi quae.'
    },
    {
        author: 'John Doe',
        date: '2020.03.14',
        title: 'First Post',
        text: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eaque, ea! Animi, et. Magni dolorem esse recusandae architecto deserunt. Consectetur tempore soluta ex sunt suscipit deserunt reprehenderit minus nihil, commodi quae.'
    },
    {
        author: 'John Doe',
        date: '2020.03.14',
        title: 'First Post',
        text: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eaque, ea! Animi, et. Magni dolorem esse recusandae architecto deserunt. Consectetur tempore soluta ex sunt suscipit deserunt reprehenderit minus nihil, commodi quae.'
    }
]


app.engine('handlebars', hbs());
app.set('view engine', 'handlebars');
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());



app.get('/', (req, res) => {
    res.render('home', {
        siteTitle: 'Bishops First Blog',
        postList
    })
})

app.get('/login', loginCotroller.get);
app.post('/login', loginCotroller.post.bind(loginCotroller), loginCotroller.logUserIn.bind(loginCotroller));
app.get('/logout', loginCotroller.logUserOut.bind(loginCotroller))
app.get('/admin', authMiddleware.authenticate.bind(authMiddleware), adminContreller.get);


app.listen(port, () => console.log(`Example app listening on port ${port}!`))