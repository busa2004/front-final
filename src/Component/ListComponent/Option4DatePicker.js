import React, { Component } from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';

const { RangePicker } = DatePicker;

const dateFormat = 'YYYY/MM/DD';


class Option4DatePick extends Component {


  onChange=(value, dateString) =>{
    this.props.dateSearch(dateString)
}
  render () {
        
       return (
        <div  style={{marginRight:"5px"}}>
        <RangePicker
          style={{width:"250px"}}
          onChange={this.onChange}  
          defaultValue={[moment( this.props.from , dateFormat), moment(this.props.to, dateFormat)]}
          format={dateFormat}
        />
      </div>
      );
  }
}
export default Option4DatePick;