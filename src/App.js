import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_KEY, CHANNEL_ID } from './secrets'
import List from './list'

function App() {

  const [ videos, setVideos ] = useState([])
  const [ nextPage, setNextPage ] = useState('')
  const [ pageToken, setPageToken ] = useState('')

  const handleClick = () => {
    setNextPage(pageToken);
  }

  useEffect(() => {
    axios.get(
      'https://www.googleapis.com/youtube/v3/channels',
      {
        params: {
          part: 'contentDetails',
          id: CHANNEL_ID,
          key: API_KEY
        }
      }
    ).then(response => {
      axios.get(
        'https://www.googleapis.com/youtube/v3/playlistItems',
        {
          params: {
            part: 'snippet',
            playlistId: response.data.items[0].contentDetails.relatedPlaylists.uploads,
            maxResults: 24,
            pageToken: nextPage,
            key: API_KEY
          }
        }
      ).then(response => {setVideos(response.data.items); setPageToken(response.data.nextPageToken); console.log(response.data.items)})
    })
  }, [nextPage])

  return (
    <div>
      <List videos={videos} nextPage={nextPage}/>
      <div style={{ cursor: 'pointer', fontSize: '50px', marginBottom: '40px' }} className="center blue-text" onClick={handleClick}>next</div>
    </div>
  );
}

export default App;
