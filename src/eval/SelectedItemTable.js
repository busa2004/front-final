import React, { Component } from 'react';
import { Table } from 'antd';

class SelectedItemTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [{
        title: '번호',
        dataIndex: 'itemNo',
        width: '20%'
      }, {
        title: '내용',
        dataIndex: 'content',
      }]
    }
  }
  render() {
    return (
      <div>
        <Table
          dataSource={this.props.itemList}
          columns={this.state.columns}
          pagination={false}
          rowKey="itemNo"/>
      </div>
    )
  }
}

export default SelectedItemTable;