import {expect} from 'chai';
import mongoose, { connect } from 'mongoose';
import '../src/db.mjs';
import * as request from 'supertest';
import {app} from '../src/app.mjs'


const Song = mongoose.model('Song');
const Game = mongoose.model('Game');
const User = mongoose.model('User');

describe ('createUser', () => {
    it('should add a user to the database', async () => {
        const response = await fetch("http://localhost:3000/register", {
            method: "POST",
            headers: { "Content-Type": "application/json; charset=UTF-8" },
            body: JSON.stringify({
                username : "testguy123",
                email : "testyboy@gmail.com",
                password : "password123",
            }),
        });

        const foundUser = await User.findOne({'username':'testguy123'});

        expect(foundUser).to.not.be.null;
        
    })
    
})

//used https://medium.com/@ehtemam/writing-test-with-supertest-and-mocha-for-expressjs-routes-555d2910d2c2
//for guidance
describe('login', async () => {

    it('should login successfully', async () => {
        const agent = request.agent(app);

        await agent
        .post('/login')
        .send(({
            "username" : "testguy123",
            "password" : "password123",
        }))

        const res = await agent.get('/userPage');

        expect(res.status).to.equal(200);

    })
    

})

describe('addGame', () => {
    it('should be able to add a game', async () => {
        const agent = request.agent(app);

        await agent
        .post('/login')
        .send(({
            "username" : "testguy123",
            "password" : "password123",
        }))

        await agent
        .post('/addgame')
        .send(({
            title: "Pikmin",
            year: "2001",
            image_link: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fpikmin.fandom.com%2Fwiki%2FYellow_Pikmin&psig=AOvVaw3CYAVS9XQMv4tewOvvojmE&ust=1733688562246000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCJi3xqi7looDFQAAAAAdAAAAABAQ"
        }))

        const foundGame = await Game.findOne({'title':'Pikmin'});

        expect(foundGame).to.not.be.null;


    })
})

describe('addSong', () => {
    it('should be able to add a song', async () => {
        const agent = request.agent(app);

        await agent
        .post('/login')
        .send(({
            "username" : "testguy123",
            "password" : "password123",
        }))

        await agent
        .post('/addSong')
        .send(({
            gameTitle: "Pikmin",
            title: "Forest of Hope",
            url: "https://www.youtube.com/watch?v=jc3gs7OJ0Jc&list=PL2D158F14D98DFA72&index=7"
        }))

        const foundSong = await Song.findOne({'title':'Forest of Hope'});

        expect(foundSong).to.not.be.null;


    })
})