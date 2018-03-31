// Create a function to add dropdown list and plotly charts
function optionChanged() {
    d3.json("/countries", function(error, response){
        if (error) return console.warn(error);
        var selDataset = document.getElementById("selDataset");
        for (var i=0; i < response.length; i++) {
            var option = document.createElement("option");
            option.value = response[i];  
            option.innerHTML = response[i];
            selDataset.appendChild(option);
        }

        // create function for pie chart 
        function init(selDataset) {
            var country = selDataset.value;
            var url1 = "/pie/" + country;
            Plotly.d3.json(url1, function(error, response) {
                var pie_value = response;
                var pie_labels = ['Accelerated Training', 'Dont Know How to Yet', 'Other', 'Self-Taught', 'School or University'];
     
                    // create pie chart
                    var trace1 = {
                        type: "pie",
                        values: pie_value,
                        labels: pie_labels,
                    };
            
                    var data = [trace1];
            
                    var layout = {
                        title: "Methods People Learned to Code",
                        height: 500,
                        width: 800,    
                    };
                    Plotly.newPlot("pie", data, layout);  
                })    
            }
        init(selDataset);  
        }); 
    }
// Show plots when open the page
optionChanged();

// Create function to update plots
function updatePlot(newcountry) {
    var Pie = document.getElementById("pie");
    Plotly.restyle(Pie, "values", newcountry);
};
