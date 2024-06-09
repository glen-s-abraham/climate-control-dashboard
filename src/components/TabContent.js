import React, { useEffect, useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, BarElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend, TimeScale, Filler } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { Pagination } from 'react-bootstrap';

ChartJS.register(LineElement, BarElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend, TimeScale, Filler);

const TabContent = ({ data, type }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [isClient, setIsClient] = useState(false);
    const itemsPerPage = 10;

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (isClient) {
            (async () => {
                const { default: zoomPlugin } = await import('chartjs-plugin-zoom');
                ChartJS.register(zoomPlugin);
            })();
        }
    }, [isClient]);

    const sortedData = data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(sortedData.length / itemsPerPage);

    if (!data.length) return <p>No data to display</p>;

    // Helper function to create dataset for relay status
    const createDataset = (data, relayKey) => {
        const labels = data.map(item => new Date(item.timestamp));
        const relayOnData = data.filter(item => item[relayKey] === 'ON').map(item => ({
            x: new Date(item.timestamp),
            y: 1,
        }));

        const relayOffData = data.filter(item => item[relayKey] === 'OFF').map(item => ({
            x: new Date(item.timestamp),
            y: 1,
        }));

        return {
            datasets: [
                {
                    label: 'ON',
                    data: relayOnData,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                },
                {
                    label: 'OFF',
                    data: relayOffData,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1,
                },
            ],
        };
    };

    // Helper function to get chart options including zoom and pan plugin
    const getChartOptions = (title) => ({
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: title,
                font: {
                    size: 18,
                    color: '#fff', // Light color for better readability in dark mode
                },
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return `${context.dataset.label}: ${context.raw}`;
                    },
                },
                titleColor: '#fff', // Light color for better readability in tooltips
                bodyColor: '#fff', // Light color for tooltip body
            },
            legend: {
                position: 'top',
                labels: {
                    color: '#fff', // Light color for legend text
                    font: {
                        size: 14,
                    },
                },
            },
            zoom: {
                pan: {
                    enabled: true,
                    mode: 'xy',
                },
                zoom: {
                    wheel: {
                        enabled: true,
                    },
                    pinch: {
                        enabled: true,
                    },
                    mode: 'xy',
                },
            },
        },
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'minute',
                },
                title: {
                    display: true,
                    text: 'Time',
                    color: '#fff', // Light color for axis titles
                },
                ticks: {
                    color: '#fff', // Light color for axis ticks
                },
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Occurrences',
                    color: '#fff', // Light color for axis titles
                },
                ticks: {
                    color: '#fff', // Light color for axis ticks
                },
            },
        },
    });

    // Helper function to render relay status bar chart
    const renderRelayStatus = (data, relayKey, title) => {
        const dataset = createDataset(data, relayKey);
        return <Bar data={dataset} options={getChartOptions(title)} />;
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const renderPaginationItems = () => {
        const items = [];
        for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
            items.push(
                <Pagination.Item key={pageNumber} active={pageNumber === currentPage} onClick={() => handlePageChange(pageNumber)}>
                    {pageNumber}
                </Pagination.Item>
            );
        }
        return items;
    };

    switch (type) {
        case 'sensordata':
            const sensorDataLabels = data.map(item => new Date(item.timestamp));
            const sensorDataSet = {
                labels: sensorDataLabels,
                datasets: [
                    {
                        label: 'Temperature (F)',
                        data: data.map(item => item.temperature_f),
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        fill: false,
                    },
                    {
                        label: 'Temperature (C)',
                        data: data.map(item => item.temperature_c),
                        borderColor: 'rgba(153, 102, 255, 1)',
                        backgroundColor: 'rgba(153, 102, 255, 0.2)',
                        fill: false,
                    },
                    {
                        label: 'Humidity',
                        data: data.map(item => item.humidity),
                        borderColor: 'rgba(255, 159, 64, 1)',
                        backgroundColor: 'rgba(255, 159, 64, 0.2)',
                        fill: false,
                    },
                ],
            };
            return <Line data={sensorDataSet} options={getChartOptions('Sensor Data')} />;
    
        case 'relaystatus':
            return (
                <div className="row">
                    <div className="col-md-6">
                        <h2 className="text-white">Relay 1 Status</h2>
                        {renderRelayStatus(data, 'relay1', 'Relay 1 Status')}
                    </div>
                    <div className="col-md-6">
                        <h2 className="text-white">Relay 2 Status</h2>
                        {renderRelayStatus(data, 'relay2', 'Relay 2 Status')}
                    </div>
                </div>
            );

        case 'errorlogs':
            return (
                <div>
                    <table className="table table-striped table-dark">
                        <thead>
                            <tr>
                                <th>Timestamp</th>
                                <th>Error</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((log, index) => (
                                <tr key={index}>
                                    <td>{new Date(log.timestamp).toLocaleString()}</td>
                                    <td>{log.error}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <Pagination>{renderPaginationItems()}</Pagination>
                </div>
            );

        default:
            return <p className="text-white">Invalid data type</p>;
    }
};

export default TabContent;