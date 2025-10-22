import express from "express"
import bodyParser from "body-parser"
import axios from "axios"

const app = express();
const port = 3000;
const weatherAPIKey = "fa3216fa33934de8b13114452251610";
const openCageAPIKey = "599eeac8a3054195be256b18401aaa43";

let choosenLocation = [];

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());



app.get("/", async (req, res) => {
    try {
        const response = await axios.get("https://countriesnow.space/api/v0.1/countries/states");
        const listOfCountries = [];

        response.data.data.forEach((c) => {
            listOfCountries.push(c.name);
        })

        res.render("index.ejs", { countries: listOfCountries })
    } catch (error) {
        res.render("index.ejs", { error: error.message })
    }
});

app.post("/getStates", async (req, res) => {
        const data = req.body.country;
        
    try {
        const response = await axios.post("https://countriesnow.space/api/v0.1/countries/states", {
            country: data
        }, {
            headers: { "Content-Type": "application/json" }
        })
        const listOfStates = [];

        response.data.data.states.forEach((s) => {
            listOfStates.push(s.name);
        })

        res.json( { listOfStates: listOfStates })
    }   catch (error) {
        res.status(500).json({ error: error.message });
    }

})


app.post("/getCities", async (req, res) => {
        const stateData = req.body.state;
        const countryData = req.body.country;
        
    try {
        const response = await axios.post("https://countriesnow.space/api/v0.1/countries/state/cities", {
            country: countryData,
            state: stateData
        }, {
            headers: { "Content-Type": "application/json" }
        })
        const listOfCities = response.data.data;

        res.json( { listOfCities: listOfCities })
    }   catch (error) {
        res.status(500).json({ error: error.message });
    }

})

app.post("/location", (req, res) => {

    choosenLocation = [];

    choosenLocation.push(req.body.city);
    choosenLocation.push(req.body.country);

    res.redirect("/weather")
})


app.get("/weather", async(req, res) => {

    try {

        const response1 = await axios.get(`https://api.opencagedata.com/geocode/v1/json?key=${openCageAPIKey}&q=${choosenLocation[0]},+${choosenLocation[1]}&no_annotations=1&pretty=1`);
        
        const lat = response1.data.results[0].geometry.lat;
        const lng = response1.data.results[0].geometry.lng;

        const response2 = await axios.get(`http://api.weatherapi.com/v1/forecast.json?key=${weatherAPIKey}&q=${lat},${lng}&days=7&aqi=yes`);

        const result = {
            city: response2.data.location.name,
            time: response2.data.location.localtime,
            currentWeatherDes: response2.data.current.condition.text,
            currentWeatherIcon: response2.data.current.condition.icon,
            currentWeatherTemp: response2.data.current.temp_c,
            dailySummary: response2.data.forecast.forecastday.map((day) => {
                return {
                    time: day.date,
                    weatherDes: day.day.condition.text,
                    weatherIcon: day.day.condition.icon,
                    maxWeatherTemp: day.day.maxtemp_c,
                    minWeatherTemp: day.day.mintemp_c,
                } 
            })
        }
        console.log(response2.data);
        res.render("weather.ejs", { result: result })

    }   catch(error) {
        res.render("weather.ejs", { error: error.message })
    }

})


app.get("/time", (req, res) => {
    res.render("time.ejs")
})
app.get("/forcast", (req, res) => {
    res.send("Coming soon")
})


app.listen(port, () => {
    console.log(`server ${port} is active`)
})