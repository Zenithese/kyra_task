import React, { Component } from 'react';
import { Chart } from 'react-google-charts';

export default class Stats extends Component {
    constructor(props){
        super(props);
        this.state = {
            chartType: 'Bar',
            options: {
                chart: {
                    title: "Uploads over 78 Weeks",
                },
                legend: { position: 'none' },
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
                chartType: "Bar",
                options: {
                    chart: {
                        title: "Uploads over 78 Weeks",
                    },
                    legend: { position: 'none' },
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

        let orderedEighteenMonthsOfVideos = this.state.chartType === "Bar" ? countByWeek(eighteenMonthsOfVideos) : countByMonth(eighteenMonthsOfVideos)

        let data = [
            ...orderedEighteenMonthsOfVideos
        ];
        return (
            <div>
                {console.log(eighteenMonthsOfVideos, orderedEighteenMonthsOfVideos)}
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

const months = [null, "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

function countByMonth(array) {
    let newArray = []
    let subArray = [array[0]]
    for (let i = 1; i < array.length; i++) {
        let slice = array[i].slice(0, 7)
        let month = Number(subArray[0].slice(5, 7))
        if (subArray.length > 0 && slice === subArray[0].slice(0, 7)) {
            subArray.push(slice)
        } else {
            newArray.push([months[month], subArray.length])
            subArray = [array[i]]
        }
        if (i === array.length - 1) {
            newArray.push([months[month], subArray.length])
        }
    }
    if (newArray.length) {
        newArray.unshift(['Month', 'Uploads'])
    }
    return newArray
}

function countByWeek(array) {
    let newArray = array.map(datetime => new Date(datetime).getWeekNumber())
    let monthArray = array.map(datetime => new Date(datetime).getMonth())
    let yearArray = array.map(datetime => new Date(datetime).getFullYear())

    let weekCount = [];
    let subArray = [newArray[0]]
    let subMonthArray = [monthArray[0]]
    for (let i = 1; i < newArray.length; i++) {
        let week = newArray[i]
        let monthNumber = monthArray[i]
        let month = months[subMonthArray[0] + 1];
        let year = yearArray[i - 1]
        if (subArray.length > 0 && week === subArray[0]) {
            subArray.push(week)
            subMonthArray.push(monthNumber)
        } else {
            let diff = week - subArray[0];
            let lastUploadWeek = subArray[0]
            weekCount.push([`Week ${lastUploadWeek} of ${year} (${month})`, subArray.length])
            if (diff > 1) {
                for (let i = 1; i < diff; i++) {
                    weekCount.push([`Week ${lastUploadWeek + i} of ${year} (${month})`, 0])
                }
            }
            if (week < lastUploadWeek) {
                let newYear = false;
                for (let i = lastUploadWeek + 1; i < week + 52; i++) {
                    if (i > 52) {
                        i -= 52;
                        newYear = true;
                    }
                    weekCount.push([`Week ${i} of ${year} (${month})`, 0])
                    if (newYear) {
                        i += 52;
                    }
                }
            }
            subArray = [week]
            subMonthArray = [monthNumber]
        }

        if (i === newArray.length - 1 && week === subArray[0]) {
            weekCount.push([`Week ${subArray[0]} of ${year} (${month})`, subArray.length])
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

// function countByWeek(array) {
//     let newArray = array.map(datetime => new Date(datetime).getWeekNumber())

//     let weekCount = [];
//     let subArray = [newArray[0]]
//     let lastYear = true
//     let newYear = false;
//     let lastWeek;
//     for (let i = 1; i < newArray.length; i++) {
//         let week = newArray[i]
//         if (subArray.length > 0 && week === subArray[0]) {
//             subArray.push(week)
//         } else {
//             lastWeek = subArray[0];
//             if (lastYear) {
//                 weekCount.push([subArray[0], subArray.length])
//                 if (week < lastWeek) {
//                     lastYear = false;
//                 }
//             } else if (!lastYear && !newYear) {
//                 weekCount.push([subArray[0] + 52, subArray.length])
//                 if (week < lastWeek) {
//                     newYear = true;
//                 }
//             } else {
//                 weekCount.push([subArray[0] + 104, subArray.length])
//             }
//             subArray = [week]
//         }

//         if (i === newArray.length - 1 && week === subArray[0]) {
//             if (lastYear) {
//                 weekCount.push([subArray[0], subArray.length])
//             } else if (!lastYear && !newYear) {
//                 weekCount.push([subArray[0] + 52, subArray.length])
//             } else {
//                 weekCount.push([subArray[0] + 104, subArray.length])
//             }
//         }
//     }

//     if (weekCount.length) {
//         weekCount.unshift(['Weeks', 'Uploads'])
//     }
//     return weekCount;
// }