import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import RouteMap from './route/index'
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import Utils from './utils/utils'
import { Toast } from 'antd-mobile';
import IP from './config/config'
import { qeuryUserInfoByCode } from './api/api'
import cookie from 'react-cookies'

export default class App extends Component {
  state = {
    isShow: false
  }

  componentDidMount = () => {
    const type = Utils.GetQueryString('type')
    if (type === 'app') {
      const token = Utils.GetQueryString('token');
      if (token) {
        cookie.save('token', token)
        this.setState({ isShow: true })
      } else {
        Toast.fail('非法进入！')
      }
    } else {
      this.handleLogin()
    }
  }

  handleLogin = () => {
    
    const code = Utils.GetQueryString('code');
    if (code) {
      // 重定向之后
      this.getUserInfoByCode(code);
      return;
    }
    window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${IP.appId}&redirect_uri=${IP.wxredirect}&response_type=code&scope=snsapi_base&state=STATE&connect_redirect=1#wechat_redirect`;
    return;
  }

  getUserInfoByCode = async (code) => {
    const result = await qeuryUserInfoByCode({ code })
    if (result.code === 20000) {
      this.setState({ isShow: true })
    }
    if(result.code === 20031){
      window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${IP.appId}&redirect_uri=${IP.wxredirect}&response_type=code&scope=snsapi_base&state=STATE&connect_redirect=1#wechat_redirect`;
    }
  }
  render() {
    const { isShow } = this.state;
    return (
      <div>
        {isShow && <BrowserRouter>
          <RouteMap />
        </BrowserRouter>}
      </div>
    )
  }
}


