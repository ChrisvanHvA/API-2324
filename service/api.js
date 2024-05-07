import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();
const giphyKey = process.env.GIPHY_KEY;

const loadGifs = async (selectedChannel) => {

    try {
        const response = await fetch(`http://api.giphy.com/v1/gifs/search?q=${selectedChannel}&api_key=${giphyKey}&limit=50`);
        const data = await response.json();
        
        if (Object.keys(data.data).length === 0) {
            console.log("empty");

            return null;
        } else {
            return data.data;
        }


    } catch (error) {
        console.error('Error:', error);
        return null;
    }

}


export default loadGifs;