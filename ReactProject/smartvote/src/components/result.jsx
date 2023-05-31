import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import "./App.css";
import "./result.css";
import api from "./api";
import PreLoader from "./PreLoader";
function Result() {
    const [preloader, UpdatePreloader] = useState(true);
    const [Timing, updateTimings] = useState({
        'Reg_starting_time': "",
    });
    // for cadidate card

    const [cadidateResult, updateCadidateResult] = useState([]);
    const [firstThree, updateFirstThree] = useState({
        'first': [],
        'second': [],
        'third': [],
    });
    const [cadidateCard, updateCadidateCard] = useState({
        'CandidatesApplied': 0,
        'RejectedCandidates': 0,
        'MaleCandidates': 0,
        'FemaleCandidates': 0,
        'OthersCandidates': 0,
        'TotalCandidates': 0
    });
    const [VoterCard, updateVoterCard] = useState({
        'VotedVoters': 0,
        'NotVotedVoters': 0,
        'MaleVoters': 0,
        'FemaleVoters': 0,
        'OthersVoters': 0,
        'TotalRegisteredVoters': 0
    });

    useEffect(() => {
        Result();
        CadidatesCard();
        VotersCard();
        getTime();
    }, []);

   useEffect(()=>{
    if (preloader) {
        document.body.style.overflow = "hidden";
        document.body.style.height = "100%";
    }
    if (!preloader) {
        document.body.style.overflowY = "auto";
        document.body.style.height = "auto";
    }
   },[preloader])
       
    

    const Result = async () => {
        let data = await api.result();
        data = JSON.parse(data);
        // console.log(data);
        let maleCount = 0;
        let femaleCount = 0;
        let othersCount = 0;
        let partyVote = {};
        let tempCandidateData = []; // delete me
        for (let i = 0; i < data.length; i++) {
            const seqNo = data[i][0];
            const adhar = data[i][1];
            const vote = data[i][2];
            let adhar_data = await api.getVoterData(adhar);
            adhar_data = await JSON.parse(adhar_data);
            let political_data = await api.findCandidate(adhar);
            political_data = await JSON.parse(political_data);
            if (partyVote[political_data['success']['group']] in partyVote) {
                partyVote[political_data['success']['group']] = partyVote[political_data['success']['group']] + 1;
            }
            if (!(partyVote[political_data['success']['group']] in partyVote)) {
                partyVote[political_data['success']['group']] = vote;
            }
            tempCandidateData.push(
                {
                    'seqNo': seqNo,
                    'vote': vote,
                    'gender': adhar_data['gender'],
                    'party_name': political_data['success']['group'],
                    'party_url': political_data['success']['party_url'],
                    'cadidate_name': adhar_data['name'],
                    'cadidate_img': adhar_data['image']
                }
            )
            updateCadidateResult((previous) => {
                return [...previous, {
                    'seqNo': seqNo,
                    'vote': vote,
                    'gender': adhar_data['gender'],
                    'party_name': political_data['success']['group'],
                    'party_url': political_data['success']['party_url'],
                    'cadidate_name': adhar_data['name'],
                    'cadidate_img': adhar_data['image']
                }]
            });

            if (adhar_data['gender'] === 'Male') {
                maleCount++;

            }
            else if (adhar_data['gender'] === 'Female') {
                femaleCount++;

            }
            else {
                othersCount++;
            }


        }

        updateCadidateCard((previous) => {
            return {
                ...previous,
                'MaleCandidates': maleCount,
                'FemaleCandidates': femaleCount,
                'OthersCandidates': othersCount,
            }
        });
        const SortedPartyVote = Object.fromEntries(
            Object.entries(partyVote).sort((a, b) => b[1] - a[1])
        );
        //   console.log(SortedPartyVote);
        let firstThree = Object.entries(SortedPartyVote).slice(0, 3);
        firstThree = Object.fromEntries(firstThree);
        updateFirstThree({
            'first': [Object.keys(firstThree)[0].slice(0, 7), Object.values(firstThree)[0]],
            'second': [Object.keys(firstThree)[1].slice(0, 7), Object.values(firstThree)[1]],
            'third': [Object.keys(firstThree)[2].slice(0, 7), Object.values(firstThree)[2]],
        });
        // console.log(firstThree);
        UpdateBarState({
            series: [{
                data: Object.values(SortedPartyVote)
            }],
            options: {
                xaxis: {
                    categories: Object.keys(SortedPartyVote)
                }
            }
        });

        console.log(tempCandidateData);
    }

    const CadidatesCard = async () => {
        let totalApplied = await api.getAll();
        totalApplied = JSON.parse(totalApplied);
        // console.log(totalApplied.length);

        let totalAccepted = await api.totalVotersAndCandidates();
        totalAccepted = JSON.parse(totalAccepted);
        // console.log(totalAccepted['Voters']);
        // console.log(totalAccepted['NumberOfCandidates']);

        updateCadidateCard((previous) => {
            return {
                ...previous,
                'CandidatesApplied': totalApplied.length,
                'RejectedCandidates': (totalApplied.length - totalAccepted['NumberOfCandidates']),
                'TotalCandidates': totalAccepted['NumberOfCandidates']
            }
        })
    }

    // for voter card

    const VotersCard = async () => {
        let totalApplied = await api.totalVotersAndCandidates();
        totalApplied = JSON.parse(totalApplied);
        let getVoters = await api.getVoters();
        getVoters = JSON.parse(getVoters);
        // console.log(getVoters[0]);
        let votedCount = 0;
        let femaleCount = 0;
        let maleCount = 0;
        let othersCount = 0;
        let VoterGender = {
            "Ages 18-": 0,
            'Ages 18-24': 0,
            'Ages 25-34': 0,
            'Ages 35-44': 0,
            'Ages 45-64': 0,
            'Ages 65+': 0
        }
        let CityVoter = {}
        for (let i = 0; i < getVoters.length; i++) {

            const adhar = getVoters[i][0];
            let voterStatus = await api.voterStatus(adhar);
            voterStatus = JSON.parse(voterStatus);
            if (!voterStatus) {
                votedCount++;
                let adhar_data = await api.getVoterData(adhar);
                adhar_data = JSON.parse(adhar_data);
                const address = adhar_data.address.toUpperCase();
                if (address in CityVoter) {
                    CityVoter[address]++;
                }
                if (!(address in CityVoter)) {
                    CityVoter[address] = 1;
                }
                let date_of_birth = adhar_data['date_of_birth'];
                date_of_birth = api.getAge(date_of_birth);
                if (date_of_birth < 18) {
                    VoterGender["Ages 18-"]++;
                }
                if (date_of_birth >= 18 && date_of_birth <= 24) {
                    VoterGender['Ages 18-24']++;
                }
                if (date_of_birth >= 25 && date_of_birth <= 34) {
                    VoterGender['Ages 25-34']++;
                }
                if (date_of_birth >= 35 && date_of_birth <= 44) {
                    VoterGender['Ages 35-44']++;
                }
                if (date_of_birth >= 45 && date_of_birth <= 64) {
                    VoterGender['Ages 45-64']++;
                }
                if (date_of_birth >= 65) {
                    VoterGender['Ages 65+']++;
                }
                if (adhar_data['gender'] === 'Male') {
                    maleCount++;

                }
                else if (adhar_data['gender'] === 'Female') {
                    femaleCount++;

                }
                else {
                    othersCount++;
                }
            }

        }

        updateVoterCard((previous) => {
            return {
                ...previous,
                'VotedVoters': votedCount,
                'NotVotedVoters': (totalApplied.NumberOfVoters - votedCount),
                'MaleVoters': maleCount,
                'FemaleVoters': femaleCount,
                'OthersVoters': othersCount,
                'TotalRegisteredVoters': totalApplied.NumberOfVoters
            }

        });

        UpdateRadialBar(prevState => {
            const newSeries = [maleCount, femaleCount, othersCount]; // example new series values
            const sum = newSeries.reduce((acc, val) => acc + val, 0);
            return {
                ...prevState,
                series: newSeries,
                options: {
                    ...prevState.options,
                    plotOptions: {
                        ...prevState.options.plotOptions,
                        radialBar: {
                            ...prevState.options.plotOptions.radialBar,
                            dataLabels: {
                                ...prevState.options.plotOptions.radialBar.dataLabels,
                                total: {
                                    show: true,
                                    label: 'Total Voters',
                                    color: "white",
                                    formatter: function (w) {
                                        // By default this function returns the average of all series. The below is just an example to show the use of custom formatter function
                                        return sum
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        UpdatePieState({
            series: Object.values(VoterGender),
            options: {
                labels: Object.keys(VoterGender),

            }
        });

        UpdateRegionVote({
            series: [{
                data: Object.values(CityVoter)
            }],
            options: {
                ...regionVote.options,
                xaxis: {
                    categories: Object.keys(CityVoter),
                }
            }
        });
    }



    const getTime = async () => {
        let data = await api.getTime();
        const jsonData = await JSON.parse(data);
        // console.log(jsonData['StartTime']);

        let Reg_starting_time = jsonData['StartTime'];
        Reg_starting_time = api.convertTime(Reg_starting_time);
        Reg_starting_time = new Date(Reg_starting_time);
        Reg_starting_time = Reg_starting_time.toISOString().replace("T", " ").slice(0, -5);

        let Registration_endTime = jsonData['Registration_endTime'];
        Registration_endTime = api.convertTime(Registration_endTime);
        Registration_endTime = new Date(Registration_endTime);
        Registration_endTime = Registration_endTime.toISOString().replace("T", " ").slice(0, -5);
        // console.log(Registration_endTime);

        let Voting_EndTime = jsonData['Voting_EndTime'];
        Voting_EndTime = api.convertTime(Voting_EndTime);
        Voting_EndTime = new Date(Voting_EndTime);
        Voting_EndTime = Voting_EndTime.toISOString().replace("T", " ").slice(0, -5);

        updateTimings({
            'Reg_starting_time': Reg_starting_time,
            'Registration_endTime': Registration_endTime,
            'Voting_EndTime': Voting_EndTime,

        });
        UpdatePreloader(false);

    }





    // --------------------------------------
    const [pieState, UpdatePieState] = useState({
        series: [44, 55, 41, 17, 15],
        options: {
            labels: ['Ages 18-24', 'Ages 25-34', 'Ages 35-44', 'Ages 45-64', 'Ages 65+'],
            chart: {
                offsetY: 10,
                width: 380,
                type: 'donut',
                foreColor: 'white'
            },
            plotOptions: {
                pie: {
                    startAngle: -90,
                    endAngle: 270,
                    donut: {
                        labels: {
                            show: true,
                            total: {
                                show: true,
                                showAlways: true,
                                color: 'purple',
                                fontSize: 30,
                                fontWeight: 'bold',
                            }

                        }

                    }
                }

            },
            dataLabels: {
                enabled: true,
                style: {
                    // colors: ['white'],
                }

            },
            fill: {
                type: 'gradient',
            },
            legend: {
                formatter: function (val, opts) {
                    return "(" + val + ") => " + opts.w.globals.series[opts.seriesIndex]

                }
            },
            title: {
                text: 'Voters Age Range',
                offsetY: -6,
                align: 'center',
                floating: true,
                // style: {
                //     fontSize: '14px',
                //     fontWeight: 'bold',
                //     fontFamily: undefined,
                //     color: 'red'
                // },
            },
            responsive: [{
                breakpoint: 480,
                options: {
                    chart: {
                        width: 200,
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }]
        },


    })

    const [barState, UpdateBarState] = useState({



        series: [{
            data: [10, 10, 10, 10, 10]
        }],

        options: {

            chart: {
                type: 'bar',
                color: '#373d3f',
                height: 350,
                toolbar: { show: false },
                foreColor: 'white'

            },
            title: {
                offsetY: 0,
                align: 'center',
                floating: true,
                text: 'Parties Vote Count',
                // style: {
                //     fontSize: '14px',
                //     fontWeight: 'bold',
                //     fontFamily: undefined,
                //     color: '#fff',
                // },
            },
            fill: {
                type: 'gradient',
            },
            plotOptions: {
                bar: {
                    distributed: true,
                    borderRadius: 4,
                    horizontal: false,
                    columnWidth: 50,
                }
            },
            dataLabels: {
                enabled: true,

            },
            xaxis: {
                categories: ['South Korea', 'Canada', 'United Kingdom', 'Netherlands', 'Italy'],
            },
            tooltip: { enabled: true },
            colors: [ // this array contains different color code for each data
                "#d4526e",
                "#90ee7e",
                "#13d8aa",
                "#f48024",
                "#546E7A",
                "#A5978B",
                "#33b2df",
                "#f9a3a4",
                "#2b908f",
                "#69d2e7"
            ],
        },
    })

    const [radialBar, UpdateRadialBar] = useState({

        series: [87, 28, 65],
        options: {
            chart: {
                foreColor: 'white',
                height: 350,
                type: 'radialBar',
            },
            plotOptions: {
                radialBar: {
                    dataLabels: {
                        name: {
                            fontSize: '22px',
                        },
                        value: {
                            fontSize: '16px',
                        },

                    }
                }
            },
            labels: ['Males', 'Females', 'Others'],
            title: {
                text: 'Count Voters On The Basis of Gender',
                align: 'center',
                floating: true
            },
            // subtitle: {
            //     text: 'Count Voters on the basis of gender',
            //     align: 'center',

            // },
        },




    });

    const [regionVote, UpdateRegionVote] = useState({
        series: [{
            data: [80, 79, 28, 22]
        }],
        options: {
            chart: {
                foreColor: "white",
                type: 'bar',
                height: 380,
                toolbar: {
                    show: false,
                    tools: {
                        download: false
                    }
                }
            },
            plotOptions: {
                bar: {

                    barHeight: '100%',
                    distributed: true,
                    horizontal: true,
                    dataLabels: {
                        position: 'bottom'
                    },
                }
            },
            colors: [
                '#33b2df',
                '#90ee7e',
                '#A5978B',
                '#2b908f',
                '#d4526e',
                '#f48024',
                '#13d8aa',
                '#f9a3a4',
                '#546E7A',
                '#69d2e7'
            ],
            dataLabels: {
                enabled: true,
                textAnchor: 'start',
                style: {
                    colors: ['#fff']
                },
                formatter: function (val, opt) {
                    return opt.w.globals.labels[opt.dataPointIndex] + ":  " + val
                },
                offsetX: 0,
                dropShadow: {
                    enabled: true
                }
            },
            stroke: {
                width: 1,
                colors: ['#fff']
            },
            xaxis: {
                categories: ['Pune', 'Nasik', 'Thane', 'Nagpur'],
            },
            yaxis: {
                labels: {
                    show: false
                }
            },
            title: {
                offsetY: -4,
                text: 'How Many Voters In Particular Region',
                align: 'center',
                floating: true
            },
            // subtitle: {
            //     offsetY: 20,
            //     text: 'Displaying how many voters in particular region',
            //     align: 'center',
            // },
            tooltip: {
                theme: 'light',
                x: {
                    show: false
                },
                y: {
                    title: {
                        formatter: function () {
                            return ''
                        }
                    }
                }
            },
        },
    });



    return (
        <>
            {preloader ? <PreLoader /> : null}

            <div className="result-containe">

                <div className="top-boxes">

                    <div className="boxes box-2">
                        <h2 className="box-header">First Three</h2>
                        <div className="boxes-row-1">
                            <div className="details">
                                <h4>{firstThree.first[1]}</h4>
                                <h3>{firstThree.first[0]}</h3>
                            </div>
                            <div className="details">
                                <h4>{firstThree.second[1]}</h4>
                                <h3>{firstThree.second[0]}</h3>
                            </div>
                            <div className="details">
                                <h4>{firstThree.third[1]}</h4>
                                <h3>{firstThree.third[0]}</h3>
                            </div>
                        </div>
                    </div>

                    <div className="boxes box-3">
                        <h2 className="box-header">Candidate Gender Ratio</h2>
                        <div className="boxes-row-1">
                            <div className="details">
                                <h3>{cadidateCard.MaleCandidates}</h3>
                                <h4>Males</h4>
                            </div>
                            <div className="details">
                                <h3>{cadidateCard.FemaleCandidates}</h3>
                                <h4>Females</h4>
                            </div>
                            <div className="details">
                                <h3>{cadidateCard.OthersCandidates}</h3>
                                <h4>Others</h4>
                            </div>
                        </div>
                    </div>
                    <div className="boxes box-4">
                        <h2 className="box-header">Voters Gender Ratio</h2>
                        <div className="boxes-row-1">
                            <div className="details">
                                <h3>{VoterCard.MaleVoters}</h3>
                                <h4>Males</h4>
                            </div>
                            <div className="details">
                                <h3>{VoterCard.FemaleVoters}</h3>
                                <h4>Females</h4>
                            </div>
                            <div className="details">
                                <h3>{VoterCard.MaleVoters}</h3>
                                <h4>Others</h4>
                            </div>
                        </div>
                    </div>
                    <div className="boxes box-1">
                        {/* <h2 className="box-header">Timings</h2> */}
                        <div className="box-header-Name">
                            <h8>Registration Starts - </h8>
                            <p> {Timing.Reg_starting_time}</p>
                        </div>
                        <div className="box-header-Name">
                            <h8>Registration Ends - </h8>
                            <p> {Timing.Registration_endTime}</p>
                        </div>
                        <div className="box-header-Name">
                            <h8>Voting Ends - </h8>
                            <p> {Timing.Voting_EndTime}</p>
                        </div>

                    </div>
                </div>
                <div className="graphs">

                    <div className="graph-2">
                        <Chart options={barState.options} series={barState.series} type="bar" width={700} height={400} />
                    </div>
                    <div className="graph-1">
                        <Chart options={pieState.options} series={pieState.series} type="donut" width={540} />
                    </div>
                </div>
                <div className="graphs">
                    <div className="graph-1">
                        <Chart options={radialBar.options} series={radialBar.series} type="radialBar" width={600} height={430} />

                    </div>
                    <div className="graph-2">
                        <Chart options={regionVote.options} series={regionVote.series} type="bar" width={700} height={320} />
                    </div>
                </div>
                <div className="vote-container">
                    <div className="demograph-data">
                        <div className="voters-demo-graph">
                            <div className="demograph-title"><h2>Voter's
                                Data</h2></div>
                            <div className="blue-line-crd"></div>
                            <div className="demo-graphs">
                                <div className="parameters">
                                    <div className="prameter">Voted voters</div>
                                    <div className="prameter">Not voted voters </div>
                                    <div className="prameter">Male voters</div>
                                    <div className="prameter">Female voters</div>
                                    <div className="prameter">Others voters</div>
                                    <div className="prameter">Total no of Registered Voter's</div>
                                </div>
                                <div className="paratmeters-no">
                                    <div className="parameter-no">{VoterCard.VotedVoters}</div>
                                    <div className="parameter-no">{VoterCard.NotVotedVoters}</div>
                                    <div className="parameter-no">{VoterCard.MaleVoters}</div>
                                    <div className="parameter-no">{VoterCard.FemaleVoters}</div>
                                    <div className="parameter-no">{VoterCard.OthersVoters}</div>
                                    <div className="parameter-no">{VoterCard.TotalRegisteredVoters}</div>
                                </div>

                            </div>
                        </div>
                        <div className="candidates-demo-graph">
                            <div className="demograph-title"><h2>Candidate's
                                Data</h2></div>
                            <div className="blue-line-crd"></div>
                            <div className="demo-graphs">
                                <div className="parameters">
                                    <div className="prameter">Total Candidates Applied</div>
                                    {/* <div className="prameter">Number of Rejected Candidates</div> */}
                                    <div className="prameter">Male Candidates</div>
                                    <div className="prameter">Female Candidates</div>
                                    <div className="prameter">Others Candidates</div>
                                    <div className="prameter">Total no of Candidates</div>
                                </div>
                                <div className="paratmeters-no">
                                    <div className="parameter-no">{cadidateCard.CandidatesApplied}</div>
                                    {/* <div className="parameter-no">{cadidateCard.RejectedCandidates}</div> */}
                                    <div className="parameter-no">{cadidateCard.MaleCandidates}</div>
                                    <div className="parameter-no">{cadidateCard.FemaleCandidates}</div>
                                    <div className="parameter-no">{cadidateCard.OthersCandidates}</div>
                                    <div className="parameter-no">{cadidateCard.TotalCandidates}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="vote-count">
                        <div className="vote-count-result">
                            <div className="vote-count-title">
                                <h1>Vote Count</h1>
                            </div>
                            <div className="vote-count-blue-line"></div>
                            <div className="vote-count-table-titles">
                                <div className="table-title-no">No</div>
                                <div className="table-title-logo">Candidate</div>
                                <div className="table-title-logo">Party</div>
                                <div className="table-title-name">Candidate Name</div>
                                <div className="table-title-votes">Votes</div>
                            </div>
                            <div className="vote-count-result-data">
                                {cadidateResult.map((cadidate, index) => <div id={"man" + index} key={index} className="result-table-data">
                                    <div className="data-content-no">{cadidate.seqNo}</div>
                                    <div className="data-content-logo"><img
                                        src={cadidate.cadidate_img}
                                        alt="img"
                                        id="can-logo-img"
                                        width={"70rem"}
                                        height={"70rem"}
                                    /></div>
                                    <div className="data-content-logo"><img
                                        src={cadidate.party_url}
                                        alt="img"
                                        id="can-logo-img"
                                        width={"70rem"}
                                        height={"70rem"}
                                    /></div>
                                    <div className="data-content-name">{cadidate.cadidate_name} ({cadidate.party_name}) </div>
                                    <div className="data-content-votes">{cadidate.vote}</div>
                                </div>)}
                            </div>
                        </div>
                    </div>


                </div>



            </div>
        </>
    );
}

export default Result;
