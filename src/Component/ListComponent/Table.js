import { Table } from 'antd';
import React, { Component } from 'react';
import ModalTest from './ModalTest';
import { Input, Button, Icon } from 'antd';
import Highlighter from 'react-highlight-words';
class DatePickers extends Component {

  constructor(props) {
    super(props);
    this.state = {
        reports: this.props.reports,
        columns : [
          {
            //5.16 업무 칼럼 추가 taskTitle
            width:"30%",
            align:'center',
            title: '업무이름',
            dataIndex: 'taskTitle',
            key: 'taskTitle',
            ...this.getColumnSearchProps('taskTitle'),
          } ,{
            width:"25%",
          align:'center',
          title: '제목',
          dataIndex: 'title',
          key: 'title',
          ...this.getColumnSearchProps('title')
        },{
          width:"10%",
          align:'center',
          title: '상태',
          dataIndex: 'status',
          key: 'status',
          ...this.getColumnSearchProps('status'),
         
        } , {
          width:"10%",
          align:'center',
          title: '보고서 보기',
          key: 'description',
          dataIndex: 'description',
         
          render: (text, row, index) => (
            <ModalTest modalTitle={'보고서 보기'} hold={this.props.hold} data={row} modify={this.props.modify} modifyConfirm={this.props.modifyConfirm} />          
           ),
        }, {
          width:"15%",
          align:'center',
          title: '작성일자',
          dataIndex: 'date',
          key: 'date',
          
          render: (text, row, index) => {
            let date = new Date(text);
            return <div>{date.getFullYear()+"-"+
                        (date.getMonth()+1)+"-"+
                        date.getDate()}<br/>{
                        date.getHours()+"시 "+
                        date.getMinutes()+"분"
                         }</div>
          }
        }],
    }
    if(this.props.columns !== undefined){
        this.state.columns = this.state.columns.concat(this.props.columns)
    }
}
getColumnSearchProps = (dataIndex) => ({
  filterDropdown: ({
    setSelectedKeys, selectedKeys, confirm, clearFilters,
  }) => (
    <div style={{ padding: 8 }}>
      <Input
        ref={node => { this.searchInput = node; }}
        placeholder={`Search ${dataIndex}`}
        value={selectedKeys[0]}
        onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
        onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
        style={{ width: 188, marginBottom: 8, display: 'block' }}
      />
      <Button
        type="primary"
        onClick={() => this.handleSearch(selectedKeys, confirm)}
        icon="search"
        size="small"
        style={{ width: 90, marginRight: 8 }}
      >
        Search
      </Button>
      <Button
        onClick={() => this.handleReset(clearFilters)}
        size="small"
        style={{ width: 90 }}
      >
        Reset
      </Button>
    </div>
  ),
  filterIcon: filtered => <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />,
  onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
  onFilterDropdownVisibleChange: (visible) => {
    if (visible) {
      setTimeout(() => this.searchInput.select());
    }
  },
  render: (text) => (
    <Highlighter
      highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
      searchWords={[this.state.searchText]}
      autoEscape
      textToHighlight={text.toString()}
    />
  ),
})

handleSearch = (selectedKeys, confirm) => {
  confirm();
  this.setState({ searchText: selectedKeys[0] });
}

handleReset = (clearFilters) => {
  clearFilters();
  this.setState({ searchText: '' });
}

  render() {
    return (
      <div>
        <Table columns={this.state.columns} dataSource={this.state.reports} pagination={{ defaultPageSize: 4 }} />
      </div>
    );
  }
}
export default DatePickers;