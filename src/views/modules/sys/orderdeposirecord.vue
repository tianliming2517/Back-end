<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.userName" placeholder="用户名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.orderId" placeholder="订单编号" clearable></el-input>
      </el-form-item>

      <el-date-picker
        v-model="dataForm.createTime"
        type="daterange"
        start-placeholder="订单创建日期"
        end-placeholder="订单结束日期"
        value-format="yyyy-MM-dd">
      </el-date-picker>

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
      <!--      <el-table-column-->
      <!--        prop="id"-->
      <!--        header-align="center"-->
      <!--        align="center"-->
      <!--        label="主键ID">-->
      <!--      </el-table-column>-->
      <el-table-column
        prop="userName"
        header-align="center"
        align="center"
        label="用户名">
      </el-table-column>
      <el-table-column
        prop="orderId"
        header-align="center"
        align="center"
        width="250"
        label="订单编号">
      </el-table-column>
      <el-table-column
        prop="amount"
        header-align="center"
        align="center"
        label="订单DS金额">
      </el-table-column>


      <el-table-column
        prop="aamount"
        header-align="center"
        align="center"
        label="订单置换A资产数量">
      </el-table-column>


      <el-table-column
        prop="samount"
        header-align="center"
        align="center"
        label="订单置换S资产数量">
      </el-table-column>
      <el-table-column
        prop="aexchangePercent"
        header-align="center"
        align="center"
        label="DS置换A资产比例">
      </el-table-column>
      <el-table-column
        prop="sexchangePercent"
        header-align="center"
        align="center"
        label="DS置换S资产比例">
      </el-table-column>
      <el-table-column
        prop="serviceFee"
        header-align="center"
        align="center"
        label="手续费">
      </el-table-column>
      <el-table-column
        prop="serviceFeeRate"
        header-align="center"
        align="center"
        label="手续费率">
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
  </div>
</template>

<script>

  export default {
    data () {
      return {
        dataForm: {
          key: ''
        },
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
        if (id != undefined) {
          this.pageIndex = id
        }
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/api/order/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'userName': this.dataForm.userName,
            'orderId': this.dataForm.orderId,
            'beginTime': this.dataForm.createTime != null && this.dataForm.createTime != '' ? this.dataForm.createTime[0] : '',
            'endTime': this.dataForm.createTime != null && this.dataForm.createTime != '' ? this.dataForm.createTime[1] : ''
          })
        }).then(({data}) => {
          console.log(data)
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
      }
    }
  }
</script>
