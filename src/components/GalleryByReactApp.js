import React, { Component } from 'react'
import imageDatas from '../data/imageData.json'

require('normalize.css')
require('../styles/main.scss')

// 利用自执行函数获取图片数组
const imageUrlArr = ( (imageDatas) => {
  let urlArr = []
  for (var i = 0; i < imageDatas.length; i++) {
    urlArr.push(require('../images/'+imageDatas[i].fileName))
  }
  return urlArr
})(imageDatas)

export default class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      imageUrlArr: imageUrlArr
    }
  }
  render(){
    return (
      <section className="stage">
        <section className="img-sec">

        </section>
        <nav className="controller-nav">

        </nav>
      </section>
    )
  }
}
