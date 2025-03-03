// importing necessary modules and components
import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useCountry, useVolcanoTable} from "../api";
import {AgGridReact} from "ag-grid-react";
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

// VolcanoesTable component definition
export default function VolcanoesTable() {
    // hooks for managing selected country and populated value
    const {loading: countryLoading, country} = useCountry();
    const [selectedCountry, setSelectedCountry] = useState("");
    const [selectedPopulated, setSelectedPopulated] = useState("");

    return (
        <section className="volcanoes">
            <div className="container">
                <h1 className="volcanoes__title">Volcanoes</h1>
                {countryLoading ? (
                    <p className="loading__message">Loading...</p>
                ) : (
                    <form className="volcanoes__form">
                        <div className="volcanoes__form-countries">
                            <label htmlFor="country">Country: </label>
                            <select className="volcanoes__form-select" id="country" name="country" value={selectedCountry}
                                    onChange={(event) => setSelectedCountry(event.target.value)}>
                                <option value={""}></option>
                                {country.map((country) => (
                                    <option key={country}>{country}</option>
                                ))}
                            </select>
                        </div>

                        <div className="volcanoes__form-populated">
                            <label htmlFor="populated">Populated within</label>
                            <select className="volcanoes__form-select" id="populated" name="populated"
                                    value={selectedPopulated}
                                    onChange={(event) => setSelectedPopulated(event.target.value)}>
                                <option value="">All</option>
                                <option>5km</option>
                                <option>10km</option>
                                <option>30km</option>
                                <option>100km</option>
                            </select>
                        </div>
                    </form>
                )}
                <VolcanoTable selectedCountry={selectedCountry} selectedPopulated={selectedPopulated}/>
            </div>
        </section>
    );
}

function VolcanoTable({selectedCountry, selectedPopulated}) {
    // fetching volcano table data based on selectedCountry and selectedPopulated
    const {volcanoTable} = useVolcanoTable(selectedCountry, selectedPopulated);
    const navigate = useNavigate();

    // defining columns for Ag-Grid table
    const columns = [
        {headerName: "ID", field: "id" },
        {headerName: "Name", field: "name"},
        {headerName: "Country", field: "country"},
        {headerName: "Region", field: "region"},
        {headerName: "Subregion", field: "subregion"},
    ];

    return (
        <div className="volcano-table">
            <p className="volcano-table-info">
                <span
                    className="badge-secondary">{volcanoTable.length}
                </span> &nbsp;Volcano{volcanoTable.length === 1 ? "" : "s"} found in {selectedCountry}
            </p>

            <div className="ag-theme-alpine">
                <AgGridReact columnDefs={columns} rowData={volcanoTable} pagination={true} paginationPageSize={10}
                             onRowClicked={(row) => navigate(`./volcano?id=${row.data.id}${(selectedPopulated === "") ? "" : `&populatedWithin=${selectedPopulated}`}`)}/>
            </div>
        </div>
    );
}
