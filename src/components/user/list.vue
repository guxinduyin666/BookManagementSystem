<template>
    <el-row class="warp">
        <el-col :span="24" class="warp-breadcrum">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
                <el-breadcrumb-item>用户列表</el-breadcrumb-item>
            </el-breadcrumb>
        </el-col>

        <el-col :span="24" class="warp-main" v-loading="loading" element-loading-text="拼命加载中">
            <!--工具条-->
            <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                <el-form :inline="true" :model="filters">
                    <el-form-item>
                        <el-input v-model="filters.name" placeholder="用户名/姓名/昵称" style="min-width: 240px;" @keyup.enter.native="handleSearch"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="handleSearch">查询</el-button>
                        <el-button type="primary" @click="showAddDialog" v-if="nickname=='系统管理员'">添加</el-button>
                    </el-form-item>
                </el-form>
            </el-col>

            <!--列表-->
            <el-table :data="users" highlight-current-row v-loading="loading" style="width: 100%;">
                <el-table-column type="index" width="60">
                </el-table-column>
                <el-table-column prop="name" label="姓名" width="120" sortable>
                </el-table-column>
                <el-table-column prop="nickname" label="角色" width="120" sortable>
                </el-table-column>
                <el-table-column prop="sex" label="性别" width="100" :formatter="formatSex" sortable>
                </el-table-column>
                <el-table-column prop="email" label="邮箱" min-width="160" sortable>
                </el-table-column>
                <el-table-column prop="addr" label="地址" sortable>
                </el-table-column>
                <el-table-column label="操作" width="150">
                    <template slot-scope="scope">
                        <el-button size="small" :disabled="nickname!='系统管理员'" @click="showAddDialog(scope.$index,scope.row)">编辑</el-button>
                        <el-button type="danger" :disabled="nickname!='系统管理员'" @click="deleteUser(scope.$index,scope.row)" size="small">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--工具条-->
            <el-col :span="24" class="toolbar" v-show="users.length>10">
                <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;">
                </el-pagination>
            </el-col>
            <!--新增界面-->
            <el-dialog :title="title" :visible.sync="addFormVisible" :close-on-click-modal="false">
                <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
                    <el-form-item label="用户名" prop="userName">
                        <el-input v-model="addForm.userName" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="姓名" prop="name">
                        <el-input v-model="addForm.name" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input type="password" v-model="addForm.password" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="角色" prop="role">
                        <el-radio-group v-model="addForm.role">
                            <el-radio :label="3" disabled>系统管理员</el-radio>
                            <el-radio :label="6" :disabled="addForm.role==3">普通管理员</el-radio>
                            <el-radio :label="9" :disabled="addForm.role==3">读者</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="性别" prop="gender">
                        <el-radio-group v-model="addForm.gender">
                            <el-radio :label="0">女</el-radio>
                            <el-radio :label="1">男</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="addForm.email" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="地址">
                        <el-input v-model="addForm.address"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="addFormVisible = false">取消</el-button>
                    <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
                </div>
            </el-dialog>
        </el-col>
    </el-row>
</template>

<script>
import API from "../../api/api_user";

export default {
    props: ["nickname"],
    data() {
        return {
            filters: {
                name: ""
            },
            loading: false,
            users: [],
            total: 0,
            page: 1,
            limit: 10,
            title: "新增角色",
            loading: false,
            //新增相关数据
            addFormVisible: false, //新增界面是否显示
            addLoading: false,
            addFormRules: {
                userName: [
                    { required: true, message: "请输入用户名", trigger: "blur" }
                ],
                role: [
                    { required: true, message: "请选择角色", trigger: "blur" }
                ],
                password: [
                    { required: true, message: "请输入密码", trigger: "blur" }
                ],
                email: [
                    { required: true, message: "请输入邮箱", trigger: "blur" }
                ]
            },
            addForm: {
                isAdd: true,
                userName: "",
                name: "",
                password: "",
                role: 6,
                gender: 1,
                email: "",
                address: ""
            }
        };
    },
    methods: {
        //性别显示转换
        formatSex: function(row, column) {
            return row.sex == 1 ? "男" : row.sex == 0 ? "女" : "未知";
        },
        handleCurrentChange(val) {
            this.page = val;
            this.search();
        },
        showAddDialog(index, rowData) {
            this.addFormVisible = true;
            if (rowData) {
                this.title = "修改角色信息";
                this.addForm = {
                    isAdd: false,
                    userName: rowData.username,
                    name: rowData.name,
                    password: rowData.password,
                    gender: rowData.sex,
                    email: rowData.email,
                    address: rowData.addr,
                    id: rowData.id
                };
                if (rowData.nickname === "系统管理员") {
                    this.$set(this.addForm, "role", 3);
                } else if (rowData.nickname === "普通管理员") {
                    this.$set(this.addForm, "role", 6);
                } else {
                    this.$set(this.addForm, "role", 9);
                }
            } else {
                this.addForm = {
                    isAdd: true,
                    userName: "",
                    name: "",
                    password: "",
                    role: 6,
                    gender: 1,
                    email: "",
                    address: ""
                };
            }
        },
        addSubmit() {
            let that = this;
            this.$refs.addForm.validate(valid => {
                if (valid) {
                    this.addForm.role == 6
                        ? (this.addForm.role = "普通管理员")
                        : (this.addForm.role = "读者");
                    that.loading = true;
                    let para = Object.assign({}, this.addForm);
                    // 新增，调用添加角色接口
                    if (para.isAdd) {
                        API.add(para)
                            .then(
                                function(result) {
                                    that.loading = false;
                                    if (
                                        result &&
                                        parseInt(result.errcode) === 0
                                    ) {
                                        that.$message.success({
                                            showClose: true,
                                            message: "新增成功",
                                            duration: 2000
                                        });
                                        that.$refs["addForm"].resetFields();
                                        that.addFormVisible = false;
                                        that.search();
                                    } else {
                                        that.loading = false;
                                        that.$message.error({
                                            showClose: true,
                                            message: "新增失败",
                                            duration: 2000
                                        });
                                    }
                                },
                                function(error) {
                                    that.loading = false;
                                    that.$message.error({
                                        showClose: true,
                                        message: err.toString(),
                                        duration: 2000
                                    });
                                }
                            )
                            .catch(function(error) {
                                that.loading = false;
                                console.log(error);
                                that.$message.error({
                                    showClose: true,
                                    message: "请求出现异常",
                                    duration: 2000
                                });
                            });
                    } else {
                        // 更新，调用修改角色信息接口
                        API.put(para)
                            .then(
                                function(result) {
                                    that.loading = false;
                                    if (
                                        result &&
                                        parseInt(result.errcode) === 0
                                    ) {
                                        that.$message.success({
                                            showClose: true,
                                            message: "修改成功",
                                            duration: 2000
                                        });
                                        that.$refs["addForm"].resetFields();
                                        that.addFormVisible = false;
                                        that.search();
                                    } else {
                                        that.loading = false;
                                        that.$message.error({
                                            showClose: true,
                                            message: "修改失败",
                                            duration: 2000
                                        });
                                    }
                                },
                                function(error) {
                                    that.loading = false;
                                    that.$message.error({
                                        showClose: true,
                                        message: err.toString(),
                                        duration: 2000
                                    });
                                }
                            )
                            .catch(function(error) {
                                that.loading = false;
                                console.log(error);
                                that.$message.error({
                                    showClose: true,
                                    message: "请求出现异常",
                                    duration: 2000
                                });
                            });
                    }
                }
            });
        },
        deleteUser(index, rowData) {
            let that = this;
            this.$confirm("确认删除该记录吗?", "提示", {
                type: "warning"
            }).then(() => {
                that.loading = true;
                API.remove(rowData.id)
                    .then(
                        function(result) {
                            that.loading = false;
                            if (result && parseInt(result.errcode) === 0) {
                                that.$message.success({
                                    showClose: true,
                                    message: "删除成功",
                                    duration: 2000
                                });
                                that.search();
                            } else {
                                that.$message.error({
                                    showClose: true,
                                    message: "删除失败",
                                    duration: 2000
                                });
                            }
                        },
                        function(error) {
                            that.$message.error({
                                showClose: true,
                                message: err.toString(),
                                duration: 2000
                            });
                        }
                    )
                    .catch(function(error) {
                        that.loading = false;
                        console.log(error);
                        that.$message.error({
                            showClose: true,
                            message: "请求出现异常",
                            duration: 2000
                        });
                    });
            });
        },
        handleSearch() {
            this.total = 0;
            this.page = 1;
            this.search();
        },
        //获取用户列表
        search: function() {
            let that = this;
            let params = {
                page: that.page,
                limit: 10,
                name: that.filters.name
            };
            that.loading = true;
            API.findList(params)
                .then(
                    function(result) {
                        that.loading = false;
                        if (result && result.users) {
                            that.total = result.total;
                            that.users = result.users;
                        }
                    },
                    function(err) {
                        that.loading = false;
                        that.$message.error({
                            showClose: true,
                            message: err.toString(),
                            duration: 2000
                        });
                    }
                )
                .catch(function(error) {
                    that.loading = false;
                    console.log(error);
                    that.$message.error({
                        showClose: true,
                        message: "请求出现异常",
                        duration: 2000
                    });
                });
        }
    },
    mounted() {
        this.handleSearch();
    }
};
</script>

<style scoped>
</style>
