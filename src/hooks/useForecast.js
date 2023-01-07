import { useEffect, useState } from "react";
import getCurrentDayForecast from '../helpers/getCurrentDayForecast';
import getCurrentDayDetailedForecast from '../helpers/getCurrentDayDetailedForecast';
import getUpcomingDaysForecast from '../helpers/getUpcomingDaysForecast';

import axios from 'axios';

const BASE_URL = 'http://api.openweathermap.org'

const useForecast = () => {
    const [isError, setError] = useState(false)
    const [isLoading, setLoading] = useState(false)
    const [forecast, setForecast] = useState(null)

    const getSearchOptions = async location => {
        const { data } = await axios(`${BASE_URL}/geo/1.0/direct`, { 
            params: {
                q: location,
                limit: 1,
                appid: process.env.REACT_APP_API_KEY
            }
        })

        if (!data || data.length === 0) {
            setError('There is no such location');
            setLoading(false);
            return;
        }
        //getForecast(data);
        return data[0];

        // fetch(
        //     `${BASE_URL}/geo/1.0/direct?q=${location}&limit=1&appid=${process.env.REACT_APP_API_KEY}`
        // )
        // .then((res) => res.json())
        // .then(data => {
        //     getForecast(data);
        //     return data;
        // })
    }

    const getForecast = async opt => {
        const { data } = await axios(`${BASE_URL}/data/2.5/forecast`, { 
            params: {
                lat: opt.lat,
                lon: opt.lon,
                appid: process.env.REACT_APP_API_KEY,
                units: 'metric'
            }
        })
        console.log('data 2', data);
        if (!data || data.length === 0) {
            setError('Something went wrong');
            setLoading(false);
            return;
        }
        //gatherForecastData(data)
        return data;

    //     fetch(
    //         `${BASE_URL}/data/2.5/forecast?lat=${data[0].lat}&lon=${data[0].lon}&appid=${process.env.REACT_APP_API_KEY}&units=metric`
    //     )
    //     .then((res) => res.json())
    //     .then((data) => {
    //     const forecastData = {
    //       ...data.city,
    //       list: data.list.slice(0, 5),
    //     }
    //     gatherForecastData(forecastData)
    //   })
    }

    const gatherForecastData = data => {
        console.log('FIRST DATA', data.list);
        const currentDay = getCurrentDayForecast(data.list[0], data.city.name);
        const currentDayDetails = getCurrentDayDetailedForecast(data.list[0]);
        const upcomingDays = getUpcomingDaysForecast(data.list);

        setForecast({ currentDay, currentDayDetails, upcomingDays });
        //console.log('currentDay', currentDay);
        setLoading(false);
    };

    const submitRequest = async location => {
        setLoading(true);
        setError(false);
        
        const response = await getSearchOptions(location)
        if (!response) return;

        const data = await getForecast(response);
        if (!data) return;

        gatherForecastData(data);

        // if (location !== '') {
        //     getSearchOptions(location)
        // }
    };

    return {
        isError,
        isLoading,
        forecast,
        submitRequest,
    };
}

export default useForecast;