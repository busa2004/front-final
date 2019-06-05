import React, { Component } from 'react';
import { Input, Icon, Button, Card, notification, Table } from 'antd';
import Highlighter from 'react-highlight-words';

import { getTask, getByTask, searchEval, getAllEvalVersion, getVersionObj, getScoreByReport } from '../util/APIUtils';
import EmpList from './EmpList';
import EvalModal from './EvalModal';

import LoadingIndicator from '../common/LoadingIndicator';
import ServerError from '../common/ServerError';
import NotFound from '../common/NotFound';


// 업무리스트component 기반으로 만들어진 component
class Eval extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [{
        align: "center",
        width:"10%",
        title: '번호',
        dataIndex: 'taskNo',
        key: 'taskNo',
      }, {
        width:"30%",
        align: "center",
        title: '업무 제목',
        dataIndex: 'title',
        key: 'title',
        ...this.getColumnSearchProps('title')
      }, {
        width:"40%",
        align: "center",
        title: '업무 내용',
        dataIndex: 'content',
        key: 'content',
        ...this.getColumnSearchProps('content'),
        render: (text,row) => {
         
          return  <div dangerouslySetInnerHTML={ {__html: text} }></div>
        }
      }],
      visible: false,
      evalDatas: null,
      taskId: 0,
      userTasks: null,
      isCompleted: false, 
      scores: [],
      successEvalUserTaskId: 0,
      nCount: 1
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

  load = () => {
    this.setState({
      isLoading: true,
    });

    // 팀장권한에서 전체 업무리스트보기
    getTask()
      .then(response => {
        // let orderBy = [];
        let index = 0;

        response.map((item) => {
          item.taskNo =  this.state.nCount;
          this.setState({
            nCount: this.state.nCount+1
          });
          return null;
        });
        // orderBy.map((item) => {
        //   item.taskNo =  this.state.nCount;
        //   this.setState({
        //     nCount: this.state.nCount+1
        //   });
        //   return null;
        // });
        this.setState({
          evalDatas: response,
          isLoading: false,
          nCount: 1
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
    // 업무리스트 평가버튼
    this.setState({
      columns: this.state.columns.concat({
        align: "center",
        width:"20%",
        title: '평가',
        dataIndex: 'eval',
        key: 'eval',
        render: (text, record) => {
          let getUser = () => {
            this.getUser(record);
          }
          return <Button onClick={getUser}>평가</Button>
        }
      })
    });
    this.load();
  }

  getUser = (record) => {
    const taskId = record.id;

    this.setState({
      isLoading: true,
    });

    getByTask(taskId)
      .then(response => {
        response.map((item) => {
          item.key = this.state.nCount;
          this.setState({
            nCount: this.state.nCount + 1
          });
          return null;
        });
        this.setState({
          userTasks: response,
          taskId: taskId,
          nCount: this.state.nCount + 1
        });

        // 업무리스트에서 평가버튼을 누르면 업무를 가진 사원리스트 뜬다
        if(this.state.userTasks.length === 0) {
          // 업무를 가진 사원이 없을때..
          notification.success({ // 옆에 표시 띄우기
            message: 'Message',
            description: "업무를 배정받은 사원이 없습니다."
          })
         }
        this.setState({
          nCount: 1,
          isLoading: false
        });
      })
      .catch(error => {
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
  // 사원 선택하고나서 평가 모달띄우기..
  evalModal = async (childUserTask) => {
    await this.setState({
      userTask: childUserTask
    });
    this.modalControl(true); // modal control.. true : visible
    this.setScore();
  }

  
  getButtonName = (childButtonName) => {
    this.setState({
      buttonName: childButtonName
    })
  }
  
  changeButtonName = async (successEvalUserTaskId) => {
    await this.setState({
      successEvalUserTaskId: successEvalUserTaskId
    });
  }

  // 평가된 업무일 경우 db에서 값을 받아와 셋팅
  setScore = async () => {
    this.setState({
      isLoading: true
    });

    const taskId = this.state.userTask.id;

    // 보고서에 따른 점수
    await getScoreByReport(taskId)
      .then( response => {
        // console.log(response);
        const reportValue = {
          key: "보고서"
        }
        if(response === 'NaN') {
          reportValue.value= "점수가 없습니다."
        } else {
          reportValue.value = response.toFixed(0);
        }        
        this.setState({
          report: reportValue
        });
        //console.log(this.state.report);
      })
      .catch(error => {
        // console.log(error);
    })

    if(this.state.buttonName === '수정') {
      await searchEval(taskId)
        .then(response => {
          let itemListArr = [];
          let scoreArr = [];

          response.map( (item) => {
            itemListArr.push(item.score.evalItem);
            scoreArr.push(item.score);
            return null;
          });
          itemListArr.map((item) => {
            item.index = this.state.nCount;
            this.setState({
              nCount: this.state.nCount + 1 
            });
            return null;
          });
          this.setState({
            itemList: itemListArr,
            score: scoreArr,
            nCount: 1
          });
        })
        .catch(error => {
          // console.log(error);
        });

      this.state.itemList.map( (item) => {
        const newData = {
          evalItem : item,
          score: 0
        }
        if(item.content === '보고서') {
          newData.score= this.state.report.value
          if(newData.score === '점수가 없습니다.') newData.score= -1;          
        }
        this.setState({
          scores: [...this.state.scores, newData]
        });
        return null;
      })
    } else if (this.state.buttonName === '평가') {
      // 최신 버전 가져와서 평가
      // 최신 버전 이름 가져오기
      await getAllEvalVersion()
        .then(response => {
          this.setState({
            version: response[response.length-1]
          });
        })
        .catch(error => {
          // console.log(error)
        });      
      // 최신 버전이름으로 json 객체 가져오기
      await getVersionObj(this.state.version)
        .then(response => {
          let arr = [];
          response.map( (item) => {
            arr.push(item.evalItem);
            return null;
          });
          arr.map((item) => {
            item.index = this.state.nCount;
            this.setState({
              nCount: this.state.nCount +1
            });
            return null;
          });
          this.setState({
            score: [],
            itemList: arr,
            version: response,
            nCount: 1
          });
        })
        .catch(error => {
          // console.log(error)
        })

      if(this.state.itemList === []) {
        // 평가항목이 없는경우
        notification.error({
          message: "Message",
          description: "평가항목이 없습니다"
        })
      } else {
        this.state.itemList.map( (item) => {
          // console.log(item);
          const newData = {
            evalItem : item,
            score: 0
          }
          if(item.content === '보고서') {
            newData.score= this.state.report.value
            if(newData.score === '점수가 없습니다.') newData.score= -1;          
          }
          this.setState({
            scores: [...this.state.scores, newData]
          });
          return null;
        });
      }      
    }
    this.setState({
      isLoading: false
    })
  }

  modalControl = (v) => {
    this.setState({
      visible: v
    })
  }
  setNull = () => {
    this.setState({
      scores: [],
    })
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
        <Card title='평가하기' headStyle={{backgroundColor:"#00B1B6",color:"#FBFBFB",fontWeight:"bold"}}>
          <Table
            dataSource={this.state.evalDatas}
            columns={this.state.columns}
            pagination={{ defaultPageSize: 4 }} />
          <br /> <br />

          <EmpList
            userTasks={this.state.userTasks} // 업무를 가진 사원리스트
            evalModal={this.evalModal}
            evalButtonVisible={this.state.evalButtonVisible}
            buttonName={this.state.buttonName}
            getButtonName={this.getButtonName}
            successEvalUserTaskId={this.state.successEvalUserTaskId}
            />

          {/* 평가 component */}
          <EvalModal
            report={this.state.report}
            buttonName={this.state.buttonName}
            changeButtonName={this.changeButtonName}
            visible={this.state.visible}
            modalControl={this.modalControl}
            userTask={this.state.userTask} // 평가할 사원의 업무
            score={this.state.score} // 평가된 업무일 경우 점수를 input에 넣어서 세팅
            scores={this.state.scores} // 점수를 입력할 수 있게..
            itemList={this.state.itemList}
            setNull={this.setNull}
          />
        </Card>
      </div>
    );
  }
}
export default Eval;