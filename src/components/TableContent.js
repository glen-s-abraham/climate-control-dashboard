import React from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, BarElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend, TimeScale } from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(LineElement, BarElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend, TimeScale);

const TabContent = ({ data, type }) => {
    if (!data.length) return <p>No data to display</p>;

    const createDataset = (data, relayKey) => {
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

    const getChartOptions = (title) => ({
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: title,
                font: {
                    size: 18,
                },
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return `${context.dataset.label}: ${context.raw}`;
                    },
                },
            },
            legend: {
                position: 'top',
                labels: {
                    color: 'black',
                    font: {
                        size: 14,
                    },
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
                },
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Occurrences',
                },
            },
        },
    });

    const renderRelayStatus = (data, relayKey, title) => {
        const dataset = createDataset(data, relayKey);
        return <Bar data={dataset} options={getChartOptions(title)} />;
    };

    switch (type) {
        case 'sensordata':
            const sensorDataLabels = data.map(item => new Date(item.timestamp).toLocaleString());
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
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ width: '45%' }}>
                        <h2>Relay 1 Status</h2>
                        {renderRelayStatus(data, 'relay1', 'Relay 1 Status')}
                    </div>
                    <div style={{ width: '45%' }}>
                        <h2>Relay 2 Status</h2>
                        {renderRelayStatus(data, 'relay2', 'Relay 2 Status')}
                    </div>
                </div>
            );
        case 'errorlogs':
            return (
                <table>
                    <thead>
                        <tr>
                            <th>Timestamp</th>
                            <th>Error</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((log, index) => (
                            <tr key={index}>
                                <td>{new Date(log.timestamp).toLocaleString()}</td>
                                <td>{log.error}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            );
        default:
            return <p>Invalid data type</p>;
    }
};

export default TabContent;