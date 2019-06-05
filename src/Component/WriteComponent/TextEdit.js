import React, { Component } from 'react';
import { Button, message, Input, Select } from 'antd';
import { createTask, createReport, getUserTaskDate } from '../../util/APIUtils';
import { html, html2, html3 } from '../../constants/html';
import {send} from '../ListComponent/Message';
import Selecter from '../WriteComponent/selecter'
import JoditEditor from "jodit-react";
import LoadingIndicator from '../../common/LoadingIndicator';
import ServerError from '../../common/ServerError';
import NotFound from '../../common/NotFound';
import Uploader from './Uploader'
import 'jodit';
import 'jodit/build/jodit.min.css';

const Option = Select.Option;
const InputGroup = Input.Group;
const error = (value) => {
    message.error(value);
};

class TextEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ok: null,
            isLoading: false,
            content: '',
            title: '',
            userTask: null,
            router: this.props.router
        };
        this.onClick = this.onClick.bind(this);
        this.loadCreateTask = this.loadCreateTask.bind(this);
        this.loadUserTask = this.loadUserTask.bind(this);
    };


    success = (value) => {
        message.success(value);
    };
    loadCreateTask(task) {
        this.setState({
            isLoading: true
        });
        if (this.state.router === 'task') {
            createTask(task)
                .then(response => {
                    this.setState({
                        ok: response,
                        isLoading: false
                    });
                    this.success('새로운 업무를 등록하였습니다.');
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
        } else if (this.state.router === 'report') {
            createReport(task)
                .then(response => {
                    this.setState({
                        ok: response,
                        isLoading: false,
                    });
                    this.success('보고서 작성을 완료하였습니다.');
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
        // console.log(`selected ${value}`);
    }
    componentWillMount() {
        if (this.state.router === 'report') {
            this.loadUserTask()
        }
    };


    onClick() {
        if (this.state.content === '') {
            error('내용을 입력해야 합니다.');
        }else if(this.state.title === ''){
            error('제목을 입력해야 합니다.');
        }else if(this.state.router === 'report'&&this.state.userTaskId==null){
            error('업무를 선택해야 합니다.');
        }else {
            const task = { content: '', title: '' };

            task.content = this.state.content;
            task.title = this.state.title;

            if (this.state.router === 'report') {
                task.fileName = this.state.fileName;
                task.userTaskId = this.state.userTaskId;
            }
            // console.log(this.props.currentUser)
            this.loadCreateTask(task);
            if (this.state.router === 'report') {
            send(this.props.currentUser.name+' 이'+
            this.state.title+'를 작성하였습니다.\n http://localhost:3000/Option4',
            'xoxp-589802289765-587062052432-637522247233-ecdfb5f0a09821fa899e7556d06c2a0d',
            '관리자')
            }
            this.setState({
                content:'',
                title:'',
                fileName:null,
                userTaskId:null
            })
           
        }
    };
    onChange = (e) => {
        this.setState({
            [e.target.title]: e.target.value
        });
    }
    updateContent = (value) => {
        this.setState({ content: value })
    }
    /**
     * @property Jodit jodit instance of native Jodit
     */
    jodit;
    setRef = jodit => this.jodit = jodit;

    config = {
        readonly: false, // all options from https://xdsoft.net/jodit/doc/
        width: '100%',
        height:'400px',
       
    }

    onUpload=(value)=>{
        var fileNameArr = value.map((num)=>num.name);
        // console.log(fileNameArr)
        this.setState({
            fileName:fileNameArr
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

                {this.state.router === 'report' ?
                    <div className="information" >
                        <InputGroup compact>
                        <Input value="업무" style={{width:"20%",pointerEvents:"none"}} />
                        <Selecter onUserTaskChange={this.onUserTaskChange} userTask={this.state.userTask} />
                        </InputGroup>
                        <InputGroup compact style={{marginTop:"10px"}}>
                            <Select defaultValue="보고서 선택" style={{ width: '20%' }} onChange={this.updateContent}>
                                <Option value={html()}>일일 보고서</Option>
                                <Option value={html2()}>주간 보고서</Option>
                                <Option value={html3()}>월간 보고서</Option>
                            </Select>
                            <Input title={'title'} value={this.state.title} style={{ width: '65%',marginRight:"0px" }} placeholder="제목" onChange={this.onChange} />
                            <Select style={{ width: '14%',marginLeft:"1%" }} placeholder="결제선 지정">
            <Option value="팀장">팀장</Option>
          </Select>
                        </InputGroup>
                    </div> :
                    <InputGroup compact style={{marginBottom:"10px"}}>
                    <Input  style={{ width: '20%',pointerEvents:"none" }} value="제목"/>
                    <Input title={'title'} value={this.state.title} style={{ width: '80%' }} placeholder="제목" onChange={this.onChange} />
                    </InputGroup>
                }
                <JoditEditor
                    editorRef={this.setRef}
                    value={this.state.content}
                    config={this.config}
                    onChange={this.updateContent}
                />
                <p></p>
                {this.state.router === 'report' ?
                <Uploader onUpload={this.onUpload}/>:''}
                <div className='submit'>
                    <Button onClick={this.onClick}>등록하기</Button>
                </div>

            </div>
        );
    };

};



export default TextEdit;