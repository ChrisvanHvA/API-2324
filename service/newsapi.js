import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();
const newsApiKey = process.env.news_api_key

//een functie die van thenewsapi een aantal artikelen ophaalt met de categorie tech en de taal nederlands
const fetchNews = async () => {

    try {
        const requestOptions = {
            method: 'GET'
        };

        const params = {
            api_token: newsApiKey,

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

            news: newsData
        }


    } catch (error) {
        console.error('Error:', error);
        return null;
    }


}

export default fetchNews;