import React, { Component } from 'react';
import Option1Calendar from '../Component/CalendarComponent/Calendar';
import { getUserTask,getUserCalendar } from '../util/APIUtils';
import { keyChange } from '../Component/ListComponent/Message';
import LoadingIndicator from '../common/LoadingIndicator';
import { Card } from 'antd';
import './css/Option1.css';
//send('ssssssssss');
class Option1 extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userTask: null,
            isLoading: true,
            cal:[],
            key:null,
            date: new Date(),
            nCount: 1
        }
        this.loadUserTask = this.loadUserTask.bind(this);
        this.loadUserCalendar = this.loadUserCalendar.bind(this);
            
    }
    
   
    loadUserTask() {
      this.setState({
          isLoading: true
      });
    
      getUserTask()
      .then(response => {
          this.setState({
              userTask: response.content,
              isLoading: false
          });

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
    
    loadUserCalendar() {
        this.setState({
            isLoading: true
        });
        getUserCalendar(this.props.currentUser.username)
        .then(response => {         
            response.map((item) => {
                item.key = this.state.nCount;
                this.setState({
                    nCount: this.state.nCount + 1
                });
            });
            this.setState({
                cal: response,
                nCount: 1,
                isLoading: false
            });
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

  
    componentDidMount() {
    // this.loadUserTask();
     this.loadUserCalendar();
    
    }
    settingKey = (e) =>{
        keyChange(e.target.value)
    }
    settingRoomTitle = (e) =>{
        this.setState({
            roomTitle: e.target.value
        });
       
        // console.log(e.target.value)
    }
  
    render () {
        const cal = this.state.cal;
        if(this.state.isLoading) {
            return <LoadingIndicator />
          }
          else{  
          return (
            <div style={{ 
                    margin: 0,
                    height: '100%',
                    overflow: 'hidden',
                   
              }}>
                 
                 <Card headStyle={{backgroundColor:"#00B1B6",color:"#FBFBFB",fontWeight:"bold"}}
                bodyStyle={{backgroundColor:"16448250"}}  title='업무리스트'>
                <Option1Calendar calendar = {cal} />   
                </Card>            
            </div>
        );
          }
    }
}
 export default Option1;