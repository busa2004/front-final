import React, { Component } from 'react';
import { Table, Input, message, Modal, Button, Tabs, DatePicker } from 'antd';
import './ScrollList.css';
import "./SelectList.css"

const { RangePicker } = DatePicker;
const Search = Input.Search;
const TabPane = Tabs.TabPane;
const error = (value) => {
  message.error(value);
};

function callback(key) {
  // (key);
}

class SelectList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: this.props.tasks,
      columns: this.props.columns,
      createArr: [],
      deleteArr: [],
      length: 0,
      taskSearch: this.props.taskSearch,
      selectedRows: null,
      visible: false,
      dataTime: null,
      branch: null,
      buttonnum: 1,
      columns: [{
        align: 'center',
        title: '제목',
        dataIndex: 'title',
        key: 'title',
        render: text => <a href="javascript:;">{text}</a>,
      }]
    }

  }
  rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      this.setState({
        selectedRows: selectedRows
      });
      // console.log(this.state.selectedRows)
    },
    getCheckboxProps: record => ({
      disabled: record.status === 'disavble', // Column configuration not to be checked
      name: record.name,

    }),
  }

  onChange = (value, dateString) => {
    // console.log('Selected Time: ', value);
    // console.log('Formatted Selected Time: ', dateString);
    this.setState({
      time: dateString
    });

  }

  onOk(value) {
    // console.log('onOk: ', value);
  }

  showModal = (value) => {
    // console.log(value)
    if (this.state.selectedRows === null) {
      error('업무를 선택하지 않았습니다.');
    } else if (value === 'create') {
      this.setState({
        visible: true,
        branch: value
      });
    } else if (value === 'delete') {
      this.setState({
        branch: value
      });
      this.props.createAndDeleteButton(this.state.selectedRows, this.state.branch, this.state.time);
    }
  }

  handleOk = (e) => {
    this.setState({
      visible: false,
    });
    this.props.createAndDeleteButton(this.state.selectedRows, this.state.branch, this.state.time);

  }

  handleCancel = (e) => {
    // console.log(e);
    this.setState({
      visible: false,
    });
  }

  createOnClick = (e) => {


    this.showModal('create');
  }
  deleteOnClick = (e) => {

    this.showModal('delete');

  }

  init() {


    for (let i = 0; i < this.state.tasks.length; i++) {

      if (this.state.tasks[i].status === 1) {
        this.state.createArr.push(this.state.tasks[i]);
      } else {
        this.state.deleteArr.push(this.state.tasks[i]);
      }

    }

    // console.log(this.state.deleteArr)
  }
  componentWillMount() {
    if (this.state.tasks != null) {
      this.init();
    }
  }
  button(check) {
    if (this.state.tasks === null) {
      return <Button disabled style={{ position: "absolute" }} >확인</Button>
    }
    else if (check === 1) {
      return <Button type="primary" onClick={this.createOnClick}>확인</Button>
    } else if (check === 2) {
      return <Button type="primary" onClick={this.deleteOnClick}>확인</Button>
    }
    // if(this.state.tasks==null){
    //   return  <Button type="primary" disabled>확인</Button>
    // }
    // else{
    //  return <Button type="primary" onClick={this.createOnClick}>확인</Button>
    // }
  }

  render() {

    return (
      <div>
        <div>
          <Search
            defaultValue={this.state.taskSearch}
            placeholder="임무 검색"
            onSearch={value => this.props.searchTask(value)}
            enterButton
          />
          <Tabs defaultActiveKey="1" onChange={callback}>
            <TabPane tab="추가" key="1" >
              <Table rowSelection={this.rowSelection} style={{ height: "294px" }} columns={this.state.columns} dataSource={this.state.createArr} pagination={false} scroll={{ y: 240 }} />
              {this.button(1)}
            </TabPane>
            <TabPane tab="삭제" key="2" >
              <Table rowSelection={this.rowSelection} style={{ height: "294px" }} columns={this.state.columns} dataSource={this.state.deleteArr} pagination={false} scroll={{ y: 240 }} />
              {this.button(2)}
            </TabPane>
          </Tabs>

          <Modal
            title="기간선택"
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
          >
            <div style={{ textAlign: "center" }}>
              <p>시작날짜와 종료날짜를 설정해 주십시오.</p>
              <RangePicker
                showTime={{ format: 'HH:mm' }}
                format="YYYY-MM-DD HH:mm"
                placeholder={['Start Time', 'End Time']}
                onChange={this.onChange}
                onOk={this.onOk}

              />
            </div>
          </Modal>

        </div>

      </div>

    )
  }
}
export default SelectList;