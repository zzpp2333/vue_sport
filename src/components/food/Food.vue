<template>
    <div>营养配餐
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-for="(item, index) in $router.currentRoute.matched" :key="index">{{ item.meta.title }}</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row>
                <el-col>
                    <!-- 搜索 -->
                    <el-input placeholder="请输入搜索内容" v-model="queryInfo.query" clearable @clear="fetchData">
                        <el-button slot="append" icon="el-icon-search" @click="fetchData"/>
                    </el-input>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="10">
                    <div>所有菜品</div>
                    <el-table :data="foodData" class="to-select" border stripe @selection-change="handleSelectionChange">
                        <el-table-column type="selection" width="40"></el-table-column>
                        <el-table-column v-for="(item, index) in tableKey" :key="index" :prop="item.value" :label="item.name" show-overflow-tooltip></el-table-column>
                    </el-table>
                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="queryInfo.pageStart"
                        :page-sizes="[5, 10, 20, 50]"
                        :page-size="queryInfo.pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total"/>
                </el-col>

                <el-col :span="4">
                    <div class="select-btn">
                        <el-button type="primary" @click="selectItems">想吃>></el-button>
                    </div>
                </el-col>

                <el-col :span="10">
                    <div>今日食谱</div>
                    <el-table :data="resultData" class="selected" border stripe :summary-method="getSummaries" show-summary>
                        <el-table-column v-for="(item, index) in tableKey" :key="index" :prop="item.value" :label="item.name" :width="item.width" show-overflow-tooltip></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button size="mini" type="danger" @click.native.prevent="handleDelete(scope.$index, scope.row.resultDate)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-col>
            </el-row>
        </el-card>

        <!-- transfer框只能显示一列数据 所以改用table实现 -->
        <!-- <el-transfer
            filterable
            :filter-method="filterMethod"
            filter-placeholder="请输入食物类型"
            v-model="value"
            :data="transferData"
            @change="handleChange">
        </el-transfer> -->
    </div>
</template>

<script>
export default {
    data() {
        return{
            // transferData: [], // Transfer数据源 array[{label key disabled}]
            // value: [], // 绑定值 根据type获取food
            // filterMethod(query, item) {
            //     return item.label.indexOf(query) > -1; // query中是否含有item的label
            // },
            queryInfo: {
                query: '',
                pageStart: 1,
                pageSize: 5
            },
            // foodType: [],
            total: 0,
            foodData: [],  // 左侧待选区域的值
            multipleSelection: [], // 复选框选中的值
            resultData: [], // 右侧已选区域的值
            resetData: [], // 搜索完成后 重置左侧待选区域
            filterBeforeData: [], // 存放搜索前的数据
            tableKey: [{
                name: '食物名称',
                value: 'name',
                label: 100,
            },{
                name: '食物类别',
                value: 'type',
                label: 100,
            },{
                name: '营养元素',
                value: 'nutrient',
                label: 100,
            },{
                name: '热量',
                value: 'calories',
                label: 100,
            },{
                name: '蛋白质',
                value: 'protein',
                label: 100,
            },{
                name: '油脂',
                value: 'fat',
                label: 100,
            },{
                name: '碳水化物',
                value: 'carbohydrate',
                label: 100,
            },{
                name: '膳食纤维',
                value: 'dietaryFiber',
                label: 100,
            }],
            sumKeys: ['calories', 'protein', 'fat', 'carbohydrate', 'dietaryFiber'],
            
        }
    },
    created(){
        this.fetchData();
    },
    computed: {
        sumAmount(){
            this.sumKeys.forEach((key, index) => {
                this.resultData.map(row => row[key]).reduce((acc, cur) => (parseFloat(cur) + acc), 0);
            });
        }
    },
    methods:{
        fetchData(){
            this.$ajax.post('/food/getFoods', this.queryInfo).then((res) => {
                console.log('getFoods', res);
                if (!res.data.flag) return this.$message.error(res.data.message);
                console.log('resultData', this.resultData);
                this.foodData = this.overlap(res.data.rows, this.resultData);
                this.total = res.data.total;
            });
            /** 初始化查询菜品分类 */
            // this.$ajax.get('/food/type/all').then((res) => {
            //     if (!res.data.flag) return this.$message.error(res.data.message);
            //     console.log('type/data', res.data.data);
            //     this.foodType = res.data.data;  // id type icon
            //     const data = [];
            //     this.foodType.forEach((item, index) => {
            //         data.push({
            //             label: item.title,
            //             key: index,
            //             id: item.id
            //         });
            //     });
            //     this.transferData = data;
            // });
        },
        // handleChange(value, direction, movedKeys){
        //     console.log(value, direction, movedKeys);
        //     // value 当前值（右侧值） direction（数据移动的方向） movedKeys（发生移动的数据key数组）
        //     if(direction === 'right'){

        //     }
        //     if(direction === 'left'){

        //     }
        // },
        handleDelete(index, row, resultData){
            this.resultData.splice(index, 1); // 右边已选择区域根据索引删除数据
            this.fetchData();
        },
        handleSelectionChange(val){
            this.multipleSelection = val;
        },
        selectItems:function() {
            // 将数组合并
            this.resultData.push.apply(this.resultData, this.multipleSelection);
            // 将获取的数据发送到父组件
            // this.$emit('dispatchData', this.resultData);
            // foodData = foodData - resultData
            this.foodData = this.overlap(this.foodData, this.resultData);
        },
        overlap:function(arr, arr2){ // return arr - arr2
            var arr3 = new Array();
            var index = 0, i = 0, j = 0;
            for(i = 0 ; i < arr.length ; ++i){
                var has = false;
                for(j = 0 ; j < arr2.length ; ++j){
                    if(arr[i].id === arr2[j].id){  // 通过id标识 数组元素是否重合
                        console.log('overlap', arr2[j].id);
                        has = true;
                        break;
                    }
                }
                if(!has){
                    arr3[index++] = arr[i];
                }
            }
            return arr3;
        },
        handleSizeChange(newPageSize) {
            this.queryInfo.pageSize = newPageSize;
            this.fetchData();
        },
        handleCurrentChange(newPageStart) {
            this.queryInfo.pageStart = newPageStart;
            this.fetchData();
        },
        getSummaries(param){
            const {columns, data} = param;
            console.log(columns, data, 'columns, data');
            const sums = []
            if(columns.length > 0){
                columns.forEach((column, index) => {
                    if([0].includes(index)){
                        sums[index] = "合计";
                    }else if(this.sumKeys.includes(column.property)){
                        let values = data.map((item) => Number(item[column.property]));
                        if(!values.every((value) => isNaN(value))){
                            sums[index] = values.reduce((prev, curr) => {
                                const value = Number(curr);
                                if(!isNaN(value)){
                                    let num = Number(prev) + Number(curr);
                                    return num.toFixed(2);
                                }else{
                                    return Number(prev).toFixed(2);
                                }
                            }, 0.0);
                        }
                    }else{
                        sums[index] = "-";
                    }
                });
            }
            return sums;
        },
    },
}
</script>

<style lang="less" scoped>
.to-select{
    width: 100%;
    margin-bottom: 0px;
}
.select-btn{
    margin-top: 100%;
    margin-left: 25%;
    margin-right: 25%;
}
.selected{
    width: 100%;
    margin-bottom: 0px;
}
</style>