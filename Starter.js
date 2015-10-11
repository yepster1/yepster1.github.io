var height = $(window).height();
var width = $(window).width();
$(function(){
	$('<h1 style="color:white; text-align: center;">Cary Small</h1>').appendTo('.MainSquare');
	$('<h3 style="color:white; text-align: center;">Proffessional, Motivated, Caring</h3>').appendTo('.MainSquare');
	$('<a href="https://github.com/yepster1" style="color:white; text-align: awesome;">Github Account</h3>').appendTo('.MainSquare');
	var sig = Math.random()*255;
	var significant = Math.floor(sig);
	append();
	function append(){
		for(var i = 0; i < width; i = i + 50){
		for (var k = 0; k < 5000; k=k+50){
				var widthDif = width/50;
				var heightDif = 5000/50;
				var colorH = (i/50) + heightDif;
				var colorW = (k/50) + widthDif;
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
});

//%(".MainSquare").css({left:0,top:100});