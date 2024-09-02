function calculateFee() {
    const submissionDate = new Date(document.getElementById('submissionDate').value);
    const grossSalary = parseFloat(document.getElementById('grossSalary').value);
    const deadlineDate = new Date("2024-06-30");

    if (isNaN(grossSalary) || submissionDate == "Invalid Date") {
        alert("Please enter valid values.");
        return;
    }

    const timeDifference = submissionDate - deadlineDate;
    const daysDelayed = Math.ceil(timeDifference / (1000 * 3600 * 24));

    let lateFee = 0;

    if (daysDelayed > 0 && daysDelayed <= 31) {
        lateFee = (grossSalary / 30) * daysDelayed;
    } else if (daysDelayed > 31) {
        const first31DaysFee = (grossSalary / 30) * 31;
        const remainingDaysFee = ((grossSalary * 6) / 30) * (daysDelayed - 31);
        lateFee = first31DaysFee + remainingDaysFee;
    }

    // Round the fee to the nearest integer
    lateFee = Math.round(lateFee);

    const multiple = lateFee / grossSalary;

    document.getElementById('fee').textContent = lateFee;
    document.getElementById('multiple').textContent = multiple.toFixed(2);

    // Generate forecast data
    generateForecast(grossSalary, deadlineDate);
}

function generateForecast(grossSalary, deadlineDate) {
    const labels = [];
    const data = [];
    let maxFee = 0;

    for (let i = 1; i <= 180; i++) {  // Forecast for up to 180 days delay
        let fee = 0;
        if (i <= 31) {
            fee = (grossSalary / 30) * i;
        } else {
            const first31DaysFee = (grossSalary / 30) * 31;
            const remainingDaysFee = ((grossSalary * 6) / 30) * (i - 31);
            fee = first31DaysFee + remainingDaysFee;
        }

        // Round the fee to the nearest integer for the forecast
        fee = Math.round(fee);

        labels.push(i + " days");
        data.push(fee);
        if (fee > maxFee) {
            maxFee = fee;
        }
    }

    const ctx = document.getElementById('feeChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Forecasted Late Fee (LKR)',
                data: data,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                fill: false
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Days Delayed'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Late Fee (LKR)'
                    }
                }
            }
        }
    });
}
