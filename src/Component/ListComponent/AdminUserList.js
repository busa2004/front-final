import {
  List, Avatar, Spin,
} from 'antd';
import React, { Component } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import './ScrollList.css';
import { Input, Button  } from 'antd';
import {BASE_URL} from '../../constants/index'
const Search = Input.Search;

class AdminUserList extends Component {

  constructor(props) {
      super(props);
      this.onClick = this.onClick.bind(this);     
  }    
  state = { 
    data: this.props.data,
    loading: false,
    hasMore: true,
    size: 'large',
    search:this.props.search
  } 
 
  onClick(id){
      this.props.search(id)
      //console.log('lu')
  }
 
  
  
  searchUser= (data) =>{
    
    this.props.userSearch(data);
  }




  onClick= (e) => {   
    this.props.clickButton(e.target.value,this.state.search);
   }

   handleLoadMore(page) { /* load more items here */ }

  render() {
      //const size = this.state.size;
    return (
      <div>
      <div>    
          <br /><br />
              <Search
                  defaultValue={this.state.search}
                  placeholder="input search text"
                  onSearch={value => this.searchUser(value)}
                  enterButton
                />
                <br /><br />       
            </div>
      <div className="demo-infinite-container">
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
                  title={<a>{item.name}</a>}
                  description={item.email}
                />
                
                    <div> <Button value={item.id} onClick={this.onClick}>수정</Button></div>
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

export default AdminUserList;