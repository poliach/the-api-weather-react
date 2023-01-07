import moment from 'moment';

const getWeekday = date => moment(date).format('dddd').substring(0, 3);

const getUpcomingDaysForecast = data =>
    data.slice(1).map(day => ({
        imgUrl: day.weather[0].icon,
        temperature: Math.round(day.main.temp_max),
        weekday: getWeekday(day.dt_txt),
    }));

export default getUpcomingDaysForecast;
