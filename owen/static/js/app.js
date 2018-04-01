// $('.flexdatalist').flexdatalist({
//     minLength: 2,
//     valueProperty: '*',
//     visibleProperties: ["name","capital","continent"],
//     searchIn: 'name',
//     data: 'response.json'
// });  
  
  function init() {
    var data = [
        {
          values: [1],
          labels: ['Accelerated Training', 'Dont Know How to Yet', 'Other', 'Self-Taught', 'School or University'],
          type: 'pie',
        },
      ];
    
      Plotly.plot('pie', data, layout);

    var data_bar = [
      {
        x: [1],
        y: [1],
        barmode: 'group',
        type: 'bar',
      },
    ];

    var layout = {
      xaxis: {
          title: 'Age Began Coding'
      },
      yaxis: {
          title: 'Count'
      },
    };
  
    Plotly.plot('bar', data_bar);
  }
  
  init();

  function initialize(country) {
    // fetch data from /bubble/<country>
    var url_bubble = "/bubble/" + country;
    Plotly.d3.json(url_bubble, function(error, response_bubble) {
        var bubble_x = response_bubble.competency;
        var bubble_y = response_bubble.know;
        var bubble_size = response_bubble.sentiment;
        var bubble_title = response_bubble.languages;
        var bubble_color = response_bubble.colors;
        var love_hate = [];
        bubble_size.forEach(element => {
            love_hate.push(element.toString()+"%");
        });
        var text = [];
        for (var i=0; i<bubble_title.length; i++) {
            text.push(bubble_title[i]+"  Love:"+love_hate[i]);
        }
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
            text: text, 
        };

        var data_bubble = [trace_bubble];

        var layout_bubble = {
            title: "Survey of Software Engineers",
            titlefont : {
                size: 30,
            },
            bgcolor: "#D3D3D3",
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
    })    
};

initialize("United States");


  function updatePlotlyPie(newdata) {
    console.log('Data:', newdata);
  var PIE = document.getElementById('pie');
  Plotly.restyle(PIE, newdata);
}
  
  function updatePlotlyBar(newdata) {
      console.log('Data:', newdata);
    var BAR = document.getElementById('bar');
    Plotly.restyle(BAR, newdata);
  }

  function updatePlotBubble(newcountry) {
    var Bubble = document.getElementById("bubble");
    Plotly.restyle(Bubble, "x", [newcountry.competency]);
    Plotly.restyle(Bubble, "y", [newcountry.know]);
    var update = {"marker": {size: newcountry.sentiment, color: newcountry.sentiment,
                colorscale: "RdBu", showscale: true}};
    Plotly.restyle(Bubble, update);
}


  
  function optionChanged(country) {
      console.log('selection: ' + country);
      var url_bar = '/bar/'+country;
      var url_pie = "/pie/" + country;
      var url_bubble = '/bubble/' + country;
    Plotly.d3.json(url_bar, function(error, response_bar) {
        console.log(response_bar)
        Plotly.d3.json(url_pie, function(error,response_pie) {
            console.log(response_pie);

        var trace0 = {
            type: 'pie',
                values: [response_pie],
                hovertext: country,
            };
        
  
      var trace1 = {
          type: 'bar',
          y: [response_bar[1]],
          x: [response_bar[0]],
          barmode: 'group',
          hovertext: country,
      };
      
      var data_pie = trace0;
      var data_bar = trace1;
       updatePlotlyPie(data_pie);
       updatePlotlyBar(data_bar);
    });

    Plotly.d3.json(url_bubble, function(error, response_bubble) {
        console.log(response_bubble);

        updatePlotBubble(response_bubble);
    });
  });
  }
  
  optionChanged("United States");