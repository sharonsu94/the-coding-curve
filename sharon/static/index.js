function init() {
    var trace1 = {
        values: [1, 1, 1, 1, 1],
        labels: ['Accelerated Training', 'Dont Know How to Yet', 'Other', 'Self-Taught', 'School or University'],
        type: 'pie'
    }
    var data = [trace1];
            
    var layout = {
        title: "Methods People Learned to Code",
        height: 500,
        width: 800,    
    };
    Plotly.newPlot("pie", data, layout);  
};

init();

function updatePlot(newdata) {
    var Pie = document.getElementById("pie");
    // console.log(Pie)
    Plotly.restyle("pie", newdata);
};

function optionChanged(country) {
    var url = "/pie/" + country;
    Plotly.d3.json(url, function(error, response) {
        console.log(response)
            var trace1 = {
                type: "pie",
                values: response,
                labels: ['Accelerated Training', 'Dont Know How to Yet', 'Other', 'Self-Taught', 'School or University'],
            };
            
            var data_pie = trace1;
            console.log(data_pie)
            updatePlot(data_pie)
})};

optionChanged("United States");
