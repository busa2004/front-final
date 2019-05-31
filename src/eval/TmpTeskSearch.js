import React, { Component } from 'react';
import Option4table from '../ListComponent/Option4table';
import { getAllTask, deleteTask, getUserTask } from '../util/APIUtils';
import Option4DatePick from '../ListComponent/Option4DatePicker';
import LoadingIndicator from '../common/LoadingIndicator';
import ServerError from '../common/ServerError';
import NotFound from '../common/NotFound';
import { Button } from 'antd';

class TmpTeskSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      datas: this.props.data,
      columns: this.props.colums,
      value: this.props.value
    };
  }

  render() {
    return (
      <div className="Option4">
        <Option4DatePick
          to={this.state.value.to} 
          from={this.state.value.from}
          dateSearch={this.props.dateSearch} />
        <br /><br />
        <Option4table
          columns={this.state.columns}
          data={this.state.datas} />
      </div>
    );
  }
}
export default TmpTeskSearch; 