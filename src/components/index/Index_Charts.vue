<template>
  <div class="Index_Charts">
    <nav class="clearfix">
      <!-- class="current" 为选中状态 -->
      <div v-if="(!justK || index > 1)" v-for="(value, index) in nav" :key="index" :class="{current: value.statu}" @click="clickNav(index)">{{value.msg}}</div>
    </nav>
    <div ref="container" class="container clearfix">
      <!-- 图表容器 -->
      <div v-for="(value, i) in nav" :key="i" v-show="value.statu" :class="['canvas', isIndex ? 'isIndex' : '']"></div>
      <!-- 固定上方数据 -->
      <div class="des">
        <div v-if="topDataStatu === 1" class="line">
          {{lineData.time}} &nbsp;&nbsp;&nbsp;&nbsp;
          价：<span :style="{color: lineData.color}">{{lineData.price}}</span> &nbsp;&nbsp;&nbsp;&nbsp;
          量: <span :style="{color: lineData.color}">{{lineData.value | getNum}}手</span>
        </div>
        <div v-if="topDataStatu === 2" class="candlestick">
          <span style="color: #C6238A">MA5: {{candlestickData.MA5}}</span> &nbsp;
          <span style="color: #2382BA">MA10：{{candlestickData.MA10}}</span> &nbsp;
          <span style="color: #DEA92A">MA30: {{candlestickData.MA30}}</span>
        </div>
      </div>
      <!-- 固定下方x轴 -->
      <div :class="['axisLabel', isIndex ? 'isIndex' : '']">
        <!-- 分时axisLabel -->
        <ul v-if="!isHK" v-show="axisLabelStatu === 1" class="line">
          <li>09:30</li>
          <li>11:30/13:00</li>
          <li>15:00</li>
        </ul>
        <ul v-if="isHK" v-show="axisLabelStatu === 1" class="line">
          <li>09:30</li>
          <li>12:00/13:00</li>
          <li>16:00</li>
        </ul>
        <!-- 5日axisLabel -->
        <ul v-show="axisLabelStatu === 2" class="five">
          <li v-for="(value, index) in five" :key="index">{{value}}</li>
        </ul>
      </div>
    </div>
    <!-- 加载 -->
    <Loading v-if="mask.isLoading"></Loading>
  </div>
</template>

<script>
// 引入公共模版
import Loading from '../common/Loading'
// 引入echarts插件
// const echarts = require('echarts/lib/echarts')

export default {
  name: 'Index_Charts',
  data () {
    return {
      nav: [ // 导航栏控制
        {
          statu: 1,
          msg: '分时'
        },
        {
          statu: 0,
          msg: '5日'
        },
        {
          statu: 0,
          msg: '日K'
        },
        {
          statu: 0,
          msg: '周K'
        },
        {
          statu: 0,
          msg: '月K'
        }
      ],
      isBj: false, // 是否是新三板
      isHK: false, // 是否是港股
      justK: false, // 是否只有K线图
      // timer: null, // 定时更新定时器
      lineData: { // 折线图上方数据
        time: '--',
        price: '--',
        value: '--',
        color: '#91999F'
      },
      five: [], // 5日axisLabel数据
      candlestickData: { // k线图上方数据
        MA5: '--',
        MA10: '--',
        MA30: '--'
      },
      topDataStatu: 0, // 上方数据状态 0-都不显示 1-显示折线图 2-显示k线图
      axisLabelStatu: 1, // axisLabel数据状态 0-都不显示 1-显示分时 2-显示5日
      mask: { // 弹窗控制
        isLoading: false // 加载中
      }
    }
  },
  components: { // 公共组件
    Loading
  },
  watch: {
    /**
     * 当点击上方左右切换时，监听code值刷新当前图表
     */
    code: function (newParam, oldParam) {
      var index = 0
      this.judgmentClass()
      for (let i = 0; i < this.nav.length; i++) {
        if (this.nav[i].statu) {
          index = i
          break
        }
      }
      if (this.justK && index < 2) {
        this.clickNav(2)
      } else {
        this.clickNav(index)
      }
    },
    /**
     * 当父组件数据加载完成时，preClosePrice会发生变化，此时刷新图表
     * 防止preClosePrice值为0
     */
    preClosePrice: function () {
      if (this.justK) {
        this.clickNav(2)
      } else {
        this.clickNav(0)
      }
    },
    '$parent.$parent.initOk': function (to, from) {
      // console.log(to, from)
      this.judgmentClass()
    }
  },
  props: ['code', 'isIndex', 'preClosePrice'],
  filters: {
    /**
     * 处理过长数字
     * str 需要处理的字符串
     */
    getNum: function (str) {
      // console.log(str)
      const num = parseFloat(str)
      var result = ''
      if (!num) {
        result = '--'
      } else {
        if (num < 10000) { // 最大9999
          result = num
        } else if (num < 1000000) { // 最大99.99万
          result = (num / 10000).toFixed(2) + '万'
        } else if (num < 10000000) { // 最大999.9万
          result = (num / 10000).toFixed(1) + '万'
        } else if (num < 100000000) { // 最大9999万
          result = (num / 10000).toFixed(0) + '万'
        } else if (num < 10000000000) { // 最大99.99亿
          result = (num / 100000000).toFixed(2) + '亿'
        } else if (num < 100000000000) { // 最大999.9亿
          result = (num / 100000000).toFixed(1) + '亿'
        } else {
          result = Math.round((num / 100000000)) + '亿'
        }
      }
      return result
    }
  },
  methods: {
    /**
     * 展示折线图
     * dom -- 展示画布的dom元素
     * Data -- 展示数据
     * title -- 标题
     * isLine -- 是否是分时数据
     */
    line: function (dom, Data, title, isLine) {
      var that = this
      var data = Data.concat()
      // 基于准备好的dom，初始化echarts实例
      var myChart = window.echarts.init(dom)
      // 重置图形尺寸大小
      myChart.resize()

      // 定义昨收价
      var preClosePrice = parseFloat(this.preClosePrice) || 0
      // 定义x轴
      var datetime = []
      /**
       * 获取1天的时间轴数据
       */
      function getDatetime () {
        var datetime = []
        // 最大值（时间数）
        var max = 5 * 60 + 30 + 1 - 90 // 一般情况 9:30-15:00 需要除去 11:31-13:00
        if (that.isHK) { // 港股 9:30-16:00 需要除去 12:01-13:00
          max = 6 * 60 + 30 + 1 - 60
        }
        var timestamp = 1523928600 // 9:30
        // let date = new Date(timestamp * 1000)
        // console.log(date)
        for (let i = 0; i < max; i++) {
          let date = new Date(timestamp * 1000)
          let result = (date.getHours() >= 10 ? date.getHours() : ('0' + date.getHours())) + ':' + (date.getMinutes() >= 10 ? date.getMinutes() : ('0' + date.getMinutes()))
          timestamp += 60
          datetime.push(result)
          if (that.isHK) {
            if (timestamp === 1523937660) { // 除去 12:01-13:00
              // 将时间定位 13:01
              timestamp = 1523941260
            }
          } else {
            if (timestamp === 1523935860) { // 除去 11:31-13:00
              // 将时间定位 13:01
              timestamp = 1523941260
            }
          }
        }
        return datetime
      }
      /**
       * 补全缺漏项
       * datetime x轴数据
       * data 需要处理的数据
       * preClosePrice 昨收价
       * end 当天是否已结束
       */
      function completion (datetime, data, preClosePrice, end) {
        var result = data
        // 定义一个对象，方便通过时间获取索引值
        var datetimeO = {}
        for (let i = 0; i < datetime.length; i++) {
          datetimeO[datetime[i]] = i
        }
        // 如果没有数据定义一个默认数组
        if (result.length === 0 && preClosePrice) {
          if (that.isHK) {
            result.push({
              averagePrice: '-',
              datetime: '-16:00',
              price: preClosePrice,
              volume: '-'
            })
          } else {
            result.push({
              averagePrice: '-',
              datetime: '-15:00',
              price: preClosePrice,
              volume: '-'
            })
          }
        }
        // 如果当天已经结束补上最后一项
        if (end) {
          if (that.isHK && result[result.length - 1].datetime.split('-')[1] !== '16:00') {
            result.push({
              averagePrice: '-',
              datetime: '-16:00',
              price: preClosePrice,
              volume: '-'
            })
          } else if (!that.isHK && result[result.length - 1].datetime.split('-')[1] !== '15:00') {
            result.push({
              averagePrice: '-',
              datetime: '-15:00',
              price: preClosePrice,
              volume: '-'
            })
          }
        }
        // 数据处理
        for (let i = 0; i < datetimeO[result[result.length - 1].datetime.split('-')[1]]; i++) {
          // console.log(result[i])
          if (!result[i] || (result[i].datetime.split('-')[1] !== datetime[i])) {
            let o = {}
            o.averagePrice = result[i - 1] ? result[i - 1].averagePrice : result[0].averagePrice
            o.datetime = !result[i] ? '' : result[i].datetime.split('-')[0] + '-' + datetime[i]
            o.price = result[i - 1] ? result[i - 1].price : result[0].price
            o.volume = '-'
            result.splice(i, 0, o)
          }
        }
        return result
      }

      if (isLine) { // 分时图
        datetime = getDatetime()
        data = completion(datetime, data, preClosePrice)
      } else { // 五日图
        /* datetime = data.map(function (item) {
          return item.datetime */
        // 给x轴赋值
        that.five = []
        // 接收每一天的数据
        var fiveDay = [[], [], [], [], []]
        var result1 = []
        var result2 = []
        // 赋上每天的值
        for (let i = 0; i < data.length; i++) {
          const el = data[i].datetime.split('-')[0]
          if (el !== that.five[that.five.length - 1]) that.five.push(el)
          fiveDay[that.five.length - 1].push(data[i])
        }
        // 补全每天的值
        for (let i = 0; i < fiveDay.length; i++) {
          let day = fiveDay[i]
          let time = getDatetime()
          let changed = []
          if (i < fiveDay.length - 1) {
            changed = completion(time, day, preClosePrice, true)
          } else {
            changed = completion(time, day, preClosePrice)
          }
          result1 = result1.concat(time)
          result2 = result2.concat(changed)
        }
        datetime = result1
        data = result2
      }

      // 定义y轴
      var yAxis = {
        maxPrice: 0, // 最大值
        minPrice: 0, // 最小值
        maxRate: 0, // 最大百分比
        minRate: 0 // 最小百分比
      }
      // 给最大值最小值赋初值
      if (data.length) {
        yAxis.maxPrice = parseFloat(data[0].price)
        yAxis.minPrice = parseFloat(data[data.length - 1].price)
      }
      // 遍历数组得到最大值和最小值
      for (let i = 0; i < data.length; i++) {
        if (parseFloat(data[i].averagePrice)) { // 如果平均值有值
          let max = Math.max(parseFloat(data[i].price), parseFloat(data[i].averagePrice))
          let min = Math.min(parseFloat(data[i].price), parseFloat(data[i].averagePrice))
          if (yAxis.maxPrice < max) yAxis.maxPrice = max
          if (yAxis.minPrice > min) yAxis.minPrice = min
        } else { // 如果平均值没值
          let el = parseFloat(data[i].price)
          if (yAxis.maxPrice < el) yAxis.maxPrice = el
          if (yAxis.minPrice > el) yAxis.minPrice = el
        }
      }
      if (Math.abs(yAxis.maxPrice - preClosePrice) === Math.abs(yAxis.minPrice - preClosePrice)) { // 如果最大值和最小值离昨收价相等
        // 最小值 = 昨收价 - 差值
        yAxis.minPrice = preClosePrice - Math.abs(yAxis.maxPrice - preClosePrice)
        // 最大值 = 昨收价 - 差值
        yAxis.maxPrice = preClosePrice + Math.abs(yAxis.minPrice - preClosePrice)
      } else if (Math.abs(yAxis.maxPrice - preClosePrice) > Math.abs(yAxis.minPrice - preClosePrice)) { // 如果最大值差值 > 最小值差值
      // 最小值 = 昨收价 - 最大值与昨收价差值
        yAxis.minPrice = preClosePrice - Math.abs(yAxis.maxPrice - preClosePrice)
      } else { // 如果最大值差值 < 最小值差值
      // 最大值 = 昨收价 - 最小值与昨收价差值
        yAxis.maxPrice = preClosePrice + Math.abs(yAxis.minPrice - preClosePrice)
      }
      // 如果最大值 === 最小值 防止图形混乱
      if (yAxis.minPrice === yAxis.maxPrice) {
        yAxis.maxPrice += 0.001
        yAxis.minPrice -= 0.001
      }
      // 保留三位小数
      yAxis.minPrice = yAxis.minPrice.toFixed(3)
      yAxis.maxPrice = yAxis.maxPrice.toFixed(3)
      // console.log(yAxis.maxPrice, yAxis.minPrice, preClosePrice)

      // 加上振幅changeRate
      for (let i = 0; i < data.length; i++) {
        data[i].changeRate = ((data[i].price - preClosePrice) / preClosePrice * 100).toFixed(2) + '%'
      }
      if (data.length) {
        yAxis.maxRate = parseFloat(data[0].changeRate)
        yAxis.minRate = parseFloat(data[data.length - 1].changeRate)
      }
      for (let i = 0; i < data.length; i++) {
        let el = parseFloat(data[i].changeRate)
        if (yAxis.maxRate < el) yAxis.maxRate = el
        if (yAxis.minRate > el) yAxis.minRate = el
      }
      if (Math.abs(yAxis.maxRate - 0) > Math.abs(yAxis.minRate - 0)) {
        yAxis.minRate = 0 - Math.abs(yAxis.maxRate - 0)
      } else {
        yAxis.maxRate = 0 + Math.abs(yAxis.minRate - 0)
      }
      yAxis.minRate = yAxis.minRate.toFixed(2)
      yAxis.maxRate = yAxis.maxRate.toFixed(2)
      // console.log(yAxis.maxRate, yAxis.minRate)

      // console.log(data)

      var option = {
        animation: false,
        tooltip: {
          trigger: 'axis', // 触发类型
          // showContent: true,
          // position: [10, -5],
          formatter: function (params, ticket, callback) { // 提示框浮层内容格式器
            // console.log(params)
            let index = 0
            if (params[0].seriesType === 'bar') index = 1
            // 从params中得到需要的数据
            let time = params[index].name
            let price = parseFloat(params[index].value) || '-'
            let value = index + 2 < params.length ? params[index + 2].value : params[0].value
            let avg = parseFloat(params[index + 1].value)
            // 根据数据获取对应的颜色
            let color = price - avg < 0 ? '#14B900' : '#FD2E26'
            // console.log(time, price, value)
            that.topDataStatu = 1
            that.lineData.time = time
            that.lineData.price = price
            that.lineData.value = value
            that.lineData.color = color
            // 返回html字符串
            // return '<div>' + time + '&nbsp;&nbsp;&nbsp;&nbsp; 价：<span style="color: ' + color + '">' + price + '</span> &nbsp;&nbsp;&nbsp;&nbsp; 量: <span style="color: ' + color + '">' + that.$options.filters['getNum'](value) + '手</span></div>'
          },
          // backgroundColor: 'rgba(50, 50, 50, 0)',
          // textStyle: {
          //   color: '#91999F',
          //   fontFamily: 'PingFangSC-Regular',
          //   fontSize: 11,
          //   lineHeight: 17,
          //   width: '100%',
          //   height: '.34rem'
          // },
          axisPointer: {
            type: 'cross'
          }
        },
        axisPointer: {
          // handle: {show: true},
          link: {
            xAxisIndex: 'all'/* ,
            yAxisName: 'someName' */
          },
          type: 'shadow',
          label: {
            // formatter: (params) => {
            //   console.log(params)
            //   return '1'
            // },
            backgroundColor: '#777'
          }
        },
        brush: {
          xAxisIndex: 'all',
          brushLink: 'all',
          outOfBrush: {
            colorAlpha: 0.1
          }
        },
        grid: [
          {
            left: '3%',
            right: '3%',
            height: '60%',
            top: '8%'
          },
          {
            left: '3%',
            right: '3%',
            bottom: '8%',
            height: '20%'
          }
        ],
        xAxis: [
          {
            // type: 'category',
            axisTick: {
              show: false // 坐标轴刻度是否显示
            },
            axisLine: {
              lineStyle: {
                color: '#E1E1E1'
              }
            },
            axisLabel: {
              show: false
            },
            splitNumber: 1,
            splitLine: {
              // show: true,
              lineStyle: {
                // 使用深浅的间隔色
                color: '#E7E7E7',
                type: 'dotted'
              }
            },
            // max: 'dataMax',
            // data: data.map(function (item) {
            //   return item.datetime
            // })
            data: datetime
          },
          {
            type: 'category',
            gridIndex: 1,
            data: datetime,
            scale: true,
            // boundaryGap: false,
            axisLine: {
              onZero: false,
              lineStyle: {
                color: '#E1E1E1'
              }
            },
            axisTick: {show: false},
            // splitNumber: 1,
            splitLine: {
              // show: true,
              lineStyle: {
                // 使用深浅的间隔色
                color: '#E7E7E7',
                type: 'dotted'
              }
            },
            axisLabel: {
              show: false,
              margin: 3, // 刻度标签与轴线之间的距离
              color: '#9F9F9F',
              interval: (index, value) => {
                // console.log(index, value)
                // if (value === '13:01') return true
                return false
              },
              showMaxLabel: true, // 是否显示最大 tick 的 label
              showMinLabel: true, // 是否显示最小 tick 的 label
              // formatter: [
              //   '{a|09：30}',
              //   '{a|111111}',
              //   '{a|15:00}'
              // ].join(' '),
              // rich: {
              //   a: {
              //     align: 'center'
              //   }
              // },
              fontSize: 10 // 文字的字体大小
            },
            splitNumber: 20,
            min: 'dataMin',
            // max: 'dataMax',
            axisPointer: {
              label: {
                formatter: function (params) {
                  // console.log(params)
                  var seriesValue = (params.seriesData[0] || {}).value || '-'
                  // return params.value +
                  // (seriesValue != null
                  //   ? '\n' + echarts.format.addCommas(seriesValue)
                  //   : ''
                  // )
                  return seriesValue
                }
              }
            }
          }
        ],
        yAxis: [ // 设置y轴
          {
            // position: 'left', // 显示位置 left right
            // splitNumber: 1, // 坐标轴的分割段数
            minInterval: 9999999,
            type: 'value',
            min: yAxis.minPrice,
            max: yAxis.maxPrice,
            scale: true,
            // silent: true, // 是否静态无法交互
            axisTick: {
              show: false // 坐标轴刻度是否显示
            },
            axisLine: {
              lineStyle: {
                color: '#E3E3E3'
              }
            },
            data: data.map(function (item) {
              return item.price
            }),
            axisLabel: {
              inside: true, // 刻度标签是否朝内，默认朝外
              margin: 3, // 刻度标签与轴线之间的距离
              color: '#91999F',
              fontSize: 10 // 文字的字体大小
            },
            splitLine: {
              show: true,
              lineStyle: {
                // 使用深浅的间隔色
                color: '#EEEEEE',
                type: 'dotted'
              }
            }
            // axisLine: { // 坐标轴轴线相关设置
            //   symbol: ['none', 'arrow'], // 轴线两边的箭头
            //   symbolSize: [5, 10]
            // }
          },
          {
            position: 'right', // 显示位置 left right
            // splitNumber: 1, // 坐标轴的分割段数
            minInterval: 9999999,
            type: 'value',
            min: yAxis.minRate,
            max: yAxis.maxRate,
            scale: true,
            // silent: true, // 是否静态无法交互
            axisTick: {
              show: false // 坐标轴刻度是否显示
            },
            axisLine: {
              lineStyle: {
                color: '#E3E3E3'
              }
            },
            // data: data.map(function (item) {
            //   return item.changeRate
            // }),
            axisLabel: {
              inside: true, // 刻度标签是否朝内，默认朝外
              margin: 3, // 刻度标签与轴线之间的距离
              color: '#91999F',
              formatter: '{value}%',
              fontSize: 10 // 文字的字体大小
            },
            axisPointer: {
              label: {
                formatter: '{value}%'
              }
            },
            splitLine: {
              show: true,
              lineStyle: {
                // 使用深浅的间隔色
                color: '#EEEEEE',
                type: 'dotted'
              }
            }
          },
          {
            scale: true,
            gridIndex: 1,
            splitNumber: 2,
            axisLabel: {show: false},
            axisLine: {
              lineStyle: {
                color: '#E3E3E3'
              }
            },
            axisTick: {show: false},
            splitLine: {
              show: true,
              lineStyle: {
                // 使用深浅的间隔色
                color: '#EEEEEE',
                type: 'dotted'
              }
            }
          }
        ],
        dataZoom: [
          {
            type: 'inside',
            xAxisIndex: [0, 1],
            start: 0,
            end: 100
          },
          {
            show: false,
            type: 'slider',
            y: '90%',
            start: 0,
            end: 100
          }
        ],
        series: [
          {
            name: title,
            symbol: 'none',
            type: 'line',
            connectNulls: true,
            color: '#0298FF',
            // backgroundColor: '#ECF2F9',
            // coordinateSystem: 'cartesian2d',
            data: data.map(function (item) {
              return item.price
            }),
            lineStyle: {
              width: 1
            },
            areaStyle: {
              color: 'rgba(192, 213, 238, 0.3)'
            },
            markLine: {
              silent: false,
              symbolSize: 0,
              precision: 3,
              lineStyle: {
                type: 'dashed',
                color: '#E3E3E3'
              },
              label: {
                formatter: preClosePrice,
                // position: 'start',
                position: '-15%',
                show: true,
                color: '#91999F',
                fontSize: 10 // 文字的字体大小
              },
              data: [
                {
                  // name: '平均线',
                  // 支持 'average', 'min', 'max'
                  yAxis: preClosePrice,
                  x: '15%'
                }
              ]
            }
          },
          {
            name: 'averagePrice',
            symbol: 'none',
            color: '#E8BC54',
            type: 'line',
            // coordinateSystem: 'cartesian2d',
            data: data.map(function (item) {
              return item.averagePrice
            }),
            lineStyle: {
              width: 1
            }
          },
          // {
          //   name: 'changeRate',
          //   symbol: 'none',
          //   color: 'red',
          //   type: 'line',
          //   // coordinateSystem: 'cartesian2d',
          //   data: data.map(function (item) {
          //     return item.changeRate
          //   }),
          //   yAxisIndex: 0,
          //   lineStyle: {
          //     width: 1
          //   }
          // },
          {
            name: 'Volumn',
            type: 'bar',
            itemStyle: {
              normal: {
                color: function (params) {
                  // 柱状图分颜色
                  // console.log(params)
                  var result = ''
                  if (params.dataIndex > 0) {
                    result = parseFloat(data[params.dataIndex].price) >= parseFloat(data[params.dataIndex - 1].price) ? '#FD2E26' : '#14B900'
                  } else {
                    result = parseFloat(data[params.dataIndex].price) >= parseFloat(that.preClosePrice) ? '#FD2E26' : '#14B900'
                  }
                  return result
                }
              }
            },
            xAxisIndex: 1,
            yAxisIndex: 2,
            data: data.map(function (item) {
              return item.volume
            })
          }
        ]
      }
      // console.log(option)
      myChart.setOption(option)
    },
    /**
     * 展示k线图
     * dom -- 展示画布的dom元素
     * Data -- 展示数据
     * title -- 标题
     */
    candlestick: function (dom, Data, title) {
      var that = this
      var data = Data.concat()
      if (data.length < 30) { // 如果数据不足30条
        // 补全数据
        for (let i = 0; i < 30 - data.length; i++) {
          data.push({
            amount: '--',
            closePrice: '--',
            date: '--',
            highPrice: '--',
            lowPrice: '--',
            openPrice: '--',
            referencePrice: '--',
            time: '--',
            volume: '--'
          })
        }
      }
      // 防止最后一个数据出错
      if (data[data.length - 1].lowPrice === '0.000') {
        data.pop()
      }
      // console.log(data)
      // 基于准备好的dom，初始化echarts实例
      var myChart = window.echarts.init(dom)
      // 重置图形尺寸大小
      myChart.resize()

      var upColor = '#ec0000'
      var upBorderColor = '#8A0000'
      var downColor = '#00da3c'
      var downBorderColor = '#008F28'
      var option = {}

      function calculateMA (dayCount) {
        var result = []
        for (let i = 0; i < data.length; i++) {
          if (i < dayCount) {
            result.push('-')
            continue
          }
          var sum = 0
          for (let j = 0; j < dayCount; j++) {
            sum += parseFloat(data[i - j].closePrice)
          }
          result.push(sum / dayCount)
        }
        return result
      }
      // console.log(calculateMA(5))
      var xData = data.map(function (item) {
        return item.date
      })
      option = {
        animation: false,
        tooltip: {
          trigger: 'axis', // 触发类型
          // showContent: true,
          // position: [10, -5],
          formatter: function (params, ticket, callback) {
            // console.log(params)
            let index = 0
            if (params[0].seriesType === 'bar') index = 1
            let MA5 = !isNaN(params[index + 1].value) ? params[index + 1].value.toFixed(2) : '-'
            let MA10 = !isNaN(params[index + 2].value) ? params[index + 1].value.toFixed(2) : '-'
            let MA30 = !isNaN(params[index + 3].value) ? params[index + 1].value.toFixed(2) : '-'
            // console.log(MA5, MA10, MA30)
            that.topDataStatu = 2
            that.candlestickData.MA5 = MA5
            that.candlestickData.MA10 = MA10
            that.candlestickData.MA30 = MA30
            // return '<div><span style="color: #C6238A">MA5:' + MA5 + '</span> &nbsp; <span style="color: #2382BA">MA10：' + MA10 + '</span> &nbsp; <span style="color: #DEA92A">MA30: ' + MA30 + '</span></div>'
          },
          // backgroundColor: 'rgba(50,50,50,0)',
          // textStyle: {
          //   color: '#91999F',
          //   fontFamily: 'PingFangSC-Regular',
          //   fontSize: 11,
          //   lineHeight: 17,
          //   width: '100%',
          //   height: '.34rem'
          // },
          axisPointer: {
            type: 'cross'
          }
        },
        // legend: {
        //   data: ['日K', 'MA5', 'MA10', 'MA30']
        // },
        axisPointer: {
          link: {xAxisIndex: 'all'},
          label: {
            backgroundColor: '#777'
          }
        },
        grid: [
          {
            left: '10%',
            right: '10%',
            height: '60%',
            top: '8%'
          },
          {
            left: '10%',
            right: '10%',
            bottom: '8%',
            height: '20%'
          }
        ],
        xAxis: [
          {
            type: 'category',
            axisTick: {
              show: false // 坐标轴刻度是否显示
            },
            axisLine: {
              lineStyle: {
                color: '#E1E1E1'
              }
            },
            axisLabel: {
              show: false
            },
            splitNumber: 1,
            splitLine: {
              // show: true,
              lineStyle: {
                // 使用深浅的间隔色
                color: '#E7E7E7',
                type: 'dotted'
              }
            },
            data: data.map(function (item) {
              return item.date
            }),
            scale: true,
            // splitLine: { show: false },
            // splitNumber: 20,
            min: 'dataMin',
            max: 'dataMax'
          },
          {
            type: 'category',
            gridIndex: 1,
            data: data.map(function (item) {
              return item.date
            }),
            scale: true,
            // boundaryGap: false,
            axisLine: {
              onZero: false,
              lineStyle: {
                color: '#E1E1E1'
              }
            },
            axisTick: {show: false},
            // splitNumber: 1,
            splitLine: {
              // show: true,
              lineStyle: {
                // 使用深浅的间隔色
                color: '#E7E7E7',
                type: 'dotted'
              }
            },
            axisLabel: {
              show: true,
              margin: 3, // 刻度标签与轴线之间的距离
              color: '#9F9F9F',
              // showMaxLabel: true,
              interval: 28,
              fontSize: 10 // 文字的字体大小
            },
            splitNumber: 20,
            min: 'dataMin',
            max: 'dataMax',
            axisPointer: {
              label: {
                formatter: function (params) {
                  var seriesValue = (params.seriesData[0] || {}).value
                  // return params.value +
                  // (seriesValue != null
                  //   ? '\n' + echarts.format.addCommas(seriesValue)
                  //   : ''
                  // )
                  return seriesValue
                }
              }
            }
          }
        ],
        yAxis: [
          {
            scale: true,
            splitNumber: 3,
            axisTick: {
              show: false // 坐标轴刻度是否显示
            },
            axisLine: {
              lineStyle: {
                color: '#E3E3E3'
              }
            },
            axisLabel: {
              inside: true, // 刻度标签是否朝内，默认朝外
              margin: 3, // 刻度标签与轴线之间的距离
              color: '#91999F',
              fontSize: 10 // 文字的字体大小
            },
            splitLine: {
              show: true,
              lineStyle: {
                // 使用深浅的间隔色
                color: '#EEEEEE'
              }
            }
          },
          {
            scale: true,
            gridIndex: 1,
            splitNumber: 2,
            axisLabel: {show: false},
            axisLine: {
              lineStyle: {
                color: '#E3E3E3'
              }
            },
            axisTick: {show: false},
            splitLine: {
              show: true,
              lineStyle: {
                // 使用深浅的间隔色
                color: '#EEEEEE'
              }
            }
          }
        ],
        dataZoom: [
          {
            type: 'inside',
            xAxisIndex: [0, 1],
            startValue: xData[xData.length - 30],
            end: 100
          },
          {
            show: false,
            type: 'slider',
            y: '90%',
            startValue: xData[xData.length - 30],
            end: 100
          }
        ],
        series: [
          {
            name: '日K',
            type: 'candlestick',
            symbol: 'none',
            data: data.map(function (item) {
              let arr = []
              arr.push(item.openPrice)
              arr.push(item.closePrice)
              arr.push(item.lowPrice)
              arr.push(item.highPrice)
              return arr
              // return item.date
            }),
            itemStyle: {
              normal: {
                color: upColor,
                color0: downColor,
                borderColor: upBorderColor,
                borderColor0: downBorderColor
              }
            },
            markPoint: {
              label: {
                normal: {
                  formatter: function (param) {
                    return param != null ? Math.round(param.value) : ''
                  }
                }
              },
              data: [
                {
                  name: 'XX标点',
                  coord: ['2013/5/31', 2300],
                  value: 2300,
                  itemStyle: {
                    normal: { color: 'rgb(41,60,85)' }
                  }
                },
                {
                  name: 'highest value',
                  type: 'max',
                  valueDim: 'highest'
                },
                {
                  name: 'lowest value',
                  type: 'min',
                  valueDim: 'lowest'
                },
                {
                  name: 'average value on close',
                  type: 'average',
                  valueDim: 'close'
                }
              ],
              tooltip: {
                formatter: function (param) {
                  return param.name + '<br>' + (param.data.coord || '')
                }
              }
            }
          },
          {
            name: 'MA5',
            type: 'line',
            connectNulls: true,
            symbol: 'none',
            data: calculateMA(5),
            smooth: true,
            lineStyle: {
              color: '#C6238A',
              // normal: { opacity: 0.5 },
              width: 1
            }
          },
          {
            name: 'MA10',
            type: 'line',
            connectNulls: true,
            symbol: 'none',
            data: calculateMA(10),
            smooth: true,
            lineStyle: {
              color: '#2382BA',
              // normal: { opacity: 0.5 },
              width: 1
            }
          },
          {
            name: 'MA30',
            type: 'line',
            connectNulls: true,
            symbol: 'none',
            data: calculateMA(30),
            smooth: true,
            lineStyle: {
              color: '#DEA92A',
              // normal: { opacity: 0.5 },
              width: 1
            }
          },
          {
            name: 'Volumn',
            type: 'bar',
            itemStyle: {
              normal: {
                color: function (params) {
                  return parseFloat(data[params.dataIndex].openPrice) > parseFloat(data[params.dataIndex].closePrice) ? '#14B900' : '#FD2E26'
                }
              }
            },
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: data.map(function (item) {
              return item.volume
            })
          }
        ]
      }

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option)
    },
    /**
     * 展示画布
     * type 类型
     * 股票代码
     * 是否是正在更新数据
     */
    showChart: function (type, code, isUpdate) {
      var that = this
      // 显示加载中
      if (!isUpdate) that.mask.isLoading = true
      // 定义一个变量接收 接口名
      var api = 'quotentrd1'
      // var api = 'catequote'
      // 如果是bj类型，更换接口
      if (this.isBj) api = 'quotentrd5'
      // console.log(api)
      window.StockAPI.send(api, {
        code: code,
        onSuccess: function (resp) {
          // console.log(resp)
          var quoteItem = resp.quoteItem
          // console.log(quoteItem.subtype)
          window.StockAPI.send(type, {
            code: quoteItem.code,
            subtype: quoteItem.subtype,
            onSuccess: function (resp) {
              console.log(resp)
              // 得到title
              const title = quoteItem.name
              // 定义一个变量接收dom元素
              var dom = null
              // console.log(dom, title)
              // 定义一个数组接收处理过后的数据
              var Data = []
              // console.log(that.$refs.container.children)
              switch (type) {
                case 'line': case 'line5d': {
                  Data = resp.chartItems
                  // let data = []
                  // 处理数据
                  for (let i = 0; i < Data.length; i++) {
                    let time = Data[i].datetime + ''
                    Data[i].datetime = time.slice(4, 6) + '/' + time.slice(6, 8) + '-' + time.slice(8, 10) + ':' + time.slice(10, 12)
                    // Data[i].datetime = time.slice(8, 10) + ':' + time.slice(10, 12)
                  }
                  // dom = that.$refs.canvasL
                  // 是否是分时数据
                  var isLine = type === 'line'
                  if (isLine) {
                    dom = that.$refs.container.children[0]
                  } else {
                    dom = that.$refs.container.children[1]
                  }
                  // console.log(dom, Data, title, isLine)
                  that.line(dom, Data, title, isLine)
                  // 关闭加载中
                  that.mask.isLoading = false
                  break
                }
                case 'dayk': case 'weekk': case 'monthk': {
                  Data = resp.OHLCItems
                  // 处理数据
                  for (let i = 0; i < Data.length; i++) {
                    let time = Data[i].date + ''
                    Data[i].date = time.slice(0, 4) + '/' + time.slice(4, 6) + '/' + time.slice(6, 8)
                  }
                  if (type === 'dayk') {
                    dom = that.$refs.container.children[2]
                  } else if (type === 'weekk') {
                    dom = that.$refs.container.children[3]
                  } else if (type === 'monthk') {
                    dom = that.$refs.container.children[4]
                  }
                  // dom = that.$refs.canvasC
                  that.candlestick(dom, Data, title)
                  // 关闭加载中
                  that.mask.isLoading = false
                  break
                }
              }
            }
          })
        },
        onError: function (resp) {
          console.log(resp)
          that.mask.isLoading = false
        }
      })
    },
    /**
     * 点击导航栏
     * index 当前点击项
     * 是否是正在更新数据
     */
    clickNav: function (index, isUpdate) {
      var typeArr = ['line', 'line5d', 'dayk', 'weekk', 'monthk']
      // if (this.justK) typeArr = ['dayk', 'weekk', 'monthk']
      for (let i = 0; i < typeArr.length; i++) {
        this.$set(this.nav[i], 'statu', 0)
      }
      this.$set(this.nav[index], 'statu', 1)
      // 上方数据隐藏
      if (!isUpdate) this.topDataStatu = 0
      // 下方x轴状态控制
      if (index === 0) {
        this.axisLabelStatu = 1
      } else if (index === 1) {
        this.axisLabelStatu = 2
      } else {
        this.axisLabelStatu = 0
      }
      this.showChart(typeArr[index], this.code, isUpdate)
    },
    /**
     * 判断当前code类别
     */
    judgmentClass: function () {
      if (this.code.split('.')[1] === 'bj') {
        this.isBj = true
      } else {
        this.isBj = false
      }
      if (this.code.split('.')[1] === 'gb') {
        this.justK = true
      } else {
        this.justK = false
      }
      if (this.code.split('.')[1] === 'hk') {
        this.isHK = true
      } else {
        this.isHK = false
      }
    }
  },
  beforeMount: function () {
    // alert('测试07')
    if (this.$parent.$parent.initOk) {
      this.judgmentClass()
      // this.getData()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.Index_Charts{
  position: relative;
  > nav {
    background-color: #f6f6f6;
    div {
      float: left;
      height: 0.62rem;
      line-height: 0.62rem;
      font-family: PingFangSC-Regular;
      font-size: 0.26rem;
      color: #707070;
      letter-spacing: 0.0069rem;
      /* padding: 0 0.57rem 0 0; */
      box-sizing: border-box;
      -moz-box-sizing: border-box; /* Firefox */
      -webkit-box-sizing: border-box; /* Safari */
      /* &:first-child {
        padding-left: 0.3rem;
      }
      &:last-child {
        padding-right: 0.35rem;
      } */
      width: 20%;
      text-align: center;
      &.current {
        color: #2d6aad;
        border-bottom: 0.04rem solid #2e6bb1;
      }
    }
  }
  > .container {
    position: relative;
    .canvas {
      width: 5.22rem;
      height: 5.59rem; /* 569 + 36 - 34 - 10 */
      margin: 0.34rem 0rem 0.1rem 0.12rem;
      float: left;
      box-sizing: border-box;
      -moz-box-sizing: border-box; /* Firefox */
      -webkit-box-sizing: border-box; /* Safari */
      position: relative;
      overflow: hidden;
      &.isIndex {
        width: 7.26rem;
      }
    }
    > .des{
      position: absolute;
      top: 0;
      left: 0;
      div{
        height: .34rem;
        line-height: .34rem;
        font-family: PingFangSC-Regular;
        font-size: .22rem;
        color: #91999F;
        padding-left: .40rem;
      }
    }
    > .axisLabel {
      width: 5.18rem;
      margin-left: 0.12rem;
      position: absolute;
      /* z-index: -1; */
      bottom: 0;
      left: 0;
      &.isIndex{
        width: 7.26rem;
      }
      > ul{
        width: 100%;
        height: .42rem;
        line-height: .42rem;
        font-family: HelveticaNeue;
        font-size: .20rem;
        color: #9F9F9F;
        li{
          float: left;
          text-align: center;
        }
        &.line li{
          width: 33.33%;
          &:nth-child(1){
            text-align: left;
          }
          &:nth-child(3){
            text-align: right;
          }
        }
        &.five li{
          width: 20%;
        }
      }
    }
  }
}
</style>
