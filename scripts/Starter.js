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

	var newColor = "rgb("+k+","+l+","+Math.floor((l+k)/2)+")";	return newColor;;
}
function currentSquare(x,y,width,height,sign){
	for (var i = x-width; i <= x+width; ++i) {
		rectangles[y-height-1][i].attr("fill",colorChanger(y-height-1,i,sign,10));
		rectangles[y+height][i].attr("fill",colorChanger(y+height,i,sign,10));	
	};
	for (var i = y-height; i < y+height; ++i) {
		rectangles[i][x-width].attr("fill",colorChanger(i,x-width,sign,10));
		rectangles[i][x+width].attr("fill",colorChanger(i,x+width,sign,10));
	};
}			
function rippleEffect(x,y){
	/*for(var k = 0; k < 10; ++k){
		currentSquare(x,y,k,k,'+');
		currentSquare(x,y,k-2,k-2,'-');
	}*/
	var max = 30;
	var newcounter = 0;
	var counter = 0;
	for(var i = 0; i < max; i++){
		setTimeout(function(){
				if(newcounter < (max)){
					currentCircle(x,y,newcounter,'+',10);
				}
				if(newcounter >=5){
					currentCircle(x,y,(newcounter-5),'-',10);
				}
				newcounter++;
			}, counter++*60);
	}

	newcounter = 0;
	counter = 0;
}
function makeripple(x,y){

}
function calculateDistance(x,y,cx,cy,radius,Limit){
	var distance = Math.sqrt(Math.pow(y-cy,2) + Math.pow(x-cx,2)); //Distance formula
	if(Limit > 100){return -1};
	if(distance > radius){
		return calculateDistance(x,y,cx,--cy,radius,++Limit); 
	}
	return cy;
}

function currentCircle(x0,y0,radius,sign,amount){
	//MidPoint_Circle_Algarithm
	var x = radius;
	var y = 0;
	var decisionOver2 = 1-x;
	while(x >= y){
		rectangles[y0+y][x0+x].attr("fill",colorChanger(y0+y,x0+x,sign,amount));
		rectangles[y0-y][x0+x].attr("fill",colorChanger(y0-y,x0+x,sign,amount));
		rectangles[y0-y][x0-x].attr("fill",colorChanger(y0-y,x0-x,sign,amount));
		rectangles[y0+y][x0-x].attr("fill",colorChanger(y0+y,x0-x,sign,amount));

		rectangles[y0+x][x0-y].attr("fill",colorChanger(y0+x,x0-y,sign,amount));
		rectangles[y0+x][x0+y].attr("fill",colorChanger(y0+x,x0+y,sign,amount));
		rectangles[y0-x][x0+y].attr("fill",colorChanger(y0-x,x0+y,sign,amount));
		rectangles[y0-x][x0-y].attr("fill",colorChanger(y0-x,x0-y,sign,amount));
	y++;
	if(decisionOver2 <0){
		decisionOver2 += 2 * y + 1;
	}else{
		x--;
		decisionOver2 += 2 * (y - x) +1;
	}
	}
} 

var squarerectangles = {width: 10, height: 10};
var x = 0;
var y = 0;
for (var i = 0; i < width; i = i + squarerectangles.width){
	var row = [];
	for (var k = 0; k < height; k = k + squarerectangles.height){
		row.push(d3.select(".canvas").append("circle")
			.attr("fill",function(){
				return "rgb("+Math.floor(colorW(i))+","+Math.floor(colorH(k))+","+Math.floor(colorB((i+k)))+")";
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