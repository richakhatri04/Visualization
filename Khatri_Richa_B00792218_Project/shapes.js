//Declaraton of variables
var svg,svg2;
var loader = d3.select("#svg1").append("div").attr("class","loader").attr("height", 480).attr("width", 575);
var loader2=d3.select("#svg2").append("div").attr("class","loader").attr("height", 480).attr("width", 575);
var dataset=new Array();
i=0;
var formatDecimal = d3.format(".0f");
//features of data
var data = ["Precepitation", "Minimum Temprature", "Maximum Temprature","Snow"];
//tooltip for datapoints
var tooltip=d3.select('body').append('div').style('opacity','0').style('position','absolute')
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px");

//scale of years filter
var myData = ['2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019'];

var linearScale = d3.scaleLinear()
                    .domain([0, 11])
                    .range([0, 500]);
  
countryColor = d3.scaleQuantize().domain(myData).range(colorbrewer.Reds[7]);

//Initalize of variables
width=900;
height=450;
var year='2009';
var parameterValue="Precepitation";
var projection = d3.geoMercator()
    .scale(4300)
    .translate([-1500, 1185])
    .rotate([86.884, 0])
    .center([0, 35.507]);

var path = d3.geoPath()
    .projection(projection);

    function transition(path) {
        path.transition()
            .duration(2000)
    }

//DropDown of features
    var select = d3.select('#ddvalues')
      .append('select')
          .attr('class','select')
        .on('change',onchange)
    
    var options = select
      .selectAll('option')
        .data(data).enter()
        .append('option')
            .text(function (d) { return d; });
    
    function onchange() {
        selectValue = d3.select('select').property('value');
        parameterValue=selectValue;
        create_city_circles(year,parameterValue);
    };

  //Time scale with COlor
  d3.select('#wrapper')
    .selectAll('text')
    .data(myData)
    .enter()
    .append('text')
    .attr('x', function(d, i) {
            return linearScale(i);
          })
    .text(function(d) {
      return d;
    })   
    .style("fill", function(d) {return countryColor(d);})
    .on("click", function(){
        d3.select(".selected_label").style('font-weight','normal');
        d3.select(".selected_label").attr("class", null);
        d3.select(this).attr('class','selected_label').style('font-weight','bold');
        year=d3.select(this).text();
        create_city_circles(d3.select(this).text(),parameterValue);
    });


// Append Halifax Map
d3.json("Halifax.json")
    .then(function (data) {
        d3.select("#svg1").select(".loader").remove();
        svg = d3.select("#svg1").append("svg").attr("height", 480).attr("width", 575);
        svg.selectAll("path")
            .data(data.features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("stroke", "black")
            .attr("stroke-width", "1px")
            .attr("fill", 'lightblue')
            .attr("width", "2000px")
            .attr("height", "500px");
        
            svg.selectAll("text")
            .data(data.features)
            .attr("class","lblStationName")
            .enter()
            .append("text")
            .html(function(d){
                if(d.properties.name=="Yarmouth" || d.properties.name=="Halifax"|| d.properties.name=="Greenwood"||d.properties.name=="Sydney"||d.properties.name=="Cape Breton")
                {
                    if(d.properties.name=="Yarmouth")
                    {
                        if(d.properties.feat_desc=="Town")
                        {
                            return d.properties.name;
                        }
                    }
                    else{
                return d.properties.name;
                    }
                }                    
            })
            .attr('x', function(d){return path.centroid(d)[0]+10})
            .attr('y', function(d){return path.centroid(d)[1]-5})
            .style("font-size", "12px")
            .attr("font-weight","bold")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px");

        
// Call the function to append circles for the cities
create_city_circles(year,parameterValue);

        
});

// create circle based on total preception of the country
function create_city_circles(y,pv) {
    d3.select("#svg2").select("svg").remove();
    d3.select("#d_one").remove();
    svg.append("text")
    .attr("id", "d_one")
    .html('Precipitation value: '+y)
    .style('font-size', '30px')
    .style('font-weight','bold')
    .attr('class', 'red')
    .attr('x', 40)
    .attr('y', 50);


    d3.csv('climate-daily.csv').then(function (capitals_data) {

                                            var precipitationTotalByYearAndStationName;
                                            // ["Precepitation", "Minimum Temprature", "Maximum Temprature","Snow"];
                                            if(pv=="Precepitation")
                                            {
                                            precipitationTotalByYearAndStationName = d3.nest()
                                            .key(function(d) { return d.STATION_NAME; })
                                            .key(function(d) { return d.LOCAL_YEAR; })
                                            .key(function(d) { return d.x; })
                                            .key(function(d) { return d.y; })
                                            .rollup(function(v) { return d3.sum(v, function(d) { return d.TOTAL_PRECIPITATION; }); })
                                            .entries(capitals_data);

                                            }
                                            if(pv=="Minimum Temprature")
                                            {
                                                precipitationTotalByYearAndStationName = d3.nest()
                                                .key(function(d) { return d.STATION_NAME; })
                                                .key(function(d) { return d.LOCAL_YEAR; })
                                                .key(function(d) { return d.x; })
                                                .key(function(d) { return d.y; })
                                                .rollup(function(v) { return d3.sum(v, function(d) { return d.MIN_TEMPERATURE; }); })
                                                .entries(capitals_data);
                                            }
                                            if(pv=="Maximum Temprature")
                                            {
                                                precipitationTotalByYearAndStationName = d3.nest()
                                                .key(function(d) { return d.STATION_NAME; })
                                                .key(function(d) { return d.LOCAL_YEAR; })
                                                .key(function(d) { return d.x; })
                                                .key(function(d) { return d.y; })
                                                .rollup(function(v) { return d3.sum(v, function(d) { return d.MAX_TEMPERATURE; }); })
                                                .entries(capitals_data);
                                            }
                                            if(pv=="Snow")
                                            {
                                                precipitationTotalByYearAndStationName = d3.nest()
                                                .key(function(d) { return d.STATION_NAME; })
                                                .key(function(d) { return d.LOCAL_YEAR; })
                                                .key(function(d) { return d.x; })
                                                .key(function(d) { return d.y; })
                                                .rollup(function(v) { return d3.sum(v, function(d) { return d.TOTAL_SNOW; }); })
                                                .entries(capitals_data);
                                            }
                                            
                                            d3.select("#d_one").remove();
                                            svg.append("text")
                                            .attr("id", "d_one")
                                            .html(pv+' value for: '+y)
                                            .style('font-size', '30px')
                                            .style('font-weight','bold')
                                            .attr('class', 'red')
                                            .attr('x', 40)
                                            .attr('y', 50);

                                        
                                            var arr=[];
                                              for (var key in precipitationTotalByYearAndStationName) 
                                              {  //this will iterate through key1 - key3
                                                    for(var key2 in precipitationTotalByYearAndStationName[key]["values"])
                                                    {
                                                        for (var key3 in precipitationTotalByYearAndStationName[key]["values"][key2])
                                                        {
                                                            if(precipitationTotalByYearAndStationName[key]["values"][key2]["key"]==y)
                                                            {
                                                            for(var key4 in precipitationTotalByYearAndStationName[key]["values"][key2]["values"])
                                                            {
                                                                for(var key5 in precipitationTotalByYearAndStationName[key]["values"][key2]["values"][key4]["values"])
                                                                {
                                                                   var precipitationValue=formatDecimal(precipitationTotalByYearAndStationName[key]["values"][key2]["values"][key4]["values"][key5]["value"]); 
                                                                   arr.push(precipitationValue);//*0.0007 

                                                                    svg.append("circle")
                                                                        .style("fill", "red")
                                                                        .style("opacity", 0.6)
                                                                        .attr("cx", function () { return projection([precipitationTotalByYearAndStationName[key]["values"][key2]["values"][key4]["key"], precipitationTotalByYearAndStationName[key]["values"][key2]["values"][key4]["values"][key5]["key"]])[0]; })
                                                                        .attr("cy", function () { return projection([precipitationTotalByYearAndStationName[key]["values"][key2]["values"][key4]["key"], precipitationTotalByYearAndStationName[key]["values"][key2]["values"][key4]["values"][key5]["key"]])[1]; })
                                                                        .attr("r", function () { 
                                                                            return (precipitationTotalByYearAndStationName[key]["values"][key2]["values"][key4]["values"][key5]["value"] * 0.007); 
                                                                        })
                                                                        .attr("fill", "red")
                                                                        .on("mousemove", function(d){
                                                                            tooltip.style("opacity","1")
                                                                            .style("fill", "violet")
                                                                            .style("left",d3.event.pageX+"px")
                                                                            .style("top",d3.event.pageY+"px");
                                                                            tooltip.html("value : "+formatDecimal((this.r["animVal"].value*1000)/7));
                                                                        })
                                                                        .on("mouseout",function(d) {
                                                                            tooltip
                                                                              .style("opacity", 0)
                                                                             d3.select(this)
                                                                              .style("stroke", "none")
                                                                              .style("opacity", 0.8)
                                                                          });
                                                                }
                                                            }
                                                        }//if end
                                                        };
                                                    }
                                            }
                                            dataset=arr;
                                         
                                            var dataPrecepitation=[];       
                                            var lineJSON=[];
                                            var precipitationMonthlyforAYear = d3.nest()
                                            .key(function(d) { return d.LOCAL_YEAR; })
                                            .key(function(d) { return d.LOCAL_MONTH; })
                                            .rollup(function(v) { return d3.sum(v, function(d) { return d.TOTAL_PRECIPITATION; }); })
                                            .entries(capitals_data);

                                            for(var index in precipitationMonthlyforAYear)
                                            {
                                                if(precipitationMonthlyforAYear[index]["key"]==y)
                                                {
                                                    for(var precipitationValue in precipitationMonthlyforAYear[index]["values"])
                                                    {
                                                        month=precipitationMonthlyforAYear[index]["values"][precipitationValue]["key"];
                                                        data=precipitationMonthlyforAYear[index]["values"][precipitationValue]["value"];//*0.0007
                                                        var newObj={key:month,value:data};
                                                        lineJSON.push(newObj);
                                                        dataPrecepitation.push(data);
                                                    }
                                                }
                                            }
                                            d3.select("#svg2").select(".loader").remove();
                                            svg2=d3.select("#svg2").append("svg").attr("height", height).attr("width", width);
                                           
                                            svg2
                                            .append("text")
                                            .html("Monthly data of climate condition")
                                            .style('font-size', '21px')
                                            .style('font-weight','bold')
                                            .attr('x','70')
                                            .attr('y','20'); 


                                            var xScale = d3.scaleLinear()
                                            .domain([1,12])
                                            .range([0,800]);
                                           
                                            svg2.append("g")
                                            .attr("class", "x axis")
                                            .attr("transform", "translate(50,430)")
                                            .call(d3.axisBottom(xScale));
                                               
                                            var yScale = d3.scaleLinear()
                                            .domain([d3.min(dataPrecepitation), d3.max(dataPrecepitation)]) // input 
                                            .range([420, 0]); // output 
    
                                            svg2.append("g")
                                            .attr("class", "y axis")
                                            .attr("transform", "translate(50, 10)")
                                            .call(d3.axisLeft(yScale));
                                            
                                            
                                            var line = d3.line()
                                            .x(function(d) { return xScale(d.key); }) // set the x values for the line generator
                                            .y(function(d) {return yScale(d.value); }) // set the y values for the line generator 
                                            .curve(d3.curveMonotoneX) // apply smoothing to the line
                                        
                                            
                                                    svg2.append("path")
                                                    .datum(lineJSON) // Binds data to the line 
                                                    .attr("class", "line") // Assign a class for styling 
                                                    .attr("transform", "translate(50, 10)")
                                                    .attr("d", line)
                                                    .call(transition);

                                                    svg2.selectAll(".dot")
                                                    .data(lineJSON)
                                                    .enter().append("circle") // Uses the enter().append() method
                                                        .attr("class", "dot") // Assign a class for styling
                                                        .attr("cx", function(d) { return xScale(d.key) })
                                                        .attr("cy", function(d) { return yScale(d.value) })
                                                        .attr("transform", "translate(50, 10)")
                                                        .attr("r", 5)
                                                        .on("mousemove", function(d){
                                                            tooltip.style("opacity","1")
                                                            .style("fill", "violet")
                                                            .style("left",d3.event.pageX+"px")
                                                            .style("top",d3.event.pageY+"px");
                                                            tooltip.html("value : "+formatDecimal(d.value));
                                                        })
                                                        .on("mouseout",function(d) {
                                                            tooltip
                                                              .style("opacity", 0)
                                                             d3.select(this)
                                                              .style("stroke", "none")
                                                              .style("opacity", 0.8)
                                                          });

                                                          //x axis label
                                                          svg2.append("text")             
                                                                .attr("transform",
                                                                        "translate(" + (width/2) + " ," + 
                                                                                    (height ) + ")")
                                                                .style("text-anchor", "middle")
                                                                .text("Months");

                                                        // text label for the y axis
                                                        svg2.append("text")
                                                        .attr('id','lblYAxis')
                                                        .attr("transform", "rotate(-90)")
                                                        .attr("y", 0)
                                                        .attr("x",0 - (height / 2))
                                                        .attr("dy", "1em")
                                                        .style("text-anchor", "middle")
                                                        .text(pv);

    });
}





