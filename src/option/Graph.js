import { Doughnut } from 'react-chartjs-2';
import React, { Component } from 'react';
import { Card } from 'antd';
import { getGraph } from '../util/APIUtils';

class Graph extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data:{
                datasets: [{
                    data: [ this.state.report[0].count, this.state.report[1].count],
                    backgroundColor: [ 
                    'rgba(255,255,192,1)',
                    'rgba(255,192,192,1)']
                }],
            
                // These labels appear in the legend and in the tooltips when hovering different arcs
                labels: [
                   
                    this.state.report[0].status,
                    this.state.report[1].status
                ],
               
            },
            
        }
       
            
    }

    loadGraph() {
        this.setState({
            isLoading: true
        });
      
        getGraph()
        .then(response => {
            this.setState({
                report: response,
                isLoading: false
            });
        console.log(this.state.report)
        }).catch(error => {
            if(error.status === 404) {
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
    componentWillMount(){
        this.loadGraph()
    }
    render () {
        return (
            <Card headStyle={{backgroundColor:"#00B1B6",color:"#FBFBFB",fontWeight:"bold"}}
            bodyStyle={{backgroundColor:"16448250"}}  title='업무리스트'>
       <Doughnut
        data={this.state.data}
        options={{
          responsive: true,
          maintainAspectRatio: true,
        }}
      />
            </Card>    
            
            )
    }
}

export default Graph;