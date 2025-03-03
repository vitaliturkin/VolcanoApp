import {useState, useEffect} from "react";

//the server URL
export const Server_URL = `http://4.237.58.241:3000`;

// hook to fetch country data from the server
export function useCountry () {
    const [loading, setLoading] = useState(true);
    const [country, setCountry] = useState([]);

    useEffect(() => {
        fetchCountry() // fetchCountry function
            .then((country => {
                setCountry(country);
            }))
            .then(() => setLoading(false));
    }, [] );

    return {loading, country};
}

// fetch country data from the server
function fetchCountry() {
    const serverUrl = `${Server_URL}/countries`
    return fetch(serverUrl)
        .then((res) => res.json())
        .catch((error) => {
            console.error("Failed to fetch countries data:", error);
            throw error;
        });
}

// hook to fetch volcano data based on country and population filter
export function useVolcanoTable(country, populatedWithin) {
    const [loading, setLoading] = useState(true);
    const [volcanoTable, setVolcanoTable] = useState([]);

    useEffect(() => {
        if (country !== "") {
            fetchVolcanoes(country, populatedWithin) // fetch volcano data with parameters
                .then((volcanoTable) => {
                    setVolcanoTable(volcanoTable);
                })
                .then(() => setLoading(false))
                .catch((error) => {
                        console.error("Failed to fetch volcano table:", error); // log error if fetch fails
                        setLoading(false);
                    });
        }
    }, [country, populatedWithin]);// effect when country or populatedWithin changes

    return { loading, volcanoTable };
}


// function to fetch volcano data based on country and population filter
function fetchVolcanoes(country, populatedWithin) {
    let serverUrl = `${Server_URL}/volcanoes/?country=${country}`
    if (populatedWithin !== null) {
        serverUrl += `&populatedWithin=${populatedWithin}`;
        }

        return fetch(serverUrl)
            .then((res) => res.json())
            .catch((error) => {
                console.error("Failed to fetch volcanoes data:", error);
                throw error;
            });
    }

// function to register a user account
export function registerAccount (email, password) {
    const serverUrl = `${Server_URL}/user/register`; // API endpoint for registration

    return fetch(serverUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email, password: password})
        })
            .then(res => res.json())
}

// function to login user and set authentication data
export function loginInAccount(email, password, setAuthData) {
    const serverUrl = `${Server_URL}/user/login`; // API endpoint for registration

    return fetch(serverUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    })
        .then(res => {
            if (!res.ok) {
                throw new Error("Login failed. Please check your credentials.");
            }
            return res.json();
        })
        .then(data => {
            localStorage.setItem("authData", JSON.stringify({ token: data.token, email }));
            setAuthData({ token: data.token, email }); // authentication data in state
            return data;
        })
        .catch(error => {
            throw error;
        });
}

// hook to fetch details of a specific volcano by ID
export function useVolcanoDetails(id) {
    const [loading, setLoading] = useState(true);
    const [volcanoDetails, setVolcanoDetails] = useState([]);

    useEffect(() => {
        if (id !== "") {
            fetchVolcanoDetailsById(id) // fetch volcano details by ID
                .then((volcanoDetails) => {
                    setVolcanoDetails(volcanoDetails);
                })
                .then(() => setLoading(false))
                .catch((error) => {
                    console.error("Failed to fetch volcano data:", error);
                    setLoading(false);
                });
        }
    }, [id]);// run effect when ID changes

    return { loading, volcanoDetails};
}

// function to fetch details of a specific volcano by ID
function fetchVolcanoDetailsById(id) {
    const serverUrl = `${Server_URL}/volcano/${id}`; // API endpoint for volcano details
    const authData = JSON.parse(localStorage.getItem("authData")); // getting authentication data from localStorage
    const headers = authData
        ? {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authData.token}`
        }
        : {};

    return fetch(serverUrl, { headers })
        .then(res => {
            if (!res.ok) {
                throw new Error("Failed to fetch volcano details");
            }
            return res.json();
        })
        .then(data => {
            // the required properties exist in the data
            const { population_5km, population_10km, population_30km, population_100km, ...volcanoDetails } = data;

            // volcano details with population data or null values if not available
            return {
                ...volcanoDetails,
                population_5km: population_5km || null,
                population_10km: population_10km || null,
                population_30km: population_30km || null,
                population_100km: population_100km || null
            };
        })
        .catch(error => {
            console.error("Error fetching volcano details:", error);
            throw error;
        });

}