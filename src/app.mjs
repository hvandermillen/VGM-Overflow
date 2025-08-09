import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url';

import mongoose from 'mongoose';
import mongooseSlugPlugin from 'mongoose-slug-plugin';
import sanitize from 'mongo-sanitize';
import session from 'express-session';
import * as google from 'googleapis';

import * as auth from './auth.mjs';
import './db.mjs';
import {getPlaylistId, getVideoId, listVideosInPlaylist, songTitleFromUrl, songTitleFromId } from './playlists.mjs';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
}));

const loginMessages = {
    "PASSWORDS DO NOT MATCH": 'Incorrect password',
    "USER NOT FOUND": 'User doesn\'t exist'
};
const registrationMessages = {
    "USERNAME ALREADY EXISTS": "Username already exists", 
    "USERNAME PASSWORD TOO SHORT": "Username or password is too short"
};

const Song = mongoose.model('Song');
const Game = mongoose.model('Game');
const User = mongoose.model('User');

// app.listen(process.env.PORT || 3000);

function hasPageAccess() {

}
  
app.post('/search', function(req, res) {
});

app.get('/search', (req, res) => {
});

app.get('/', (req, res) => {
    res.redirect(302, '/home');
});

app.get('/home', (req, res) => {
    res.render('home', {user: req.session.user});
});

app.get('/addsong', async (req, res) => {
  const games = await Game.find({}).exec();
  res.render('addSong', {games: games, user: req.session.user});
})

app.get('/addgame', async (req, res) => {
    res.render('addGame', {user: req.session.user});
})

app.get('/song/:songName', async (req, res) => {
  const songName = req.params.songName;
  const song = await Song.findOne({title: songName}).exec();
  if (song) {
    const songId = getVideoId(song.url);
    res.render('viewSong', {song: song, url:`https://www.youtube.com/embed/${songId}`})
  } else {
    res.redirect('/');
  }
})

app.get('/game/:gameName', async (req, res) => {
  const gameName = req.params.gameName;
  const game = await Game.findOne({title: gameName}).exec();
  const songs = await Promise.all(game.songs.map(async song => {
    const songObj = await Song.findOne({_id: song});
    return songObj;
  }));
  const addedBy = await User.findOne({_id: game.user});
  const addedByString = addedBy.username;
  console.log("added by" + addedByString);
  // console.log(game.songs);
  // console.log(songs);

  res.render('viewGame', {game: game, songs: songs, user: req.session.user, addedBy: addedByString});

})

//VIEW SONG EDIT FORM (only if user made this song)
app.get('/song/:paramName/edit', async (req, res) => {

    const songName = req.params.paramName;
  
    const song = await Song.findOne({title: songName}).exec();
    // console.log(song);

    //if user is logged in
    if (req.session.user) {
      //AUTHENTICATION
      if (req.session.user._id == song.user) {
        res.render('editSong', {song: song, user: req.session.user});
      } else {
        res.render('authenticationFailed', {message: "You do not have permission to edit this page", user: req.session.user});
      }
    } else {
      res.render("authenticationFailed", {message: "You must be logged in to make edits!", user: req.session.user});
    }
  
});

//EDIT SONG INFO
app.post('/song/:paramName/edit', async (req, res) => {

    const songName = req.params.paramName;
    const song = await Song.findOne({title: songName}).exec();

     //if user is logged in
     if (req.session.user) {
      //AUTHENTICATION
      if (req.session.user._id == song.user) {
        await Song.updateOne({title:songName}, {
          title: req.body.title,
          url: req.body.url
        })
        res.redirect('/searchSongs');
      } else {
        res.render('authenticationFailed', {message: "You do not have permission to edit this page", user: req.session.user});
      }
    } else {
      res.render("authenticationFailed", {message: "You must be logged in to make edits!", user: req.session.user});
    }
  
});

//VIEW GAME EDIT FORM
app.get('/game/:paramName/edit', async (req, res) => {

  const gameName = req.params.paramName;

  const game = await Game.findOne({title: gameName}).exec();
  // console.log(game);

  //if user is logged in
  if (req.session.user) {
    //AUTHENTICATION
    if (req.session.user._id == game.user) {
      res.render('editGame', {game: game, user: req.session.user});
    } else {
      res.render('authenticationFailed', {message: "You do not have permission to edit this page", user: req.session.user});
    }
  } else {
    res.render("authenticationFailed", {message: "You must be logged in to make edits!", user: req.session.user});
  }
});

//EDIT GAME INFO
app.post('/game/:paramName/edit', async (req, res) => {

  const gameName = req.params.paramName;
  const game = await Game.findOne({title: gameName}).exec();
  // console.log(game);

  //if user is logged in
  if (req.session.user) {
    //AUTHENTICATION
    if (req.session.user._id == game.user) {
      await Game.updateOne({title:gameName}, {
        title: req.body.title,
        year: req.body.year
      })
      res.redirect('/searchGames');
    } else {
      res.render('authenticationFailed', {message: "You do not have permission to edit this item", user: req.session.user});
    }
  } else {
    res.render("authenticationFailed", {message: "You must be logged in to make edits!", user: req.session.user});
  }

});

app.post('/song/delete/:paramName', async (req, res) => {

    const songName = req.params.paramName;
    const song = await Song.findOne({title: songName}).exec();

    const game = song.game;

    //if user is logged in
    if (req.session.user) {
      //AUTHENTICATION
      if (req.session.user._id == song.user) {
        await Song.deleteOne({title:songName})
        await Game.updateOne({_id: game._id}, {
          $pull: { songs: game },
        })
        res.render('home');
      } else {
        res.render('authenticationFailed', {message: "You do not have permission to delete this item", user: req.session.user});
      }
    } else {
      res.render("authenticationFailed", {message: "You must be logged in to make edits!", user: req.session.user});
    }
  
});

app.post('/game/delete/:paramName', async (req, res) => {

  const gameName = req.params.paramName;
  const game = await Game.findOne({title: gameName}).exec();
  // console.log(game);

  //if user is logged in
  if (req.session.user) {
    //AUTHENTICATION
    if (req.session.user._id == game.user) {
      game.songs.forEach(async song => {
        await Song.deleteOne({_id: song})
      })
      await Game.deleteOne({title:gameName})
      res.render('home');
    } else {
      res.render('authenticationFailed', {message: "You do not have permission to delete this page", user: req.session.user});
    }
  } else {
    res.render("authenticationFailed", {message: "You must be logged in to make edits!", user: req.session.user});
  }

  

});

app.get('/searchSongs', async (req, res) => {
    const songs = await Song.find({}).exec();
    const songsPlus = await Promise.all (songs.map(async song => {
      const game = await Game.findOne({_id: song.game})
      if (game) {
        return {
          "song": song,
          "game": game.title || "",
          "image": game.imageLink || ""
        }
      } else {
        return {
          "song": song,
          "game": "",
          "image": ""
        }
      }
    }))
    // console.log(songs);
    res.render('searchSongs', {songs: songsPlus, user: req.session.user})
})

app.get('/searchGames', async (req, res) => {
    const games = await Game.find({}).exec();
    // console.log(games);
    res.render('searchGames', {games: games, user: req.session.user})
})

app.post('/searchGames', async (req, res) => {
  const games = await Game.find({}).exec();

  const filteredGames = games.filter(game => game.title.toLowerCase().includes(req.body.search_query.toLowerCase()));

  res.render('searchGames', {games: filteredGames, user: req.session.user})
})

app.post('/searchSongs', async (req, res) => {
  const songs = await Song.find({}).exec();
  console.log("search " + req.body.search_query)

  const filteredSongs = songs.filter(song => song.title.toLowerCase().includes(req.body.search_query.toLowerCase()));

  const songsPlus = await Promise.all (filteredSongs.map(async song => {
    const game = await Game.findOne({_id: song.game})
    return {
      "song": song,
      "game": game.title,
      "image": game.imageLink
    }
  }))

  res.render('searchSongs', {songs: songsPlus, user: req.session.user})
})

app.post('/addSong', async (req, res) => {
    if (req.session.user) {
      //find the associated game
      const game = await Game.findOne({title: req.body.gameTitle})
      // console.log ("found game: " + game);
      if (!game) {
        //if the game is not found, make user try again
        const games = await Game.find({}).exec();
        res.render('addSong', {message: "Please enter a valid game", games: games, user: req.session.user});
      } else {
        //create song and add song to database
        const song = new Song({
          title: sanitize(req.body.title), 
          url: sanitize(req.body.url),
          game: game._id,
          user: req.session.user._id
        });
        //add the song to the game's soundtrack
        await Game.updateOne({_id: game._id}, {
          $push: { songs: song._id },
        })
        // console.log("updated game" + game);
        try {
          await song.save();
          res.redirect('/');
        } catch(err) {
          console.log(err.message);
          res.render('addSong', {message: err.message, user: req.session.user});
        }
      }
    } else {
      //user is not logged in
      const games = await Game.find({}).exec();
      res.render('addGame', {message: "You must login before adding a game!", games: games, user: req.session.user});
    }
  });

  app.post('/addGame', async (req, res) => {
    // console.log("adding game");
    if (req.session.user) {
      const game = new Game({
        title: sanitize(req.body.title), 
        year: sanitize(req.body.year),
        user: req.session.user._id,
        imageLink: sanitize(req.body.image_link),
      });
      try {
        await game.save();
        // console.log(game);
        res.redirect('/');
      } catch(err) {
        // console.log(err.message);
        res.render('addGame', {message: err.message});
      }
    } else {
      // console.log('not logged in');
      res.render('addGame', {message: "You must login before adding a game!", user: req.session.user});
    }
  });

//REGISTRATION AND LOGIN

  app.get('/register', (req, res) => {
    res.render('register');
  });
  
  app.post('/register', async (req, res) => {
    try {
      // console.log("body" + JSON.stringify(req.body));
      // console.log("headers" + JSON.stringify(req.headers));
      const newUser = await auth.register(
        sanitize(req.body.username), 
        sanitize(req.body.email), 
        req.body.password
      );
      // console.log(newUser);
      await auth.startAuthenticatedSession(req, newUser);
      res.redirect('/');
    } catch(err) {
      // console.log(err);
      res.render('register', {message: registrationMessages[err.message] ?? 'Registration error', user: req.session.user}); 
    }
  });
          
  app.get('/login', (req, res) => {
      res.render('login');
  });
  
  app.post('/login', async (req, res) => {
    try {
      const user = await auth.login(
        sanitize(req.body.username), 
        req.body.password
      );
      // console.log(user);
      await auth.startAuthenticatedSession(req, user);
      res.redirect('/'); 
    } catch(err) {
      console.log(err);
      res.render('login', {message: loginMessages[err.message] ?? 'Login unsuccessful'}); 
    }
  });

  app.get('/userPage', (req, res) => {
    if (req.session.user) {
      res.render('userPage', {user: req.session.user});
    } else {
      res.sendStatus('404');
    }
  })

  app.post('/userPage', async (req, res) => {
    if (req.session.user) {
      await auth.endAuthenticatedSession(req);
      // console.log('logging out');
      res.redirect('/');
    } else {
      res.sendStatus('404');
    }
  })

  //adding multiple songs via playlist link
  app.post('/game/:gameName', async (req, res) => {
    const playlistUrl = sanitize(req.body.playlist_url)

    let videoIds = ''
    try {
      videoIds = await listVideosInPlaylist(playlistUrl);
    } catch(err) {
      console.log(err);
      res.redirect(`/game/${req.params.gameName}`)
      return;
    }

    console.log("ids: " + videoIds);
    const game = await Game.findOne({title: req.params.gameName});

    if (req.session.user) {
      await videoIds.forEach(async (id) => {
        const songTitle = await songTitleFromId(id);

        //make sure there are no duplicates
        // if (await Game.findOne({title: req.params.gameName}) == undefined) {
          //add the song to the database
          console.log("adding");
          const song = new Song({
            title: sanitize(songTitle), 
            url: sanitize(`https://www.youtube.com/watch?v=${id}`),
            game: game._id,
            user: req.session.user._id
          });
          console.log("song" + song);
          //add the song to the game's soundtrack
          await Game.updateOne({_id: game._id}, {
            $push: { songs: song._id },
          })
          try {
            await song.save();
          } catch(err) {
            console.log(err.message);
            res.render('addSong', {message: err.message, user: req.session.user});
          // }
        }
      })
      res.redirect(`/game/${req.params.gameName}`)
    } else {
      //user is not logged in
      const games = await Game.find({}).exec();
      res.render('authenticationFailed', {message: "You must login before adding a song!"});
    }
    
  })

  // listVideosInPlaylist("https://www.youtube.com/watch?v=qL9PpTjZVbQ&list=PL2uxd6YWj7PLw3RFWtqXME1PxRGnXMODQ");
  export {app}