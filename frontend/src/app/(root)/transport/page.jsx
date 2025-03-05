'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

// Dynamically import the map component to avoid SSR issues
const TransportMap = dynamic(() => import('@/components/transport/TransportMap'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-[500px] bg-gray-100 animate-pulse flex items-center justify-center">
            <div className="text-gray-500">Loading Map...</div>
        </div>
    ),
});

export default function TransportPage() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Load any necessary scripts
        const loadExternalScripts = async () => {
            try {
                await Promise.all([
                    import('leaflet'),
                    import('@fortawesome/fontawesome-free/css/all.min.css'),
                ]);
                setIsLoading(false);
            } catch (error) {
                console.error('Error loading scripts:', error);
            }
        };

        loadExternalScripts();
    }, []);

    return (
        <div className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6 bg-gradient-to-r from-blue-600 to-green-500 rounded-lg shadow-lg p-4 md:p-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-white text-center">
                        University Bus Tracker
                    </h1>
                </div>

                {/* Map Container */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
                    <div className="w-full h-[400px] md:h-[500px] lg:h-[600px] relative">
                        <TransportMap />
                    </div>
                </div>

                {/* Bus Information Panel */}
                <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
                    <h2 className="text-lg md:text-xl font-semibold text-blue-600 mb-4 flex items-center gap-2">
                        <span role="img" aria-label="bus">🚌</span>
                        Bus Information
                    </h2>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div id="busStatus" className="p-4 bg-gray-50 rounded-lg border-l-4 border-blue-600">
                            <div className="text-gray-700">
                                Status: <span className="font-medium">Checking...</span>
                            </div>
                        </div>

                        <div id="lastUpdate" className="p-4 bg-gray-50 rounded-lg border-l-4 border-green-500">
                            <div className="text-gray-700">
                                Last Update: <span className="font-medium">--</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 
