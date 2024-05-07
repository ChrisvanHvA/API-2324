import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import loadGifs from './service/api.js';
import fetchNews from './service/newsapi.js';
import session from 'express-session';

const app = express();
const port = process.env.PORT || 9000;
const sessionLength = (1000 * 60 * 60 * 24) * 7; // 1 day

//maakt een sessie aan die ervoor zorgt dat je gifs niet steeds weer opnieuw gefetcht worden
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
  // voegt nieuwe resultaten toe aan de sessie.
  req.session.news = newsData.news.data;

  console.log(newsData.news.data[0])
  //zorgt dat er altijd een fallback is als er geen selected channel gevonden kan worden
  let selectedChannel = "netflix";
  req.session.activeChannelIndex = req.session.activeChannelIndex || 0;
  // Checked of er wel een sessie is 
  req.session[selectedChannel] = req.session[selectedChannel] || [];

  // Checked of de sessie leeg is, zoja haalt hij nieuwe gifs op met de API
  if (req.session[selectedChannel].length == 0) {
    console.info("no gifs found in session... fetching new ones woof");
    const loadedGifs = await loadGifs(selectedChannel);

    // mocht je iets zoeken in de input form wat geen resultaten opleverd, dan laad hij de not_found gifs in.
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

      // zijn de gifs wel gevonden, dan haalt hij de gifs uit de sessie op.
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


  if (!req.session.news) {
    const newsData = await fetchNews();
    req.session.news = newsData.news.data;
  }


  let selectedChannel = "netflix";


  const id = parseInt(req.params.id)
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

  // kijkt of er nog gifs in de sessie zijn en als dat niet zo is dan laad hij nieuwe gifs
  if (!req.session[req.params.channel] || req.session[req.params.channel].length == 0) {
    let selectedChannelGifs = await loadGifs(req.params.channel);

    if (selectedChannelGifs == null) {
      console.info("gifs not found... loading not_found gifs");
      const selectedChannel = "not_found";
      selectedChannelGifs = await loadGifs(selectedChannel);
    }

    console.info("no gifs found in session... fetching new ones meow");

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
//de giphy api haalt max 50 gifs op, maar om het wat veiliger te maken limiteer ik het naar 30
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
    let newIndex = req.session.activeChannelIndex == 0 ? 30 : req.session.activeChannelIndex - 1;
    console.info("previous gif index: ", newIndex);
    newGif = req.session[selectedChannel][newIndex];
    req.session.activeChannelIndex = newIndex;
  }

  //haalt de gif uit de api op en laat hem in de tv zien
  res.json({
    "gifUrl": newGif.images.fixed_height.url
  });
})

app.use(express.static('public'))
//geeft in de terminal een linkje
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})