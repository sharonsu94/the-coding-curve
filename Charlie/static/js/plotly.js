function init(country) {
    // fetch data from /bubble/<country>
    var url = "/bubble/" + country;
    Plotly.d3.json(url, function(error, response) {
        var bubble_x = response.competency;
        var bubble_y = response.know;
        var bubble_size = response.sentiment;
        var bubble_title = response.languages;
        var bubble_color = response.colors;
        var love_hate = [];
        bubble_size.forEach(element => {
            love_hate.push(element.toString()+"%");
        });
        var x = [];
        var text = bubble_title.forEach(d => {
            love_hate.forEach(e => {
            x.push(d+" Love:"+e);
            })
        })
        //create bubble 2D plot
        var trace_bubble = {
            x: bubble_x,
            y: bubble_y,
            mode: "markers",
            
            marker: {
                size: bubble_size,
                color: bubble_size,
                colorscale: "RdBu",
                showscale: true,
            },
            text: x, 
        };

        var data_bubble = [trace_bubble];

        var layout_bubble = {
            title: "Survey of Software Engineers",
            titlefont : {
                size: 30,
            },
            bgcolor: "#D3D3D3",
            // showbackground: true,
            height: 500,
            width: 1050,
            xaxis: {
                title: "Hiring mamagers think it's important",
                titlefont: {
                    color: "blue",
                    family: "italic",
                    size: 20,
                },
            },
            yaxis: {
                title: "How many engineers know it",
                titlefont: {
                    color: "blue",
                    family: "italic",
                    size: 20,
                },
            },
        };
        Plotly.newPlot("bubble", data_bubble, layout_bubble);    


        // //create bubble 3D plot
        // var trace_bubble = {
        //     x: bubble_x,
        //     y: bubble_y,
        //     z: bubble_size,
        //     mode: "markers",
        //     type: "scatter3d",
        //     marker: {
        //         size: bubble_size,
        //         color: bubble_color,
        //     },
        //     text: bubble_title,    
        // };

        // var data_bubble = [trace_bubble];

        // var layout_bubble = {
        //     title: "Survey of Software Engineers",
        //     height: 600,
        //     width: 1050,
        //     scene: {
        //     xaxis: {
        //         title: "Importance",
        //         backgroundcolor: "#D3D3D3",
        //         showbackground: true,
        //         gridcolor: "#FFFFFF",
        //         titlefont: {
        //             color: "blue",
        //             family: "italic",
        //             size: 20,
        //         },
        //     },
        //     yaxis: {
        //         title: "Know",
        //         backgroundcolor: "#D3D3D3",
        //         showbackground: true,
        //         gridcolor: "#FFFFFF",
        //         titlefont: {
        //             color: "blue",
        //             family: "italic",
        //             size: 20,
        //         },
        //     },
        //     zaxis: {
        //         title: "Love %",
        //         ticksuffix: '%',
        //         backgroundcolor: "#D3D3D3",
        //         showbackground: true,
        //         gridcolor: "#FFFFFF",
        //         titlefont: {
        //             color: "blue",
        //             family: "italic",
        //             size: 20,
        //         },
        //     },
        // },
        // };
        // Plotly.newPlot("bubble", data_bubble, layout_bubble);
    })    
};

init("United States");

// create function to update plots
function updatePlot(newcountry) {
    var Bubble = document.getElementById("bubble");
    Plotly.restyle(Bubble, "x", [newcountry.competency]);
    Plotly.restyle(Bubble, "y", [newcountry.know]);
    var update = {"marker": {size: newcountry.sentiment, color: newcountry.sentiment,
                colorscale: "RdBu", showscale: true}};
    Plotly.restyle(Bubble, update);
    // Plotly.restyle(Bubble, "z", [newcountry.sentiment]);
}

// create getData function to act when sample was selected
function optionChanged(country) {
    url2 = "/bubble/" + country;
    Plotly.d3.json(url2, function(error, response){
        updatePlot(response);
    });      
}   