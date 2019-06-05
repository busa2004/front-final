import React, { Component } from 'react';
import { Table } from 'antd';

class Option4table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      route: this.props.route,
      buttonTitle: this.props.buttonTitle,
      data: this.props.data,
      columns: this.props.columns,
      arr: []
    }
  }
  render() {
    return <Table columns={this.state.columns} dataSource={this.state.data} pagination={{ defaultPageSize: 4 }} />;
  }
}

export default Option4table;