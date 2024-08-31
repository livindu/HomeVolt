    // Replace with your Google Sheets API key
const apiKey = 'AIzaSyCJUpx3d2aRxgOnbbB73WBpcZ1oI2YAauc';
// Replace with your Google Sheets ID
const sheetId = '14g5GswUj6mj411o2dYOPghzJthp97hfz5DZvOU3O5Ww';
// Specify the range of data you want to fetch (e.g., A1:B10)
const range = 'Sheet1!A1:B29';

document.addEventListener('DOMContentLoaded', function() {
    fetchSheetData();
    document.getElementById('mainBtn')?.addEventListener('click', showmainpower);
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

// Existing functions for chart updates
function fetchdata(device) {
    fetch('https://docs.google.com/spreadsheets/d/1sAMNYYz1C2wIRcYA9RqKjKGprR3Lu6DLK0xBm-Rg4EA/pub?output=csv')
        .then(response => response.text())
        .then(data => { 
            const parsedData = processCSV(data, device);
            updateChart(parsedData, device); 
        })
        .catch(error => console.error('Error fetching data:', error));
}

function processCSV(data, device) {
    const rows = data.split('\n');
    const headers = rows[0].split(',');
    const time = [];
    const power = [];
    
    const timeIndex = headers.indexOf('time');
    const devicePowerIndex = headers.indexOf(device + '_power');

    rows.slice(1).forEach(row => {
        const cols = row.split(',');
        if (cols.length > timeIndex && cols.length > devicePowerIndex) {
            time.push(cols[timeIndex]);
            power.push(parseFloat(cols[devicePowerIndex]));
        }
    });

    return { time, power };
}

function updateChart(data, device) {
    const ctx = document.getElementById('powerChart').getContext('2d');
    if (window.myChart) {
        window.myChart.destroy();
    }

    const xMin = Math.min(...data.time.map(t => parseInt(t.split(':')[0]))); 
    const xMax = Math.max(...data.time.map(t => parseInt(t.split(':')[10]))); 
    const yMin = 0; 
    const yMax = Math.max(...data.power) * 1.2; 

    window.myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.time,
            datasets: [{
                label: `${device.charAt(0).toUpperCase() + device.slice(1)} Power Consumption`,
                data: data.power,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
                tension: 0.1
            }]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Time (s)'
                    },
                    min: xMin,
                    max: xMax
                },
                y: {
                    title: {
                        display: true,
                        text: 'Power (W)'
                    },
                    min: yMin,
                    max: yMax
                }
            },
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

function showDevicePower(device) {
    document.getElementById('deviceIframe').style.display = 'none';
    document.getElementById('powerChart').style.display = 'block';
    document.getElementById('chartTitle').style.display = 'block';
    document.getElementById('chartTitle').innerText = `${device.charAt(0).toUpperCase() + device.slice(1)} Power Consumption`;
    fetchdata(device);
}

function showmainpower() {
    showDevicePower('main');
}




//  defining the logout function
function logout() {window.location.href = 'index.html';}

    document.getElementById('loginForm')?.addEventListener('submit', function(event) 
    {event.preventDefault(); const username = document.getElementById('username').value;
                             const password = document.getElementById('password').value;

    if (username === 'admin' && password === 'admin')    
         {window.location.href = 'dashboard.html';} 
    else 
         {alert('Invalid User Credentials');}});



