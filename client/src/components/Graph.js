import React, {Component} from 'react';
import * as d3Mod from "d3";
import { scaleLinear } from 'd3-scale';
import { select } from 'd3-selection';
import { transition } from 'd3-transition';
import { axisBottom, axisLeft } from 'd3-axis';
import { colours } from '../constants';

class Graph extends Component {

    componentDidMount() {
        this.drawChart();
    }

    drawChart() {
        const d3 = { select, transition, scaleLinear, axisBottom, axisLeft };
        let margin = {
            top: 20,
            right: 40,
            bottom: 30,
            left: 50
       }
       let width = this.props.width < 1025 ? this.props.width - 100 : 800;
       let height = 400;

        var svg = d3.select("#graph")
                    .append("svg")
                    .attr("width", width)
                    .attr("height", height);
        
        // create scales
        var x_scale = d3.scaleLinear()
                        .domain([0, 1])
                        .range([margin.left, width - margin.right]);
        
        var y_scale = d3.scaleLinear()
                        .domain([0, 1])
                        .range([height - margin.bottom + 10, margin.top]);
        
        // create axes
        var x_axis = d3.axisBottom()
                       .scale(x_scale);
        
        var y_axis = d3.axisLeft()
                       .scale(y_scale);
        
        // add axes
        svg.append("g")
           .attr("transform", `translate(${margin.left}, ${-10})`)
           .call(y_axis);
        
        svg.append("g")
           .attr("transform", `translate(0,${height - margin.bottom})`)
           .call(x_axis)

        // add labels for axes
        svg.append("text")     
            .attr("font-size", "10px")        
            .attr("transform", `translate(${width/2},${height})`)
            .style("text-anchor", "middle")
            .style("fill", "white")
            .text("Valence");

        svg.append("text")
           .attr("font-size", "10px")
           .attr("transform", "rotate(-90)")
           .attr("y", 10)
           .attr("x", 0 - (height / 2))
           .style("text-anchor", "middle")
           .style("fill", "white")
           .text("Energy");

        for (let i = 0; i < this.props.data.length; i++) {
            let albumArt = this.props.data[i].img_url;
            let albumName = this.props.data[i].name;
            let audio = null;

            let colour = colours[i];
            let circles = svg.append("g")
                             .selectAll("circle")
                             .data(this.props.data[i].tracks)
                             .enter()
                             .append("circle");

            let tooltip = d3.select("#graph")
                            .append("div")
                            .attr("class", "tooltip")
                            .style("border", `2px solid ${colour}`)
                            .style("opacity", 0);

            let tipMouseover = (d) => {
                if (this.props.playPreview && d.preview_url) {
                    audio = new Audio(d.preview_url);
                    audio.play();
                }

                let html  = `
                    <div class="tooltip-container">
                        <div><img class="tooltip-img" src=${albumArt}></img></div>
                        <div class="tooltip-info">
                            <div>Track: ${d.name}</div>
                            <div>Album: ${albumName}</div>
                            <div>Valence: ${d.valence}</div>
                            <div>Energy: ${d.energy}</div>
                        </div>
                    </div>
                `;

                tooltip.html(html)
                       .style("left", (d3Mod.event.pageX - 200) + "px")
                       .style("top", (d3Mod.event.pageY + 10) + "px")
                       .transition()
                       .duration(200)
                       .style("opacity", .9)

            };

            let tipMouseout = (d) => {
                if (this.props.playPreview && d.preview_url) {
                    audio.pause();
                    audio.currentTime = 0;
                }
                tooltip.transition()
                       .duration(300)
                       .style("opacity", 0);
            };


            let circleAttributes = circles.attr("cx", function (d) { return x_scale(d.valence); })
                                          .attr("cy", function (d) { return y_scale(d.energy); })
                                          .attr("r", "3px")
                                          .style("fill", colour)
                                          .on("mouseover", tipMouseover)
                                          .on("mouseout", tipMouseout);
        }
    }

    render() {
        return (
            <div id="graph"></div>
        );
    }
}

export default Graph;