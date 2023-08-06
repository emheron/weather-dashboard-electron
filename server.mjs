import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();

const app = express();
const port = 3000;

let weatherApiKey = process.env.WEATHER_API_KEY || '';
let apodApiKey = process.env.APOD_API_KEY || '';

app.use(cors());
app.use(express.static('public'));

app.get('/weather', async (req, res) => {
    const city = req.query.city;
    const apikey = req.query.appid || weatherApiKey;
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}&units=imperial`;
    console.log("Fetch URL: ", url);

    try {
        const weatherResponse = await fetch(url);
        const weatherData = await weatherResponse.json();

        res.send(weatherData);
    } catch (error) {
        console.log('An error occurred: ' + error);
    }
});

app.get('/forecast', async (req, res) => {
    const { city, state, country } = req.query;
    const apikey = req.query.appid || weatherApiKey;
    const url = `http://api.openweathermap.org/data/2.5/forecast?q=${city},${state},${country}&appid=${apikey}&units=imperial`;

    try {
        const forecastResponse = await fetch(url);
        const forecastData = await forecastResponse.json();

        res.send(forecastData);
    } catch (error) {
        console.log('An error occurred: ' + error);
    }
});

app.get('/apod', async (req, res) => {
    const apikey = req.query.appid || apodApiKey;
    const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${apikey}`);
    const adata = await response.json();
    res.json(adata);
  });

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
