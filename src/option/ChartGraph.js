import { Doughnut,Bar } from 'react-chartjs-2';
import React, { Component } from 'react';
class ChartGraph extends Component {
    constructor(props) {
        super(props);
        this.state ={
            circleData:{
                datasets: [{
                    data: [this.props.data[0].count,this.props.data[1].count],
                    backgroundColor: [ 
                    'rgba(255,255,192,1)',
                    'rgba(255,192,192,1)']
                }],
            
                // These labels appear in the legend and in the tooltips when hovering different arcs
                labels: [
                    this.props.data[0].status,this.props.data[1].status
                   
                ],
               
            },
            barData:{
                datasets: [{
                    data: [10,20],
                    backgroundColor: [ 
                    'rgba(255,255,192,1)',
                    'rgba(255,192,192,1)']
                }],
            
                // These labels appear in the legend and in the tooltips when hovering different arcs
                labels: [
                    this.props.data[0].status,this.props.data[1].status
                   
                ],
               
            }
            
           }
       
            
    }
    render () {
        return (
            <div>
       <Doughnut
        data={this.state.circleData}
        options={{
          responsive: true,
          maintainAspectRatio: true,
        }}
        width={600} height={200}
      />
      <Bar
      data={this.state.barData}
      width={100}
      height={50}
      options={{  responsive: true }}
        />
        </div> 
            )
          
    }
}

export default ChartGraph;