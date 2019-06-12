import { Doughnut } from 'react-chartjs-2';
import React, { Component } from 'react';
import { Card, Table } from 'antd';
import { getGraph } from '../util/APIUtils';
import LoadingIndicator from '../common/LoadingIndicator';
import ChartGraph from './ChartGraph'
import ServerError from '../common/ServerError';
import NotFound from '../common/NotFound';

var dateFormat = require('dateformat');
var date = new Date();
var now = date.getFullYear()+'-'+("0"+date.getMonth()).slice(-2);
const columns = [
    {
        width: "50%",
        align: 'center',
        title: '반려 이유',
        dataIndex: 'description',
        key: 'description',
    },
    {
        width: "50%",
        align: 'center',
        title: '횟수',
        dataIndex: 'count',
        key: 'count',
    },

];


class Graph extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: null
        }

    }
    loadGraph() {
        this.setState({
            isLoading: true
        });
        getGraph()
            .then(response => {

                this.setState({
                    data: response,
                    isLoading: false
                });
                //
                this.state.data.graph.map((value,index) =>
                {if(index==0 && value.status=='HOLD'){
                  this.state.data.graph.push({status:'HOLD',count:this.state.data.graph[0].count});
                  this.state.data.graph[0].count=0;
                  this.state.data.graph[0].status="PROGRESS";
                }
              })
                //
            }).catch(error => {
                if (error.status === 404) {
                    this.setState({
                        notFound: true,
                        isLoading: false
                    });
                } else {
                    this.setState({
                        serverError: true,
                        isLoading: false
                    });
                }
            });
    }
    // branch(){


    //     if(Object.keys(this.state.data).length === 0 ){
    //        <p>결제된 보고서가 존재하지 않습니다.</p>
    //     }
    //     else if(Object.keys(this.state.data).length === 1 ){

    //         if(this.state.data[0].status ==='HOLD')
    //         this.state.data.push({count:0,status:'PROGRESS'})
    //         else{
    //         this.state.data.push({count:0,status:'HOLD'})
    //         }
    //         return <ChartGraph data={this.state.data}/>
    //     }else if(Object.keys(this.state.data).length ===2 ){

    //     return <ChartGraph data={this.state.data}/>
    //     }
    // }
    componentWillMount() {
        this.loadGraph()
    }
    render() {
        if (this.state.isLoading) {
            return <LoadingIndicator />
        }
        if (this.state.notFound) {
            return <NotFound />;
        }

        if (this.state.serverError) {
            return <ServerError />;
        }
        return (
            <div>
                <Card headStyle={{ backgroundColor: "#00B1B6", color: "#FBFBFB", fontWeight: "bold" }}
                    bodyStyle={{ backgroundColor: "16448250" }} title='반려 분석'>
                    {this.state.data.graph.length == 0 ?
                        <p>반려된 보고서가 존재하지 않습니다.</p> :
                        <div>
                            
                            <h1>전체 반려율은 {Math.ceil(this.state.data.graph[1].count/
                                (this.state.data.graph[0].count+this.state.data.graph[1].count)*100)}%이며 
                            전월 반려율은 {this.state.data.rate.map((value)=>{
                                if(value.m == now){
                                    return Math.ceil(value.hold/(value.progress+value.hold)*100)
                                }
                             
                            })}%입니다.</h1>
                            
                            <ChartGraph data={this.state.data} />

                            <Table dataSource={this.state.data.description} columns={columns} pagination={{ defaultPageSize: 3 }}/>
                        </div>
                    }
                </Card>

            </div>
        )

    }
}

export default Graph;