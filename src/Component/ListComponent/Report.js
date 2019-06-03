import React, { Component } from 'react';
import Option4table from '../ListComponent/Option4table';
import { message } from 'antd';
import "./Report.css"
import { getAllReport, getAllTask, ReportConverter, getAllTaskNoSearch } from '../../util/APIUtils';
import Option4DatePick from '../ListComponent/Option4DatePicker';
import Option4Search from '../ListComponent/Option4Search';
import Option4modal from '../ListComponent/Option4modal';
import LoadingIndicator from '../../common/LoadingIndicator';
import ServerError from '../../common/ServerError';
import NotFound from '../../common/NotFound';
import Selecter from '../WriteComponent/selecter';
import { sendUser } from './Message';

class Report extends Component {
  constructor(props) {
    super(props);
    var d = new Date();
    this.progress = this.progress.bind(this);
    this.state = {
      buttonTitle: this.props.buttonTitle,
      value: { status: this.props.status },
      title: this.props.title,
      route: this.props.route,
      taskId: null,
      user: this.props.currentUser,
      datas: null,
      ok: null
    }
    this.state.value.search = '';
    this.state.value.from = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
    this.state.value.to = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + (d.getDate());
    this.load = this.load.bind(this);
  }
  success = () => {
    message.success('변경 사항이 저장되었습니다.');
  }

  search = (data) => {

    this.state.value.search = data;
    this.load();
  }
  dateSearch = (dateSearch) => {


    this.state.value.from = dateSearch[0];
    this.state.value.to = dateSearch[1];
    this.load();
  }
  load() {
    this.state.value.to = this.state.value.to + ' 23:59:59';
    this.setState({
      isLoading: true,
    });
    if (this.state.route === 'report') {
      getAllReport(this.state.value)
        .then(response => {
          this.setState({
            datas: response,

          });
          this.loadUserTask()
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
    } else if (this.state.route === 'task') {
      // console.log(this.state.value)
      //여기부터
      //getAllTask구현
      //column과 data 수정
      getAllTask(this.state.value)
        .then(response => {
          this.setState({
            datas: response,
            isLoading: false

          });
          // console.log(this.state.datas);
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
  }

  ModalLoad(state) {
    // console.log(state)
    this.setState({
      isLoading: true,
    });
    if (this.state.route === 'report') {
      ReportConverter(state)
        .then(response => {
          this.setState({
            ok: response,
            isLoading: false


          });
          this.load();
          this.success();
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
    } else if (this.state.route === 'task') {


    }
  }


  progress = (idData, stateData, textArea, reportTitle) => {
    let state = { state: stateData, id: idData, description: textArea };
    this.ModalLoad(state);
    // (state)
    if (stateData === 'PROGRESS') {
      sendUser(reportTitle + '가 승인되었습니다.\n http://localhost:3000/Option3', idData);
    } else if (stateData === 'HOLD') {
      sendUser(reportTitle + '가 반려되었습니다.\n http://localhost:3000/Option3', idData);
    }
  }


  loadUserTask() {
    this.setState({
      isLoading: true
    });
    getAllTaskNoSearch()
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


  componentWillMount() {
    // console.log(this.props.currentUser)

    if (this.state.route === 'report') {
      this.setState({
        columns: this.props.columns.concat({
          align: 'center',
          title: 'action',
          key: 'id',
          render: (record, columns) => (

            <span>
              <Option4modal
                progress={this.progress}
                route={this.state.route} record={record} title={this.state.buttonTitle} />
            </span>
          )
        }),
      });
    } else {
      this.setState({
        columns: this.props.columns
      })
    }
    this.load();

  }


  onUserTaskChange = (value) => {

    // console.log(`selected ${value}`);
    this.state.value.taskId = value;
    this.state.taskId = value
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
      <div className="Option4">
        <div className='header'>
          <Option4DatePick
            to={this.state.value.to} from={this.state.value.from}
            dateSearch={this.dateSearch} />


          {this.state.route === 'report' ? <Selecter onUserTaskChange={this.onUserTaskChange} userTask={this.state.userTask} userTaskId={this.state.taskId} />
            : null}
          <Option4Search
            searchValue={this.state.value.search}
            search={this.search} />
        </div>



        <Option4table
          route={this.state.route}
          columns={this.state.columns}
          buttonTitle={this.state.buttonTitle} data={this.state.datas} />
      </div>
    );
  }
}
export default Report; 