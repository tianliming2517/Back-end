<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
      <el-input v-model="dataForm.userName" placeholder="用户名" clearable></el-input>
    </el-form-item>
      <el-form-item>
        <el-input
          v-model="dataForm.release"
          :disabled="true">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.fromOrderId" placeholder="订单编号" clearable></el-input>
      </el-form-item>
<!--      <el-form-item>-->
<!--        <el-input v-model="dataForm.assetType" placeholder="资产类型" clearable></el-input>-->
<!--      </el-form-item>-->
      <el-select v-model="dataForm.assetType" clearable placeholder="资产类型">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-form-item>
        <el-button @click="getDataList(1)">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>


      <el-table-column
        prop="userName"
        header-align="center"
        align="center"
        label="用户名">
      </el-table-column>


      <el-table-column
        prop="releaseAvailableAmount"
        header-align="center"
        align="center"
        label="可用资产释放量">
      </el-table-column>
      <el-table-column
        prop="releaseLockAmount"
        header-align="center"
        align="center"
        label="基金资产释放量">
      </el-table-column>


      <el-table-column
        prop="releaseType"
        header-align="center"
        align="center"
        :formatter="releaseType"
        label="释放方式">

      </el-table-column>
      <el-table-column
        prop="fromOrderId"
        header-align="center"
        align="center"
        width="250"
        label="订单编号">
      </el-table-column>
      <el-table-column
        prop="assetType"
        header-align="center"
        align="center"
        :formatter="assetType"
        label="资产类型">
      </el-table-column>
      <el-table-column
        prop="dUnit"
        header-align="center"
        align="center"
        label="D资产单价(兑USDT)">
      </el-table-column>

      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        width="160"
        label="创建时间">
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
  </div>
</template>

<script>
  export default {
    data () {
      return {
        dataForm: {
          key: '',
          release:'对碰释放'
        },
        options: [{
          value: '1',
          label: 'A资产'
        },{
          value: '2',
          label: '可用D资产'
        },{
          value: '3',
          label: '基金D资产'
        },{
          value: '4',
          label: 'S资产'
        },{
          value: '5',
          label: '可用S资产'
        },{
          value: '6',
          label: '基金S资产'
        },{
          value: '7',
          label: 'DS资产'
        }],
        release: [{
          value: '1',
          label: '静态释放'
        },{
          value: '2',
          label: '直推奖励'
        },{
          value: '3',
          label: '对碰释放'
        },{
          value: '4',
          label: '极差奖励'
        }],
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false
      }
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList (id) {
        if(id!=undefined){
          this.pageIndex=id;
        }
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/api/asset/release/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'userName': this.dataForm.userName,
            'releaseType': 3,
            'fromOrderId': this.dataForm.fromOrderId,
            'assetType': this.dataForm.assetType
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list
            this.totalPage = data.page.totalCount
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      releaseType: function (row, column, value) {
          return '对碰释放'
      },
      assetType: function (row, column, value) {
        if (value == '1')
          return 'A资产'
        if (value == '2')
          return '可用D资产'
        if (value == '3')
          return '基金D资产'
        if (value == '4')
          return 'S资产'
        if (value == '5')
          return '可用S资产'
        if (value == '6')
          return '基金S资产'
        else if (value == '7')
          return 'DS资产'
      }
    }
  }
</script>
