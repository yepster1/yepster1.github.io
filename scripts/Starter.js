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
var colorH = d3.scale.linear().domain([0,height]).range([0,255]);
var colorW = d3.scale.linear().domain([0,width]).range([0,255]);
var colorB = d3.scale.linear().domain([0,(width+height)]).range([0,255]);
function toRGB (color){
	color = color.replace("rgb(","");
	color = color.replace(")","");
	color = color.split(",");
	return color.map(function (x) { 
    		return parseInt(x); 
		});
}
function colorChanger(x,y,sign){
	var currentColor  = rectangles[x][y].attr("fill");
	//var position = rectangles[x][y].id.split(",");
	var colors = toRGB(currentColor);
	var k = colors[0];
	var l = colors[1];
	if(sign == '+'){
		k = colors[0]+10;
		l = colors[1]+10;
	}else{
		k = colors[0]-10;
		l = colors[1]-10;	
	}

	var newColor = "rgb("+k+","+l+","+Math.floor((l+k)/2)+")";	return newColor;
	//debugger;
	return "red";
}
function currentSquare(x,y,width,height,sign){
	for (var i = x-width; i <= x+width; ++i) {
		rectangles[y-height-1][i].attr("fill",colorChanger(y-height-1,i,sign));
		rectangles[y+height][i].attr("fill",colorChanger(y+height,i,sign));
	};
	for (var i = y-height; i < y+height; ++i) {
		rectangles[i][x-width].attr("fill",colorChanger(i,x-width,sign));
		rectangles[i][x+width].attr("fill",colorChanger(i,x+width,sign));
	};
}			
function rippleEffect(x,y){
	for(var k = 0; k < 10; ++k){
		currentSquare(x,y,k,k,'+');
		currentSquare(x,y,k-2,k-2,'-');
	}
}

var squarerectangles = {width: 10, height: 10};
var x = 0;
var y = 0;
for (var i = 0; i < width; i = i + squarerectangles.width){
	var row = [];
	for (var k = 0; k < height; k = k + squarerectangles.height){
		row.push(d3.select(".canvas").append("rect")
			.attr("fill",function(){
				return "rgb("+Math.floor(colorW(i))+","+Math.floor(colorH(k))+","+Math.floor(colorB((i+k)))+")";
			})
			.attr("x",i)
			.attr("y",k)
			.attr("width",squarerectangles.width)
			.attr("height",squarerectangles.height)
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