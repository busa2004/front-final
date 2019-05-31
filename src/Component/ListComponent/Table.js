import { Table, Divider, Tag } from 'antd';
import React, { Component } from 'react';
import ModalTest from './ModalTest';
import { Popconfirm, message,Button } from 'antd';

class DatePickers extends Component {

  constructor(props) {
    super(props);
    this.state = {
        reports: this.props.reports,
        columns : [{
          align:'center',
          title: '제목',
          dataIndex: 'title',
          key: 'title',
        }, {
          align:'center',
          title: '작성일자',
          dataIndex: 'date',
          key: 'date',
          render: (text, row, index) => {
            let date = new Date(text);
            return <div>{date.getFullYear()+"-"+
                        (date.getMonth()+1)+"-"+
                        date.getDate()}<br/>{
                        date.getHours()+":"+
                        date.getMinutes()+":"+
                        date.getSeconds()
                         }</div>
          }
        },{
          align:'center',
          title: '상태',
          dataIndex: 'status',
          key: 'status',
        } , {
          //5.16 업무 칼럼 추가 taskTitle
          align:'center',
          title: '업무',
          dataIndex: 'taskTitle',
          key: 'taskTitle',
        } ,{
          align:'center',
          title: '보고서 보기',
          key: 'description',
          dataIndex: 'description',
          render: (text, row, index) => (
            <ModalTest hold={this.props.hold} data={row} modify={this.props.modify} modifyConfirm={this.props.modifyConfirm} />          
           ),
        }],
        
        
    }
    console.log(';;;;;;;;;;;;;;;;;;;;;;;;' +this.props.columns)
    if(this.props.columns != undefined){
        this.state.columns = this.state.columns.concat(this.props.columns)
    }
   
}

  render() {

    return (<div>
     
      <Table columns={this.state.columns} dataSource={this.state.reports} />
      </div>
    );
  }
}
export default DatePickers;