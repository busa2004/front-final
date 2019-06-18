import React, { Component } from 'react';
import UserTable from './UserTable';
import { Input,Row, Col,Card,Button,message } from 'antd';
import LoadingIndicator from '../common/LoadingIndicator';
import ServerError from '../common/ServerError';
import NotFound from '../common/NotFound';
import {getUserAll, } from '../util/APIUtils';
import {send} from '../Component/ListComponent/Message'
const { TextArea } = Input;
const Search = Input.Search;
const error = (value) => {
    message.error(value);
};
const success = (value) => {
    message.success(value);
};
class SendMessage extends Component {
    constructor(props) {
        super(props);
        this.state = {
          search:'',
          text:'',
          selectedRows:[],
        }
    
      }
      searchUser= (data) =>{
        this.state.search = data;
        this.load();
      }
      load() {
        this.setState({
            isLoading: true
        });
        getUserAll(this.state.search)
            .then(response => {
                this.setState({
                    data: response,
                    isLoading: false
                });
               // console.log(response)
            }).catch(error => {
                if (error.status === 404) {
                    this.setState({
                        notFound: true,
                        isLoading: false
                    });
                } else {
                    this.setState({
                        serverError: true,
                        isLoading: false
                    });
                }
            });
    }
      onChange = e => {
          this.setState({
            text:e.target.value
          })
       
      };
      onClick = () =>{
        if(this.state.selectedRows==false){
            error('사원을 선택하지 않았습니다.');
            return;
        }else if(this.state.text === ''){
            error('메세지를 작성하지 않았습니다.')
            return;
        }else{
         
            this.state.selectedRows.map((text)=>
            send(this.state.text,text.slackKey,text.slackChannel))
            success('메세지를 전송하였습니다.')
            return;
        }
      
      }
      rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
         
          //console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
          this.setState({
            selectedRows:selectedRows
          });
          
        },
        getCheckboxProps: record => ({
          disabled: record.slackKey === null, // Column configuration not to be checked
          name: record.name,
        }),
      };
    componentWillMount(){
        this.load();
    }
    render() {
        if (this.state.isLoading) {
            return <LoadingIndicator />;
        }

        if (this.state.notFound) {
            return <NotFound />;
        }

        if (this.state.serverError) {
            return <ServerError />;
        }
        return (
                <Card title='메세지 보내기' headStyle={{backgroundColor:"#00B1B6",color:"#FBFBFB",fontWeight:"bold"}}> 
 
                <Search
                   defaultValue={this.state.search}
                    placeholder="사원 검색"
                    onSearch={value => this.searchUser(value)}
                    enterButton
                />
                    <UserTable rowSelection={this.rowSelection} data={this.state.data}/>
                    <TextArea rows={4} onChange={this.onChange} placeholder="메세지를 입력하세요." />
                    <Button style={{marginTop:'10px'}} onClick={this.onClick}>전송</Button>

                
                </Card>
        );
    }
}
 export default SendMessage;