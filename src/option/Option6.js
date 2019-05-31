import React, { Component } from 'react';
import Report from '../Component/ListComponent/Report';
import {
    Table, Input, Button, Icon,
  } from 'antd';
  import Highlighter from 'react-highlight-words';
  import {Card} from 'antd';
  

class Option6 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchText: '',
            columns : [{
                align: "center",
                title: '제목',
                dataIndex: 'title',
                key: 'title',
                ...this.getColumnSearchProps('title')
              
              }, {
                align: "center",
                title: '내용',
                dataIndex: 'content',
                key: 'content',
               
                ...this.getColumnSearchProps('content'),
                render: (text, row, index) => {
                  console.log(text,row,index)
                  return  <div dangerouslySetInnerHTML={ {__html: text} }></div>
                }
              },{
                align: "center",
                title: '날짜',
                dataIndex: 'createdAt',
                key: 'createdAt',
                ...this.getColumnSearchProps('createdAt'),
                render: (text, row, index) => {
                  let date = new Date(text);
                  return <div>{date.getFullYear()+"-"+
                              (date.getMonth()+1)+"-"+
                              date.getDate()}</div>
                }
              }]
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
            <Card title='업무리스트' headStyle={{backgroundColor:"#00B1B6",color:"#FBFBFB",fontWeight:"bold"}}> 
               <Report title={'업무리스트'}  status={'PROGRESS'} route={'task'}
               columns={this.state.columns}/>
            </Card>
            </div>
        );
    }
}
 export default Option6;