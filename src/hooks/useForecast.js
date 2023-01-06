import { useEffect, useState } from "react";
import getCurrentDayForecast from '../helpers/getCurrentDayForecast';
import getCurrentDayDetailedForecast from '../helpers/getCurrentDayDetailedForecast';
import getUpcomingDaysForecast from '../helpers/getUpcomingDaysForecast';

const BASE_URL = 'http://api.openweathermap.org'

const useForcast = () => {
    const [isError, setError] = useState(false)
    const [isLoading, setLoading] = useState(false)
    const [forecast, setForecast] = useState(null)

    const [response, setResponse] = useState(null)

    const getSearchOptions = async location => {
        fetch(
            `${BASE_URL}/geo/1.0/direct?q=${location}&limit=1&appid=${process.env.REACT_APP_API_KEY}`
        )
        .then((res) => res.json())
        // .then((data) => {
        //     const locCity = data[0].name
        //     setError('There is no such location');
        //     setLoading(false);
        // })
        .then(data => {
            getForecast(data);
            console.log({ data })
            return data;
        })
    }

            // ${BASE_URL}/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${process.env.REACT_APP_API_KEY}
    // api.openweathermap.org/data/2.5/forecast/daily?lat={lat}&lon={lon}&cnt={cnt}&appid={API key}

    const getForecast = async data => {
        fetch(
            `${BASE_URL}/data/2.5/forecast?lat=${data[0].lat}&lon=${data[0].lon}&appid=${process.env.REACT_APP_API_KEY}`
        )
        .then((res) => res.json())
        .then((data) => {
        const forecastData = {
          ...data.city,
          list: data.list.slice(0, 16),
        }
        setForecast(forecastData)
      })
      .then(data => console.log({ data }))
    }

    const gatherForecastData = data => {
        const currentDay = getCurrentDayForecast(data.consolidated_weather[0], data.title);
        const currentDayDetails = getCurrentDayDetailedForecast(data.consolidated_weather[0]);
        const upcomingDays = getUpcomingDaysForecast(data.consolidated_weather);

        setForecast({ currentDay, currentDayDetails, upcomingDays });
        setLoading(false);
    };

    const submitRequest = async location => {
        setLoading(true);
        setError(false);
        
        if (location !== '') {
            getSearchOptions(location)
        }

        gatherForecastData();
    };

    return {
        isError,
        isLoading,
        forecast,
        submitRequest,
    };
}

export default useForcast;