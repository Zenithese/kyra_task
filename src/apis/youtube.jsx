import axios from 'axios';
import {API_KEY} from '../secrets'

const key = API_KEY;

export default axios.get(
    'https://www.googleapis.com/youtube/v3/channels',
    {
        params: {
            part: 'contentDetails',
            id: 'UCvO6uJUVJQ6SrATfsWR5_aA',
            maxResults: 50,
            key: key
        }
    }
).then(response => {
    axios.get(
    'https://www.googleapis.com/youtube/v3/playlistItems',
    {
        params: {
            part: 'snippet',
            playlistId: response.data.items[0].contentDetails.relatedPlaylists.uploads,
            key: key
        }
    }
).then(response => response)})