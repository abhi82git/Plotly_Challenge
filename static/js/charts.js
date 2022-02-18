function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var arrSamples = data.samples;
    var arrMetaData = data.metadata;

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var arrResultSample = arrSamples.filter(sampleObj => sampleObj.id == sample);
    var arrResultMetaData = arrMetaData.filter(sampleObj => sampleObj.id == sample);

    //  5. Create a variable that holds the first sample in the array.
    var resultSample = arrResultSample[0];
    var resultMetaDta = arrResultMetaData[0];
  

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var arrOTU_IDs = resultSample.otu_ids;
    var arrOTU_Labels = resultSample.otu_labels;
    var arrSample_Values = resultSample.sample_values;
    var arrWash_Freq = resultMetaDta.wfreq;

    console.log(arrOTU_IDs);
    console.log(arrOTU_Labels);
    console.log(arrSample_Values);
    console.log(arrWash_Freq);

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks= arrOTU_IDs.slice(0,10).map(id => 'OTU '+id).reverse();
    var xticks = arrSample_Values.slice(0,10).reverse();
    console.log(yticks);
    console.log(xticks);

    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: xticks,
      y: yticks,
      orientation: 'h',
      //width: 1,
      type: 'bar'
    }];
      
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found"
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar",barData,barLayout);

    // ****************************************
    // **********Bubble Chart *****************
    // ****************************************
    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: arrOTU_IDs,
      y: arrSample_Values,
      text: arrOTU_Labels,
      mode: 'markers',
      marker: {
        color: arrOTU_IDs,
        size: arrSample_Values
      }
    }];
    
    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: 'Bacteria Culture Per Sample',
      xaxis: {title: "OTU ID"},
      showlegend: false,
      height: 600,
      width: 600
    };
    
    // Gauge Chart
    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble",bubbleData,bubbleLayout); 

    // 4. Create the trace for the gauge chart.
    var gaugeData = [ {
      domain: { x: [0, 1], y: [0, 1] },
      value: arrWash_Freq,
      title: { text: "Belly Button Washing Frequency" },
      type: "indicator",
      mode: "gauge+number",
      //delta: { reference: 380 },
      gauge: {
        axis: { range: [null, 10] },
        bar: { color: "black" },
        steps: [
          { range: [0, 2], color: "red" },
          { range: [2, 4], color: "orange" },
          { range: [4, 6], color: "yellow" },
          { range: [6, 8], color: "lightgreen" },
          { range: [8, 10], color: "darkgreen" }
        ],
      }
    }];
        
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 500,
      height: 400,
      margin: { t: 25, r: 25, l: 25, b: 25 },
      font: { color: "black", family: "Arial" }
    };
    
    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge",gaugeData,gaugeLayout);
    
  });
}
