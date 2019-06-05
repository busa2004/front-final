import {
  List, Avatar, Spin,
} from 'antd';
import reqwest from 'reqwest';
import React, { Component } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import './ScrollList.css';
import { Input } from 'antd';
import {  Button } from 'antd';
import {BASE_URL, API_BASE_URL} from '../../constants/index'
const Search = Input.Search;
const fakeDataUrl = API_BASE_URL+'/user/all';

class InfiniteListExample extends Component {

  constructor(props) {
      super(props);
      
      this.onClick = this.onClick.bind(this);
     
     
  }

  
    
  state = {
   
    data: [],
    loading: false,
    hasMore: true,
    size: 'large',
    search:this.props.search
  }
  
  onClick(id){
      this.props.search(id)
      // console.log('lu')
  }
  componentDidMount() {
    this.load();
  }

  searchUser= (data) =>{
    this.state.search = data
    this.load();
    
  }

  load(){
    this.fetchData((res) => {
      this.setState({
        data: res,
      });
    });
  }


  fetchData = (callback) => {
    reqwest({
      url: fakeDataUrl+'?search='+this.state.search,
      type: 'json',
      method: 'get',
      contentType: 'application/json',
      success: (res) => {
        callback(res);
        
      },
    });
  }

  // handleInfiniteOnLoad = () => {
  //   let data = this.state.data;
  //   this.setState({
  //     loading: true,
  //   });
  //   if (data.length > 3) {
     
  //     this.setState({
  //       hasMore: false,
  //       loading: false,
  //     });
  //     return;
  //   }
  //   this.fetchData((res) => {
  //     data = data.concat(res.results);
  //     this.setState({
  //       data,
  //       loading: false,
  //     });
  //   });
  // }
  onClick= (e) => {
      
      
    this.props.clickButton(e.target.value,this.state.search);
   }
   handleLoadMore(page) { /* load more items here */ }
  render() {
      //const size = this.state.size;
    return (
      <div>
      <div>        
               
                <Search
                   defaultValue={this.state.search}
                    placeholder="사원 검색"
                    onSearch={value => this.searchUser(value)}
                    enterButton
                />
                <br /><br />    
            </div>

      <div className="demo-infinite-container" >
        <InfiniteScroll 
          initialLoad={false}
          pageStart={0}    
          loadMore={this.handleLoadMore}   
          hasMore={!this.state.loading && this.state.hasMore}
          useWindow={false}
         
        >
          <List 
            dataSource={this.state.data}
            renderItem={item => (
              <List.Item key={item.id}>
                <List.Item.Meta
                   avatar={item.profile==null?<Avatar icon="user" size={80} />:<Avatar icon="user" size={80} src={BASE_URL+"test/"+item.profile} />}
                  title={<a href="https://ant.design">{item.name}</a>}
                  description={item.email}
                />       
                    <div> <Button value={item.id} onClick={this.onClick}>업무부여</Button></div>                 
              </List.Item>
            )}
          >
            {this.state.loading && this.state.hasMore && (
              <div className="demo-loading-container">
                <Spin />
              </div>
            )}
          </List>
        </InfiniteScroll>
      </div>
      </div>
    );
  }
}

export default InfiniteListExample;