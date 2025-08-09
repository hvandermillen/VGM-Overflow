//class for song data
class SongData {
    links = {
        spotify: "",
        appleMusic: "",
        youtube: "",
        other: ""
    };
    covers = {}

    //initialize with a link
    //linkSource is a string: either spotify, appleMusic, youtube, or other
    // constructor(link, linkSource) {
    //     this.links[linkSource] = link;
    // }

    constructor () {
    }

    addLink(link, linkSource) {
        this.links[linkSource] = link;
    }

    addCover(coverName, coverLink) {
        this.covers[coverName] = coverLink;
    }
}