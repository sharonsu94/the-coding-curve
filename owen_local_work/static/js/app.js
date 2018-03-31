function init() {
    var trace1 = {
        x: ['giraffes', 'orangutans', 'monkeys'],
        y: [20, 14, 23],
        name: 'SF Zoo',
        type: 'bar'
      };
      
    //   var trace2 = {
    //     x: ['giraffes', 'orangutans', 'monkeys'],
    //     y: [12, 18, 29],
    //     name: 'LA Zoo',
    //     type: 'bar'
    //   };
      
      var data = trace1;
      
      var layout = {barmode: 'group'};
      
      Plotly.plot('bar', data, layout);
  }
  
  init();
  
  function updatePlotlyBar(newdata) {
      console.log('Data:', newdata);
    var BAR = document.getElementById('bar');
    Plotly.restyle(BAR, newdata);
  }
  
  function optionChanged(country) {
      console.log('selection: ' + country);
      var url_bar = '/bar/'+country;
    Plotly.d3.json(url_bar, function(error, response) {
         console.log(response);
  
      var trace1 = {
          type: 'bar',
          y: [response[1]],
          x: [response[0]],
          name: 'all'
        //   barmode: 'group',
      };

    //   var trace2 = {
    //       type: 'bar',
    //       y: [response[5]],
    //       x: [response[4]],
    //       name: 'male'
    //     //   hovertext: country,
    //     //   barmode: 'group',
    //   };
  
      var data_bar = trace1;
       updatePlotlyBar(data_bar);
  });
    //   d3.json(url_meta, function(error, response) {
    //       console.log(response);
    //   var meta_table = document.getElementById("sample_metadata")
    //   meta_table.innerHTML = "";
    //   for(var key in response) {
    //       var row = document.createElement("tr");
    //       var el = document.createElement("th");
    //       var el2 = document.createElement("td");
    //       el.textContent = key
    //       el2.textContent = " " + response[key];
    //       row.appendChild(el);
    //       row.appendChild(el2);
    //       meta_table.appendChild(row);
    //   }
    //   })
  }
  
  optionChanged("United States");