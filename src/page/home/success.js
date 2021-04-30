import React, { Component } from 'react'
export default class success extends Component {
    render() {
        return (
            <div style={{display:'flex',textAlign:'center',height:'100vh'}}>
                <div style={{margin:'auto',marginTop:'40%',varticleAlign:'middle'}}>
                    <img style={{width:'190px',height:'190px'}} src={require('./../../images/success.png')} alt='' />
                    <div style={{marginTop:'-15%',fontSize:'24px',fontWeight:'500',color:'rgb(0,168,84)'}}>
                        投票成功
                    </div>
                </div>
            </div>
        )
    }
}