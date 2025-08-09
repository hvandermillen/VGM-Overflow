Milestone 04 - Final Project Documentation
===

NetID
---
hwv2006

Name
---
Henry Vandermillen

Repository Link
---
[repo_link](https://github.com/nyu-csci-ua-0467-001-002-fall-2024/final-project-hvandermillen)

URL for deployed site 
---
[url_deployed](http://linserv1.cims.nyu.edu:27611/home)

URL for form 1 (from previous milestone) 
---
[add_song_url](http://linserv1.cims.nyu.edu:27611/addsong)


Special Instructions for Form 1
---
You must be logged in to add a song

URL for form 2 (for current milestone)
---
[add_game_url](http://linserv1.cims.nyu.edu:27611/addgame)

Special Instructions for Form 2
---
You must be logged in to add a game

URL for form 3 (from previous milestone) 
---
[balatro_url](http://linserv1.cims.nyu.edu:27611/game/Balatro)

Special Instructions for Form 3
---
This can be accessed from any /game/gameName url, but I chose Balatro as it already exists and has no added songs. Paste the link to the playlist of the soundtrack (https://www.youtube.com/watch?v=OnGQeVTt4KI&list=PLKyIRtl8BHAUwPqVk7UdRagiuhI5Sf2v2) into the form titled "Add Multiple Songs via Youtube Playlist Link", and it will add up to 50 songs from the soundtrack.

First link to github line number(s) for constructor, HOF, etc.
---
[video_map_link](https://github.com/nyu-csci-ua-0467-001-002-fall-2024/final-project-hvandermillen/blob/6e4114d8c1eff809cb1f5a63ca6a9e3226a5e169/src/playlists.mjs#L29)

Second link to github line number(s) for constructor, HOF, etc.
---
[songsPlus_map_link](https://github.com/nyu-csci-ua-0467-001-002-fall-2024/final-project-hvandermillen/blob/6e4114d8c1eff809cb1f5a63ca6a9e3226a5e169/src/app.mjs#L245-L260)

Short description for links above
---
The first link shows a use of array.prototype.map to take in the body of a fetch request, and map each item in the "items" array (containing a "video" resource) to its unique video ID (which can be used to get a URL).

The second link shows another use of map to take in an array of "song" items and map each to an object containing the name of the game associated with it, as well as an icon image for that game. This is used in the "search songs" page to display the icon and game name.

Link to github line number(s) for schemas (db.js or models folder)
---
[schema_link](https://github.com/nyu-csci-ua-0467-001-002-fall-2024/final-project-hvandermillen/blob/6e4114d8c1eff809cb1f5a63ca6a9e3226a5e169/src/db.mjs#L12-L37)

(ignore the "Playlist" schema, it was not used).

Description of research topics above with points
---
2 points - used tailwind.css for all my styling (including some examples from the website, some modified examples, and a large amount of completely original work)

3 points - used mocha unit testing and created four of my own unit tests for creating a user, logging in, adding a game, and adding a song.

5 points - used the YouTube apis to access all videos in any public YouTube playlist (using the PlaylistItems resource), then obtain the video titles from this list (using the Videos resource).

Links to github line number(s) for research topics described above (one link per line)
---
Tailwind: (one example) [tailwind_link](https://github.com/nyu-csci-ua-0467-001-002-fall-2024/final-project-hvandermillen/blob/6e4114d8c1eff809cb1f5a63ca6a9e3226a5e169/src/views/home.hbs#L11-L45)

Mocha: [mocha_link](https://github.com/nyu-csci-ua-0467-001-002-fall-2024/final-project-hvandermillen/blob/6e4114d8c1eff809cb1f5a63ca6a9e3226a5e169/test/test.mjs#L1-L107)

YouTube APIs: [youtube_api_link](https://github.com/nyu-csci-ua-0467-001-002-fall-2024/final-project-hvandermillen/blob/6e4114d8c1eff809cb1f5a63ca6a9e3226a5e169/src/playlists.mjs#L4-L58)

Optional project notes 
--- 
To create a song, you must attach it to a game. To make a game or song, you must be logged in. Songs can be accessed from the "search songs" page or from any game's page. Songs and games have edit pages, but these can only be accessed by the user who created them.

Attributions
---
See source code comments. I also generally used https://tailwindui.com/ for info and short examples for styling (besides the ones already commented in my code).