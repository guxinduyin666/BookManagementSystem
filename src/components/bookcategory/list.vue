<template>
	<el-row class="warp">
		<el-col :span="24" class="warp-breadcrum">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item :to="{ path: '/home' }"><b>首页</b></el-breadcrumb-item>
				<el-breadcrumb-item>图书管理</el-breadcrumb-item>
				<el-breadcrumb-item>图书借还</el-breadcrumb-item>
			</el-breadcrumb>
		</el-col>

		<!--列表-->
		<el-table :data="books" highlight-current-row style="width: 100%;">
			<el-table-column type="selection" width="55"></el-table-column>
			<el-table-column type="index" width="60"></el-table-column>
			<el-table-column type="expand">
				<template slot-scope="props">
					<el-form label-position="left" inline class="demo-table-expand">
						<el-form-item label="[图书简介]">
							<span>{{ props.row.description }}</span>
						</el-form-item>
					</el-form>
				</template>
			</el-table-column>
			<el-table-column prop="name" label="书名" sortable></el-table-column>
			<el-table-column prop="author" label="作者" width="100" sortable></el-table-column>
			<el-table-column prop="publishAt" label="出版日期" width="150" sortable></el-table-column>
			<el-table-column label="操作" width="150">
				<template slot-scope="scope">
					<el-button size="small" @click="returnBook(scope.$index,scope.row)">还书</el-button>
					<el-button size="small" @click="lend(scope.$index,scope.row)">续借</el-button>
				</template>
			</el-table-column>
		</el-table>
	</el-row>
</template>
<script>
import API from "../../api/api_book";
export default {
    props: ["username"],
    data() {
        return {
            books: []
        };
    },
    methods: {
        queryLendBooks(username) {
            let params = { username: username };
            let that = this;
            API.queryLendBooks(params).then(
                function(result) {
                    that.books = result.books;
                },
                function(error) {
                    that.$message.error({
                        showClose: true,
                        message: err.toString(),
                        duration: 2000
                    });
                }
            );
        },
        returnBook(index, book) {
            debugger;
            let params = {
                username: this.username,
                book: book
            };
            let that = this;
            API.returnBook(params).then(
                function(result) {
                    that.books = result.books;
                    that.$message.success({
                        showClose: true,
                        message: "还书成功",
                        duration: 1500
                    });
                },
                function() {}
            );
        },
        lend() {
            console.log("lend");
        }
    },
    mounted() {
        this.queryLendBooks(this.username);
    }
};
</script>
<style>
.el-table .cell {
    text-align: center;
}
</style>

