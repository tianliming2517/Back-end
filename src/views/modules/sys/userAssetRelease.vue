<template>
  <div class="warp">
    <button class="btn btn1" @click="aAssetRelease">释放当日A资产</button>
    <button class="btn btn2"@click="oldLockAssetRelease">释放当日老锁仓资产</button>
  </div>
</template>


<script>
  export default {
    activated () {
      this.getDataList()
    },
    methods: {
      aAssetRelease () {
        this.$http({
          url: this.$http.adornUrl(`/api/asset/release/aAssetRelease`),
          method: 'post'
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message.success('用户今日A资产释放成功')
            this.getDataList()
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      oldLockAssetRelease () {
        this.$http({
          url: this.$http.adornUrl(`/api/asset/release/oldLockAssetRelease/`),
          method: 'post'
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message.success('用户今日老锁仓资产释放成功')
            this.getDataList()
          } else {
            this.$message.error(data.msg)
          }
        })
      }
    }
  }
</script>



<style>
  .warp{
    width: 300px;
    height: 100px;
    position: relative;
  }
  .btn{
    width: 300px;
    height: 60px;
    background-color: #00b7ee;
    border-radius: 10px;
    color: #fff;
    font-size: 16px;
    text-align: center;
    line-height: 30px;
  }
  .btn1{
    position: absolute;
    left: 10px;
    top: 10px;
  }
  .btn2{

    position: absolute;
    left: 450px;
    top: 10px;
  }
</style>
