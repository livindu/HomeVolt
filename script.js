
// Google Sheets API URL (replace with your published Google Sheets URL)
const sheetURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTrKiwFo6dNnSAqUctnDmv3QojlsAbd3KY3kExYjwe6Arbs-97ddtIfrKHwnpFYMU4Vp-m4YThsh2nl/pubhtmloutput=csv';


document.addEventListener('DOMContentLoaded', function() {
    fetchSheetData();
    document.getElementById('mainBtn')?.addEventListener('click', showmainpower);
});

// Function to fetch data from Google Sheet
function fetchSheetData() {
    fetch(sheetURL)
        .then(response => response.text())
        .then(data => {
            const parsedData = processCSV(data);
            updateStatus(parsedData);
        })
        .catch(error => console.error('Error fetching data:', error));
}

// Function to process CSV data
function processSheetCSV(data) {
    const rows = data.split('\n');
    const headers = rows[0].split(',');
    const voltageIndex = headers.indexOf('voltage');
    const currentIndex = headers.indexOf('current');
    
    let voltage = 0.0;
    let current = 0.0;
    
    if (rows.length > 1) {
        const latestRow = rows[rows.length - 1].split(',');
        voltage = parseFloat(latestRow[voltageIndex]);
        current = parseFloat(latestRow[currentIndex]);
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
    fetch('data.csv')
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


 //  define y and x axis 
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

//   function to show power consumption for specific devices on button one click
function showDevicePower(device) {
    document.getElementById('deviceIframe').style.display = 'none';
    document.getElementById('powerChart').style.display = 'block';
    document.getElementById('chartTitle').style.display = 'block';
    document.getElementById('chartTitle').innerText = `${device.charAt(0).toUpperCase() + device.slice(1)} Power Consumption`;
    fetchdata(device);
}

//  main power consumption chart
function showmainpower() {
    showDevicePower('main');
}

document.getElementById('mainBtn')?.addEventListener('click', showmainpower);
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('mainBtn')) {
        showmainpower();
    }
});



//  defining the logout function
function logout() {window.location.href = 'index.html';}

    document.getElementById('loginForm')?.addEventListener('submit', function(event) 
    {event.preventDefault(); const username = document.getElementById('username').value;
                             const password = document.getElementById('password').value;

    if (username === 'admin' && password === 'admin')    
         {window.location.href = 'dashboard.html';} 
    else 
         {alert('Invalid User Credentials');}});
