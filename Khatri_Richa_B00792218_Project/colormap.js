var svg;
var loader= d3.select('#map_container').append("div").attr("class","loader").attr("height", 480).attr("width", 575);
var featurevalue=[];
var parameterValue="Precepitation";
//Initalize pie parameters
var dataValueSnow=0,dataValueMaxTemp=0,dataValueMinTemp=0;
var formatDecimal = d3.format(".0f");
var data = ["Precepitation", "Minimum Temprature", "Maximum Temprature","Snow"];
var color = d3.scaleQuantile()
    .range(["rgb(237, 248, 233)", "rgb(186, 228, 179)", "rgb(116,196,118)", "rgb(49,163,84)", "rgb(0,109,44)"]);

color.domain([0,1580]);
var dataState='';
var dataValue='';

//tooltip for datapoints
var tooltip=d3.select('body').append('div').style('opacity','0').style('position','absolute')
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px");

var projection = d3.geoMercator()
    .scale(4200)
    .translate([-1500, 1200])
    .rotate([86.884, 0])
    .center([0, 35.507]);

var path = d3.geoPath()
    .projection(projection);


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
        create_city_colors(parameterValue);
    };


create_city_colors(parameterValue);

calculate_pie();




function calculate_pie()
{
  d3.csv('climate-daily.csv').then(function (capitals_data) {
      //MIN TEMP
      var  minTempByYearAndStationName = d3.nest()
      .key(function(d) { return d.STATION_NAME; })
      .key(function(d) { return d.LOCAL_YEAR; })
      .key(function(d) { return d.x; })
      .key(function(d) { return d.y; })
      .rollup(function(v) { return d3.sum(v, function(d) { return d.MIN_TEMPERATURE; }); })
      .entries(capitals_data);

      for (var key in minTempByYearAndStationName) {  //this will iterate through key1 - key3
        for(var key2 in minTempByYearAndStationName[key]["values"])
        {
            for (var key3 in minTempByYearAndStationName[key]["values"][key2])
            {
                if(minTempByYearAndStationName[key]["values"][key2]["key"]==2012)
                {
                for(var key4 in minTempByYearAndStationName[key]["values"][key2]["values"])
                {
                    for(var key5 in minTempByYearAndStationName[key]["values"][key2]["values"][key4]["values"])
                    {
                        dataValueMinTemp+=minTempByYearAndStationName[key]["values"][key2]["values"][key4]["values"][key5]["value"];
                    }
                    }
                }
            }//if end
            }
        }

        //MAX TEMP
        var  maxTempByYearAndStationName = d3.nest()
        .key(function(d) { return d.STATION_NAME; })
        .key(function(d) { return d.LOCAL_YEAR; })
        .key(function(d) { return d.x; })
        .key(function(d) { return d.y; })
        .rollup(function(v) { return d3.sum(v, function(d) { return d.MAX_TEMPERATURE; }); })
        .entries(capitals_data);
  
        for (var key in maxTempByYearAndStationName) {  //this will iterate through key1 - key3
          for(var key2 in maxTempByYearAndStationName[key]["values"])
          {
              for (var key3 in maxTempByYearAndStationName[key]["values"][key2])
              {
                  if(maxTempByYearAndStationName[key]["values"][key2]["key"]==2012)
                  {
                  for(var key4 in maxTempByYearAndStationName[key]["values"][key2]["values"])
                  {
                      for(var key5 in maxTempByYearAndStationName[key]["values"][key2]["values"][key4]["values"])
                      {
                          dataValueMaxTemp+=maxTempByYearAndStationName[key]["values"][key2]["values"][key4]["values"][key5]["value"];
                      }
                      }
                  }
              }//if end
              }
          }

          //SNOW
          var snowTotalByYearAndStationName = d3.nest()
          .key(function(d) { return d.STATION_NAME; })
          .key(function(d) { return d.LOCAL_YEAR; })
          .key(function(d) { return d.x; })
          .key(function(d) { return d.y; })
          .rollup(function(v) { return d3.sum(v, function(d) { return d.TOTAL_SNOW; }); })
          .entries(capitals_data);

            for (var key in snowTotalByYearAndStationName) {  //this will iterate through key1 - key3
              for(var key2 in snowTotalByYearAndStationName[key]["values"])
              {
                  for (var key3 in snowTotalByYearAndStationName[key]["values"][key2])
                  {
                      if(snowTotalByYearAndStationName[key]["values"][key2]["key"]==2012)
                      {
                      for(var key4 in snowTotalByYearAndStationName[key]["values"][key2]["values"])
                      {
                          for(var key5 in snowTotalByYearAndStationName[key]["values"][key2]["values"][key4]["values"])
                          {
                              dataValueSnow+=snowTotalByYearAndStationName[key]["values"][key2]["values"][key4]["values"][key5]["value"];
                          }
                          }
                      }
                  }//if end
                  }
              }
            
              var totalValue=dataValueSnow+dataValueMaxTemp+dataValueMinTemp;
              var snowPre=formatDecimal(((dataValueSnow)/totalValue)*100);
              var maxTempPer=formatDecimal(((dataValueMaxTemp)/totalValue)*100);
              var minTempPer=100-(snowPre+maxTempPer);//formatDecimal(((dataValueMinTemp)/totalValue)*100);
              console.log(snowPre+","+maxTempPer+","+minTempPer);

              
var piesvg = d3.select('#divpie').append("svg").attr("height", 600).attr("width", 670);

data = [[0,snowPre,"#FF0000"], [snowPre,maxTempPer,"#000000"], [maxTempPer,100,"#808080"]]
dataone = [[0,snowPre,"rgb(49,163,84)"], [snowPre,maxTempPer,"rgb(186, 228, 179)"], [maxTempPer,100,"rgb(116,196,118)"]]
var txtStationName=["Snow","Max. Temp.","Min. Temp."];
var cScale = d3.scaleLinear().domain([0, 100]).range([0, 2 * Math.PI]);

var arc = d3.arc()
                .innerRadius(0)
                .outerRadius(100)
                .startAngle(function(d){return cScale(d[0]);})
                .endAngle(function(d){return cScale(d[1]);});

                var arcone = d3.arc()
                .innerRadius(0)
                .outerRadius(100)
                .startAngle(function(d){return cScale(d[0]);})
                .endAngle(function(d){return cScale(d[1]);});

                piesvg.selectAll("path.first")
                .data(dataone)
                .enter()
                .append("path")
                .attr("class","first")
                .attr("d", arcone)
                .style("fill", function(d){return d[2];})
                .attr("transform", "translate(170,300)");

                piesvg.selectAll("text.secondtext").data(dataone)
                .enter().append("text")
                .attr("class", "secondtext")
                .style('font-weight','bold')
                .style('fill','white')
                .attr('x', 170)
                .attr('y', 300)
                .attr("transform", function(d,i) {
                d.innerRadius = 0;
                d.outerRadius = 100;
                return "translate("+arc.centroid(d)+")";})
                .attr("text-anchor", "middle")                  
                .text(function(d){return d[1]-d[0]+"%"});
                var Cy=400;
                for(var x=0;x<dataone.length;x++)
                {
                var symbolGenerator = d3.symbol()
                          .type(d3.symbolSquare)
                          .size(250);
                          i=2
                           var pathData = symbolGenerator();
                           piesvg.append('path')
                           .attr('d', pathData)
                           .attr('fill',dataone[x][2])
                           .attr("transform","translate(250,"+Cy+")");
                           Cy+=30;
                }
                piesvg.append("text")
                    .html('Snow')
                    .style('font-size', '16px')
                    .style('font-weight','bold')
                    .attr('x', 270)
                    .attr('y', 405);

                    piesvg.append("text")
                    .html('Max. Temp.')
                    .style('font-size', '16px')
                    .style('font-weight','bold')
                    .attr('x', 270)
                    .attr('y', 435);

                    piesvg.append("text")
                    .html('Min. Temp.')
                    .style('font-size', '16px')
                    .style('font-weight','bold')
                    .attr('x', 270)
                    .attr('y', 465);
                piesvg
                .append("text")
                .html("Contribution of different weather conditions in Halifax")
                .style('font-size', '21px')
                .style('font-weight','bold')
                .attr('x','50')
                .attr('y','50'); 

            });
}


    function create_city_colors(pv)
    {
    d3.csv('climate-daily.csv').then(function (capitals_data) {
    
      var precipitationTotalByYearAndStationName = d3.nest()
      .key(function(d) { return d.STATION_NAME; })
      .key(function(d) { return d.LOCAL_YEAR; })
      .key(function(d) { return d.x; })
      .key(function(d) { return d.y; })
      .rollup(function(v) { return d3.sum(v, function(d) { return d.TOTAL_PRECIPITATION; }); })
      .entries(capitals_data);

    
  d3.json("Halifax.json").then(function (json) {
    d3.select("#map_container").select(".loader").remove();
    svg = d3.select("#map_container").append("svg").attr("height", 600).attr("width", 800);
    var precipitationTotalByYearAndStationName;
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



    for (var key in precipitationTotalByYearAndStationName) {  //this will iterate through key1 - key3
          for(var key2 in precipitationTotalByYearAndStationName[key]["values"])
          {
            dataState=precipitationTotalByYearAndStationName[key]["key"];
              for (var key3 in precipitationTotalByYearAndStationName[key]["values"][key2])
              {
                  if(precipitationTotalByYearAndStationName[key]["values"][key2]["key"]==2012)
                  {
                  for(var key4 in precipitationTotalByYearAndStationName[key]["values"][key2]["values"])
                  {
                      for(var key5 in precipitationTotalByYearAndStationName[key]["values"][key2]["values"][key4]["values"])
                      {
                          dataValue=precipitationTotalByYearAndStationName[key]["values"][key2]["values"][key4]["values"][key5]["value"];
                          x=precipitationTotalByYearAndStationName[key]["values"][key2]["values"][key4]["key"];
                          y=precipitationTotalByYearAndStationName[key]["values"][key2]["values"][key4]["values"][key5]["key"];
                          for(var n = 0; n < json.features.length; n++){
                            
                            var Stringx=(json.features[n].geometry.coordinates[0][0][0][0]).toString();
                            var Stringy=(json.features[n].geometry.coordinates[0][0][0][1]).toString();
                            var strX=(Stringx.substr(0,Stringx.indexOf('.')));
                            var strY=(Stringy.substr(0,Stringy.indexOf('.')));

                            DataStrx=x.toString();
                            DataStrx=DataStrx.substr(0,DataStrx.indexOf('.'));
                            
                            DataStry=(y.toString());
                            DataStry=DataStry.substr(0,DataStry.indexOf('.'));    
                           
                            if(d3.format(",.0f")(x) == d3.format(",.0f")(json.features[n].geometry.coordinates[0][0][0][0]) && d3.format(",.0f")(y)==d3.format(",.0f")(json.features[n].geometry.coordinates[0][0][0][1])){
                             json.features[n].properties.value = parseFloat(dataValue);
                              break;
                            }
                            else if(dataState.substr(0,dataState.indexOf(' '))=='HALIFAX'){
                              json.features[n].properties.value = parseFloat(dataValue);
                            }
                          }
                            

                          

                      }
                  }
              }//if end
              }
          }
  }
var i=10;
var arrayFeature=[];
                          svg.selectAll("path")
                          .data(json.features)
                          .enter()
                          .append("path")
                          .attr("d", path)
                          .attr("stroke", "black")
                          .attr("stroke-width", "0.5px")
                          .style("fill", function(d){
                          if(d.properties.value){
                          //console.log(d);
                          arrayFeature.push(formatDecimal(d.properties.value));
                          var symbolGenerator = d3.symbol()
                          .type(d3.symbolSquare)
                          .size(250);
                           
                           var pathData = symbolGenerator();
                           Ty=420+i;
                           svg.append('path')
                           .attr('d', pathData)
                           .attr('fill',color(d.properties.value))
                           .attr("transform","translate(720,"+Ty+")");

                            i+=2;
                              //If value exists
                            return color(d.properties.value);
                            } else {
                              return "#ffffff"//"#ffffff"
                            }
                      
                          })
                          .on("mousemove", function(d){
                            tooltip.style("opacity","1")
                            .style("fill", "violet")
                            .style("left",d3.event.pageX+"px")
                            .style("top",d3.event.pageY+"px");
                            tooltip.html("value : "+formatDecimal(d.properties.value));
                        })
                        .on("mouseout",function(d) {
                            tooltip
                              .style("opacity", 0)
                          });
                          d3.select("#txtColorRange").remove();
                          svg.append("text")
                            .attr('id','txtColorRange')
                            .html('Color Range from '+d3.max(arrayFeature)+" - "+d3.min(arrayFeature)+" precepitation")
                            .style('font-size', '20px')
                            .style('font-weight','bold')
                            .attr('x', 290)
                            .attr('y', 450);

                            svg
                            .append("text")
                            .html("Heat Map of Halifax, Nova Scotia")
                            .style('font-size', '21px')
                            .style('font-weight','bold')
                            .attr('x','50')
                            .attr('y','50'); 




});//Halifax json

});//climate-daily csv
}