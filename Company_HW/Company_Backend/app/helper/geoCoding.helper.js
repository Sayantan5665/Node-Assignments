async function getCoordinates(address) {
    const opencageKey = process.env.OPENCAGE_API_KEY;

    try {
        const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${opencageKey}`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Check for OpenCage success status
        if (data.status.code === 200 && data.results.length > 0) {
            const location = data.results[0].geometry;
            // console.log("location: ", location);
            return { lat: location.lat, lng: location.lng };
        } else {
            throw new Error(`Geocoding failed: ${data.status.message}`);
        }
    } catch (error) {
        console.error(error);
        throw new Error('Could not retrieve coordinates');
    }
}

module.exports = getCoordinates;