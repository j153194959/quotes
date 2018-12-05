<template>
  <div class="Index_Nav">
    <!-- 导航栏 -->
    <!-- <nav class="clearfix">
      <a v-for="(value, index) in navSource" :key="index" @click="clickSource(index)" :class="{current: value.statu}" href="javascript:void(0)">{{value.txt}}</a>
    </nav> -->
    <!-- 下方显示容器 -->
    <div class="container">
      <!-- 资金 -->
      <div v-show="navSource[0].statu" class="funds">
        <div class="none">
          <div><img src="../../assets/no-shareholder.png" alt=""></div>
          <p>暂无数据</p>
        </div>
      </div>
      <!-- 资讯 -->
      <div v-show="navSource[1].statu" class="information">
        <div class="none">
          <div><img src="../../assets/no-shareholder.png" alt=""></div>
          <p>暂无数据</p>
        </div>
      </div>
      <!-- 简况/F10 -->
      <div v-show="navSource[2].statu" class="profile">
        <!-- <div v-show="!companyinfo.COMPNAME" class="none">
          <div><img src="../../assets/no-shareholder.png" alt=""></div>
          <p>暂无数据</p>
        </div> -->
        <div v-show="companyinfo.COMPNAME">
          <nav class="clearfix">
            <a v-for="(value, index) in F10.nav" :key="index" @click="clickNavF10(index)" :class="{current: value.statu}" href="javascript:void(0)">{{value.txt}}</a>
          </nav>
          <!-- 下方显示容器 -->
          <div class="container">
            <!-- 简况 -->
            <div v-show="F10.nav[0].statu" class="profile">
              <!-- 公司简介 -->
              <div class="clearfix">
                <h4>公司简介</h4>
                <!-- <ul class="key">
                  <li>公司名称</li>
                  <li>董事长</li>
                  <li>董秘</li>
                  <li>董秘邮箱</li>
                  <li>注册地址</li>
                  <li>上市时间</li>
                  <li>发行价</li>
                  <li>首日开盘价</li>
                  <li>所属行业</li>
                </ul>
                <ul class="value">
                  <li class="one-txt-cut" v-for="(value, key) in companyinfo" :key="key">{{value}}</li>
                </ul> -->
                <ul class="company-info">
                  <li v-for="(value, key) in companyinfo" :key="key">
                    <span class="company-key">{{ key|filterCompanyInfo }}</span>
                    <span class="company-val">{{ value }}</span>
                  </li>
                </ul>
              </div>
              <!-- 分红扩股 -->
              <div>
                <!-- <h4>分红扩股<a href="javascript:void(0)">更多</a></h4> -->
                <h4>分红扩股</h4>
                <div v-if="!sharebonus.length" class="none">
                  <p>该证券暂无分红扩股</p>
                </div>
                <div v-if="sharebonus.length">
                  <ul class="clearfix">
                    <li>报告期</li>
                    <li>方案</li>
                    <li>除权除息日</li>
                  </ul>
                  <ul v-for="(value, index) in sharebonus" :key="index" class="tr clearfix">
                    <li>{{value.DATETYPENAME}}</li>
                    <li class="txt-cut">{{value.PRETAXCASHMAXDVCNY}}</li>
                    <li>{{value.XDRDATE}}</li>
                  </ul>
                </div>
              </div>
              <!-- 公司高管 -->
              <div>
                <!-- <h4>公司高管<a href="javascript:void(0)">更多</a></h4> -->
                <h4>公司高管</h4>
                <ul class="clearfix">
                  <li>姓名</li>
                  <li>职务</li>
                  <li>持股</li>
                  <li>薪酬</li>
                </ul>
                <ul v-for="(value, index) in companymanager" :key="index" class="clearfix">
                  <li>{{value.CNAME}}</li>
                  <li>{{value.DUTY}}</li>
                  <li>{{value.HOLDAFAMT}}</li>
                  <li>{{value.REMBEFTAX}}</li>
                </ul>
              </div>
            </div>
            <!-- 股本股东 -->
            <div v-show="F10.nav[1].statu" class="shareholders">
              <!-- 股本结构 -->
              <div class="clearfix">
                <h4>股本结构</h4>
                <!-- <ul>
                  <li>总股本</li>
                  <li>流通股本</li>
                  <li>实际控制人</li>
                  <li>第一大股东</li>
                  <li>持股比例</li>
                  <li>股东人数</li>
                  <li>较上期</li>
                </ul>
                <ul>
                  <li class="one-txt-cut" v-for="(value, key) in shareinfo" :key="key">{{value}}</li>
                </ul> -->
                <ul class="company-info">
                  <li v-for="(value, key) in shareinfo" :key="key">
                    <span class="company-key">{{ key|filterShareInfo }}</span>
                    <span class="company-val">{{ value }}</span>
                  </li>
                </ul>
              </div>
              <!-- 股东股数 -->
              <div>
                <!-- <h4>股东股数<a href="javascript:void(0)">更多</a></h4> -->
                <h4>股东股数</h4>
                <div v-show="!shareholdernum.length" class="none">
                  <div><img src="../../assets/no-shareholder.png" alt=""></div>
                  <p>暂无数据</p>
                </div>
                <div v-if="shareholdernumTopData.isShow" class="data">
                  <i></i> 股东人数: <span>{{shareholdernumTopData.TOTALSHAMT | getNum}}户</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <i></i> 人均持股: <span>{{shareholdernumTopData.KAVGSH | getNum}}股</span>
                </div>
                <div ref="canvas" v-show="shareholdernum.length" class="have"></div>
              </div>
              <!-- 十大流通股东 -->
              <div>
                <div class="h4-right">{{holderTime}}</div>
                <h4><i :class="{uncurrent: holder10Type}" @click="clickHolder10(0)">十大流通股东</i><span> 丨 </span><i :class="{uncurrent: !holder10Type}" @click="clickHolder10(1)">十大股东</i></h4>
                <div v-show="!holder10.length" class="none">
                  <p>该证券暂无十大流通股东信息</p>
                </div>
                <div v-show="holder10.length" class="container">
                  <ul class="clearfix">
                    <li>股东名称</li>
                    <li>持股</li>
                    <li>增减</li>
                  </ul>
                  <!-- <div v-for="(value, index) in holder10" :key="index" :class="['tr', parseInt(value.HOLDERSUMCHG) ? (parseInt(value.HOLDERSUMCHG) > 0 ? 'red' : 'green') : '']"> -->
                  <div v-for="(value, index) in holder10" :key="index" :class="['tr', value.HOLDERSUMCHG[0] === '增' ? 'red' : (value.HOLDERSUMCHG[0] === '减' ? 'green' : '')]">
                    <p>{{value.SHHOLDERNAME}}</p>
                    <ul class="clearfix">
                      <li><div><i :style="{width: getWidth(value.PCTOFFLOTSHARES, holderMax)}"></i></div> <span>{{value.PCTOFFLOTSHARES}}</span></li>
                      <li>{{value.HOLDERAMT}}</li>
                      <li :class="{toUp: GLOBAL.strlen(value.HOLDERSUMCHG) > 8}">{{value.HOLDERSUMCHG}}</li>
                    </ul>
                  </div>
                  <!-- <div class="tr red">
                    <p>富德生命人寿保险股份有限公司</p>
                    <ul class="clearfix">
                      <li><div><i></i></div> <span>15.89%</span></li>
                      <li>54.11</li>
                      <li>未变</li>
                    </ul>
                  </div> -->
                </div>
              </div>
            </div>
            <!-- 财务 -->
            <div v-show="F10.nav[2].statu" class="finance">
              <!-- 主要指标 -->
              <div class="clearfix">
                <!-- <h4>主要指标&nbsp; <span>{{profinmainindex[0] ? profinmainindex[0].REPORTTITLE　: ''}}</span><a href="javascript:void(0)">更多</a></h4> -->
                <h4>主要指标&nbsp; <span>{{profinmainindex[0] ? profinmainindex[0].REPORTTITLE　: ''}}</span></h4>
                <ul>
                  <li>基本每股收益（元）</li>
                  <li>摊薄每股收益（元）</li>
                  <li>每股净资产（元）</li>
                  <li>每股未分配利润（元）</li>
                  <li>每股公积金（元）</li>
                  <li>销售毛利率（%）</li>
                  <li>营业利润率（%）</li>
                  <li>加权净资产收益率（%）</li>
                  <li>摊薄净资产收益率（%）</li>
                  <li>流动比率</li>
                  <li>速动比率</li>
                  <li>每股经营现金流（元）</li>
                </ul>
                <ul>
                  <li v-for="(value, key) in profinmainindex[0]" :key="key" v-if="key!=='REPORTTITLE'">{{value}}</li>
                </ul>
              </div>
              <!-- 利润表 -->
              <div class="clearfix">
                <!-- <h4>利润表&nbsp; <span>{{proincstatementnew[0] ? proincstatementnew[0].REPORTTITLE : ''}}</span><a href="javascript:void(0)">更多</a></h4> -->
                <h4>利润表&nbsp; <span>{{proincstatementnew[0] ? proincstatementnew[0].REPORTTITLE : ''}}</span></h4>
                <ul>
                  <li>营业收入</li>
                  <li>营业成本</li>
                  <li>营业费用</li>
                  <li>管理费用</li>
                  <li>财务费用</li>
                  <li>营业利润</li>
                  <li>投资收益</li>
                  <li>营业外收支净额</li>
                  <li>利润总额</li>
                  <li>净利润</li>
                </ul>
                <ul>
                  <li v-for="(value, key) in proincstatementnew[0]" :key="key" v-if="key!=='REPORTTITLE'">{{value}}</li>
                </ul>
              </div>
              <!-- 资产负债表 -->
              <div class="clearfix">
                <!-- <h4>资产负债表&nbsp; <span>{{probalsheetnew[0] ? probalsheetnew[0].REPORTTITLE : ''}}</span><a href="javascript:void(0)">更多</a></h4> -->
                <h4>资产负债表&nbsp; <span>{{probalsheetnew[0] ? probalsheetnew[0].REPORTTITLE : ''}}</span></h4>
                <ul>
                  <li>总资产</li>
                  <li>流动资产</li>
                  <li>货币资产</li>
                  <li>存货</li>
                  <li>交易性金融资产</li>
                  <li>应收账款</li>
                  <li>其他应收款</li>
                  <li>固定资产净额</li>
                  <li>可供出售金融资产</li>
                  <li>无形资产</li>
                  <li>应付账款</li>
                  <li>流动负债</li>
                  <li>长期负债</li>
                  <li>总负债</li>
                  <li>股东权益</li>
                  <li>资本公积金</li>
                </ul>
                <ul>
                  <li v-for="(value, key) in probalsheetnew[0]" :key="key" v-if="key!=='REPORTTITLE'">{{value}}</li>
                </ul>
              </div>
              <!-- 现金流量表 -->
              <div class="clearfix">
                <!-- <h4>现金流量表&nbsp; <span>{{procfstatementnew[0] ? procfstatementnew[0].REPORTTITLE : ''}}</span><a href="javascript:void(0)">更多</a></h4> -->
                <h4>现金流量表&nbsp; <span>{{procfstatementnew[0] ? procfstatementnew[0].REPORTTITLE : ''}}</span></h4>
                <ul>
                  <li>经营现金流入小计</li>
                  <li>经营现金流出小计</li>
                  <li>经营现金流量净额</li>
                  <li>投资现金流入小计</li>
                  <li>投资现金流出小计</li>
                  <li>投资现金流量净额</li>
                  <li>筹资现金流入小计</li>
                  <li>筹资现金留出小计</li>
                  <li>筹资现金流量净额</li>
                  <li>现金等的净增加额</li>
                </ul>
                <ul>
                  <li v-for="(value, key) in procfstatementnew[0]" :key="key" v-if="key!=='REPORTTITLE'">{{value}}</li>
                </ul>
              </div>
            </div>
            <p class="disclaimer">
              【免责声明】优理宝移动金融终端提供的行业分类数据采用中国证监会二级行业分类标准，以上所有数据均以上市公司信息披露公告为准，本公司及信息提供商不承担由于数据资料产生或引发的任何损失。股市有风险，投资需谨慎。
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 引入echarts插件
// const echarts = require('echarts/lib/echarts')

export default {
  name: 'Index_Nav',
  data () {
    return {
      navSource: [ // 最外层导航栏
        {
          statu: 0,
          txt: '资金'
        },
        {
          statu: 0,
          txt: '资讯'
        },
        {
          statu: 1,
          txt: '简况/F10'
        }
      ],
      F10: { // 简况/F10
        nav: [ // 导航栏控制
          {
            statu: 1,
            txt: '简况'
          },
          {
            statu: 0,
            txt: '股本股东'
          },
          {
            statu: 0,
            txt: '财务'
          }
        ]

      },
      companyinfo: { // 公司简介
        COMPNAME: '', // 公司名称
        CHAIRMAN: '', // 董事长
        BSECRETARY: '', // 董秘
        BSECRETARYMAIL: '', // 董秘邮箱
        REGADDR: '', // 注册地址
        LISTDATE: '', // 上市时间
        ISSPRICE: '', // 发行价
        LISTOPRICE: '', // 首日开盘价
        FCLEVEL2NAME: '' // 所属行业
      },
      sharebonus: [ // 分红扩股
        // {
        //   EQURECORDDATE: '', // 登记日
        //   PRETAXCASHMAXDVCNY: '', // 方案
        //   DATETYPENAME: '', // 时间
        //   XDRDATE: '' // 除权息日
        // }
      ],
      companymanager: [ // 公司高管
        // {
        //   CNAME: '', // 姓名
        //   DUTY: '', // 职位
        //   HOLDAFAMT: '', // 持股
        //   REMBEFTAX: '' // 薪酬
        // }
      ],
      shareinfo: { // 股本结构
        TOTALSHARE: '', // 总股本
        CIRCSKAMT: '', // 流通股本
        RELANAME: '', // 实际控制人
        SHHOLDERNAME: '', // 第一大股东
        HOLDERRTO: '', // 持股比例
        TOTALSHAMT: '', // 股东人数
        TOTALSHRTO: '' // 较上期增长
      },
      shareholdernum: [ // 股东股数
        // {
        //   ENDDATE: '', // 变动日期
        //   TOTALSHAMT: '', // 股东户数
        //   KAVGSH: '' // 人均持股
        // }
      ],
      shareholdernumTopData: { // 股东股数上方数据
        isShow: false, // 是否展示
        TOTALSHAMT: '--', // 股东户数
        KAVGSH: '--' // 人均持股
      },
      holder10Type: 0, // 当前显示 0-十大流通股东 1-十大股东
      holder10: [ // 十大流通股东 | 十大股东
        // {
        //   SHHOLDERNAME: '', // 股东名称
        //   HOLDERAMT: '', // 持股
        //   PCTOFFLOTSHARES: '', // 占比
        //   HOLDERSUMCHG: '' // 增减
        // }
      ],
      holderMax: '', // 股东最大值
      holderTime: '', // 股东时间
      profinmainindex: [ // 主要指标
        // {
        //   REPORTTITLE: '', // 标题
        //   EPSBASIC: '', // 基本每股收益（元）
        //   EPSDILUTED: '', // 摊薄每股收益（元）
        //   NAPS: '', // 每股净资产（元）
        //   UPPS: '', // 每股未分配利润（元）
        //   CRPS: '', // 每股公积金（元）
        //   SGPMARGIN: '', // 销售毛利率（%）
        //   OPPRORT: '', // 营业利润率（%）
        //   // SNPMARGIN: '', // 净利润率（%）
        //   ROEWEIGHTED: '', // 加权净资产收益率（%）
        //   ROEDILUTED: '', // 摊薄净资产收益率（%）
        //   CURRENTRT: '', // 流动比率
        //   QUICKRT: '', // 速冻比率
        //   OPNCFPS: '' // 每股经营现金流量（元）
        // }
      ],
      proincstatementnew: [ // 利润表
        // {
        //   REPORTTITLE: '', // 标题
        //   BIZINCO: '', // 营业收入
        //   BIZCOST: '', // 营业成本
        //   SALESEXPE: '', // 营业费用
        //   MANAEXPE: '', // 管理费用
        //   FINEXPE: '', // 财务费用
        //   PERPROFIT: '', // 营业利润
        //   INVEINCO: '', // 投资收益
        //   NONOPERINCOMEN: '', // 营业外收支净额
        //   TOTPROFIT: '', // 利润总额
        //   PARENETP: '' // 净利润
        // }
      ],
      probalsheetnew: [ // 资产负债表
        // {
        //   REPORTTITLE: '', // 标题
        //   TOTLIABSHAREQUI: '', // 总资产
        //   TOTCURRASSET: '', // 流动资产
        //   CURFDS: '', // 货币资金
        //   INVE: '', // 存货
        //   TRADFINASSET: '', // 交易性金融资产
        //   ACCORECE: '', // 应收账款
        //   OTHERRECE: '', // 其他应收款
        //   FIXEDASSENET: '', // 固定资产净额
        //   AVAISELLASSE: '', // 可供出售金额资产
        //   INTAASSET: '', // 无形资产
        //   ACCOPAYA: '', // 应付账款
        //   // SHORTTERMBORR: '', // 短期借款
        //   // ADVAPAYM: '', // 预收账款
        //   TOTALCURRLIAB: '', // 流动负债
        //   SUNEVENNONCLIAB: '', // 长期负债
        //   TOTLIAB: '', // 总负债
        //   PARESHARRIGH: '', // 股东权益
        //   CAPISURP: '' // 资产公积金
        // }
      ],
      procfstatementnew: [ // 现金流量表
        // {
        //   REPORTTITLE: '', // 标题
        //   BIZCASHINFL: '', // 经营现金流入小计
        //   BIZCASHOUTF: '', // 经营现金流出小计
        //   MANANETR: '', // 经营现金流量净额
        //   INVCASHINFL: '', // 投资现金流入小计
        //   INVCASHOUTF: '', // 投资现金流出小计
        //   INVNETCASHFLOW: '', // 投资现金流量净额
        //   FINCASHINFL: '', // 筹资现金流入小计
        //   FINCASHOUTF: '', // 筹资现金流出小计
        //   FINNETCFLOW: '', // 筹资现金流量净额
        //   CASHNETR: '' // 现金等的净额加额
        // }
      ]
    }
  },
  watch: {
    code: function (newParam, oldParam) {
      this.getData()
    },
    '$parent.$parent.initOk': function (to, from) {
      // console.log(to, from)
      this.getData()
    }
  },
  props: ['code'],
  filters: {
    /**
     * xuyang 公司简况
     */
    filterCompanyInfo (key) {
      var info = ''
      switch (key) {
        case 'COMPNAME':
          info = '公司名称'
          break
        case 'CHAIRMAN':
          info = '董事长'
          break
        case 'BSECRETARY':
          info = '董秘'
          break
        case 'BSECRETARYMAIL':
          info = '董秘邮箱'
          break
        case 'REGADDR':
          info = '注册地址'
          break
        case 'LISTDATE':
          info = '上市时间'
          break
        case 'ISSPRICE':
          info = '发行价'
          break
        case 'LISTOPRICE':
          info = '首日开盘价'
          break
        case 'FCLEVEL2NAME':
          info = '所属行业'
          break
      }
      return info
    },
    /**
     * xuyang 股本股东
     */
    filterShareInfo (key) {
      var info = ''
      switch (key) {
        case 'TOTALSHARE':
          info = '总股本'
          break
        case 'CIRCSKAMT':
          info = '流通股本'
          break
        case 'RELANAME':
          info = '实际控制人'
          break
        case 'SHHOLDERNAME':
          info = '第一大股东'
          break
        case 'HOLDERRTO':
          info = '持股比例'
          break
        case 'TOTALSHAMT':
          info = '股东人数'
          break
        case 'TOTALSHRTO':
          info = '较上期增长'
          break
      }
      return info
    },
    /**
     * 处理过长数字
     * str 需要处理的字符串
     */
    getNum: function (str) {
      // console.log(str)
      const num = parseFloat(str) || 0
      var result = ''
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
      return result
    }
  },
  methods: {
    /**
     * 点击最外层导航栏
     * index 当前点击项的索引
     */
    clickSource: function (index) {
      for (let i = 0; i < this.navSource.length; i++) {
        this.navSource[i].statu = 0
      }
      this.navSource[index].statu = 1
    },
    /**
     * 点击简况/F10导航栏
     * index 当前点击项的索引
     */
    clickNavF10: function (index) {
      // console.log(index)
      for (let i = 0; i < this.F10.nav.length; i++) {
        this.F10.nav[i].statu = 0
      }
      this.F10.nav[index].statu = 1
    },
    /**
     * 获取数据
     */
    getData: function () {
      var that = this
      // 公司简介
      window.StockAPI.send('companyinfo', {
        code: that.code,
        onSuccess: function (resp) {
          const data = resp.data
          // console.log(data)
          // alert(JSON.stringify(data))
          that.companyinfo.LISTDATE = data.LISTDATE
          that.companyinfo.LISTOPRICE = data.LISTOPRICE
          that.companyinfo.FCLEVEL2NAME = data.FCLEVEL2NAME
          that.companyinfo.COMPNAME = data.COMPNAME
          that.companyinfo.CHAIRMAN = data.CHAIRMAN
          that.companyinfo.BSECRETARY = data.BSECRETARY
          that.companyinfo.BSECRETARYMAIL = data.BSECRETARYMAIL
          that.companyinfo.REGADDR = data.REGADDR
          that.companyinfo.ISSPRICE = data.ISSPRICE
        },
        onError: function (resp) {
          console.log(resp)
          // alert(JSON.stringify(resp))
        }
      })
      // 分红扩股
      window.StockAPI.send('sharebonus', {
        code: that.code,
        onSuccess: function (resp) {
          const data = resp.data
          console.log(data)
          that.sharebonus = []
          for (let i = 0; i < data.length; i++) {
            let o = {}
            o.EQURECORDDATE = data[i].EQURECORDDATE
            o.PRETAXCASHMAXDVCNY = data[i].PRETAXCASHMAXDVCNY
            o.DATETYPENAME = data[i].DATETYPENAME
            o.XDRDATE = data[i].XDRDATE
            that.sharebonus.push(o)
          }
        },
        onError: function (resp) {
          console.log(resp)
        }
      })
      // 公司高管
      window.StockAPI.send('companymanager', {
        code: that.code,
        onSuccess: function (resp) {
          const data = resp.data
          // console.log(data)
          that.companymanager = []
          for (let i = 0; i < data.length; i++) {
            let o = {}
            o.CNAME = data[i].CNAME
            o.DUTY = data[i].DUTY
            o.HOLDAFAMT = data[i].HOLDAFAMT
            o.REMBEFTAX = data[i].REMBEFTAX
            that.companymanager.push(o)
          }
        },
        onError: function (resp) {
          console.log(resp)
        }
      })
      // 股东股数
      window.StockAPI.send('shareholdernum', {
        code: that.code,
        onSuccess: function (resp) {
          const data = resp.data
          // console.log(data)
          that.shareholdernum = []
          for (let i = data.length - 1; i >= 0; i--) {
            let o = {}
            o.ENDDATE = data[i].ENDDATE
            o.TOTALSHAMT = data[i].TOTALSHAMT
            o.KAVGSH = data[i].KAVGSH
            that.shareholdernum.push(o)
          }
          that.line()
        },
        onError: function (resp) {
          console.log(resp)
        }
      })
      // 股本结构
      window.StockAPI.send('shareinfo', {
        code: that.code,
        onSuccess: function (resp) {
          const data = resp.data
          // console.log(data)
          that.shareinfo.TOTALSHARE = data.TOTALSHARE
          that.shareinfo.CIRCSKAMT = data.CIRCSKAMT
          that.shareinfo.RELANAME = data.RELANAME
          that.shareinfo.SHHOLDERNAME = data.SHHOLDERNAME
          that.shareinfo.HOLDERRTO = data.HOLDERRTO
          that.shareinfo.TOTALSHAMT = data.TOTALSHAMT
          that.shareinfo.TOTALSHRTO = data.TOTALSHRTO
        },
        onError: function (resp) {
          console.log(resp)
        }
      })
      // 十大流通股东
      this.clickHolder10(0)
      // 主要指标
      window.StockAPI.send('profinmainindex', {
        code: that.code,
        onSuccess: function (resp) {
          const data = resp.data
          // console.log(data)
          that.profinmainindex = []
          for (let i = 0; i < data.length; i++) {
            let o = {}
            o.REPORTTITLE = data[i].REPORTTITLE
            o.EPSBASIC = data[i].EPSBASIC
            o.EPSDILUTED = data[i].EPSDILUTED
            o.NAPS = data[i].NAPS
            o.UPPS = data[i].UPPS
            o.CRPS = data[i].CRPS
            o.SGPMARGIN = data[i].SGPMARGIN
            o.OPPRORT = data[i].OPPRORT
            // o.SNPMARGIN = data[i].SNPMARGIN
            o.ROEWEIGHTED = data[i].ROEWEIGHTED
            o.ROEDILUTED = data[i].ROEDILUTED
            o.CURRENTRT = data[i].CURRENTRT
            o.QUICKRT = data[i].QUICKRT
            o.OPNCFPS = data[i].OPNCFPS
            that.profinmainindex.push(o)
          }
        },
        onError: function (resp) {
          console.log(resp)
        }
      })
      // 利润表
      window.StockAPI.send('proincstatementnew', {
        code: that.code,
        onSuccess: function (resp) {
          const data = resp.data
          // console.log(data)
          that.proincstatementnew = []
          for (let i = 0; i < data.length; i++) {
            let o = {}
            o.REPORTTITLE = data[i].REPORTTITLE
            o.BIZINCO = data[i].BIZINCO
            o.BIZCOST = data[i].BIZCOST
            o.SALESEXPE = data[i].SALESEXPE
            o.MANAEXPE = data[i].MANAEXPE
            o.FINEXPE = data[i].FINEXPE
            o.PERPROFIT = data[i].PERPROFIT
            o.INVEINCO = data[i].INVEINCO
            o.NONOPERINCOMEN = data[i].NONOPERINCOMEN
            o.TOTPROFIT = data[i].TOTPROFIT
            o.PARENETP = data[i].PARENETP
            that.proincstatementnew.push(o)
          }
        },
        onError: function (resp) {
          console.log(resp)
        }
      })
      // 资产负债表
      window.StockAPI.send('probalsheetnew', {
        code: that.code,
        onSuccess: function (resp) {
          const data = resp.data
          // console.log(data)
          that.probalsheetnew = []
          for (let i = 0; i < data.length; i++) {
            let o = {}
            o.REPORTTITLE = data[i].REPORTTITLE
            o.TOTLIABSHAREQUI = data[i].TOTLIABSHAREQUI
            o.TOTCURRASSET = data[i].TOTCURRASSET
            o.CURFDS = data[i].CURFDS
            o.INVE = data[i].INVE
            o.TRADFINASSET = data[i].TRADFINASSET
            o.ACCORECE = data[i].ACCORECE
            o.OTHERRECE = data[i].OTHERRECE
            o.FIXEDASSENET = data[i].FIXEDASSENET
            o.AVAISELLASSE = data[i].AVAISELLASSE
            o.INTAASSET = data[i].INTAASSET
            o.ACCOPAYA = data[i].ACCOPAYA
            o.TOTALCURRLIAB = data[i].TOTALCURRLIAB
            o.SUNEVENNONCLIAB = data[i].SUNEVENNONCLIAB
            o.TOTLIAB = data[i].TOTLIAB
            o.PARESHARRIGH = data[i].PARESHARRIGH
            o.CAPISURP = data[i].CAPISURP
            that.probalsheetnew.push(o)
          }
        },
        onError: function (resp) {
          console.log(resp)
        }
      })
      // 现金流量表
      window.StockAPI.send('procfstatementnew', {
        code: that.code,
        onSuccess: function (resp) {
          const data = resp.data
          // console.log(data)
          that.procfstatementnew = []
          for (let i = 0; i < data.length; i++) {
            let o = {}
            o.REPORTTITLE = data[i].REPORTTITLE
            o.BIZCASHINFL = data[i].BIZCASHINFL
            o.BIZCASHOUTF = data[i].BIZCASHOUTF
            o.MANANETR = data[i].MANANETR
            o.INVCASHINFL = data[i].INVCASHINFL
            o.INVCASHOUTF = data[i].INVCASHOUTF
            o.INVNETCASHFLOW = data[i].INVNETCASHFLOW
            o.FINCASHINFL = data[i].FINCASHINFL
            o.FINCASHOUTF = data[i].FINCASHOUTF
            o.FINNETCFLOW = data[i].FINNETCFLOW
            o.CASHNETR = data[i].CASHNETR
            that.procfstatementnew.push(o)
          }
        },
        onError: function (resp) {
          console.log(resp)
        }
      })
    },
    /**
     * 展示折线图
     */
    line: function () {
      var myChart = window.echarts.init(this.$refs.canvas)
      var data = this.shareholdernum
      var that = this
      var option = {
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(0, 0, 0, 0)',
          textStyle: {
            color: 'gray',
            fontFamily: 'PingFangSC-Regular',
            fontSize: 11,
            lineHeight: 17,
            width: '100%',
            height: '.34rem'
          },
          formatter: function (params, ticket, callback) {
            that.shareholdernumTopData.isShow = true
            console.log(params)
            // var str = ''
            for (let i = 0; i < params.length; i++) {
              const el = params[i]
              if (el.seriesName === '股东人数') {
                that.shareholdernumTopData.TOTALSHAMT = el.value
              } else if (el.seriesName === '人均持股') {
                that.shareholdernumTopData.KAVGSH = el.value
              }
            }
            // str = '<div>' + str + '</div>'
            // return str
          }
        },
        // legend: {
        //   data: ['股东人数', '人均持股'],
        //   top: 0,
        //   right: 0
        // },
        grid: {
          left: '5%',
          right: '5%',
          bottom: '15%'
        },
        xAxis: {
          axisTick: {
            show: false // 坐标轴刻度是否显示
          },
          axisPointer: {
            label: {
              show: true,
              color: '#7D7D7D',
              fontFamily: 'PingFangSC-Regular',
              backgroundColor: '#fff',
              shadowColor: '#fff',
              borderColor: '#fff'
            }
          },
          axisLine: {
            lineStyle: {
              color: '#E1E1E1'
            }
          },
          axisLabel: {
            show: false
          },
          data: data.map(function (item) {
            return item.ENDDATE
          })
        },
        yAxis: {
          show: true, // 是否显示
          splitNumber: 3, // 坐标轴的分割段数
          type: 'value',
          scale: true,
          axisTick: {
            show: false // 坐标轴刻度是否显示
          },
          axisLine: {
            show: false
          },
          axisLabel: {
            show: false
          },
          splitLine: {
            show: true,
            lineStyle: {
              // 使用深浅的间隔色
              color: '#E1E1E1',
              type: 'dashed'
            }
          }
        },
        series: [
          {
            name: '股东人数',
            type: 'line',
            color: '#FD2E28',
            data: data.map(function (item) {
              var str = item.TOTALSHAMT.split(',').join('')
              return str
            }),
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: 'rgba(255, 0, 0, .2)' // 0% 处的颜色
                }, {
                  offset: 1, color: 'rgba(255, 0, 0, 0)' // 100% 处的颜色
                }],
                globalCoord: false // 缺省为 false
              }
            },
            smooth: true
          },
          {
            name: '人均持股',
            type: 'line',
            color: '#2E6BB1',
            data: data.map(function (item) {
              var str = item.KAVGSH.split(',').join('')
              return str
            }),
            smooth: true
          }
        ]
      }
      myChart.setOption(option)
    },
    /**
     * 点击 十大流通股东 | 十大股东
     * index 0-十大流通股东 1-十大股东
     */
    clickHolder10: function (index) {
      // console.log(index)
      var api = ['otsholder10', 'shareholder10']
      var that = this
      window.StockAPI.send(api[index], {
        code: that.code,
        onSuccess: function (resp) {
          const data = resp.data
          console.log(data)
          that.holder10 = []
          // 定义最大值
          // var max = 0
          that.holderMax = data[0].PCTOFFLOTSHARES
          // if (index) {
          //   max = data[0].HOLDERRTO
          // } else {
          //   max = data[0].PCTOFFLOTSHARES
          // }
          for (let i = 0; i < data.length; i++) {
            let o = {}
            o.SHHOLDERNAME = data[i].SHHOLDERNAME
            o.HOLDERAMT = data[i].HOLDERAMT
            if (index) {
              o.PCTOFFLOTSHARES = data[i].HOLDERRTO
              o.HOLDERSUMCHG = data[i].CURCHG
            } else {
              o.PCTOFFLOTSHARES = data[i].PCTOFFLOTSHARES
              o.HOLDERSUMCHG = data[i].HOLDERSUMCHG
            }
            // if (max < o.PCTOFFLOTSHARES) max = o.PCTOFFLOTSHARES
            that.holder10.push(o)
          }
          that.holderTime = data[0].ENDDATE
          // that.holderMax = max
          // console.log(that.holder10)
          that.holder10Type = index
        },
        onError: function (resp) {
          console.log(resp)
        }
      })
    },
    /**
     * 十大股东柱状图宽度
     */
    getWidth: function (width, max) {
      return parseFloat(width) / parseFloat(max) * 100 + '%'
    }
  },
  mounted: function () {
    // alert(this.code)
    // console.log(this.$parent.$parent.initOk)
    if (this.$parent.$parent.initOk) {
      this.getData()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.Index_Nav{
  > nav{
    background-color: #F6F6F6;
    text-align: center;
    > a{
      float: left;
      width: 33.33%;
      height: .62rem;
      line-height: .62rem;
      font-family: PingFangSC-Regular;
      font-size: .26rem;
      color: #777;
      &.current{
        font-family: MicrosoftYaHei;
        color: #2E6BB1;
        position: relative;
        &:after{
          content: "";
          position: absolute;
          width: 1.5rem;
          height: .04rem;
          background-color: #2E6BB1;
          bottom: 0;
          left: 50%;
          margin-left: -.75rem;
        }
      }
    }
  }
  > .container{
    > .profile > div{
      nav{
        margin-top: .22rem;
        a{
          float: left;
          width: 1.83rem;
          border: 1px solid #979797;
          border-radius: .1rem;
          height: .48rem;
          line-height: .48rem;
          text-align: center;
          font-family: PingFangSC-Regular;
          font-size: .26rem;
          color: #777;
          &.current{
            border-color: #2E6BB1;
            color: #2E6BB1;
          }
          &:nth-child(1){
            margin-left: .36rem;
          }
          &:nth-child(2){
            margin-left: .65rem;
          }
          &:nth-child(3){
            margin-left: .6rem;
          }
        }
      }
      > .container{
        > div {
          > div{
            padding: .22rem .28rem .16rem .45rem;
            h4{
              margin-bottom: .15rem;
              font-family: PingFangSC-Regular;
              font-size: .28rem;
              color: #2D2D2D;
              letter-spacing: 0.93px;
              height: .4rem;
              line-height: .4rem;
              position: relative;
              span{
                color: #7D7D7D;
              }
              a{
                position: absolute;
                font-family: PingFangSC-Regular;
                font-size: .28rem;
                color: #2E6BB1;
                letter-spacing: 0.93px;
                line-height: .4rem;
                top: 0;
                right: .12rem;
                &:after{
                  content: "";
                  position: absolute;
                  width: .11rem;
                  height: .19rem;
                  background-image: url("../../assets/Imported Layers 4 Copy 3@3x.png");
                  background-size: contain;
                  background-repeat: no-repeat;
                  top: 50%;
                  right: -.11rem;
                  margin-top: -.095rem;
                }
              }
              &:before{
                position: absolute;
                content: "";
                width: .04rem;
                height: .25rem;
                background-color: #326DAF;
                top: 50%;
                left: -.15rem;
                margin-top: -.125rem;
              }
            }
            border-bottom: .1rem solid #F6F6F6;
            &:last-of-type{
              border-bottom: none;
            }
            .none p{
              margin: .2rem 0;
            }
            // xuyang
            .company-info{
              li{
                margin: .1rem 0;
                display: -webkit-box; /* OLD - iOS 6-, Safari 3.1-6 */
                display: -moz-box; /* OLD - Firefox 19- (buggy but mostly works) */
                display: -ms-flexbox; /* TWEENER - IE 10 */
                display: -webkit-flex; /* NEW - Chrome */
                display: flex;
                -webkit-justify-content: space-between;
                -moz-justify-content: space-between;
                -ms-justify-content: space-between;
                -o-justify-content: space-between;
                justify-content: space-between;
                -webkit-align-items: center;
                -moz-align-items: center;
                -ms-align-items: center;
                -o-align-items: center;
                align-items: center;
                .company-key{
                  color: #7D7D7D;
                  -webkit-box-flex: 26;   /* OLD - iOS 6-, Safari 3.1-6 */
                  -moz-box-flex: 26;     /* OLD - Firefox 19- */
                  -webkit-flex: 26;      /* Chrome */
                  flex: 26;  /* NEW, Spec - Opera 12.1, Firefox 20+ */
                  line-height: normal;
                }
                .company-val{
                  color: #2D2D2D;
                  -webkit-box-flex: 74;   /* OLD - iOS 6-, Safari 3.1-6 */
                  -moz-box-flex: 74;     /* OLD - Firefox 19- */
                  -webkit-flex: 74;      /* Chrome */
                  flex: 74;  /* NEW, Spec - Opera 12.1, Firefox 20+ */
                  line-height: normal;
                }
              }
            }
          }
        }
        > .profile{
          > div{
            &:nth-of-type(1){
              font-family: PingFangSC-Regular;
              line-height: .48rem;
              letter-spacing: .0093rem;
              font-size: .28rem;
              .key{
                float: left;
                width: 1.45rem;
                color: #7D7D7D;
              }
              .value{
                padding-left: 1.45rem;
                color: #2D2D2D;
                text-align: right;
              }
            }
            &:nth-of-type(2){
              > div > ul{
                font-family: PingFangSC-Regular;
                font-size: .28rem;
                color: #7D7D7D;
                letter-spacing: .0093rem;
                line-height: .4rem;
                padding: .05rem 0;
                position: relative;
                li{
                  &:nth-of-type(1){
                    position: absolute;
                    top: 50%;
                    left: 0;
                    transform: translateY(-50%);
                    -ms-transform: translateY(-50%);
                    -moz-transform: translateY(-50%);
                    -webkit-transform: translateY(-50%);
                    -o-transform: translateY(-50%);
                    width: 1.93rem;
                  }
                  &:nth-of-type(2){
                    float: left;
                    width: 2.69rem;
                    padding-left: 1.93rem;
                    -webkit-line-clamp: 3;
                  }
                  &:nth-of-type(3){
                    position: absolute;
                    top: 50%;
                    right: 0;
                    transform: translateY(-50%);
                    -ms-transform: translateY(-50%);
                    -moz-transform: translateY(-50%);
                    -webkit-transform: translateY(-50%);
                    -o-transform: translateY(-50%);
                    width: 1.93rem;
                    text-align: right;
                  }
                }
                &.tr{
                  color: #2D2D2D;
                }
              }
            }
            &:nth-of-type(3){
              ul{
                font-family: PingFangSC-Regular;
                font-size: .28rem;
                color: #2D2D2D;
                letter-spacing: .0093rem;
                line-height: .5rem;
                &:first-of-type{
                  color: #7D7D7D;
                }
                li{
                  float: left;
                  &:nth-child(1){
                    width: 1.35rem;
                  }
                  &:nth-child(2){
                    width: 2.075rem;
                  }
                  &:nth-child(3){
                    width: 1.75rem;
                  }
                  &:nth-child(4){
                    float: right;
                    text-align: right;
                    width: 1.575rem;
                    font-size: .26rem;
                  }
                }
              }
            }
          }
        }
        > .shareholders{
          > div{
            &:nth-of-type(1){
              > ul{
                font-family: PingFangSC-Regular;
                font-size: .28rem;
                color: #2D2D2D;
                letter-spacing: .0093rem;
                line-height: .48rem;
                // &:first-of-type{ // xuyang
                //   width: 2rem;
                //   float: left;
                //   color: #7D7D7D;
                // }
                // &:last-of-type{
                //   padding-left: 2rem;
                // }
              }
            }
            &:nth-of-type(2){
              position: relative;
              /* .none{
                div{
                  width: 3.43rem;
                  height: 2.15rem;
                  margin: .58rem auto 0;
                }
                p{
                  margin: .2rem 0 .58rem 0;
                  font-family: PingFangSC-Regular;
                  font-size: .28rem;
                  color: #7D7D7D;
                  letter-spacing: .0093rem;
                  text-align: center;
                  line-height: .4rem;
                }
              } */
              .have{
                height: 3.91rem;
                width: 6.8rem;
              }
              .data{
                position: absolute;
                font-family: PingFangSC-Regular;
                font-size: .24rem;
                color: #7D7D7D;
                letter-spacing: 0.8px;
                line-height: .4rem;
                i{
                  display: inline-block;
                  width: .13rem;
                  height: .13rem;
                  border-radius: 50%;
                  vertical-align: middle;
                  &:first-of-type{
                    background: #FD2E28;
                  }
                  &:last-of-type{
                    background: #2E6BB1;
                  }
                }
                span{
                  &:first-of-type{
                    color: #FD2E28;
                  }
                  &:last-of-type{
                    color: #2E6BB1;
                  }
                }
              }
            }
            &:nth-of-type(3){
              .h4-right{
                float: right;
                font-family: PingFangSC-Regular;
                font-size: .28rem;
                color: #7D7D7D;
                letter-spacing: .0093rem;
                text-align: right;
                line-height: .4rem;
              }
              h4{
                .uncurrent{
                  color: #7D7D7D;
                }
              }
              > .container{
                margin-left: -.15rem;
                font-family: PingFangSC-Regular;
                font-size: .28rem;
                ul{
                  margin-bottom: .3rem;
                  li{
                    float: left;
                    &:nth-of-type(1){
                      width: 3.86rem;
                    }
                    &:nth-of-type(2){
                      width: 1.6rem;
                      text-align: right;
                    }
                    &:nth-of-type(3){
                      float: right;
                      width: 1.4rem;
                      text-align: right;
                      &.toUp{
                        margin-top: -.4rem;
                      }
                    }
                  }
                  &:first-of-type{
                    color: #7D7D7D;
                    line-height: .4rem;
                    letter-spacing: 0.93px;
                    margin-top: .04rem;
                  }
                }
                .tr{
                  p{
                    font-size: .26rem;
                    color: #2D2D2D;
                    letter-spacing: 0.93px;
                    line-height: 30px;
                    margin-bottom: .06rem;
                    width: 5rem;
                  }
                  li{
                    color: #2D2D2D;
                    &:nth-of-type(1){
                      line-height: .4rem;
                      div{
                        display: inline-block;
                        width: 2.8rem;
                        height: .26rem;
                        background-color: #F8F8F8;
                        vertical-align: middle;
                        i{
                          display: block;
                          width: 15%;
                          height: 100%;
                          opacity: 0.2;
                          background-color: #0074E1;
                        }
                      }
                      span{
                        vertical-align: middle;
                        color: #2E6BB1;
                        font-size: .22rem;
                      }
                    }
                  }
                  &.red{
                    li:nth-of-type(1){
                      div{
                        i{
                          background-color: #FD2E28;
                          opacity: 1;
                        }
                      }
                      span{
                        color: #FD2E28;
                      }
                    }
                    li:nth-of-type(3){
                      color: #FD2E28;
                    }
                  }
                  &.green{
                    li:nth-of-type(1){
                      div{
                        i{
                          background-color: #46B053;
                          opacity: 1;
                        }
                      }
                      span{
                        color: #46B053;
                      }
                    }
                    li:nth-of-type(3){
                      color: #46B053;
                    }
                  }
                }
              }
            }
          }
        }
        > .finance{
          > div{
            ul{
              font-family: PingFangSC-Regular;
              font-size: .28rem;
              color: #7D7D7D;
              letter-spacing: .0093rem;
              line-height: .48rem;
              &:first-of-type{
                float: left;
                width: 3.5rem;
              }
              &:last-of-type{
                padding-left: 3.5rem;
                color: #2D2D2D;
                text-align: right;
              }
            }
          }
        }
        > p{
          padding: .2rem .3rem .4rem;
          background-color: #F6F6F6;
          font-family: PingFangSC-Regular;
          font-size: .24rem;
          color: #7D7D7D;
          letter-spacing: .008rem;
          line-height: .4rem;
        }
      }
    }
    .none{
      div{
        width: 3.43rem;
        height: 2.15rem;
        margin: .58rem auto 0;
      }
      p{
        margin: .2rem 0 .58rem 0;
        font-family: PingFangSC-Regular;
        font-size: .28rem;
        color: #7D7D7D;
        letter-spacing: .0093rem;
        text-align: center;
        line-height: .4rem;
      }
    }
  }
}
</style>
