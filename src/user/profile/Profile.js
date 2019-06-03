import React, { Component } from 'react';
import { getUserProfile } from '../../util/APIUtils';
import { Card, Col, Row } from 'antd';
import { formatDate } from '../../util/Helpers';
import LoadingIndicator from '../../common/LoadingIndicator';
import './Profile.css';
import NotFound from '../../common/NotFound';
import ServerError from '../../common/ServerError';
import { FileUploader } from './fileUploader.jsx';
import SlackConnect from './SlackConnect.js';

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            isLoading: false,
            username: null
        }
        this.loadUserProfile = this.loadUserProfile.bind(this);
    }


    loadUserProfile(username) {
        
        this.setState({
            isLoading: true
        });

        getUserProfile(username)
            .then(response => {
                this.setState({
                    user: response,
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

    componentDidMount() {
        const username = this.props.match.params.username;
        this.loadUserProfile(username);
        
    }

    componentDidUpdate(nextProps) {
        if (this.props.match.params.username !== nextProps.match.params.username) {
            this.loadUserProfile(nextProps.match.params.username);
        }
    }

    refresh = () => {
        this.loadUserProfile(this.state.user.username);
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

        const tabBarStyle = {
            textAlign: 'center'
        };

        return (
            <div className="profile">
                {
                    this.state.user ? (
                        <div>
                            <div style={{ padding: '30px' }}>
                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Card title="개인정보" >
                                            <div className="user-profile">
                                                <div className="user-details">
                                                    <div className="user-avatar">
                                                        <FileUploader userId={this.state.user.id} refresh={this.refresh} profile={this.state.user.profile} />
                                                    </div>
                                                    <div className="user-summary">
                                                        <div className="full-name">{this.state.user.name}</div>
                                                        <div className="username">@{this.state.user.username}</div>
                                                        <div className="user-joined">
                                                            Joined {formatDate(this.state.user.joinedAt)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    </Col>
                                    <Col span={12}>
                                        <Card title="슬랙 연동">
                                           <SlackConnect/>
                                        </Card>
                                    </Col>
                                   
                                </Row>
                                
                            </div>


                        </div>
                    ) : null
                }
            </div>
        );
    }
}

export default Profile;