import React, {useState, useEffect} from 'react';
import axios from 'axios'

const Result = ({name, capital, population, languages, flag}) => {

  const [weather, setWeather] = useState({temp: "loading", icon:null, wind: "loading"})

  useEffect(() => {
    axios.get("http://api.weatherstack.com/current?access_key=" + process.env.REACT_APP_API_KEY + "&query=" + capital)
        .then( response => {
          console.log()
          setWeather({temp: response.data.current.temperature, icon:response.data.current.weather_icons[0], wind: response.data.current.wind_speed + " direction " + response.data.current.wind_dir})
        })
  },[capital])

  return (<>
    <h3>{name}</h3>
    <p>Capital: {capital}<br/>
    Population: {population}<br/>
    </p>
    <h4>Languages</h4>
    <ul>
      {languages.map( language => <li>{language.name}</li>)}
    </ul>
    <img style={{width: 150, height: "auto"}} src={flag} alt="flag"/>
    <h4>Weather in {capital}</h4>
    <p><strong>Temperature:</strong> {weather.temp} celsius</p>
    <img src={weather.icon} alt="weather icon"/>
    <p><strong>wind:</strong> {weather.wind}</p>
  </>)
}

const Results = ({results, setFilter}) => {
  if (results.length > 10) {
    return <div>Too many matches, specify another filter</div>
  }
  return results.map(result => <div key={result.alpha2Code}>{result.name} <button onClick={() => setFilter(result.name)}>show</button></div>)
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState("")
  useEffect(() => {
    axios.get("https://restcountries.eu/rest/v2/all")
        .then(response => setCountries(response.data))
  })

  const filtered = countries.filter(country => country.name.toLowerCase().includes(filter.toLowerCase()))

  return <>
    <div>Find coutries <input value={filter} onChange={(e) => setFilter(e.currentTarget.value)}/></div>
    { filtered.length === 1 ? <Result {...filtered[0]} /> : <Results results={filtered} setFilter={setFilter} /> }
  </>
}

export default App;
