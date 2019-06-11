import { Doughnut } from 'react-chartjs-2';
import React, { Component } from 'react';
import { Card } from 'antd';
import { getGraph } from '../util/APIUtils';
import LoadingIndicator from '../common/LoadingIndicator';
import ChartGraph from './ChartGraph'
import ServerError from '../common/ServerError';
import NotFound from '../common/NotFound';
class Graph extends Component {
    constructor(props) {
        super(props);
      
       this.state={
           data:null
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
                console.log(this.state.data)
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
    branch(){
      
        
        if(Object.keys(this.state.data).length === 0 ){
           <p>결제된 보고서가 존재하지 않습니다.</p>
        }
        else if(Object.keys(this.state.data).length === 1 ){
            
            if(this.state.data[0].status ==='HOLD')
            this.state.data.push({count:0,status:'PROGRESS'})
            else{
            this.state.data.push({count:0,status:'HOLD'})
            }
            return <ChartGraph data={this.state.data}/>
        }else if(Object.keys(this.state.data).length ===2 ){

        return <ChartGraph data={this.state.data}/>
        }
    }
    componentWillMount(){
        this.loadGraph()
    }
    render () {
    if(this.state.isLoading) {
            return <LoadingIndicator />
    }
    if(this.state.notFound) {
        return <NotFound />;
      }
      
      if(this.state.serverError) {
        return <ServerError />;
      }
        return (
            <div>
            <Card headStyle={{backgroundColor:"#00B1B6",color:"#FBFBFB",fontWeight:"bold"}}
            bodyStyle={{backgroundColor:"16448250"}}  title='업무리스트'>
       {this.branch()}   
        </Card> 
        
        </div>
            )
          
    }
}

export default Graph;