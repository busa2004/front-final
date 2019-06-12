import React, { Component, Fragment } from 'react';
import './App.css';
import {
  Route,
  withRouter,
  Switch
} from 'react-router-dom';

import { getCurrentUser } from '../util/APIUtils';
import { ACCESS_TOKEN } from '../constants';
import SiderMenu from '../common/SiderMenu';
import Login from '../user/login/Login';
import Signup from '../user/signup/Signup';
import Option1 from '../option/Option1';
import Option2 from '../option/Option2';
import Option3 from '../option/Option3';
import Option4 from '../option/Option4';
import Option5 from '../option/Option5';
import Option6 from '../option/Option6';
import Option7 from '../option/Option7';
import Option8 from '../option/Option8';
import SendMessage from '../option/SendMessage';
import Graph from '../option/Graph';
import Option12 from '../option/Option12';
import EvalRank from '../eval/EvalRank';
import Profile from '../user/profile/Profile';
import AppHeader from '../common/AppHeader';
import NotFound from '../common/NotFound';
import LoadingIndicator from '../common/LoadingIndicator';
import PrivateRoute from '../common/PrivateRoute';
import Eval from '../eval/Eval';
import ManageEvalItem from '../eval/ManageEvalItem';
import { Layout, notification } from 'antd';
import ignoreWarnings from 'ignore-warnings';
ignoreWarnings('src');

const { Sider, Content, Footer } = Layout;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,       //유저아이디
      isAuthenticated: false,  //로그인여부
      isLoading: false         //로딩여부
    }
    this.handleLogout = this.handleLogout.bind(this);
    this.loadCurrentUser = this.loadCurrentUser.bind(this);
    this.handleLogin = this.handleLogin.bind(this);

    notification.config({
      placement: 'topRight',
      top: 70,
      duration: 3,
    });
  }

  loadCurrentUser() {
    this.setState({
      isLoading: true
    });
    getCurrentUser()
      .then(response => {        //로그인이 되어있을때
        this.setState({
          currentUser: response,
          isAuthenticated: true,
          isLoading: false
        });
      }).catch(error => {        //로그인이 안되어있을때
        this.setState({
          isLoading: false
        });
      });
  }

  componentWillMount() { //렌더후에
    this.loadCurrentUser();
  }

  handleLogout(redirectTo = "/login", notificationType = "success", description = "수고하셨습니다.") {
    localStorage.removeItem(ACCESS_TOKEN);

    this.setState({
      currentUser: null,
      isAuthenticated: false
    });

    this.props.history.push(redirectTo);

    notification[notificationType]({
      message: '더존팩토리',
      description: description,
    });
  }

  handleLogin() {
    notification.success({
      message: '더존팩토리',
      description: "반갑습니다.",
    });
    this.loadCurrentUser();
    this.props.history.push("/");
  }

  render() {
    console.disableYellowBox = true;
    if (this.state.isLoading) {
      return <LoadingIndicator />
    }
    let sider;
    let admin;
    if (this.state.currentUser == null) {
      sider = []
    } else {
      sider = [
        <Sider className="app-Sider" key="sider" ><SiderMenu
          currentUser={this.state.currentUser.authorities[0].authority}
        /></Sider>
      ];
    }
    
    if (this.state.currentUser !== null && this.state.currentUser.authorities[0].authority === 'ROLE_ADMIN') {  
      admin = [<div key="admin">
         <PrivateRoute authenticated={this.state.isAuthenticated} exact path="/" handleLogout={this.handleLogout}
                      component={(props) => <Option4 isAuthenticated={this.state.isAuthenticated} currentUser={this.state.currentUser} {...props} />}></PrivateRoute>
                   
        {/* 업무보고현황 */}
        <PrivateRoute authenticated={this.state.isAuthenticated} path="/Option4" handleLogout={this.handleLogout}
          component={(props) => <Option4 isAuthenticated={this.state.isAuthenticated} currentUser={this.state.currentUser} {...props} />}></PrivateRoute>

        {/* 결제관리 */}
        <PrivateRoute authenticated={this.state.isAuthenticated} path="/Option5" handleLogout={this.handleLogout}
          component={(props) => <Option5 isAuthenticated={this.state.isAuthenticated} currentUser={this.state.currentUser} {...props} />}></PrivateRoute>

        {/* 업무 리스트 */}
        <PrivateRoute authenticated={this.state.isAuthenticated} path="/Option6" handleLogout={this.handleLogout}
          component={(props) => <Option6 isAuthenticated={this.state.isAuthenticated} currentUser={this.state.currentUser} {...props} />}></PrivateRoute>

        {/* 업무 등록 */}
        <PrivateRoute authenticated={this.state.isAuthenticated} path="/Option7" handleLogout={this.handleLogout}
          component={(props) => <Option7 isAuthenticated={this.state.isAuthenticated} currentUser={this.state.currentUser} {...props} />}></PrivateRoute>

        {/* 업무 부여 */}
        <PrivateRoute authenticated={this.state.isAuthenticated} path="/Option8" handleLogout={this.handleLogout}
          component={(props) => <Option8 isAuthenticated={this.state.isAuthenticated} currentUser={this.state.currentUser} {...props} />}></PrivateRoute>

        <PrivateRoute authenticated={this.state.isAuthenticated} path="/SendMessage" handleLogout={this.handleLogout}
          component={(props) => <SendMessage isAuthenticated={this.state.isAuthenticated} currentUser={this.state.currentUser} {...props} />}></PrivateRoute>

        <PrivateRoute authenticated={this.state.isAuthenticated} path="/signup" handleLogout={this.handleLogout}
          component={(props) => <Signup isAuthenticated={this.state.isAuthenticated} currentUser={this.state.currentUser} {...props} />}></PrivateRoute>

        <PrivateRoute authenticated={this.state.isAuthenticated} path="/Option12" handleLogout={this.handleLogout}
          component={(props) => <Option12 isAuthenticated={this.state.isAuthenticated} currentUser={this.state.currentUser} {...props} />}></PrivateRoute>

        {/* 평가 */}
        <PrivateRoute authenticated={this.state.isAuthenticated} path="/Eval" handleLogout={this.handleLogout}
          component={(props) => <Eval isAuthenticated={this.state.isAuthenticated} currentUser={this.state.currentUser} {...props} />}></PrivateRoute>
        
        {/* 평가 순위*/}
        <PrivateRoute authenticated={this.state.isAuthenticated} path="/EvalRank" handleLogout={this.handleLogout}
          component={(props) => <EvalRank isAuthenticated={this.state.isAuthenticated} currentUser={this.state.currentUser} {...props} />}></PrivateRoute>        
       
        {/* 평가항목관리 */}
        <PrivateRoute authenticated={this.state.isAuthenticated} path="/ManageEvalItem" handleLogout={this.handleLogout}
          component={(props) => <ManageEvalItem isAuthenticated={this.state.isAuthenticated} currentUser={this.state.currentUser} {...props} />}></PrivateRoute>

      </div>]
    }else if(this.state.currentUser !== null && this.state.currentUser.authorities[0].authority === 'ROLE_USER'){
      admin = [<div>
         <PrivateRoute authenticated={this.state.isAuthenticated} exact path="/" handleLogout={this.handleLogout}
                      component={(props) => <Option1 isAuthenticated={this.state.isAuthenticated} currentUser={this.state.currentUser} {...props} />}></PrivateRoute>
                   
        <PrivateRoute authenticated={this.state.isAuthenticated} path="/Option1" handleLogout={this.handleLogout}
        component={(props) => <Option1 isAuthenticated={this.state.isAuthenticated} currentUser={this.state.currentUser} {...props} />}></PrivateRoute>
      <PrivateRoute authenticated={this.state.isAuthenticated} path="/Option2" handleLogout={this.handleLogout}
        component={(props) => <Option2 isAuthenticated={this.state.isAuthenticated} currentUser={this.state.currentUser} {...props} />}></PrivateRoute>

      <PrivateRoute authenticated={this.state.isAuthenticated} path="/Option3" handleLogout={this.handleLogout}
        component={(props) => <Option3 isAuthenticated={this.state.isAuthenticated} currentUser={this.state.currentUser} {...props} />}></PrivateRoute>


      <PrivateRoute authenticated={this.state.isAuthenticated} path="/Graph" handleLogout={this.handleLogout}
        component={(props) => <Graph isAuthenticated={this.state.isAuthenticated} currentUser={this.state.currentUser} {...props} />}></PrivateRoute>


      </div>

      
      ];
    }

    return (
      <Layout className="app-container">
        <AppHeader isAuthenticated={this.state.isAuthenticated}
          currentUser={this.state.currentUser}
          onLogout={this.handleLogout} />


        <Content className="app-content">
          <Layout style={{ backgroundColor: "#FAFAFA" }}>

            {/* 사이드 바 */}
            {sider}

            <Switch>
            
            {this.state.currentUser == null?
              <Route path="/login"
                render={(props) => <Login onLogin={this.handleLogin} {...props} />}></Route>:
              ''
            } 
             {this.state.currentUser == null?
              <Route path="/"
                render={(props) => <Login onLogin={this.handleLogin} {...props} />}></Route>:
              ''
            } 
              <Fragment>
              <div className="center">
                <div className="main" >

                  <Switch>

                   
                   
                   

                    {/* 관리자 메뉴 */}
                    <Route path="/users/:username"
                      render={(props) => <Profile isAuthenticated={this.state.isAuthenticated} currentUser={this.state.currentUser} {...props} />}>
                    </Route>
                    <Fragment>
                    {admin}
                    </Fragment>
                    {/* <Route path="/Option1" 
                render={(props) => <Option1 isAuthenticated={this.state.isAuthenticated} currentUser={this.state.currentUser} {...props}  />}></Route> */}

                    <Route component={NotFound}></Route>
                  </Switch>
                </div>
              </div>
              </Fragment>
            </Switch>
          </Layout>
          <Footer style={{ textAlign: 'center',width:"1680px" }}>
            Design ©2019 Created by SungJun
          </Footer>
        </Content>


      </Layout>

    );
  }
}

export default withRouter(App);