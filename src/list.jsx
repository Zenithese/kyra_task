import React, { useEffect, useState } from 'react';

function list({ videos, nextPage }) {

    const videoList = videos.length ? (
        videos.map((item, i) => {
            let video = item.snippet;
            return (
                <ul>
                    <li className="col s3" key={`video-${i}`}>
                        <div className="card hovering">
                            <div className="card-image">
                                <img src={`${item.snippet.thumbnails.medium.url}`} />
                            </div>
                            <div className="card-content">
                                <p className="truncate"><a href={`https://www.youtube.com/watch?v=${video.resourceId.videoId}`}>{video.title}</a></p>
                            </div>
                        </div>
                    </li>
                </ul>
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