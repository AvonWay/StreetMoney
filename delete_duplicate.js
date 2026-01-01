const fetch = require('node-fetch');

async function deleteVideo() {
    try {
        const response = await fetch('http://localhost:3000/api/videos/2', {
            method: 'DELETE'
        });
        const data = await response.json();
        console.log('Delete result:', data);
    } catch (error) {
        console.error('Error deleting video:', error);
    }
}

deleteVideo();
