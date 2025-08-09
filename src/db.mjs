import mongoose from 'mongoose';
import mongooseSlugPlugin from 'mongoose-slug-plugin';

import {config} from "dotenv";
config();

mongoose.connect(process.env.DSN);
//mongoose.connect('mongodb+srv://hvandermillen:<EOgyykU7eFELIozn>@cluster0.m5jrd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');


//A schema for a user
const UserSchema = new mongoose.Schema({
  username: {type: String, required: true},
  password: {type: String, required: true},
  salt: {type: String},
  email: {type: String},
  songs: [{type: mongoose.Schema.Types.ObjectId, ref: "Song"}],
  songs: [{type: mongoose.Schema.Types.ObjectId, ref: "Game"}],
  playlists: [{type: mongoose.Schema.Types.ObjectId, ref: "Playlist"}],
});

//A schema for a single song, which is part of a game soundtrack
const SongSchema = new mongoose.Schema({
  title: {type: String, required: true},
  url: {type: String, required: true},
  game: { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

//A schema for a game, which will contain several songs
const GameSchema = new mongoose.Schema({
    title: {type: String, required: true},
    year: {type: String, required: true},
    songs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    imageLink: {type: String}
});

//A schema for a playlist, which contains multiple songs in order
const PlaylistSchema = new mongoose.Schema({
    title: {type: String, required: true},
    songs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});


//UserSchema.plugin(mongooseSlugPlugin, {tmpl: '<%=username%>'});

mongoose.model('User', UserSchema);
mongoose.model('Song', SongSchema);
mongoose.model('Game', GameSchema);
mongoose.model('Playlist', PlaylistSchema);