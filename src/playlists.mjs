import * as google from 'googleapis';
import { get } from 'mongoose';

const apiKey = 'AIzaSyCQwpdwBrXrZmksBqtWwQ9vJUqVz1JkZEQ';

function getPlaylistId(url) {
    const splitUrl = url.split('list=')
    return splitUrl[1];
}

function getVideoId(url) {
    const splitUrl = url.split('watch?v=');
    return splitUrl[1];
}

//input link to playlist, return list of video urls
//used https://developers.google.com/youtube/v3/docs/playlistItems/list for basics
async function listVideosInPlaylist(url) {

    const playlistId = getPlaylistId(url);
    
    const response = await fetch(`https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet%2CcontentDetails&maxResults=50&playlistId=${playlistId}&key=${apiKey}`, {
        method: "GET"
    })
    const data = await response.json();

    console.log(data);

    const videoURLs = data.items.map(video => video.contentDetails.videoId);
    return (videoURLs);
}

//used https://developers.google.com/youtube/v3/docs/videos for basics
async function songTitleFromUrl(url) {

    const videoId = getVideoId(url);
    
    const response = await fetch(`https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=${apiKey}`, {
        method: "GET"
    })
    const data = await response.json();

    const videoTitle = data.items[0].snippet.title;
    return videoTitle;

}

async function songTitleFromId(videoId) {
    const response = await fetch(`https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=${apiKey}`, {
        method: "GET"
    })
    const data = await response.json();

    const videoTitle = data.items[0].snippet.title;
    console.log(videoTitle);
    console.log("yes");
    return videoTitle;
}


export{
    getPlaylistId,
    getVideoId,
    listVideosInPlaylist,
    songTitleFromUrl,
    songTitleFromId,
};
