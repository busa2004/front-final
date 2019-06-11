import { Doughnut } from 'react-chartjs-2';
import React, { Component } from 'react';
class ChartGraph extends Component {
    constructor(props) {
        super(props);
        this.state ={
            data:{
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
            
           }
       
            
    }
    render () {
        return (
       <Doughnut
        data={this.state.data}
        options={{
          responsive: true,
          maintainAspectRatio: true,
        }}
        width={600} height={200}
      />
 
            
            )
          
    }
}

export default ChartGraph;