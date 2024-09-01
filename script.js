// Replace with your Google Sheets API key
const apiKey = 'AIzaSyCJUpx3d2aRxgOnbbB73WBpcZ1oI2YAauc';
// Replace with your Google Sheets ID
const sheetId = '14g5GswUj6mj411o2dYOPghzJthp97hfz5DZvOU3O5Ww';
// Specify the range of data you want to fetch (e.g., A1:B10)
const range = 'Sheet1!A1:B29';

document.addEventListener('DOMContentLoaded', function() {
    fetchSheetData();
    document.getElementById('mainBtn')?.addEventListener('click', () => showDevicePower('main'));
    document.getElementById('combinedBtn')?.addEventListener('click', showCombinedPower);
});

// Function to fetch data from Google Sheet using Google Sheets API
function fetchSheetData() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const parsedData = processSheetData(data);
            updateStatus(parsedData);
        })
        .catch(error => console.error('Error fetching data:', error));
}

// Function to process Google Sheets data
function processSheetData(data) {
    const rows = data.values;
    let voltage = 0.0;
    let current = 0.0;

    // Assuming the first row contains headers and the second row contains the latest data
    if (rows.length > 1) {
        const latestRow = rows[1];
        voltage = parseFloat(latestRow[0]); // Adjust the index based on your sheet structure
        current = parseFloat(latestRow[1]); // Adjust the index based on your sheet structure
    }

    return { voltage, current };
}

// Function to update the status display
function updateStatus(data) {
    document.getElementById('voltage').innerText = `${data.voltage} V`;
    document.getElementById('current').innerText = `${data.current} A`;
}

// Function to fetch data for multiple devices and update the chart
function fetchCombinedData(devices) {
    fetch('https://docs.google.com/spreadsheets/d/1sAMNYYz1C2wIRcYA9RqKjKGprR3Lu6DLK0xBm-Rg4EA/pub?output=csv')
        .then(response => response.text())
        .then(data => { 
            const parsedData = processCombinedCSV(data, devices);
            updateCombinedChart(parsedData, devices); 
        })
        .catch(error => console.error('Error fetching data:', error));
}

function processCombinedCSV(data, devices) {
    const rows = data.split('\n');
    const headers = rows[0].split(',');
    const time = [];
    const powerData = {};

    devices.forEach(device => {
        powerData[device] = [];
    });

    const timeIndex = headers.indexOf('time');

    rows.slice(1).forEach(row => {
        const cols = row.split(',');
        if (cols.length > timeIndex) {
            time.push(cols[timeIndex]);

            devices.forEach(device => {
                const devicePowerIndex = headers.indexOf(device + '_power');
                if (cols.length > devicePowerIndex) {
                    powerData[device].push(parseFloat(cols[devicePowerIndex]));
                }
            });
        }
    });

    return { time, powerData };
}

function updateCombinedChart(data, devices) {
    const ctx = document.getElementById('powerChart').getContext('2d');
    if (window.myChart) {
        window.myChart.destroy();
    }

    const datasets = devices.map(device => ({
        label: `${device.charAt(0).toUpperCase() + device.slice(1)} Power Consumption`,
        data: data.powerData[device],
        borderColor: getRandomColor(),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0.1
    }));

    window.myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.time,
            datasets: datasets
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Time (s)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Power (W)'
                    }
                }
            },
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

function getRandomColor() {
    return `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`;
}

function showDevicePower(device) {
    document.getElementById('deviceIframe').style.display = 'none';
    document.getElementById('powerChart').style.display = 'block';
    document.getElementById('chartTitle').style.display = 'block';
    document.getElementById('chartTitle').innerText = `${device.charAt(0).toUpperCase() + device.slice(1)} Power Consumption`;
    fetchdata(device);
}

function showCombinedPower() {
    document.getElementById('deviceIframe').style.display = 'none';
    document.getElementById('powerChart').style.display = 'block';
    document.getElementById('chartTitle').style.display = 'block';
    document.getElementById('chartTitle').innerText = 'Combined Power Consumption';
    
    const devices = ['main', 'kettle', 'fan', 'computer', 'mobile', 'iron'];
    fetchCombinedData(devices);

//  defining the logout function
function logout() { window.location.href = 'index.html'; }

document.getElementById('loginForm')?.addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === 'admin' && password === 'admin') {
        window.location.href = 'dashboard.html';
    } else {
        alert('Invalid User Credentials');
    }
});
