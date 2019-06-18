import { Select,Input,Row,Col,Card } from 'antd';
import React, { Component } from 'react';
import LoadingIndicator from '../../common/LoadingIndicator';
import ServerError from '../../common/ServerError';
import NotFound from '../../common/NotFound';
import ModalTest from '../ListComponent/ModalTest'
import { getReportByTaskId } from '../../util/APIUtils';
const Option = Select.Option;
const InputGroup = Input.Group;

class Selecter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userTask: this.props.userTask,
      userTaskId : this.props.userTaskId
    };
    // console.log(this.state.userTask)
    // console.log(this.state.userTaskId)
  };
  

  onBlur = () =>{
  //  console.log('blur');
  }
  onFocus = () => {
    // console.log('focus');
  }
  onSearch = (val) => {
    // console.log('search:', val);
  }

  loadGetReportByTaskId(value) {
    this.setState({
        isLoading: true
    });
    getReportByTaskId(value)
        .then(response => {
            this.setState({
                report: response,
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
  

  onUserTaskChange=(value)=>{
    this.state.userTask.map((task)=>{if(task.id == value){
      this.setState({
        taskTitle:task.title
      })
    }})
    this.loadGetReportByTaskId(value)
    this.props.onUserTaskChange(value)
    this.setState({
      userTaskId:value
    })
    //console.log(value)
    
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
      <div>
        {this.state.report==undefined||this.state.report==false?'':
          
        <Card title="참조">
        <Row type="flex" justify="start">
       
      {this.state.report.map((value,i)=>

      <ModalTest key={i} modalTitle={value.title}   route={'report'} data={value} />
      
     )
        }    
        
       
        </Row>
        </Card>
      
        }
       <p></p>   
           <InputGroup compact>
                
      <Input value="업무" style={{ width: "20%", pointerEvents: "none" }} />
      
      <Select
        showSearch
        style={{  width:"80%" }}
        
        value={this.state.userTaskId==null?
          '업무선택':this.state.taskTitle}
        optionFilterProp="children"
        onChange={value => this.onUserTaskChange(value)}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        onSearch={this.onSearch}
        filterOption={(input, option) =>
          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
            {this.state.userTask.map((contact, i) => {
      return ( <Option key={i} value={contact.id}>{contact.title}</Option>);
    })}
      </Select>
      </InputGroup>
      </div>
    )
  }

}

export default Selecter;