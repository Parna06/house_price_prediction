function getBathValue() {
    var uiBathrooms = document.getElementsByName("uiBathrooms");
    for(var i = 0; i < uiBathrooms.length; i++) {
        if(uiBathrooms[i].checked) {
            return parseInt(uiBathrooms[i].value);
        }
    }
    return -1;
}

function getBHKValue() {
    var uiBHK = document.getElementsByName("uiBHK");
    for(var i = 0; i < uiBHK.length; i++) {
        if(uiBHK[i].checked) {
            return parseInt(uiBHK[i].value);function getBathValue() {
                var uiBathrooms = document.getElementsByName("uiBathrooms");
                for (var i = 0; i < uiBathrooms.length; i++) {
                    if (uiBathrooms[i].checked) {
                        return parseInt(uiBathrooms[i].value);
                    }
                }
                return -1;
            }
            
            function getBHKValue() {
                var uiBHK = document.getElementsByName("uiBHK");
                for (var i = 0; i < uiBHK.length; i++) {
                    if (uiBHK[i].checked) {
                        return parseInt(uiBHK[i].value);
                    }
                }
                return -1;
            }
            
            function onClickedEstimatePrice() {
                console.log("Estimate price button clicked");
            
                // Disable button and show loading state
                var button = document.querySelector(".btn");
                button.disabled = true;
                button.innerHTML = "Estimating...";
            
                // Get form values
                var sqft = document.getElementById("uiSqft").value;
                var bhk = getBHKValue();
                var bathrooms = getBathValue();
                var location = document.getElementById("uiLocations").value;
            
                // Validate inputs
                if (!sqft || sqft <= 0) {
                    alert("Please enter valid square footage");
                    button.disabled = false;
                    button.innerHTML = "Estimate Price";
                    return;
                }
                if (bhk === -1) {
                    alert("Please select number of bedrooms");
                    button.disabled = false;
                    button.innerHTML = "Estimate Price";
                    return;
                }
                if (bathrooms === -1) {
                    alert("Please select number of bathrooms");
                    button.disabled = false;
                    button.innerHTML = "Estimate Price";
                    return;
                }
                if (!location) {
                    alert("Please select a location");
                    button.disabled = false;
                    button.innerHTML = "Estimate Price";
                    return;
                }
            
                // Create form data
                var formData = new FormData();
                formData.append('total_sqft', sqft);
                formData.append('bhk', bhk);
                formData.append('bath', bathrooms);
                formData.append('location', location);
            
                // Make API request
                console.log("Making API request with:", {
                    total_sqft: sqft,
                    bhk: bhk,
                    bath: bathrooms,
                    location: location
                });
            
                $.ajax({
                    url: "/predict_home_price",
                    type: "POST",
                    data: formData,
                    processData: false,
                    contentType: false,
                    success: function (response) {
                        console.log("API Response:", response);
                        if (response.estimated_price) {
                            var price = response.estimated_price;
                            document.getElementById("uiEstimatedPrice").innerHTML = "<h2>Estimated Price: " + price.toString() + " Lakh</h2>";
                        } else {
                            alert("Error: " + (response.error || "Could not estimate price"));
                        }
                    },
                    error: function (xhr, status, error) {
                        console.error("API Error:", error);
                        console.error("Response:", xhr.responseText);
                        try {
                            var response = JSON.parse(xhr.responseText);
                            alert("Error: " + (response.error || "Could not estimate price"));
                        } catch (e) {
                            alert("Error getting estimation. Please try again.");
                        }
                    },
                    complete: function () {
                        // Re-enable button and reset text
                        button.disabled = false;
                        button.innerHTML = "Estimate Price";
                    }
                });
            }
            
            function onPageLoad() {
                console.log("Loading locations...");
            
                // Get location names
                $.get("/get_location_names", function (data) {
                    console.log("Got locations:", data);
            
                    if (data && data.location) {
                        var locations = data.location;
                        var uiLocations = $('#uiLocations');
            
                        // Clear and initialize dropdown
                        uiLocations.empty();
                        uiLocations.append('<option value="" disabled selected>Choose a Location</option>');
            
                        // Add locations
                        locations.forEach(function (location) {
                            var displayName = location.split(' ')
                                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                .join(' ');
                            uiLocations.append(new Option(displayName, location));
                        });
                    } else {
                        console.error("Error loading locations:", data);
                    }
                });
            }
            
            // Initialize on page load
            window.onload = onPageLoad;
        }
    }
    return -1;
}

function onClickedEstimatePrice() {
    console.log("Estimate price button clicked");
    
    // Get form values
    var sqft = document.getElementById("uiSqft").value;
    var bhk = getBHKValue();
    var bathrooms = getBathValue();
    var location = document.getElementById("uiLocations").value;
    
    // Validate inputs
    if (!sqft || sqft <= 0) {
        alert("Please enter valid square footage");
        return;
    }
    if (bhk === -1) {
        alert("Please select number of bedrooms");
        return;
    }
    if (bathrooms === -1) {
        alert("Please select number of bathrooms");
        return;
    }
    if (!location) {
        alert("Please select a location");
        return;
    }

    // Create form data
    var formData = new FormData();
    formData.append('total_sqft', sqft);
    formData.append('bhk', bhk);
    formData.append('bath', bathrooms);
    formData.append('location', location);

    // Make API request
    console.log("Making API request with:", {
        total_sqft: sqft,
        bhk: bhk,
        bath: bathrooms,
        location: location
    });

    $.ajax({
        url: "/predict_home_price",
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function(response) {
            console.log("API Response:", response);
            if (response.estimated_price) {
                var price = response.estimated_price;
                document.getElementById("uiEstimatedPrice").innerHTML = "<h2>" + price.toString() + " Lakh</h2>";
            } else {
                alert("Error: " + (response.error || "Could not estimate price"));
            }
        },
        error: function(xhr, status, error) {
            console.error("API Error:", error);
            console.error("Response:", xhr.responseText);
            try {
                var response = JSON.parse(xhr.responseText);
                alert("Error: " + (response.error || "Could not estimate price"));
            } catch(e) {
                alert("Error getting estimation. Please try again.");
            }
        }
    });
}

function onPageLoad() {
    console.log("Loading locations...");
    
    // Get location names
    $.get("/get_location_names", function(data) {
        console.log("Got locations:", data);
        
        if (data && data.location) {
            var locations = data.location;
            var uiLocations = $('#uiLocations');
            
            // Clear and initialize dropdown
            uiLocations.empty();
            uiLocations.append('<option value="" disabled selected>Choose a Location</option>');
            
            // Add locations
            locations.forEach(function(location) {
                var displayName = location.split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');
                uiLocations.append(new Option(displayName, location));
            });
        } else {
            console.error("Error loading locations:", data);
        }
    });
}

// Initialize on page load
window.onload = onPageLoad;