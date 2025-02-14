import React, {Component} from 'react';
import axios from 'axios';
import Form from './Form';
import Result from './Result';
import CurrentArtist from './CurrentArtist';
import Graph from './Graph';
import Album from './Album';
import Loading from './Loading';
import SpotifyPlaceholder from '../assets/spotify-icon.png';

class App extends Component {
    constructor() {
        super();
        this.state = {
            currArtist: '',
            currArtistAlbums: [],
            artistsFromSearch: [],
            loading: false,
            playPreview: false
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.handleGenerate = this.handleGenerate.bind(this);
        this.handleToggle = this.handleToggle.bind(this);
    }

    componentDidMount() {
        axios(`http://localhost:5000/accessToken`, { //https://spotifyviz.herokuapp.com/accessToken
            method: 'get',
            withCredentials: true
        })
        .then((res) => {
            if (res.status === 200) {
                localStorage.setItem("access_token", res.data.access_token);
            }
        });
    }

    handleSubmit(query) {
        axios(`https://api.spotify.com/v1/search?q=${query}&type=artist`, {
            method: 'get',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                'Content-Type': 'application/json'
            }
        })
        .then((res) => this.setState({artistsFromSearch: res.data.artists.items}))
        .catch((err) => console.log(err))
    }

    handleSelect(selectedArtist) {
        this.setState({currArtist: selectedArtist});
    }

    handleToggle() {
        this.setState({playPreview: !this.state.playPreview});
    }

    handleGenerate() {
        this.setState({loading: true});

        axios(`https://api.spotify.com/v1/artists/${this.state.currArtist.id}/albums?limit=50&country=US&include_groups=album,single`, {
            method: 'get',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                'Content-Type': 'application/json'
            }
        })
        .then(async (res) => {
            if (res.status === 200) {
                // get albums and their tracks
                let albumIds = res.data.items.map(album => album.id);
                let currArtistAlbums = [];
                let max = 20;
                for (let i = 0; i < albumIds.length / max; i++) {
                    let obj = await axios(`https://api.spotify.com/v1/albums?ids=${albumIds.slice(i * max, (i * max) + max).join(",")}`,  { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('access_token')}`}});
                    currArtistAlbums = [...currArtistAlbums, ...obj.data.albums.map((album) => {
                        return { id: album.id, name: album.name, img_url: album.images.length !== 0 ? album.images[0].url : SpotifyPlaceholder, tracks: album.tracks.items.map((track) => { return {id: track.id, name: track.name, preview_url: track.preview_url} })}
                    })];
                }

                // add audio features to each track
                for (let i = 0; i < currArtistAlbums.length; i++) {
                    let audioFeatures = await axios(`https://api.spotify.com/v1/audio-features?ids=${currArtistAlbums[i].tracks.map(track => track.id).join(",")}`,  { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('access_token')}`}});
                    audioFeatures = audioFeatures.data.audio_features.map((audioFeature) => { return { energy: audioFeature.energy, valence: audioFeature.valence }})
                    currArtistAlbums[i].tracks = currArtistAlbums[i].tracks.map((track, i) => { return {...track, ...audioFeatures[i]} });
                }

                this.setState({currArtistAlbums, loading: false});
            }
        });
    }

    render() {
        return (
            <div id="container">
                <div id="left-container">
                    <div id="logo-area">
                        <div id="logo">spotify-viz</div>
                        <div id="by-label">by <a href="https://catherinekleung.com" rel="noopener noreferrer" target="_blank">catherine</a></div>
                    </div>
                    <Form handleSubmit={this.handleSubmit} />
                    <div id="selected-artist-container" className="section">
                        <div className="heading">Current Artist</div>
                        <div>
                            {this.state.currArtist ? <CurrentArtist artist={this.state.currArtist} handleGenerate={this.handleGenerate} handleToggle={this.handleToggle} /> : null}
                        </div>
                    </div>
                    <div id="results-container" className="section">
                        <div className="heading">Results</div>
                        <div>
                            {this.state.artistsFromSearch.map(artist => <Result key={artist.id} artist={artist} handleSelect={this.handleSelect} />)}
                        </div>
                    </div>
                </div>
                <div id="right-container">
                    { this.state.loading ? <Loading /> :
                        <React.Fragment>
                            <div id="graph-container" className="left-container">
                                <Graph playPreview={this.state.playPreview} height={window.innerHeight} width={window.innerWidth} data={this.state.currArtistAlbums}/>
                            </div>
                            <div id="albums-container" className="left-container">
                                {this.state.currArtistAlbums ? this.state.currArtistAlbums.map((album, i) => <Album album={album} key={album.id} index={i} />) : null}
                            </div>
                        </React.Fragment>}
                </div>
            </div>
        )
    }
}

export default App;