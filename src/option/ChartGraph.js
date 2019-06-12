import { Doughnut } from 'react-chartjs-2';
import React, { Component } from 'react';
import { Row, Col,Card } from 'antd';
import {
    BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend,  PieChart, Pie
} from 'recharts';
import Title from 'antd/lib/typography/Title';



  
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
class ChartGraph extends Component {
    constructor(props) {
        super(props);
        
    //   this.props.data.graph.map((value,index) =>
    //   {if(index==0 && value.status=='HOLD'){
    //     this.props.data.graph.push({status:'HOLD',count:this.props.data.graph[0].count});
    //     this.props.data.graph[0].count=0;
    //     this.props.data.graph[0].status="PROGRESS";
    //   }
    // })


       
        this.state = {
            data01:this.props.data.graph,
            circleData: {
                datasets: [{
                    data:
                        this.props.data.graph.map((value,index) =>
                        value.count)
                    ,
                    backgroundColor: [
                        'rgba(83,148,204,1)','rgba(203,88,85,1)'
                        ]
                }],

                // These labels appear in the legend and in the tooltips when hovering different arcs
                labels:['승인','반려']
                   

                ,

            },
            // barData: {
            //     datasets: [{
            //         data: this.props.data.rate.map((value) => value.count),
            //         backgroundColor: [
            //             'rgba(255,255,192,1)',
            //             'rgba(255,192,192,1)']

            //     }],

            //     // These labels appear in the legend and in the tooltips when hovering different arcs
            //     labels: this.props.data.rate.map((value) => value.m)

            // }

        }


    }
    render() {
        return (
            <div>
               
                <Row>
                    <Col span={12}>
                    <Card>
                        <p>전체 반려</p>
                    <Doughnut
                            data={this.state.circleData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: true,
                                legend:{position:'bottom',labels:{boxWidth:15}}
                            }}
                            width={500} height={316}
                        
                        />
                    
                    </Card>
                    </Col>
                    <Col span={12}>
                    <Card>
                        {/* <Bar
                            legend={{ label: 'HOLD' }}
                            data={this.state.barData}
                            width={100}
                            height={50}
                            options={{
                                responsive: true,
                            }}
                        /> */}
                         <p>월별 반려</p>
                        <BarChart
                            
                            width={500}
                            height={300}
                            data={this.props.data.rate}
                            margin={{right:50}}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="m" />
                            <YAxis />
                            <Tooltip />
                            <Legend  payload={[{value:'승인',color:"#5082bd",type:"square"},
                        {value:'반려',color:"#cb5855",type:"square"}]}/>
                            <Bar dataKey="progress" fill="#5082bd" />
                            <Bar dataKey="hold" fill="#cb5855" />
                        </BarChart>
                        </Card>
                    </Col>
                </Row>
            </div>
        )

    }
}

export default ChartGraph;