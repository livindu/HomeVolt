
//  defining the function to fetch data from the .csv file (power data)

function fetchdata(device) {
    fetch('data.csv')
        .then(response => response.text())
        .then(data => { const parsedData = processCSV(data, device);
                        updateChart(parsedData, device); })
        .catch(error => console.error('Error fetching data:', error)); // if error detected issue
}

//  process the .comma seperated values data file fro data extraction
function processCSV(data, device) {
    const rows = data.split('\n');
    const headers = rows[0].split(','); // read each data seperated by comma
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

//  defining the function to update the chart 
function updateChart(data, device) {
    const ctx = document.getElementById('powerChart').getContext('2d');
    if (window.myChart) {
        window.myChart.destroy();
    }

    //  define y and x axis 
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
                tension: 0.1            }]        },
        
        // scale x axis and y axis
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
                    // min: 0,
                 //   max: 100,
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