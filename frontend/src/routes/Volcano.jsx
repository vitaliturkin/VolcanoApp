// importing necessary modules and components
import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useVolcanoDetails } from "../api";
import { Map, Marker, ZoomControl } from "pigeon-maps";
import { Chart, CategoryScale, LinearScale, BarElement, BarController } from 'chart.js';
import { Bar } from "react-chartjs-2";

// Volcano component definition
export default function Volcano() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");
    // fetching volcano details based on ID from URL query parameter
    const { loading: volcanoDetailsLoading, volcanoDetails } = useVolcanoDetails(id);


    return (
        <section className="volcano">
            <div className="container">
                {volcanoDetailsLoading ? (
                    <p className="loading__message">Loading ...</p>
                ) : (
                    <div className="volcanoData">
                        <div className="volcano-info">
                            <h1 className="volcano-title">{volcanoDetails.name}</h1>
                            <VolcanoDetails {...volcanoDetails} />
                        </div>
                        <div className="volcano-map">
                            <VolcanoMap {...volcanoDetails} />
                        </div>
                        <div className="volcano-chart">
                            <h2 className="chart-title">Population Chart</h2>
                            <div className="chart-table">
                                {localStorage.getItem("authData") === null ? (
                                    <p className="chart-text">Please log in to access the chart</p>
                                ) : (
                                    <VolcanoChart {...volcanoDetails} />
                                )}
                            </div>
                        </div>
                    </div>
                )}
                <button className="volcano-button" onClick={() => navigate("../volcanoes")}>
                    Back
                </button>
            </div>
        </section>
    );
}

// VolcanoDetails component definition to display volcano details
function VolcanoDetails({ country, region, subregion, last_eruption, summit, elevation }) {
    return (
        <div>
            <ul className="volcano__data">
                <li>Country: {country}</li>
                <li>Region: {region}</li>
                <li>Subregion: {subregion}</li>
                <li>Last Eruption: {last_eruption}</li>
                <li>Summit: {summit}</li>
                <li>Elevation: {elevation}</li>
            </ul>
        </div>
    );
}

// VolcanoMap component definition to display map with volcano marker
function VolcanoMap({ latitude, longitude }) {
    // Convert latitude and longitude strings to numbers
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    return (
        <Map height={400} center={[lat, lng ]} defaultZoom={5}>
            <Marker anchor={[ lat,  lng]}>
                🌋
            </Marker>
            <ZoomControl />
        </Map>
    );
}

// VolcanoChart component definition to display population chart
function VolcanoChart({ population_5km, population_10km, population_30km, population_100km }) {
    // necessary chart components
    Chart.register(CategoryScale, LinearScale, BarElement, BarController);

    // data and options for the population chart
    const data = {
        labels: ["5km", "10km", "30km", "100km"],
        datasets: [
            {
                label: 'Population',
                data: [population_5km, population_10km, population_30km, population_100km],
                backgroundColor: 'rgba(236,116,116,0.4)',
            },
        ],
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };
    // bar chart with provided data and options
    return <Bar data={data} options={options} />;
}
