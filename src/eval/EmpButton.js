import React, { Component } from 'react';
import LoadingIndicator from '../common/LoadingIndicator';
import NotFound from '../common/NotFound';
import ServerError from '../common/ServerError';
import { Button } from 'antd/lib/radio';
import { searchEval } from '../util/APIUtils';
import {  withRouter } from 'react-router-dom';

class EmpButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      record: this.props.record, // 업무리스트에서 평가를 눌렀을 때 그 업무를 수행하고있는 사원리스트
      buttonName: "평가",
      visible: false,
      successEvalUserTaskId: this.props.successEvalUserTaskId
    }
  }

  // 평가? 수정?
  setButtonName = async () => {
    const taskId = this.state.record.id;

    // eval 테이블에서 user_task가 있는지 확인
    await searchEval(taskId)
      .then(response => {
        if (response.length != 0) {
          // 평가완료
          this.state.buttonName = "수정"
        } else if (response.length == 0) {
          this.state.buttonName = "평가"
        }
      })
      .catch(error => {
        // console.log(error);
      });

    this.setState({
      isLoading: false
    })
  }

  setVisible = () => {
    // empList 가져오고 평가하기 버튼 활성화/비활성화여부
    var d = new Date();
    var tmpToday = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
    var today = new Date(tmpToday);
    var endDate = new Date(this.props.record.endDate);

    if (today > endDate) {
      // 업무가 마감되지 않았으므로 평가를 할 수 없다.
      this.setState({
        visible: false, // 평가버튼 비활성화
      });
    } else {
      this.setState({
        visible: true, // 평가버튼 활성화
      });
    }
  }

  componentWillMount() {
    this.setButtonName();
    this.setVisible();
  }

  componentDidUpdate(prevProps){
    if(prevProps.successEvalUserTaskId != this.props.successEvalUserTaskId) {
      // 레코드 번호 따서 그부분만 수정으로 만들기
      if(this.state.record.id == this.props.successEvalUserTaskId) {
        this.setState({
          successEvalUserTaskId: this.props.successEvalUserTaskId,
          buttonName: "수정"
        });
      }      
    }
  }
  
  evalModal = () => {
    this.props.evalModal(this.state.record);
    this.props.getButtonName(this.state.buttonName);
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
      <Button
        onClick={this.evalModal}
        disabled={this.state.visible}
      >{this.state.buttonName}</Button>
    )
  }
}

export default withRouter(EmpButton);