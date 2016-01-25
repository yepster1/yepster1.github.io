function readTextFile(file) {
    var rawFile = new XMLHttpRequest();

    rawFile.open("GET", file, false);
    var a = ""
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4) {
            if (rawFile.status === 200 || rawFile.status == 0) {
                var allText = rawFile.responseText;
                a = (allText);
            }
        }
    }
    rawFile.send(null);
    return a
}
usedData = []
filelist = readTextFile("files");
individualfiles = filelist.split("\n")
allData = []
currentdata = []
for (var k = 0; k < individualfiles.length; k++) {
    if ("" == individualfiles[k]) {
        allData.push(currentdata)
        currentdata = []
        continue;
        individualfiles[k].dele
    }
    data = readTextFile(individualfiles[k]);
    var res = data.split('\n');
    var X = []
    var names = []
    var sizes = []
    finalData = []

    for (var i = 0; i < res.length - 1; i++) {
        var l = res[i]
        l = l.split(" - ")
        X.push(parseFloat(l[0]))
        var index = l[1].indexOf(",")
        names.push(l[1].substring(index, l[1].length - 1))
        sizes.push(i)
        finalData.push({
            "sizes": i,
            "names": l[1].substring(index, l[1].length - 1),
            "value": parseFloat(l[0])
        })
    }
    currentdata.push(finalData)
}
headings = ["1 Character sequence","3 character sequence","2 sequence","word"]
allData.push(currentdata)
var vis = d3.select("#visualisation"),
    WIDTH = 800,
    HEIGHT = 500,
    MARGINS = {
        top: 20,
        right: 20,
        bottom: 50,
        left: 100
    },
    xScale = d3.scale.linear().range([MARGINS.left, WIDTH - MARGINS.right]).domain([sizes[0], sizes[sizes.length - 1]]),
    yScale = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([0.0, 1.0]),
    xAxis = d3.svg.axis()
    .scale(xScale),
    yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left");

vis.append("svg:g")
    .attr("transform", "translate(0," + (HEIGHT - MARGINS.bottom) + ")")
    .call(xAxis);

vis.append("svg:g")
    .attr("transform", "translate(" + (MARGINS.left) + ",-24)")
    .call(yAxis);
//vis.call(tip);
var lineGen = d3.svg.line()
    .x(function(d) {
        return xScale(d.sizes);
    })
    .y(function(d) {
        return yScale(d.value);
    });
lines = []
counter = 0
for (var op = 0; op < allData.length; op++) {
    sMalllines = []
    var container = d3.select("body").append("div").attr("id", "container");
    container.append("h2").text(headings[op]);
    canvas = container.append("svg").attr("viewBox", function(d, i) {
        return "0,0,400," + allData[op].length * 50
    });
    colors = d3.scale.category20().domain([0, allData[op].length])
    for (var s = 0; s < allData[op].length; s++) {

        sMalllines.push(vis.append('svg:path')
            .attr('d', lineGen(allData[op][s]))
            .attr('stroke', colors(s))
            .attr('stroke-width', 2)
            .attr('fill', 'none')
            .attr("id", "#yes")
            .attr("class",op)
            .attr("transform", "scale(9)")//.on('mouseover', tip.show)
     // .on('mouseout', tip.hide)
        )
        group = canvas.append("g");
        group.append("rect").attr("width", 400).attr("height", 50).attr("y", function(d) {
            var h = 50 * s
            return h
        }).attr("class", s).attr("x", function(d) {
            return 0
        }).attr("whichcontainer",op).on("click", function(d, i) {
            if (lines[this.getAttribute("whichcontainer")][this.getAttribute("class")].attr("id") == "#no") {
                lines[this.getAttribute("whichcontainer")][this.getAttribute("class")].transition()
                    .duration(800)
                    .attr("transform", "scale(9)");
                lines[this.getAttribute("whichcontainer")][this.getAttribute("class")].attr("id", "#yes");
            } else {
                lines[this.getAttribute("whichcontainer")][this.getAttribute("class")].transition()
                    .duration(800)
                    .attr("transform", "scale(1)");
                lines[this.getAttribute("whichcontainer")][this.getAttribute("class")].attr("id", "#no");
            }
            if (this.getAttribute("fill") == "grey") {
                this.setAttribute("fill", colors(this.getAttribute("class")))
            } else {
                this.setAttribute("fill", "grey")
            }
        }).attr("fill","grey");
        if(individualfiles[counter] == ""){
            counter++
        }
        group.append("text").attr("y", function(d) {
            var h = 25 + 50 * s
            return h
        }).attr("x",0).text(individualfiles[counter++]);

    }
    lines.push(sMalllines)
}

// var tip = d3.tip()
//   .attr('class', 'd3-tip')
//   .offset([-10, 0])
//   .html(function(d) {
//     return "<strong>Frequency:</strong> <span style='color:red'>" + d.frequency + "</span>";
//   })

function updateData() {
        for (var k = 0; k < lines.length;k++)
            for (var j = 0; j < lines[k].length;j++){
                lines[k][j].attr("id","#yes").transition()
                    .duration(1)
                    .attr("transform", "scale(8)");
            }
        d3.selectAll("rect").attr("fill","grey")
    }