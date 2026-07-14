document.getElementById('bookingForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission
    
    // Hide messages
    document.getElementById('message').style.display = 'none';
    document.getElementById('error-message').style.display = 'none';

    // Get form data
    const formData = {
        customerName: document.getElementById('customerName').value,
        carModel: document.getElementById('carModel').value,
        serviceType: document.getElementById('serviceType').value,
        preferredDate: document.getElementById('preferredDate').value,
        preferredTime: document.getElementById('preferredTime').value
    };

    // Send POST request
    fetch('/api/appointments', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(async response => {
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Network response was not ok');
        }
        return data;
    })
    .then(data => {
        // Show success message
        const msgDiv = document.getElementById('message');
        msgDiv.innerText = data.message;
        msgDiv.style.display = 'block';
        
        // Reset form
        document.getElementById('bookingForm').reset();
    })
    .catch(error => {
        // Show error message
        const errDiv = document.getElementById('error-message');
        errDiv.innerText = error.message || "Error booking appointment. Please try again later.";
        errDiv.style.display = 'block';
        console.error('There was a problem with the fetch operation:', error);
    });
});

document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const name = document.getElementById('searchName').value.trim();
    
    document.getElementById('searchMessage').style.display = 'none';
    document.getElementById('searchError').style.display = 'none';
    
    fetch(`/api/appointments/search?name=${encodeURIComponent(name)}`)
        .then(res => res.json())
        .then(data => {
            const list = document.getElementById('searchResults');
            list.innerHTML = '';
            
            if (data.length === 0) {
                list.innerHTML = '<li>No appointments found for this name.</li>';
                return;
            }
            
            data.forEach(appt => {
                const li = document.createElement('li');
                li.style.marginBottom = '20px';
                li.style.padding = '15px';
                li.style.border = '1px solid #ddd';
                li.style.borderRadius = '5px';
                li.style.backgroundColor = '#f9f9f9';
                
                const dateObj = new Date(appt.preferredDate);
                const dateStr = dateObj.toLocaleDateString();
                
                li.innerHTML = `<strong>${appt.carModel}</strong> - ${appt.serviceType} <br> 📅 Date: ${dateStr} <br> ⏰ Time: ${appt.preferredTime} <br>`;
                
                const cancelBtn = document.createElement('button');
                cancelBtn.innerText = 'Cancel Appointment';
                cancelBtn.style.marginTop = '10px';
                cancelBtn.style.backgroundColor = '#dc3545';
                cancelBtn.style.color = '#fff';
                cancelBtn.style.border = 'none';
                cancelBtn.style.padding = '8px 12px';
                cancelBtn.style.cursor = 'pointer';
                cancelBtn.style.borderRadius = '4px';
                
                cancelBtn.addEventListener('click', () => cancelAppointment(appt._id, name));
                
                li.appendChild(cancelBtn);
                list.appendChild(li);
            });
        })
        .catch(err => {
            const errDiv = document.getElementById('searchError');
            errDiv.innerText = 'Failed to search appointments.';
            errDiv.style.display = 'block';
        });
});

function cancelAppointment(id, searchName) {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;
    
    fetch(`/api/appointments/${id}`, { method: 'DELETE' })
        .then(res => res.json())
        .then(data => {
            const msgDiv = document.getElementById('searchMessage');
            if (data.error) {
                const errDiv = document.getElementById('searchError');
                errDiv.innerText = data.error;
                errDiv.style.display = 'block';
            } else {
                msgDiv.innerText = data.message || 'Appointment cancelled!';
                msgDiv.style.display = 'block';
                // Trigger search again to refresh the list
                document.getElementById('searchForm').dispatchEvent(new Event('submit'));
            }
        })
        .catch(err => {
            const errDiv = document.getElementById('searchError');
            errDiv.innerText = 'Failed to cancel appointment.';
            errDiv.style.display = 'block';
        });
}
