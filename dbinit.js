const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./model/blog.db");
db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS
            posts(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                author VARCHAR(100) NOT NULL,
                title VARCHAR(100) NOT NULL,
                content TEXT NOT NULL,
                created_at TEXT NOT NULL,
                slug VARCHAR(100) NOT NULL,
                published_at VARCHAR(100),
                modified_at VARCHAR(100),
                draft INTEGER NOT NULL
                )`
  );

  db.run(`
        INSERT
        INTO
        posts(title, author, content, created_at, slug, draft, published_at, modified_at)
        VALUES("Build a Simple Chat App with Node.js and Socket.io",
            "Paolo",
            '
            {"ops":[{"insert":"While working with React.js, chances are you’ve faced a problem with how to access "},{"attributes":{"background":"rgba(0, 0, 0, 0.05)","code":true},"insert":"this"},{"insert":" from inside the promise. For example, as exhibited in the code below, one of the problems could be "},{"attributes":{"background":"rgba(0, 0, 0, 0.05)","code":true},"insert":"this"},{"insert":" is resolving inside the promise as "},{"attributes":{"background":"rgba(0, 0, 0, 0.05)","code":true},"insert":"undefined"},{"insert":":\nclass Component extends React.Component { "},{"attributes":{"code-block":true},"insert":"\n"},{"insert":" componentDidMount() {"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":" axios.get(‘http://…’).then(function(data) {"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":" this.setState( { name: data.blah } );"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":" });"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":" }"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":"}"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":"There’s more than one solution to determine this reference inside the promise. The earlier approach would be setting the "},{"attributes":{"background":"rgba(0, 0, 0, 0.05)","code":true},"insert":"self = this"},{"insert":" reference. While this would work, the recommended solution, which is more incline with ES6, would be to use an arrow function here:\nclass Component extends React.Component { "},{"attributes":{"code-block":true},"insert":"\n"},{"insert":" componentDidMount() {"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":" let component = this;"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":" axios.get(‘http://…’).then(function(data) {"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":" component.setState( { name: data.blah } );"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":" });"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":" }"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":"}"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":"The arrow syntax, as described above, is a much reliable way to allow a user of "},{"attributes":{"background":"rgba(0, 0, 0, 0.05)","code":true},"insert":"this"},{"insert":" to make reference to "},{"attributes":{"background":"rgba(0, 0, 0, 0.05)","code":true},"insert":"React.Component"},{"insert":" classes, as we can analyze below:\nclass Component extends React.Component { "},{"attributes":{"code-block":true},"insert":"\n"},{"insert":" componentDidMount() {"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":" axios.get(‘http://…’).then(data => {"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":" this.setState( { name: data.blah } );"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":" });"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":" }"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":"}"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":"Kindly note that instead of using "},{"attributes":{"background":"rgba(0, 0, 0, 0.05)","code":true},"insert":"function(data) { //body }"},{"insert":", we used "},{"attributes":{"background":"rgba(0, 0, 0, 0.05)","code":true},"insert":"data => { //body }"},{"insert":", and in this cases, "},{"attributes":{"background":"rgba(0, 0, 0, 0.05)","code":true},"insert":"this"},{"insert":" reference won’t get the promise instance back.\n"}]}
            ',
            "2020-03-22 11:55:43",
            "build-a-simple-chat-app",
            0,
            "2020-04-09 10:15:45",
            "2020-04-09 10:10:45"
    )
    `);

  db.run(`
        INSERT
        INTO
        posts(title, author, content, created_at, slug, draft, published_at, modified_at)
        VALUES("React Data Fetching",
            "Justin",
            '
            {"ops":[{"insert":"Detecting the location of your website’s users is useful for a variety of reasons.\nYou might, for instance, want to display different content, perhaps in different languages for people from different countries, or display targeted information to visitors from different locations.\nWhatever your reasons might be, you have two options:\nThe "},{"attributes":{"color":"inherit","link":"https://developers.google.com/maps/documentation/geolocation/intro"},"insert":"Geolocation API"},{"insert":" and"},{"attributes":{"list":"ordered"},"insert":"\n"},{"insert":"IP address lookup"},{"attributes":{"list":"ordered"},"insert":"\n"},{"insert":"\nThe Geolocation API"},{"attributes":{"header":1},"insert":"\n"},{"insert":"The geolocation API is a new HTML5 feature that allows a web page’s visitor to share their location with you if they so choose.\n\nWhen you try to retrieve the location using this API, a prompt is shown to the user, asking them if they’d like to share their location with your site.\n"}]} 
            ',
            "2019-12-23 09:46:12",
            "react-data-fetching",
            1,
            "",
            "2019-12-23 09:46:12"
    )
`);

  db.run(`
        INSERT
        INTO
        posts(title, author, content, created_at, slug, draft, published_at, modified_at)
        VALUES("Better frontend development with inspiration from the culinary world",
            "Ryan",
            '
            {"ops":[{"insert":"1. OS"},{"attributes":{"header":1},"insert":"\n"},{"attributes":{"italic":true},"insert":"JavaScript in Web browser cannot get the information about Operating System (OS) but node can"},{"insert":"\n"},{"attributes":{"bold":true},"insert":"os.type()"},{"insert":" : shows the Operating Systems type"},{"attributes":{"list":"bullet"},"insert":"\n"},{"attributes":{"bold":true},"insert":"os.uptime()"},{"insert":" : time after OS boots up"},{"attributes":{"list":"bullet"},"insert":"\n"},{"attributes":{"bold":true},"insert":"os.hostname()"},{"insert":" : shows the computer name"},{"attributes":{"list":"bullet"},"insert":"\n"},{"attributes":{"bold":true},"insert":"os.release()"},{"insert":" : shows OS version"},{"attributes":{"list":"bullet"},"insert":"\n"},{"attributes":{"bold":true},"insert":"os.homedir()"},{"insert":" : shows home directory path"},{"attributes":{"list":"bullet"},"insert":"\n"},{"attributes":{"bold":true},"insert":"os.freemem ()"},{"insert":" : shows available RAM"},{"attributes":{"list":"bullet"},"insert":"\n"},{"attributes":{"bold":true},"insert":"os.totalmem()"},{"insert":" : show entire memory capacity"},{"attributes":{"list":"bullet"},"insert":"\n"},{"insert":"2. Path"},{"attributes":{"header":1},"insert":"\n"},{"attributes":{"italic":true},"insert":"It helps manipulating folder & file path"},{"insert":"\n\n"},{"attributes":{"bold":true},"insert":"path"},{"insert":" module is very useful because every Operating system has different path delimiter"},{"attributes":{"list":"bullet"},"insert":"\n"},{"insert":"Windows type & POSIX type"},{"attributes":{"list":"bullet"},"insert":"\n"},{"attributes":{"bold":true},"insert":"Window type"},{"insert":" : separated by ₩ (i.e., C:₩Users₩gplee)"},{"attributes":{"list":"bullet"},"insert":"\n"},{"insert":"POSIX type is used in Unix based Operating system such as macOS and Linux"},{"attributes":{"list":"bullet"},"insert":"\n"},{"attributes":{"bold":true},"insert":"POSIX type"},{"insert":" : separated by / (i.e., /home/gplee)"},{"attributes":{"list":"bullet"},"insert":"\n"},{"insert":"\n"},{"attributes":{"bold":true},"insert":"__filename"},{"insert":", "},{"attributes":{"bold":true},"insert":"__dirname "},{"insert":"represents current file and current folder path respectively"},{"attributes":{"list":"bullet"},"insert":"\n"},{"attributes":{"bold":true},"insert":"path:sep"},{"insert":" : path delimiter (i.e., Windows : "},{"attributes":{"background":"rgba(0, 0, 0, 0.05)","code":true},"insert":"\\"},{"insert":" , POSIX : "},{"attributes":{"background":"rgba(0, 0, 0, 0.05)","code":true},"insert":"/"},{"insert":" )"},{"attributes":{"list":"bullet"},"insert":"\n"},{"attributes":{"bold":true},"insert":"path.delimiter"},{"insert":" : env variable delimiter (i.e., Windows : "},{"attributes":{"background":"rgba(0, 0, 0, 0.05)","code":true},"insert":";"},{"insert":" , POSIX "},{"attributes":{"background":"rgba(0, 0, 0, 0.05)","code":true},"insert":":"},{"insert":")"},{"attributes":{"list":"bullet"},"insert":"\n"},{"attributes":{"bold":true},"insert":"path.dirname(path)"},{"insert":" : file Path"},{"attributes":{"list":"bullet"},"insert":"\n"},{"attributes":{"bold":true},"insert":"path.extname(path)"},{"insert":" : file extension"},{"attributes":{"list":"bullet"},"insert":"\n"},{"attributes":{"bold":true},"insert":"path.basename(path, extension)"},{"insert":" : file name"},{"attributes":{"list":"bullet"},"insert":"\n"},{"attributes":{"bold":true},"insert":"path.parse(path)"},{"insert":" : separate the file path into root, dir, base, ext, name"},{"attributes":{"list":"bullet"},"insert":"\n"},{"attributes":{"bold":true},"insert":"path.format(object)"},{"insert":" : path.parse() object to file path"},{"attributes":{"list":"bullet"},"insert":"\n"},{"attributes":{"bold":true},"insert":"path.noramlize(path)"},{"insert":" : remove duplicates / \\"},{"attributes":{"list":"bullet"},"insert":"\n"},{"attributes":{"bold":true},"insert":"path.isAbsolute(path)"},{"insert":" : return boolean tells whether the file path is absolute path or relative path"},{"attributes":{"list":"bullet"},"insert":"\n"},{"insert":"path.join(path, …) : combine into a path"},{"attributes":{"list":"bullet"},"insert":"\n"},{"insert":"path.resolve(path, …) : combine into a path"},{"attributes":{"list":"bullet"},"insert":"\n"},{"insert":"difference between path.join & path.resolve"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":"--"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":"- path.resolve : absolute path"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":"- path.join : relative path"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":"path.join(/a\", \"/b\", \"c\"); // /a/b/c"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":"path.resolve(\"/a\", \"/b\", \"c\"); // /b/c"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":"\n"}]}
            ',
            "2020-01-11 10:22:34",
            "better-frontend-development",
            0,
            "2020-01-11 10:22:34",
            "2020-01-11 10:22:34"
        )
`);

  db.run(`
        INSERT
        INTO
        posts(title, author, content, created_at, slug, draft, published_at, modified_at)
        VALUES("A Minimalistic Web Portfolio for all devs",
            "Sivanesh",
            '
            {"ops":[{"insert":"Providing a "},{"attributes":{"color":"#0a0a23","link":"https://en.wikipedia.org/wiki/Table_of_contents"},"insert":"table of contents"},{"insert":" helps preview and prioritize content when writing lengthier articles. But not every platform makes it easy to add one. How can we implement one when we lack first class tooling?\nWant to skip ahead of the “what” and “why”? "},{"attributes":{"color":"#0a0a23","link":"https://www.freecodecamp.org/news/how-to-add-a-table-of-contents-to-your-blog-post-or-article/#how-can-we-add-a-table-of-contents"},"insert":"Jump to the “how”"},{"insert":"!\n\nFor the purposes of this article, we’re going to use freeCodeCamp.org‘s content manager for visual and demonstration purposes. freeCodeCamp/news uses the blogging platform "},{"attributes":{"color":"#0a0a23","link":"https://ghost.org/"},"insert":"Ghost"},{"insert":" at the time of writing this, but this method can really apply to any article you write.\n"},{"attributes":{"bold":true},"insert":"Why is this helpful?"},{"attributes":{"header":2},"insert":"\n"},{"insert":"Providing a table of contents helps improve the experience that the people reading your article will have.\n"},{"attributes":{"bold":true},"insert":"It gives readers a preview of the article"},{"attributes":{"header":3},"insert":"\n"},{"insert":"Jumping into an article, at least a lengthy one, can be a big time commitment. No one wants to spend 20 minutes of their morning only to figure out a post they dove into hasn’t actually answered their questions. Or that it‘s a rehash of something they’re already an expert on (although differing perspectives can still be helpful).\nBy providing this preview, you can help people get a sense of what to expect as they start to read. It allows them to prioritize their time with the other list of articles they have to read.\n"},{"attributes":{"bold":true},"insert":"It provides anchor points to jump down to specific content"},{"attributes":{"header":3},"insert":"\n"},{"insert":"Similar to providing a preview, maybe someone wants to read a specific portion of the page. Maybe it’s because they can skip the first few bits of a tutorial or they are coming in from a link a coworker shared in "},{"attributes":{"color":"#0a0a23","link":"https://slack.com/"},"insert":"Slack"},{"insert":".\nThe point is, people can use the table of contents to jump down to the parts that are more important to them.\n"},{"attributes":{"bold":true},"insert":"Bonus: it helps you as an author"},{"attributes":{"header":3},"insert":"\n"},{"insert":"Providing a table of contents might not help for many practical reasons, but it‘s an additional tool for you to prioritize and understand the content of your post. It serves as a high level outline that you can refer to when making sure the flow of your story actually makes sense.\n"},{"attributes":{"bold":true},"insert":"What it doesn’t do"},{"attributes":{"header":2},"insert":"\n"},{"insert":"Unfortunately, this is a manual process. This table of contents isn’t going to magically update any time you tweak your content. So make sure to be vigilant during the editing process and update any broken links or add and remove any changes before you publish.\n"},{"attributes":{"bold":true},"insert":"How can we add a table of contents?"},{"attributes":{"header":2},"insert":"\n"},{"attributes":{"bold":true},"insert":"Content headers and anchor links"},{"attributes":{"header":3},"insert":"\n"},{"insert":"The key to this solution is to utilize the built in "},{"attributes":{"background":"#d0d0d5","code":true},"insert":"id"},{"insert":" attributes applied to content headers in the HTML when building a post page. Using these attributes allows us to create an "},{"attributes":{"color":"#0a0a23","link":"https://www.w3.org/TR/REC-html40/struct/links.html#h-12.2.3"},"insert":"anchor link"},{"insert":" that will jump the browser’s scroll position down to the location of the element with that "},{"attributes":{"background":"#d0d0d5","code":true},"insert":"id"},{"insert":".\nA basic example of the HTML looks like this:\n<ul>"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":"  <li><a href=“#my-id”>Link to My ID</a></li>"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":"</ul>"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":"<article>"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":"  <p>Super long content</p>"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":"  <h2 id=“my-id”>Important Thing</h2>"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":"  <p>Important content</p>"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":"</article>"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":"In the above, we can see our "},{"attributes":{"background":"#d0d0d5","code":true},"insert":"article"},{"insert":" contains some basic content (imagine it‘s much longer than the above) with an "},{"attributes":{"background":"#d0d0d5","code":true},"insert":"h2"},{"insert":"  that follows with our important content.\nBy providing our "},{"attributes":{"background":"#d0d0d5","code":true},"insert":"h2"},{"insert":" with the "},{"attributes":{"background":"#d0d0d5","code":true},"insert":"id"},{"insert":" attribute, we can now create a link by setting the "},{"attributes":{"background":"#d0d0d5","code":true},"insert":"href"},{"insert":" to the pattern of "},{"attributes":{"background":"#d0d0d5","code":true},"insert":"#[id]"},{"insert":" that will jump to that element in the page.\nNow, when creating this in our blogging platform, we don’t necessarily need to worry about writing this HTML. But we do need to understand how to find the "},{"attributes":{"background":"#d0d0d5","code":true},"insert":"id"},{"insert":" in order to create our links.\n"},{"attributes":{"bold":true},"insert":"Finding our header ID"},{"attributes":{"header":3},"insert":"\n"},{"insert":"We can use our browser’s developer tools ("},{"attributes":{"color":"#0a0a23","link":"https://developers.google.com/web/tools/chrome-devtools"},"insert":"Chrome"},{"insert":", "},{"attributes":{"color":"#0a0a23","link":"https://developer.mozilla.org/en-US/docs/Tools"},"insert":"Firefox"},{"insert":") to pretty easily find our precious "},{"attributes":{"background":"#d0d0d5","code":true},"insert":"id"},{"insert":" attributes to create our links.\nUsing your favorite browser, find the headline that you’d like to use, right-click the text, and then select “Inspect” (or “Inspect Element”) from the bottom of the context menu.\n"}]}
            ',
            "2019-12-25 09:46:12",
            "minimalistic-web-portfolio",
            0,
            "2019-12-25 09:46:12",
            "2019-12-26 09:46:12"
        )
`);

  db.run(`
        INSERT
        INTO
        posts(title, author, content, created_at, slug, draft, published_at, modified_at)
        VALUES("React: Context",
            "Karl",
            '
            {"ops":[{"insert":"I’ve read a lot of articles in the last few months, and have noticed that many had disclaimers saying that the post was originally posted on a personal blog. I’ve written a few articles and wanted to increase my exposure, so I decided that I wanted to have a blog on my site as well. But how to do it?\n"},{"attributes":{"bold":true},"insert":"Options"},{"attributes":{"header":3},"insert":"\n"},{"insert":"There were a few options for incorporating a blog into my site. The main two were a custom content management system (CMS) or WordPress. I wanted to get it set up quickly, so I went with WordPress.\n"},{"attributes":{"bold":true},"insert":"WordPress API"},{"attributes":{"header":3},"insert":"\n"},{"insert":"I’d heard a few things about the WordPress API over the last few weeks so started to Google. I set up a free blog at "},{"attributes":{"color":"#0a0a23","link":"http://wordpress.com/"},"insert":"WordPress.com"},{"insert":" and imported my articles from Medium. This was super simple with Medium’s export facility and WordPress’s “import from Medium” facility.\nNow that I had my articles on WordPress, I had to figure out how to access them. I found "},{"attributes":{"color":"#0a0a23","link":"https://developer.wordpress.com/docs/api/"},"insert":"this page"},{"insert":" in the documentation and I built a very basic web page to test with.\n<h1>wordpress checker</h1>"},{"attributes":{"code-block":true},"insert":"\n\n"},{"insert":"<script src=\"https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.0/jquery.min.js\"></script>"},{"attributes":{"code-block":true},"insert":"\n\n"},{"insert":"<script src=\"getWordpress.js\"></script>"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":"getWordpress.html\nconsole.log(\"this is a proof of concenpt\");"},{"attributes":{"code-block":true},"insert":"\n\n"},{"insert":"$.get("},{"attributes":{"code-block":true},"insert":"\n"},{"insert":"  \"https://public-api.wordpress.com/rest/v1/sites/YourSite.wordpress.com/posts\","},{"attributes":{"code-block":true},"insert":"\n"},{"insert":"  function(response) {"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":"    console.log(response);"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":"  }"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":");"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":"getWordpress.js\nThis does the very simple task of calling the WordPress API and asking for all of the posts from “YourSite.wordpress.com.” From this, I got a response object containing the number of posts and an array of each of the posts.\n"},{"attributes":{"bold":true},"insert":"Routing"},{"attributes":{"header":3},"insert":"\n"},{"insert":"Now that I was going to add a blog section to my site, I had to change from the single page that I had. I installed react-router-dom and imported "},{"attributes":{"background":"#d0d0d5","code":true},"insert":"BrowserRouter"},{"insert":" and "},{"attributes":{"background":"#d0d0d5","code":true},"insert":"Route"},{"insert":" into my layout file.\n<BrowserRouter>"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":"    <div id=\"center-stripe\">"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":"        <Nav />"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":"        <Route exact path=\"/\" component={main} />"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":"        <Route exact path=\"/blog\" component={Blog} />"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":"    </div>"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":"</BrowserRouter>"},{"attributes":{"code-block":true},"insert":"\n"},{"attributes":{"bold":true},"insert":"Creating the Blog in React"},{"attributes":{"header":3},"insert":"\n"},{"insert":"My personal website is built using create-react-app and has a very basic structure. The next thing that I needed to do was to add a new “blog” page that would show previews of all the articles.\nexport default class Blog extends Component {"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":"  constructor(props) {"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":"    super(props);"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":"    this.state = {"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":"      posts: []"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":"    };"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":"  }"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":"  componentDidMount() {"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":"    axios"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":"      .get("},{"attributes":{"code-block":true},"insert":"\n"},{"insert":"        \"http://public-api.wordpress.com/rest/v1/sites/samwcoding.wordpress.com/posts\""},{"attributes":{"code-block":true},"insert":"\n"},{"insert":"      )"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":"      .then(res => {"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":"        this.setState({ posts: res.data.posts });"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":"        console.log(this.state.posts);"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":"      })"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":"      .catch(error => console.log(error));"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":"  }"},{"attributes":{"code-block":true},"insert":"\n\n"},{"insert":"  render() {"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":"    return ("},{"attributes":{"code-block":true},"insert":"\n"},{"insert":"      <div className=\"blog\">"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":"        <h1 className=\"sectionTitle\">Articles</h1>"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":"        {this.state.posts.map(post => <ArticlePreview post={post} />)}"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":"      </div>"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":"    );"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":"  }"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":"}"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":"blog.js\nI’ll talk you through this code. The top section sets the state of the component with an empty array of posts. Then I use the "},{"attributes":{"background":"#d0d0d5","code":true},"insert":"componentDidMount"},{"insert":" function to execute the call to the WordPress API with axios. When the API call returns, I set this.state.posts to be the array of posts. This then causes line 24 to render an "},{"attributes":{"background":"#d0d0d5","code":true},"insert":"ArticlePreview"},{"insert":" component for each of the posts.\nrender() {"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":"    if (this.props.post) {"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":"      return ("},{"attributes":{"code-block":true},"insert":"\n"},{"insert":"        <div className=\"article\">"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":"          <a href={\"/blog/\" + this.props.post.ID} className=\"blackLink\">"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":"            {this.props.post.featured_image ? ("},{"attributes":{"code-block":true},"insert":"\n"},{"insert":"              <img"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":"                className=\"img-responsive webpic\""},{"attributes":{"code-block":true},"insert":"\n"},{"insert":"                alt=\"article header\""},{"attributes":{"code-block":true},"insert":"\n"},{"insert":"                src={this.props.post.featured_image}"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":"              />"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":"            ) : ("},{"attributes":{"code-block":true},"insert":"\n"},{"insert":"              \"\""},{"attributes":{"code-block":true},"insert":"\n"},{"insert":"            )}"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":"            <h1 className=\"text-center\">{this.props.post.title}</h1>"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":"            <div className=\"content\">{excerpt}</div>"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":"          </a>"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":"          <Link to={\"/blog/\" + this.props.post.ID}>"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":"            <button className=\"btn\">Read More</button>"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":"          </Link>"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":"        </div>"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":"      );"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":"    } else {"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":"      return null;"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":"    }"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":"  }"},{"attributes":{"code-block":true},"insert":"\n"},{"insert":"articlePreview.js\nArticlePreview takes each post and renders the preview with a title and excerpt, which are both provided by the WordPress API. If the post also has a featured image, it includes that too.\n"}]}
            ',
            "2020-01-12 11:24:37",
            "react-context",
            0,
            "2020-01-12 11:24:37",
            "2020-01-12 11:24:37"
        )
`);
});
