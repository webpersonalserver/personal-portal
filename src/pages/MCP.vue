<template>
    <div class="portal-pages-mcp-container">
        <div class="mcp-header">
            <h2 class="mcp-title">YHSG CRM</h2>
            <a-button type="primary" @click="handleAdd">
                <template #icon>
                    <icon-plus />
                </template>
                新增
            </a-button>
        </div>

        <div class="mcp-filter">
            <a-form :model="filterForm" layout="inline">
                <a-form-item field="keyword" label="关键词">
                    <a-input
                        v-model="filterForm.keyword"
                        placeholder="请输入关键词"
                        allow-clear
                    />
                </a-form-item>
                <a-form-item field="status" label="状态">
                    <a-select
                        v-model="filterForm.status"
                        placeholder="请选择状态"
                        allow-clear
                        style="width: 150px"
                    >
                        <a-option value="active">启用</a-option>
                        <a-option value="inactive">禁用</a-option>
                    </a-select>
                </a-form-item>
                <a-form-item>
                    <a-button type="primary" @click="handleSearch">查询</a-button>
                    <a-button @click="handleReset">重置</a-button>
                </a-form-item>
            </a-form>
        </div>

        <div class="mcp-content">
            <a-table
                :columns="columns"
                :data="tableData"
                :pagination="pagination"
                :loading="loading"
                @page-change="handlePageChange"
                @page-size-change="handlePageSizeChange"
            >
                <template #status="{ record }">
                    <a-tag :color="record.status === 'active' ? 'green' : 'red'">
                        {{ record.status === 'active' ? '启用' : '禁用' }}
                    </a-tag>
                </template>
                <template #action="{ record }">
                    <a-button type="text" size="small" @click="handleEdit(record)">
                        编辑
                    </a-button>
                    <a-button
                        type="text"
                        size="small"
                        status="danger"
                        @click="handleDelete(record)"
                    >
                        删除
                    </a-button>
                </template>
            </a-table>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { Message } from "@arco-design/web-vue";
import { IconPlus } from "@arco-design/web-vue/es/icon";

// 筛选表单
const filterForm = reactive({
    keyword: "",
    status: ""
});

// 表格列配置
const columns = [
    {
        title: "ID",
        dataIndex: "id",
        width: 80
    },
    {
        title: "名称",
        dataIndex: "name",
        width: 150
    },
    {
        title: "描述",
        dataIndex: "description",
        ellipsis: true
    },
    {
        title: "状态",
        dataIndex: "status",
        slotName: "status",
        width: 100
    },
    {
        title: "创建时间",
        dataIndex: "createTime",
        width: 180
    },
    {
        title: "操作",
        slotName: "action",
        width: 120,
        fixed: "right"
    }
];

// 表格数据
const tableData = ref([]);
const loading = ref(false);

// 分页配置
const pagination = reactive({
    current: 1,
    pageSize: 10,
    total: 0,
    showTotal: true,
    showPageSize: true
});

// 获取数据
const fetchData = async () => {
    loading.value = true;
    try {
        // TODO: 替换为实际的 API 调用
        // 模拟数据
        await new Promise(resolve => {
            window.setTimeout(resolve, 500);
        });
        tableData.value = [
            {
                id: 1,
                name: "示例数据 1",
                description: "这是一个示例描述信息",
                status: "active",
                createTime: "2024-01-01 10:00:00"
            },
            {
                id: 2,
                name: "示例数据 2",
                description: "这是另一个示例描述信息",
                status: "inactive",
                createTime: "2024-01-02 11:00:00"
            }
        ];
        pagination.total = 2;
    } catch {
        Message.error("获取数据失败");
    } finally {
        loading.value = false;
    }
};

// 搜索
const handleSearch = () => {
    pagination.current = 1;
    fetchData();
};

// 重置
const handleReset = () => {
    filterForm.keyword = "";
    filterForm.status = "";
    handleSearch();
};

// 新增
const handleAdd = () => {
    Message.info("新增功能待实现");
};

// 编辑
const handleEdit = record => {
    Message.info(`编辑: ${record.name}`);
};

// 删除
const handleDelete = record => {
    Message.warning(`删除: ${record.name}`);
};

// 分页变化
const handlePageChange = page => {
    pagination.current = page;
    fetchData();
};

// 每页数量变化
const handlePageSizeChange = size => {
    pagination.pageSize = size;
    pagination.current = 1;
    fetchData();
};

// 初始化
onMounted(() => {
    fetchData();
});
</script>

<style lang="less" scoped>
.portal-pages-mcp-container {
    width: 100%;
    height: 100%;
    overflow: hidden;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    padding: 20px;
    background-color: #f5f5f5;

    .mcp-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        padding: 16px 20px;
        background-color: #fff;
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

        .mcp-title {
            margin: 0;
            font-size: 20px;
            font-weight: 600;
            color: #1d2129;
        }
    }

    .mcp-filter {
        margin-bottom: 20px;
        padding: 16px 20px;
        background-color: #fff;
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .mcp-content {
        flex: 1;
        overflow: auto;
        padding: 16px 20px;
        background-color: #fff;
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
}
</style>
