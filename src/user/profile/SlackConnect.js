import React, { Component } from 'react';
import {
    Form, Input, message, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete,
  } from 'antd';
import Password from 'antd/lib/input/Password';
import {createSlack } from '../../util/APIUtils';
import LoadingIndicator from '../../common/LoadingIndicator';
import NotFound from '../../common/NotFound';
import ServerError from '../../common/ServerError';
  class RegistrationForm extends React.Component {
    constructor(props){
      super(props);
      this.state = {
      confirmDirty: false,
      autoCompleteResult: [],
      id:this.props.id
      };
      this.load = this.load.bind(this);
    };
    success = () => {
        message.success('변경 사항이 저장되었습니다.');
      }
    load(values) {
      this.setState({
          isLoading: true
      });
      createSlack(values)
      .then(response => {
          this.setState({
              ok:response,
              isLoading: false
            });
          this.success();
            console.log(this.state.ok)
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
  

    handleSubmit = (e) => {
      e.preventDefault();
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values);
          console.log(values)
          this.load(values);

        }
      });
    }
  
    // handleConfirmBlur = (e) => {
    //   const value = e.target.value;
    //   this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    // }
  
    // compareToFirstPassword = (rule, value, callback) => {
    //   const form = this.props.form;
    //   if (value && value !== form.getFieldValue('password')) {
    //     callback('Two passwords that you enter is inconsistent!');
    //   } else {
    //     callback();
    //   }
    // }
  
    // validateToNextPassword = (rule, value, callback) => {
    //   const form = this.props.form;
    //   if (value && this.state.confirmDirty) {
    //     form.validateFields(['confirm'], { force: true });
    //   }
    //   callback();
    // }
  
    
  
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
      const { getFieldDecorator } = this.props.form;

  
      const formItemLayout = {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
      };
      const tailFormItemLayout = {
        wrapperCol: {
          xs: {
            span: 24,
            offset: 0,
          },
          sm: {
            span: 16,
            offset: 8,
          },
        },
      };
     
  
      return (
        
        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
          <Form.Item
            label="키"
          >
            {getFieldDecorator('slackKey', {
              rules: [{
                required: true, message: '키를 입력해 주세요.',
              }, {
                //validator: this.validateToNextPassword,
              }],
            })(
              <Input/>
            )}
          </Form.Item>
          <Form.Item
            label="채널"
          >
            {getFieldDecorator('slackChannel', {
              rules: [{
                required: true, message: '채널을 입력해 주세요.',
              }, {
               // validator: this.validateToNextPassword,
              }],
            })(
              <Input/>
            )}
          </Form.Item>
        
         
         
          <Form.Item {...tailFormItemLayout}>
            <Button htmlType="submit">변경</Button>
          </Form.Item>
        </Form>
        
      );
    }
  }
  
  const SlackConnect = Form.create({ name: 'register' })(RegistrationForm);
  
  export default SlackConnect;