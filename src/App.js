import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_KEY, CHANNEL_ID } from './secrets';
import List from './list';
import Stats from './chart';

function App() {

  const [videos, setVideos] = useState([]);
  const [ allVideos, setAllVideos ] = useState([]);
  const [nextPage, setNextPage] = useState('');
  const [prevPage, setPrevPage] = useState('');
  const [pageToken, setPageToken] = useState('');
  const [prevPageToken, setPrevPageToken] = useState('');
  // const [ data, setData ] = useState([]); 
  const [ pt, setPt ] = useState('')

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
      'https://www.googleapis.com/youtube/v3/playlistItems',
      {
        params: {
          part: 'snippet',
          playlistId: 'UUvO6uJUVJQ6SrATfsWR5_aA',
          maxResults: 50,
          pageToken: pt,
          key: API_KEY
        }
      }
    ).then(response => {
      setAllVideos(allVideos.concat(response.data.items))
      if (response.data.nextPageToken !== undefined){
        setPt(response.data.nextPageToken)
      } 
    })
  }, [pt])

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
      ).then(response => { setVideos(response.data.items); setPageToken(response.data.nextPageToken); setPrevPageToken(response.data.prevPageToken) })
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
      } else {
      }
    })
  }, [prevPage])

  return (
    <div>
      <br/>
      <List videos={videos} nextPage={nextPage} />
      <div className="pageButtons" >
        <div className="previousButton blue-text" onClick={handleClick2}>  previous</div>
        <div className="nextButton blue-text" onClick={handleClick}>next</div>
      </div>
      <Stats videoData={allVideos} />
      <br/>
    </div>
  );
}

export default App;