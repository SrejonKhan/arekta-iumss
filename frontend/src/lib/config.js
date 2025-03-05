const config = {
    traccarServer: 'https://demo.traccar.org',
    traccarUsername: 'knownaskawsar@gmail.com',
    traccarPassword: 'k@wch@r#',

    busDeviceId: '3497', // Device ID 

    // Map configuration
    defaultLocation: {
        lat: 23.4613464, // Default location from your position
        lng: 91.1890411, // Default location from your position
        zoom: 15 // Increased zoom for better detail
    },

    // Update interval in milliseconds (1 seconds for more frequent updates)
    updateInterval: 10000
};

export default config; 