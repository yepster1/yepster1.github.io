$( document ).ready(function() {
	var height = $(window).height();
	var width = $(window).width();
	d3.select(".can")
			.attr("width",width)
			.attr("height",height);
	d3.select("svg .canvas")
			.attr("width",width)
			.attr("height",height);
	var rectangles = [];
	//I know you can do it using a color scale but I think this way you get more control
	var red = "rgb(255,0,0)";
	var yellow = "rgb(0,255,0)";
	var colorH = d3.scale.linear().domain([0,height]).range([0,255]);
	var colorW = d3.scale.linear().domain([0,width]).range([0,255]);
	var colorB = d3.scale.linear().domain([red,yellow]).range([255,0]);
	function toRGB (color){
		color = color.replace("rgb(","");
		color = color.replace(")","");
		color = color.split(",");
		return color.map(function (x) { 
	    		return parseInt(x); 
			});
	}
	function colorChanger(x,y,sign,amount){
		var currentColor  = rectangles[x][y].attr("fill");
		var colors = toRGB(currentColor);
		var k = colors[0];
		var l = colors[1];
		if(sign == '+'){
			k = colors[0]+amount;
			l = colors[1]+amount;
		}else{
			k = colors[0]-amount;
			l = colors[1]-amount;	
		}
	
		var newColor = "rgb("+k+","+l+","+"Math.floor(colorB(k+l))"+")";	return newColor;;
	}
	function change(x,u,c,s,a){
		try{
			currentCircle(x,u,c,s,a);
		}catch(err){};
	}		
	function rippleEffect(x,y){
		var max = 120;
		var newcounter = 0;
		var counter = 0;
		var Slowdowneffect = 0;
		for(var i = 0; i < max; i++){
			setTimeout(function(){
						change(x,y,newcounter++,'+',2);
				}, counter++*60-Slowdowneffect++*10);
		}
	
		newcounter = 0;
		counter = 0;
	}
	function makeripple(x,y){
	
	}
	function rectangleChanger(x,y,sign,amount){
		try{
			rectangles[x][y].attr("fill",colorChanger(x,y,sign,amount));
		}catch(err){}
	}
	function currentCircle(x0,y0,radius,sign,amount){
		//MidPoint_Circle_Algarithm
		var x = radius;
		var y = 0;
		var decisionOver2 = 1-x;
		while(x >= y){
			rectangleChanger(y0+y,x0+x,sign,amount);
			rectangleChanger(y0+y,x0+x,sign,amount);
			rectangleChanger(y0-y,x0+x,sign,amount);
			rectangleChanger(y0-y,x0-x,sign,amount);
			rectangleChanger(y0+y,x0-x,sign,amount);
			rectangleChanger(y0+x,x0-y,sign,amount);
			rectangleChanger(y0+x,x0+y,sign,amount);
			rectangleChanger(y0-x,x0+y,sign,amount);
			rectangleChanger(y0-x,x0-y,sign,amount);
		y++;
		if(decisionOver2 <0){
			decisionOver2 += 2 * y + 1;
		}else{
			x--;
			decisionOver2 += 2 * (y - x) +1;
		}
		}
	} 
	var r = window.prompt("please enter indivudual width, smaller = better quality but more graphically intensive(between 5-10 for normal power computers)", 10);
	var squarerectangles = {width: parseInt(r),height: parseInt(r)};
	var x = 0;
	var y = 0;
	for (var i = 0; i < width; i = i + squarerectangles.width){
		var row = [];
		for (var k = 0; k < height; k = k + squarerectangles.height){
			row.push(d3.select(".canvas").append("circle")
				.attr("fill",function(){
					return "rgb("+Math.floor(colorW(i))+","+Math.floor(colorH(k))+","+Math.floor(colorB(Math.floor(colorW(i))+Math.floor(colorH(k))))+")";
				})
				.attr("cx",i)
				.attr("cy",k)
				.attr("r",squarerectangles.width)
				.attr("id",x+++","+y)
				.on("click",function(d){
					var position = this.id.split(",");
					rippleEffect(parseInt(position[0]),parseInt(position[1]))
				})
				)
			}
		y++;
		rectangles.push(row);
		row = [];
		x = 0;
	}
});
