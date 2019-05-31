import { Select } from 'antd';
import React, { Component } from 'react';
const Option = Select.Option;


class Selecter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userTask: this.props.userTask,
      userTaskId : this.props.userTaskId
    };
    console.log(this.state.userTask)
    console.log(this.state.userTaskId)
  };
  

  onBlur = () =>{
    console.log('blur');
  }
  onFocus = () => {
    console.log('focus');
  }
  onSearch = (val) => {
    console.log('search:', val);
  }


  
  render() {
    return (
      <Select
        showSearch
        style={{  width:"80%" }}
        placeholder={this.state.userTaskId==null?
          '업무선택':this.state.userTask.map((contact, i) => {
            console.log(contact,this.state.userTaskId)
          if(this.state.userTaskId == contact.id){
          return (contact.title);
          }
        })}
        optionFilterProp="children"
        onChange={value => this.props.onUserTaskChange(value)}
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
    )
  }

}

export default Selecter;