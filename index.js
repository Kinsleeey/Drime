import express from "express"
import bodyParser from "body-parser"
import axios from "axios"

const app = express();
const port = 3000;

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



app.get("/weather", (req, res) => {
    res.render("weather.ejs")
})


app.get("/time", (req, res) => {
    res.render("time.ejs")
})



app.listen(port, () => {
    console.log(`server ${port} is active`)
})