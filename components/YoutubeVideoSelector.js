import React from 'react';
import YouTube from 'react-youtube';

const YoutubeVideoSelector = ({ youtubeVideos, selectedVideos, toggleVideoSelection, getBestDescription }) => {
    // YouTube player options
    const opts = {
        height: '180', // Adjust the height as needed
        width: '320', // Adjust the width as needed
        playerVars: {
            autoplay: 0, // Do not autoplay the videos
        },
    };

    return (
        <div className="grid grid-cols-1 gap-4 py-2">
            <button 
                onClick={getBestDescription} 
                disabled={selectedVideos.length === 0}
                className="get-description-button"
            >
                Get Best Description
            </button>
            {youtubeVideos.map((video, index) => (
                <div key={index} className="flex border rounded-lg shadow-sm p-4 items-start">
                    <div className="w-2/5 mr-4">
                        <YouTube videoId={video.id} opts={opts} className="youtube-player rounded-lg" />
                    </div>
                    <div className="w-3/5">
                        <div>
                            <p className="font-semibold text-lg">{video.title}</p>
                            <p className="text-gray-600 text-sm">{video.views} views • {video.published_date}</p>
                            <p className="text-sm mt-2">{video.description}</p>
                        </div>
                        <button 
                            onClick={() => toggleVideoSelection(video.id)}
                            className={`px-4 py-2 rounded mt-2 ${selectedVideos.includes(video.id) ? 'bg-green-500' : 'bg-blue-500'} text-white`}
                        >
                            {selectedVideos.includes(video.id) ? 'Deselect' : 'Select'}
                    </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default YoutubeVideoSelector;
