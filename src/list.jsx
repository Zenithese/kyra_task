import React from 'react';

function list({ videos }) {

    const videoList = videos.length ? (
        videos.map((item, i) => {
            let video = item.snippet;
            return (
                <div className="col s3" key={`video-${i}`}>
                    <div className="card hoverable">
                        <div className="card-image">
                            <img src={`${item.snippet.thumbnails.medium.url}`} alt="" />
                        </div>
                        <div className="card-content">
                            <p className="truncate"><a href={`https://www.youtube.com/watch?v=${video.resourceId.videoId}`}>{video.title}</a></p>
                        </div>
                    </div>
                </div>
            )
        })
        
    ) : (
        <p>waiting for videos...</p>
    )
        

    return (
        <div className="row">{videoList}</div>
    )
}

export default list;