<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">
          <b>首页</b>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">
      <section class="chart-container">
        <el-row>
          <el-col :span="8">
            <el-card :body-style="{ padding: '0px' }">
              <img src="../assets/images/forest.png" class="image">
              <div style="padding: 14px;">
                <span>只见树木不见森林</span>
                <div class="bottom clearfix">
                  <time class="time">{{ currentDate |data}}</time>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card :body-style="{ padding: '0px' }">
              <img src="../assets/images/sunrise.png" class="image">
              <div style="padding: 14px;">
                <span>夕阳无限好</span>
                <div class="bottom clearfix">
                  <time class="time">{{ currentDate |data}}</time>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card :body-style="{ padding: '0px' }">
              <img src="../assets/images/sunshine.png" class="image">
              <div style="padding: 14px;">
                <span>快乐生活每一天</span>
                <div class="bottom clearfix">
                  <time class="time">{{ currentDate |data}}</time>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="12">
            <div id="chartColumn" style="width:100%; height:400px;"></div>
          </el-col>
          <el-col :span="12">
            <div id="chartBar" style="width:100%; height:400px;"></div>
          </el-col>
          <el-col :span="12">
            <div id="chartLine" style="width:100%; height:400px;"></div>
          </el-col>
          <el-col :span="12">
            <div id="chartPie" style="width:100%; height:400px;"></div>
          </el-col>
          <el-col :span="24">
            <a href="http://echarts.baidu.com/examples.html" target="_blank" style="float: right;">more>></a>
          </el-col>
        </el-row>
      </section>

    </el-col>
  </el-row>
</template>
<style scoped>
.time {
    font-size: 13px;
    color: #999;
}

.bottom {
    margin-top: 13px;
    line-height: 12px;
}

.image {
    width: 100%;
    display: block;
}

.clearfix:before,
.clearfix:after {
    display: table;
    content: "";
}

.clearfix:after {
    clear: both;
}

.chart-container {
    width: 100%;
}
.chart-container .el-col {
    padding: 30px 20px;
}
.el-card:hover{
  transform: scale(1.1,1.1);
  -ms-transform: scale(1.1,1.1);	/* IE 9 */
  -webkit-transform: scale(1.1,1.1);	/* Safari 和 Chrome */
  -o-transform: scale(1.1,1.1);	/* Opera */
  -moz-transform: scale(1.1,1.1);	/* Firefox */
}
</style>

<script>
  import echarts from 'echarts'

  export default {
    data() {
      return {
        currentDate: new Date('2018-09-12 17:48:52'),
        chartColumn: null,
        chartBar: null,
        chartLine: null,
        chartPie: null
      };
    },
    filters: {
      data:function (input) {
          var d = new Date(input),
              year = d.getFullYear(),
              month = d.getMonth() + 1,
              day = d.getDate() <10 ? '0' + d.getDate() : '' + d.getDate(),
              hour = d.getHours(),
              minutes = d.getMinutes(),
              seconds = d.getSeconds();
          return  year+ '/' + month + '/' + day + ' ' + hour + ':' + minutes + ':' + seconds;
      }
    },
    mounted: function () {
      var _this = this;
      //基于准备好的dom，初始化echarts实例
      this.chartColumn = echarts.init(document.getElementById('chartColumn'));
      this.chartBar = echarts.init(document.getElementById('chartBar'));
      this.chartLine = echarts.init(document.getElementById('chartLine'));
      this.chartPie = echarts.init(document.getElementById('chartPie'));

      this.chartColumn.setOption({
        title: { text: '藏书分类' },
        tooltip: {},
        xAxis: {
          data: ["哲学", "文学", "医学", "药学", "史学", "艺术"]
        },
        yAxis: {},
        series: [{
          name: '藏书量',
          type: 'bar',
          data: [150, 230, 360, 200, 100, 80]
        }]
      });

      this.chartBar.setOption({
        title: {
          text: '借阅量',
          subtext: '近两年借阅量'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['2016年', '2017年']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.01]
        },
        yAxis: {
          type: 'category',
          data: ['医学', '药学', '文学', '史学', '哲学', '总借阅量(次)']
        },
        series: [
          {
            name: '2016年',
            type: 'bar',
            data: [18203, 23489, 29034, 104970, 131744, 630230]
          },
          {
            name: '2017年',
            type: 'bar',
            data: [19325, 23438, 31000, 121594, 134141, 681807]
          }
        ]
      });

      this.chartLine.setOption({
        title: {
          text: '各年级借阅情况'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['大一', '大二', '大三']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '大一',
            type: 'line',
            stack: '总量',
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: '大二',
            type: 'line',
            stack: '总量',
            data: [220, 182, 191, 234, 290, 330, 310]
          },
          {
            name: '大三',
            type: 'line',
            stack: '总量',
            data: [820, 932, 901, 934, 1290, 1330, 1320]
          }
        ]
      });

      this.chartPie.setOption({
        title: {
          text: '藏书分类',
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: ["哲学", "文学", "医学", "药学", "史学", "艺术"]
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: [
              { value: 150, name: '哲学' },
              { value: 230, name: '文学' },
              { value: 360, name: '医学' },
              { value: 200, name: '药学' },
              { value: 100, name: '史学' },
              { value: 80, name: '艺术' }
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      });
    }
  }
</script>
