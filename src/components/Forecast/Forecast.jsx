import React, {useState} from 'react';
import PropTypes from 'prop-types';

import { Container, Row, Col } from 'react-bootstrap';
import CurrentDay from '../CurrentDay';
import CurrentDayDescription from '../CurrentDayDescription';
import UpcomingDaysForecast from '../UpcomingDaysForecast';

import styles from './Forecast.module.css';
import formStyles from '../Form/Form.module.css';

const Forecast = ({ forecast, submitSearch }) => {
    const [location, setLocation] = useState('');

    const onSubmit = (e) => {
        e.preventDefault();
        if (!location || location === '') return;
        submitSearch(location);
    }

    return (
    <>
        <Container>
            <form className='d-flex ' onSubmit={onSubmit}>
                <input
                    aria-label="location"
                    type="text"
                    className={`${formStyles.input} form-control`}
                    placeholder="Search for location"
                    required
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                />

                <button type="submit" className={formStyles.button} onClick={onSubmit}>
                    SEARCH
                </button>
            </form>
        </Container>
        <Container className={styles.box}>
            <Row>
                <Col xs={12} md={4} className='p-0'>
                    <div className={styles.card}>
                        <CurrentDay {...forecast.currentDay} />
                    </div>
                </Col>
                <Col xs={12} md={8} className="d-flex flex-column justify-content-between">
                    <CurrentDayDescription forecast={forecast.currentDayDetails} />
                    <UpcomingDaysForecast days={forecast.upcomingDays} />
                </Col>
            </Row>
        </Container>
    </>
    )
};

Forecast.propTypes = {
    forecast: PropTypes.shape({
        currentDay: PropTypes.object,
        currentDayDetails: PropTypes.array,
        upcomingDays: PropTypes.array,
    }),
};

export default Forecast;
