import React, { Component } from 'react'
import { Toast, Carousel } from 'antd-mobile'
import { listSculptureInfo, getUserVote, userVote } from '../../api/api'
import './index.less'
import IP from '../../config/config'
import WxImageViewer from 'react-wx-images-viewer';
class Home extends Component {
  state = {
    data: [],
    sculptureIds: [],
    bidData: [], // 用户是否投标
    arr:[],//动态获取点击可放大图片的数组
    isOpen: false,
    idx: 0,
  }

  componentDidMount = () => {
    this.fetchBid()
  }
  // 所有设计方案
  fetch = async () => {
    const { bidData } = this.state;
    const res = await listSculptureInfo()
    if (res.code === 20000) {
      this.setState({
        data: res.data.map(x => {
          x.checked = bidData.find(p => p === x.sculpture_id) ? true : false;
          return x
        })
      })
    }
  }

  // 获取用户是否投标
  fetchBid = async () => {
    const res = await getUserVote()
    if (res.code === 20000) {
      this.setState({
        bidData: (res.data || []).map(x => x.sculpture_id),
        sculptureIds: (res.data || []).map(x => x.sculpture_id),
      }, () => {
        this.fetch()
      })
      if ((res.data || []).length) Toast.info('今日您已经参与过投票!', 2)
    }
  }

  // 选择
  handleSelect = id => {
    const { data, sculptureIds, bidData } = this.state;
    if (bidData && bidData.length) return
    let array = sculptureIds
    if (array.find(x => x === id)) {
      array = array.filter(x => x !== id)
    } else {
      if (array && array.length === 2) return Toast.offline('当天最多可投2票!')
      array.push(id)
    }
    data.map(x => {
      x.checked = array.find(p => p === x.sculpture_id) ? true : false
      return x
    })
    this.setState({
      sculptureIds: array
    })
  }

  // 提交
  handleSubmit = async () => {
    const { sculptureIds } = this.state;
    if (!sculptureIds.length) return Toast.offline('请选择要投的票!')
    const res = await userVote({ sculptureIds: sculptureIds.join(',') })
    if (res.code === 20000) {
      this.props.history.push({ pathname: '/success' })
    }
  }

  onClose = () => {
    this.setState({
      isOpen: false
    })
  }

  openViewer(idx ,id) {
    const {data}=this.state
    let arr=data.filter(x=>{return x.sculpture_id===id}).map(y=>{return y.sculpture_img}).map(z=>{return z.split(",")}).map(a=>{return a.map(b=>{return IP.host + b})})[0]
    this.setState({
      arr,
      idx,
      isOpen: true
    })
  }
  render() {
    const { data, bidData, idx, isOpen , arr} = this.state
    return (
      <div className='home'>
        <div className='home-detail'>
          <div className='home-notice'>
            <div className='home-notice-desc'>
              <div className='desc-rule'>投票规则：</div>
              <div className='desc-detail'>
                <p>1.每天投票1次，每次可投1至2个作品；</p>
                <p>2.投票一旦提交当日不可再更改；</p>
                <p>3.点击作品名称即可选中；</p>
                <p>备注：左右滑动可详细浏览作品。</p>
              </div>
            </div>
          </div>
          <div className='home-info'>
            {
              (data || []).map(item => {
                return <div className="home-info-list" key={item.sculpture_id}>
                  <div className="home-info-list-img">
                    <Carousel
                      infinite={true}
                    >
                      {
                        item.sculpture_img.split(",").map((elem, idx) => {
                          return <img key={idx} src={IP.host + elem} onClick={this.openViewer.bind(this,idx,item.sculpture_id)} alt="" />
                        })
                      }
                    </Carousel>
                  </div>
                  <div className={`home-info-list-notactive ${item.checked ? 'active' : ''}`} onClick={() => this.handleSelect(item.sculpture_id)}>
                    <div className='home-info-list-title'>{`${item.sculpture_id}号作品`}&nbsp;&nbsp;{item.sculpture_designer}&nbsp;&nbsp;<span>·</span>{item.sculpture_theme}</div>
                    <div className='home-info-list-desc'>{item.sculpture_desc}</div>
                    <div className="stacites">总票数{item.voteNumber}</div>
                  </div>
                </div>
              })
            }
          </div>
          {
            isOpen ? <WxImageViewer onClose={this.onClose} urls={arr} index={idx} /> : ""
          }
        </div>
        <div className='home-btn'>
          {
            bidData.length ? '' : <div className='home-sub' onClick={() => this.handleSubmit()}>提 交</div>
          }
        </div>
      </div>
    )
  }
}
export default Home
