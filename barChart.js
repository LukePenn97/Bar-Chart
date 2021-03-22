
$(document).ready(function(){
  
});

function getCanvas(){
    return document.getElementById("myCanvas");
  }
let data = [101,22,3,44,55];
    let dataLabels = ["first", "second","third","fourth","fifth"];
    let dataStack = {
      sets: 5,
      data: [
        [160,950,300,40,25],
        [160,950,400,50,36],
        [160,950,500,60,47],
        [160,950,600,70,58],
        [160,950,700,80,69],
        [160,950,700,80,69]
        ],
      colours: ["LightPink","Pink","HotPink","PaleVioletRed","Orchid"],  
      labels: ["first", "second", "third", "fourth", "fifth","sixth"],
      labelColours: ["Black","Black","Red","red","red","black"], 
      legend: ["utilities", "rent", "food", "gas", "clothes"]
    }
    
    function drawBarChart(data, options, element){
      
      let ctx = element.getContext("2d");
      element.width = options.width;
      element.height = options.height;



      //drawBars(data, options, element, ctx, dataLabels);

      //drawAxis(data, options, element, ctx);
      drawTitle(options, element, ctx);
      
      drawStackedBars(dataStack, options, element, ctx)
      

    }

    function drawStackedBars(dataStack, options, element, ctx){
      
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      let textPosition = checkTextPos(options.textPos);
      let maxVals = [];
      let maxVal = 0;

      for(let i = 0; i < dataStack.data.length; i++){
        maxVal = 0;
        for(num of dataStack.data[i]){
          maxVal += num;
        }
        maxVals.push(maxVal);      
      }
      drawAxis(maxVals, options, element, ctx);
      
      maxVal = largestVal(maxVals);
      let constant = options.innerHeight()/maxVal;
      let barSpace;
      
      if(options.barSpace === "default"){
        barSpace = options.innerWidth()/dataStack.data.length/2;
      } else {
        barSpace = options.barSpace;
      }
      let barWidth = options.innerWidth()/dataStack.data.length - barSpace;

      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      
      let previousHeight = 0;
      for(let i = 0; i < dataStack.data.length; i++){
        previousHeight = 0;
        for(let j = 0; j < dataStack.data[i].length; j++){
          ctx.fillStyle = dataStack.colours[j];
          ctx.fillRect(i*(barWidth+barSpace)+(options.xGap()+10), element.height - options.yGap() - previousHeight, barWidth, -dataStack.data[i][j]*constant);
          ctx.fillStyle = dataStack.labelColours[i];
          if(options.displayValues){
            ctx.fillText(dataStack.data[i][j].toString(), i*(barWidth+barSpace)+(options.xGap())+barWidth/2+10, element.height - previousHeight - dataStack.data[i][j]*constant*textPosition - options.yGap() + options.bump());
          }
          
          previousHeight += dataStack.data[i][j]*constant;
        }
        
        ctx.fillText(dataStack.labels[i], i*(barWidth+barSpace)+(options.xGap())+barWidth/2+10, element.height - options.yGap() + 20);
        if(options.displayTotals){
          ctx.fillText(maxVals[i], i*(barWidth+barSpace)+(options.xGap())+barWidth/2+10, element.height - options.yGap() - previousHeight - 10);
        }
      }
      drawLegend(dataStack,options,ctx,element);
    } 


    function drawLegend(dataStack,options,ctx,element){
        ctx.textBaseline = "right";
        ctx.textAlign = "left";
        let barSpace;
        if(options.barSpace === "default"){
          barSpace = options.innerWidth()/dataStack.data.length/2;
        } else {
          barSpace = options.barSpace;
        }
        for(let i = 0; i < dataStack.legend.length; i++){
          ctx.fillStyle = dataStack.colours[dataStack.legend.length - 1 - i];
          ctx.fillRect(options.width - options.xGap() + 30 - barSpace, i*20+options.height/4, 10, 10);
          ctx.fillStyle = options.textColour;
          ctx.fillText(dataStack.legend[dataStack.legend.length - 1 - i], options.width - options.xGap() + 50 - barSpace, i*20+options.height/4+5);
        }
        
    }

    function drawTitle(options, element, ctx){
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      ctx.fillText(options.title, options.width/2, 20);
    }

    function drawBars(data, options, element, ctx, dataLabels){
      let textPosition = checkTextPos(options.textPos);
      let maxVal = largestVal(data);
      let constant = options.innerHeight()/maxVal; 
      let barSpace;
      if(options.barSpace === "default"){
        barSpace = options.innerWidth()/data.length/2;
      } else {
        barSpace = options.barSpace;
      }
      let barWidth = options.innerWidth()/data.length - barSpace;

      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      
      for(let i = 0; i < data.length; i++){
        ctx.fillStyle = options.fillColour;
        ctx.fillRect(i*(barWidth+barSpace)+(options.xGap())+barSpace, element.height - options.yGap(), barWidth, -data[i]*constant);        
        ctx.fillStyle = options.textColour;
        ctx.fillText(data[i].toString(), i*(barWidth+barSpace)+(options.xGap())+barWidth/2+barSpace, element.height - data[i]*constant*textPosition - options.yGap() - options.bump());
        ctx.fillText(dataLabels[i], i*(barWidth+barSpace)+(options.xGap())+barWidth/2+barSpace, element.height - options.yGap() + 20);
      }
    }

    function drawAxis(data, options, element, ctx){
      ctx.textAlign = "right";
      ctx.textBaseline = "left";
      ctx.fillStyle = options.textColour;
      let maxVal = largestVal(data);
      for(let i = options.axisNums; i >= 0; i--){
        ctx.fillText((maxVal*i*10/options.axisNums*0.1).toFixed(1).toString(), options.xGap(), (element.height - (options.yGap()+options.innerHeight()*i*10/options.axisNums*0.1)));
      }
      ctx.save();
      ctx.translate(options.xGap()/2, options.height/2);
      ctx.rotate(-Math.PI/2);
      ctx.textAlign = "center";
      ctx.fillText(options.yAxisLabel, 0, -5);
      ctx.restore();
      
    }

    function largestVal(data){
      let largest = 0;
      for(d of data){
        if(d > largest){
          largest = d;
        }
      }
      return largest;
    }
    function checkTextPos(pos){
      let textPosition = 0;
      if(pos === "top"){
          textPosition = 1
        }
      if(pos === "middle"){
          textPosition = 0.5
        }
      if(pos=== "bottom"){
          textPosition = 0
        }
      return textPosition;
    }

    
    let options = {
      width: 700,
      height: 300,
      barSpace: "default",
      textPos: "middle",
      fillColour: "Pink",
      textColour: "Black",
      widthMultiplier: 0.6,
      heightMultiplier: 0.8,
      title: "My Monthly Expenses",
      yAxisLabel: "Amount Spent Per Month",
      axisNums: 5,
      displayTotals: true,
      displayValues: true,
      
      bump: function(){
        if(this.textPos === "top"){
          return 5;
        }else if(this.textPos === "bottom"){
          return -5;
        }else{
          return 0;
        }
      },
      innerWidth: function(){
        return this.width * this.widthMultiplier;
      },
      innerHeight: function(){
        return this.height * this.heightMultiplier;
      },
      xGap: function(){
        return (this.width-this.innerWidth())/2},
      yGap: function(){
        return (this.height-this.innerHeight())/2}
    }