var height = $(window).height();
var width = $(window).width();
var sig = Math.random()*255;
var significant = Math.floor(sig);
function append(){
		for(var i = 0; i< width; i = i + 50){
		for (var k = 0; k < 5000; k=k+50){
				var widthDif = width/50;
				var heightDif = 5000/50;
				var colorH = Math.floor((i/50) + heightDif);
				var colorW =  Math.floor((k/50) + widthDif);
				d3.select(".canvas").append("rect")
					.attr("width",50)
					.attr("height",50)
					.attr("fill",function(d){
						return "rgb("+colorW+","+colorH+","+significant+")";
					})
					.attr("x",i)
					.attr("y",k)
					.on("click",function(d){
						d3.selectAll("rect").remove();
						significant +=1;
						if(significant > 255){
							significant = 5;
						}
						append();
					})
		}
	}
	}

$(function(){
	append();
});

$(window).resize(function() {
  d3.selectAll("rect").remove();
  height = $(window).height();
  width = $(window).width();
  append();
});
//%(".MainSquare").css({left:0,top:100});