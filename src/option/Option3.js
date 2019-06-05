import React, { Component } from 'react';
import { getReport,deleteReport,modifyReport,getUserTaskDate } from '../util/APIUtils';
import { Row, Col, Card, Popconfirm, Input,Button  } from 'antd';
import  DatePickers from '../Component/ListComponent/DatePickers';
import  SerachForm from '../Component/ListComponent/SearchForm';
import  TabForm from '../Component/ListComponent/TabForm';
import LoadingIndicator from '../common/LoadingIndicator';
import ServerError from '../common/ServerError';
import NotFound from '../common/NotFound';
import Selecter from '../Component/WriteComponent/selecter'

const InputGroup = Input.Group;
class Option3 extends Component {
    constructor(props) {
        super(props);
        var d = new Date();
        this.state = {
            reports: null,
            isLoading: false,
            from:d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate(),
            to:d.getFullYear()+'-'+(d.getMonth()+1)+'-'+(d.getDate()),
            userTaskId:null,
            search:'',
            columns: {
                align:'center',
                title: '삭제',
                dataIndex: 'id',
                key: 'id',
                
                render: (text,row) => {
                  
                  if(row.status === '대기' ){
                  let confirm = () => {
                    this.loadDelete(text)
                  }
                  return <Popconfirm placement="top" title={'정말로 삭제하시겠습니까?'} onConfirm={confirm} okText="Yes" cancelText="No">
                    <Button type="danger" ghost >삭제</Button>
                  </Popconfirm>
                  }
  
                }
              }
        }
        this.loadReport = this.loadReport.bind(this);
             
    }
    
    loadDelete(id) {
        this.setState({
            isLoading: true
        });
      
        deleteReport(id)
        .then(response => {
            this.setState({
              ok: response,
                isLoading: false
            
              });
              this.loadReport({search:this.state.search,from:this.state.from,to:this.state.to,taskId:this.state.userTaskId});
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
      loadModify(content,id) {
        this.setState({
            isLoading: true
        });
      
        modifyReport(content,id)
        .then(response => {
            this.setState({
              ok: response,
                isLoading: false
            
              });
              this.loadReport({search:this.state.search,from:this.state.from,to:this.state.to,taskId:this.state.userTaskId});
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

    loadReport(data) {
        data.to = data.to + ' 23:59:59';
      this.setState({
          isLoading: true
      });
      getReport(data)
      .then(response => {
        // console.log('ss')
          this.setState({
            reports: response,
          
            });
            this.loadUserTask()
            // console.log(this.state.reports)
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
    
    loadUserTask() {
      this.setState({
          isLoading: true
      });
      getUserTaskDate()
          .then(response => {
              this.setState({
                  userTask: response,
                  isLoading: false
              });
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
  onUserTaskChange = (value) => {
    this.setState({
        userTaskId: value
    })
    this.loadReport({search:this.state.search,from:this.state.from,to:this.state.to,taskId:value})
    // console.log(`selected ${value}`);
}
    componentWillMount() {
     
     this.loadReport({search:this.state.search,from:this.state.from,to:this.state.to,taskId:this.state.userTaskId});
    }
    
    modifyConfirm=(content,id)=>{
      this.loadModify(content,id)

   }
    
    
    // _renderUserTask = () => {
    
    // const userTask =  this.state.userTask.map((userTask, index) => {
    //   console.log(userTask)
    //   return <TabPane 
    //   tab={userTask.task.title}
    //   key={index}>
    //   <Option1Table/></TabPane>
    //  }); 
    
    //  return userTask;
    // }
    
    search= (data) => {
        this.setState({
            search:data
        })
       let body={search:data,from:this.state.from,to:this.state.to,taskId:this.state.userTaskId}
        this.loadReport(body);
        // console.log(data)
    }
    dateSearch= (dateSearch) => {

        
         // console.log(dateSearch[0],dateSearch[1])
         this.setState({
            from:dateSearch[0],
            to:dateSearch[1],
        });
        let body={search:this.state.search,from:dateSearch[0],to:dateSearch[1],taskId:this.state.userTaskId}
        this.loadReport(body);
        // this.setState({
        //     startDate:date[0]._i,
        //     end:date[1]._i
        // });
    }
    render () {
        // console.log(this.state.isLoading)
        if(this.state.isLoading) {
            return <LoadingIndicator />;
          }
          
          if(this.state.notFound) {
            return <NotFound />;
          }
          
          if(this.state.serverError) {
            return <ServerError />;
          }
          // console.log(this.state.reports);
          
     
        
        
         return (       
            <div>
               
                <div>
                <Card headStyle={{backgroundColor:"#00B1B6",color:"#FBFBFB",fontWeight:"bold"}}
                bodyStyle={{backgroundColor:"16448250"}} title='보고서관리'>
                <InputGroup compact>
                <div style={{display:"flex", flexDirection: "row"}}>
                <DatePickers dateSearch={this.dateSearch} to={this.state.to} from={this.state.from} />
                <Selecter onUserTaskChange={this.onUserTaskChange} userTask={this.state.userTask} userTaskId={this.state.userTaskId}/>
                <SerachForm search={this.search} value={this.state.search}/></div>
                
                </InputGroup>
                     <Row>
                         <Col span={24}><TabForm modifyConfirm={this.modifyConfirm} reports={this.state.reports} columns={this.state.columns}/></Col>
                     </Row>
                </Card>
                 </div>
                {/* <Tap isAuthenticated={this.props.isAuthenticated} currentUser={this.props.currentUser}
                    userTasks={userTask} />  */}
            </div>
        );
    }
}
 export default Option3;