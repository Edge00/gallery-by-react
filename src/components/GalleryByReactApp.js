import React, { Component } from 'react'
import ReactDOM from 'react-dom'
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

// 获取区间内的随机值
function getRangeRandom(low, height){
  return Math.ceil(Math.random() * (height - low) + low)
}

// 获取0-30'之间的任意正负值
function get30DegRandom(){
  return (Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30)
}

class ImgFigure extends Component {

  handleClick = (e) => {
    if(this.props.arrange.isCenter){
      this.props.inverse()
    }else{
      this.props.center()
    }
    e.stopPropagation()
    e.preventDefault()
  }

  render(){
    let styleObj = {}
    // 如果props属性中指定了这张图片的位置，则使用
    if(this.props.arrange.pos){
      styleObj = this.props.arrange.pos
    }
    // 如果图片有旋转值
    if(this.props.arrange.rotate){
      (['MozTransform', 'msTransform', 'WebkitTransform', 'transform']).forEach((value)=>{
        styleObj[value] = 'rotate(' + this.props.arrange.rotate + 'deg)'
      })
    }

    if(this.props.arrange.isCenter){
      styleObj.zIndex = 11
    }

    let imgFighreClassName = 'img-figure'
    imgFighreClassName += this.props.arrange.isInverse ? ' is-inverse' : ''

    return(
      <figure
        className={imgFighreClassName}
        style={styleObj}
        onClick={this.handleClick}
      >
        <img
          src={this.props.dataSrc}
          alt={this.props.data.title}
        />
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
          <div className="img-back" onClick={this.handleClick}>
            <p>
              {this.props.data.description}
            </p>
          </div>
        </figcaption>
      </figure>
    )
  }
}

export default class App extends Component {
  constructor(){
    super()
    this.state = {
      imageUrlArr: imageUrlArr,
      imgsArrangeArr: [
        {
          pos: {
            left: 0,
            top: 0
          },
          retate: 0,
          isInverse: false,
          isCenter: false
        }
      ]
    }
  }

  /*
   * 利用rearrange函数居中点击图片
   * @param index 输入当前inverse操作的图片对应的index
   * @return {function}
   */
  center = (index) => {
    return () => {
      this.rearrange(index)
    }
  }

  Constant = {
    centerPos: {
      left: 0,
      right: 0
    },
    hPosRange: {  // 水平方向的取值范围
      leftSecX: [0, 0],
      rightSecX: [0, 0],
      y: [0, 0]
    },
    vPosRange: {  //垂直分享的取值范围
      x: [0, 0],
      topY: [0, 0]
    }
  }

  componentDidMount() {
    // 获得舞台尺寸数据
    const stageDOM = ReactDOM.findDOMNode(this.refs.stage)
    const stageWidth = stageDOM.scrollWidth
    const stageHeight = stageDOM.scrollHeight
    const halfStageWidth = Math.ceil(stageWidth / 2)
    const halfStageHeight = Math.ceil(stageHeight / 2)
    // 获得imgfigure尺寸数据
    const imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFighre0)
    const imgWidth = imgFigureDOM.scrollWidth
    const imgHeight = imgFigureDOM.scrollHeight
    const halfImgWidth = Math.ceil(imgWidth / 2)
    const halfImgHeight = Math.ceil(imgHeight / 2)
    // 计算中心图片的位置点
    this.Constant.centerPos = {
      left: halfStageWidth - halfImgWidth,
      top: halfStageHeight - halfImgHeight
    }
    // 计算左侧，右侧区域图片排布位置的取值范围
    this.Constant.hPosRange.leftSecX[0] = -halfImgWidth
    this.Constant.hPosRange.leftSecX[1] = halfStageWidth - halfImgWidth * 3
    this.Constant.hPosRange.rightSecX[0] = halfStageWidth + halfImgWidth
    this.Constant.hPosRange.rightSecX[1] = stageWidth - halfImgWidth
    this.Constant.hPosRange.y[0] = -halfImgHeight
    this.Constant.hPosRange.y[1] = stageHeight - halfImgHeight
    // 计算上侧区域图片排布位置的取值范围
    this.Constant.vPosRange.topY[0] = -halfImgHeight
    this.Constant.vPosRange.topY[1] = halfStageHeight - halfImgHeight * 3
    this.Constant.vPosRange.x[0] = halfStageWidth - imgWidth
    this.Constant.vPosRange.x[1] = halfStageWidth

    this.rearrange(0)
  }

  /*
   * 翻转图片
   * @param index 输入当前inverse操作的图片对应的index
   * @return {function} 闭包含数，return一个真正待被执行的函数
   */
  inverse(index) {
    return () => {
      let imgsArrangeArr = this.state.imgsArrangeArr
      imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse
      this.setState({
        imgsArrangeArr: imgsArrangeArr
      })
    }
  }

  /*
   * 重新布局所有图片
   * @param centerIndex 指定居中哪个图片
   */
  rearrange (centerIndex){
    let imgsArrangeArr = this.state.imgsArrangeArr
    let Constant = this.Constant
    let centerPos = Constant.centerPos
    let hPosRange = Constant.hPosRange
    let vPosRange = Constant.vPosRange
    let hPosRangeLeftSexX = hPosRange.leftSecX
    let hPosRangeRightSexX = hPosRange.rightSecX
    let hPosRangeY = hPosRange.y
    let vPosRangeTopY = vPosRange.topY
    let vPosRangeX = vPosRange.x

    let imgsArrangeTopArr = []

    // 取一个或者不取
    let topImgNum = Math.ceil(Math.random() * 2)
    let topImgSpliceIndex = 0
    let imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1)

    // 首先居中 centerIndex 的图片, 居中的图片不旋转
    imgsArrangeCenterArr[0] = {
      pos: centerPos,
      retate: 0,
      isCenter: true
    }

    // 取出要布局上侧图片的状态信息
    topImgSpliceIndex = Math.ceil(Math.random() * imgsArrangeArr.length - topImgNum)
    imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum)

    // 布局位于上侧的图片
    imgsArrangeTopArr.forEach((value, index) => {

      imgsArrangeTopArr[index] = {
        pos: {
          top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
          left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
        },
        retate: get30DegRandom(),
        isCenter: false
      }
    })

    // 布局左右两侧的图片
    for(let i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++){
      let hPosRangeLORX = null

      // 前半部分布局左边，有半部分布局右边
      if(i < k){
        hPosRangeLORX = hPosRangeLeftSexX
      }else{
        hPosRangeLORX = hPosRangeRightSexX
      }

      imgsArrangeArr[i] = {
        pos: {
          top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
          left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
        },
        rotate: get30DegRandom(),
        isCenter: false
      }
    }

    if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
      imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0])
    }

    imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0])

    this.setState({
      imgsArrangeArr: imgsArrangeArr
    })

  }

  render(){
    let constructorUnits = []
    let imgFigures = []
    imageDatas.forEach((value, index) => {
      if (!this.state.imgsArrangeArr[index]) {
        this.state.imgsArrangeArr[index] = {
          pos: {
            left: 0,
            top: 0
          },
          rotate: 0,
          isInverse: false,
          isCenter: false
        }
      }
      imgFigures.push(<ImgFigure
                        ref={'imgFighre' + index}
                        key={index} data={value}
                        dataSrc={imageUrlArr[index]}
                        arrange={this.state.imgsArrangeArr[index]}
                        inverse={this.inverse(index)}
                        center={this.center(index)}
                      />)
    })

    return (
      <section className="stage" ref="stage">
        <section className="img-sec">
          {imgFigures}
        </section>
        <nav className="controller-nav">
          {constructorUnits}
        </nav>
      </section>
    )
  }
}
