import { Table } from 'antd';
import React, { Component } from 'react';
const columns = [
  {
    width:"50%",
    align:'center',
    title: '사원번호',
    dataIndex: 'username',
  },
  {
    width:"50%",
    align:'center',
    title: '이름',
    dataIndex: 'name',
  }
];
const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
  },
  {
    key: '4',
    name: 'Disabled User',
    age: 99,
    address: 'Sidney No. 1 Lake Park',
  },
];

// rowSelection object indicates the need for row selection



class SendMessage extends Component {
    constructor(props) {
        super(props);
        this.state = {
          
        }
    
      }
 
    render() {
        return (
            <Table style={{marginTop:'10px'}} rowSelection={this.props.rowSelection} columns={columns} dataSource={this.props.data} pagination={{ defaultPageSize: 5 }} />
        );
    }
}
 export default SendMessage;