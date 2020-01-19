import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_KEY, CHANNEL_ID } from './secrets'
import List from './list'

function App() {

  const [ videos, setVideos ] = useState([])
  const [ nextPage, setNextPage ] = useState('')
  const [ prevPage, setPrevPage ] = useState('')
  const [ pageToken, setPageToken ] = useState('')
  const [ prevPageToken, setPrevPageToken ] = useState('');

  const handleClick = () => {
    setNextPage(pageToken);
  }

  const handleClick2 = () => {
    if (prevPageToken === undefined) {
      setNextPage(prevPage)
    } else {
      setNextPage(prevPageToken)
    }
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
      ).then(response => {setVideos(response.data.items); setPageToken(response.data.nextPageToken); setPrevPageToken(response.data.prevPageToken); console.log(response.data.items)})
    })
  }, [nextPage])

  useEffect(() => {
    axios.get(
      'https://www.googleapis.com/youtube/v3/playlistItems',
      {
        params: {
          part: 'snippet',
          playlistId: 'UUvO6uJUVJQ6SrATfsWR5_aA',
          maxResults: 24,
          pageToken: prevPage,
          key: API_KEY
        }
      }
    ).then(response => { 
      if (response.data.items.length >= 24) {
        setPrevPage(response.data.nextPageToken)
      }
    })
  }, [prevPage])

  return (
    <div>
      <List videos={videos} nextPage={nextPage}/>
      <div style={{display: 'flex', width: '100%', justifyContent: 'space-around'}} >
        <div style={{ cursor: 'pointer', fontSize: '50px', marginBottom: '40px' }} className="blue-text" onClick={handleClick2}>  previous</div>
        <div style={{ cursor: 'pointer', fontSize: '50px', marginBottom: '40px', float: 'right' }} className="blue-text" onClick={handleClick}>next</div>
      </div>
    </div>
  );
}

export default App;
