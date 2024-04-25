import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import loadGifs from './service/api.js';
import fetchNews from './service/newsapi.js';
import session from 'express-session';

const app = express();
const port = process.env.PORT || 9000;
const sessionLength = (1000 * 60 * 60 * 24) * 7; // 1 day

app.use(session({
  name: 'tvsession',
  secret: "tvsessionsecret",
  saveUninitialized: true,
  cookie: {
    maxAge: sessionLength
  },
  resave: false
}));

app.set('view engine', 'ejs')
app.set('views', './views')

app.get('/', async (req, res) => {
  const newsData = await fetchNews();
  // add news results to session storage
  req.session.news = newsData.news.data;

  console.log(newsData.news.data[0])

  let selectedChannel = "netflix";
  req.session.activeChannelIndex = req.session.activeChannelIndex || 0;
  // Check if the session exists
  req.session[selectedChannel] = req.session[selectedChannel] || [];

  // Check if the session is empty - if so, load the gifs
  if (req.session[selectedChannel].length == 0) {
    console.info("no gifs found in session... fetching new ones");
    const loadedGifs = await loadGifs(selectedChannel);

    // If the gifs are not found, load the not_found gifs
    if (loadedGifs == null) {
      console.info("gifs not found... loading not_found gifs");
     
      selectedChannel = "fail";
      const notFoundGifs = await loadGifs(selectedChannel);

      req.session[selectedChannel] = notFoundGifs;
      const firstGif = notFoundGifs[0];

      res.render('layout', {
        "view": "home",
        "gif": firstGif,
        "news": newsData
      })
      return;

      // If the gifs are found, load the gifs
    } else {
  
      console.info("gifs found... loading gifs");
      req.session[selectedChannel] = loadedGifs;
      const firstGif = loadedGifs[0];

      res.render('layout', {
        "view": "home",
        "gif": firstGif,
        "news": newsData
      })
      return;
    }

    // If the session is not empty, load the gifs from the session
  } else {
    console.info("gifs found in session... loading gifs");
    const firstGif = req.session[selectedChannel][0];

    res.render('layout', {
      "view": "home",
      "gif": firstGif,
      "news": newsData
    })
    return;
  }

})

app.get('/news/:id', async (req, res) => {
  console.log("MEOW")

  // check if news is in session, if not, fetch news
  if (!req.session.news) {
    const newsData = await fetchNews();
    req.session.news = newsData.news.data;
  }


  let selectedChannel = "netflix";

  // turn id into a number
  const id = parseInt(req.params.id)

  // Get the news article by the id
  const newsArticle = req.session.news[id];

  const firstGif = req.session[selectedChannel][0];

  console.log(newsArticle.title, newsArticle.description)
 
  //send res json

  res.json({
    "news": newsArticle,
  })
})

app.get('/new_gif/:channel', async (req, res) => {

  console.info(req.params.channel);
  req.session.activeChannelIndex = 0;

  // if channel is not in session or session is empty, load gifs
  if (!req.session[req.params.channel] || req.session[req.params.channel].length == 0) {
    let selectedChannelGifs = await loadGifs(req.params.channel);

    if (selectedChannelGifs == null) {
      console.info("gifs not found... loading not_found gifs");
      const selectedChannel = "not_found";
      selectedChannelGifs = await loadGifs(selectedChannel);
    }

    console.info("no gifs found in session... fetching new ones");

    req.session[req.params.channel] = selectedChannelGifs;
    res.json({
   
      "gifUrl": selectedChannelGifs[0].images.fixed_height.url
    });

  } else {

    console.info("gifs found in session... loading gifs");
    const selectedChannelGifs = req.session[req.params.channel];
    res.json({
      "gifUrl": selectedChannelGifs[0].images.fixed_height.url
    });

  }

})

app.get('/change_show/:type/:channel', async (req, res) => {
  const type = req.params.type;
  const selectedChannel = req.params.channel;
  let newGif;

  if (type == "next") {

    let newIndex = req.session.activeChannelIndex == 30 ? 0 : req.session.activeChannelIndex + 1;

    console.info("next gif index: ", newIndex);

    newGif = req.session[selectedChannel][newIndex];
    req.session.activeChannelIndex = newIndex;
  } else if (type == "previous") {

    let newIndex = req.session.activeChannelIndex == 0 ? 30 : req.session.activeChannelIndex - 1;

    console.info("previous gif index: ", newIndex);

    newGif = req.session[selectedChannel][newIndex];
    req.session.activeChannelIndex = newIndex;


  } else {
    let newIndex = req.session.activeChannelIndex == 0 ? 49 : req.session.activeChannelIndex - 1;

    console.info("previous gif index: ", newIndex);

    newGif = req.session[selectedChannel][newIndex];
    req.session.activeChannelIndex = newIndex;
  }

  // TODO: Add error handling for when no gif found for index

  res.json({
    "gifUrl": newGif.images.fixed_height.url
  });
})

app.use(express.static('public'))

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})