import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();
const giphyKey = process.env.GIPHY_KEY;

const fetchNews = async () => {

    try {


        const requestOptions = {
            method: 'GET'
        };

        const params = {
             api_token: 'C4cSEq99q5KARDl7kkGoyG0iknSF92IvWEJhfgLm',
           // api_token: //'7JHX8w17My3gy3tFrDI0jGfKPnQTjvm72nG5UOaW',
            language: 'nl',
            categories: 'tech',
            limit: '3'
        };

        const esc = encodeURIComponent;
        const query = Object.keys(params)
            .map(function (k) {
                return esc(k) + '=' + esc(params[k]);
            })
            .join('&');

        const response = await fetch("https://api.thenewsapi.com/v1/news/all?" + query, requestOptions);

        const newsData = await response.json();

        return {
            // title: newsData.data[1].title,
            // description: newsData.data[1].description,
            // source: newsData.data[1].source,
            news: newsData
        }


    } catch (error) {
        console.error('Error:', error);
        return null;
    }


}

export default fetchNews;