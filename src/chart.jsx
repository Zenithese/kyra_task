import React, { Component } from 'react';
import { Chart } from 'react-google-charts';

export default class Stats extends Component {
    constructor(props){
        super(props);
        this.state = {
            chartType: 'ScatterChart',
            options: {
                title: "Uploads over 78 Weeks",
                hAxis: { title: "Weeks", viewWindow: { min: 0, max: 78 } },
                vAxis: { title: "Uploads", viewWindow: { min: 0, max: 10 } },
                legend: 'none'
            },
            chartSwitch: 0
        }
    }

    setChartType() {
        this.setState({ chartSwitch: this.state.chartSwitch += 1 })
        if (this.state.chartSwitch === 2) {
            this.setState({ 
                chartType: "LineChart",
                options: {
                    title: "Uploads over 18 months",
                    hAxis: { title: "Months", viewWindow: { min: 0, max: 18 } },
                    vAxis: { title: "Uploads", viewWindow: { min: 0, max: 10 } },
                    legend: 'none'
                }
            })
        } else if (this.state.chartSwitch === 4) {
            this.setState({ 
                chartType: "ScatterChart",
                options: {
                    title: "Uploads over 78 Weeks",
                    hAxis: { title: "Weeks", viewWindow: { min: 0, max: 78 } },
                    vAxis: { title: "Uploads", viewWindow: { min: 0, max: 10 } },
                    legend: 'none'
                },
                chartSwitch: 0 
            })
        }
    }

    render() {
        let eighteenMonthsAgo = new Date() - 47304000000;

        let eighteenMonthsOfVideos = []
        this.props.videoData.forEach((item) => {
            let video = item.snippet.publishedAt;
            if (new Date(video) >= eighteenMonthsAgo) {
                eighteenMonthsOfVideos.push(video);
            }
        })
        eighteenMonthsOfVideos = eighteenMonthsOfVideos.sort()

        let orderedEighteenMonthsOfVideo = this.state.chartType === "ScatterChart" ? countByWeek(eighteenMonthsOfVideos) : countByMonth(eighteenMonthsOfVideos)

        let data = [
            ...orderedEighteenMonthsOfVideo
        ];
        return (
            <div>
                {console.log(eighteenMonthsOfVideos)}
                <div className="switch center" onClick={() => this.setChartType()}>
                    <label>
                        Weeks
                        <input type="checkbox" />
                        <span className="lever"></span>
                        Months
                    </label>
                </div>
                <br />
                <Chart
                    chartType={this.state.chartType}
                    data={data}
                    options={this.state.options}
                    width="100%"
                    height="400px"
                    loader={<div>Loading chart...</div>}
                />
            </div> 
        )
    }

}

function countByMonth(array) {
    let newArray = []
    let subArray = [array[0]]
    let lastYear = true
    for (let i = 1; i < array.length; i++) {
        let slice = array[i].slice(0, 7)
        let month = Number(subArray[0].slice(5, 7))
        if (subArray.length > 0 && slice === subArray[0].slice(0, 7)) {
            subArray.push(slice)
        } else {
            if (lastYear) {
                newArray.push([month, subArray.length])
                if (month >= 12) {
                    lastYear = false;
                }
            } else {
                newArray.push([month + 12, subArray.length])
            }
            subArray = [array[i]]
        }
        if (i === array.length - 1) {
            if (lastYear) {
                newArray.push([month, subArray.length])
            } else {
                newArray.push([month + 12, subArray.length])
            }
        }
    }
    if (newArray.length) {
        newArray.unshift(['Months', 'Uploads'])
    }
    return newArray
}

function countByWeek(array) {
    let newArray = array.map(datetime => new Date(datetime).getWeekNumber())

    let weekCount = [];
    let subArray = [newArray[0]]
    let lastYear = true
    let lastWeek;
    for (let i = 1; i < newArray.length; i++) {
        let week = newArray[i]
        if (subArray.length > 0 && week === subArray[0]) {
            subArray.push(week)
        } else {
            lastWeek = subArray[0];
            if (lastYear) {
                weekCount.push([subArray[0], subArray.length])
                if (week < lastWeek) {
                    lastYear = false;
                }
            } else {
                weekCount.push([subArray[0] + 52, subArray.length])
            }
            subArray = [week]
        }

        if (i === newArray.length - 1 && week === subArray[0]) {
            if (lastYear) {
                weekCount.push([subArray[0], subArray.length])
            } else {
                weekCount.push([subArray[0] + 52, subArray.length])
            }
        }
    }

    if (weekCount.length) {
        weekCount.unshift(['Weeks', 'Uploads'])
    }
    return weekCount;
}

Date.prototype.getWeekNumber = function () {
    var d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
    var dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
};