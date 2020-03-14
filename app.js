const express = require('express');
const path = require('path');
const hbs = require('express-handlebars');

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

app.get('/', (req, res) => {
    res.render('home', {
        siteTitle: 'Bishops First Blog',
        postList
    })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))