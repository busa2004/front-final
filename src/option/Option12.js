import React, { Component } from 'react';
import { Row, Col } from 'antd';
import {getOtherUserProfile,profileModify } from '../util/APIUtils';
import LoadingIndicator from '../common/LoadingIndicator';
import ServerError from '../common/ServerError';
import NotFound from '../common/NotFound';
import {Card,notification} from 'antd';
import AdminUserList from '../Component/ListComponent/AdminUserList';
import AdminUserSelectList from '../Component/ListComponent/AdminUserSelectList';
import reqwest from 'reqwest';
import { API_BASE_URL} from '../constants/index'
class Option12 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tasks: null,
            isLoading: false,
            userId:null,
            ok:null,
            search:'',
            taskIds:[],
            taskSearch:'',
          
        }
        this.loadProfile = this.loadProfile.bind(this);
        
    }

    clickButton = (data,search) => {
        //let userId={userId:data}
        this.loadProfile(data)
        this.setState({
            userId:data,
            search:search
        })
       
    }
    



    loadProfile(data) {
        this.setState({
            isLoading: true
        });
      
        getOtherUserProfile(data)
        .then(response => {
            this.setState({
              profile: response,
                isLoading: false
                
              });
              // console.log(this.state.profile)
        }).catch(error => {
            if(error.status === 404) {
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

      onModify = (modify) => {
        profileModify(modify)
        .then(response => {
           
            notification.success({
                message: '더존팩토리',
                description: "수정되었습니다.",
            });          
            this.load();
           
        }).catch(error => {
            notification.error({
                message: '더존팩토리',
                description: error.message || 'Sorry! Something went wrong. Please try again!'
            });
        });
       
    }
    componentDidMount() {
      this.load();
    }
    userSearch=(data)=>{
      this.state.search=data;
      this.load();
    }
    load = () =>{
      this.setState({
        isLoading: true
      });
      this.fetchData((res) => {
        this.setState({
          data: res,
          isLoading: false
        });
        if(this.state.userId != null){
        this.loadProfile(this.state.userId)}
        // console.log(this.state.data)
      });
    }
  
    fetchData = (callback) => {
      reqwest({
        url: API_BASE_URL+'/user/all?search='+this.state.search,
        type: 'json',
        method: 'get',
        contentType: 'application/json',
        success: (res) => {
          callback(res);
          
        },
      });
    }

    render() {
        if(this.state.isLoading) {
            return <LoadingIndicator />;
          }
          
          if(this.state.notFound) {
            return <NotFound />;
          }
          
          if(this.state.serverError) {
            return <ServerError />;
          }
        return (

            <div>

                <div>
                <Card title='회원정보수정' headStyle={{backgroundColor:"#00B1B6",color:"#FBFBFB",fontWeight:"bold"}}>
                    <Row>
                        <Col span={10}><AdminUserList  load={this.load} data = {this.state.data} userSearch={this.userSearch}
                        search ={this.state.search} 
                        clickButton={this.clickButton} /></Col>
                         <Col span={14}><AdminUserSelectList onModify={this.onModify} profile={this.state.profile}/></Col> 
                       
                    </Row>
                </Card> 


                </div>

            </div>
        );
    }
}
export default Option12;