import { useState } from "react";
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
        return data[0];
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

        if (!data || data.length === 0) {
            setError('Something went wrong');
            setLoading(false);
            return;
        }
        return data;
    }

    const gatherForecastData = data => {
        const currentDay = getCurrentDayForecast(data.list[0], data.city.name);
        const currentDayDetails = getCurrentDayDetailedForecast(data.list[0]);
        const upcomingDays = getUpcomingDaysForecast(data.list);

        setForecast({ currentDay, currentDayDetails, upcomingDays });
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
    };

    return {
        isError,
        isLoading,
        forecast,
        submitRequest,
    };
}

export default useForecast;