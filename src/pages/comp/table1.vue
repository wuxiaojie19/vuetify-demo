<template>
  <v-app>
    <v-data-table
      :headers="headers"
      :items="items"
      :items-per-page="5"
      class="custom-data-table"
    >
      <!-- 自定义表头样式 -->
      <template #header="{ props }">
        <thead class="custom-header">
          <tr>
            <th
              v-for="header in props.headers"
              :key="header.title"
              class="text-uppercase font-weight-bold"
            >
              {{ header.title }}
            </th>
          </tr>
        </thead>
      </template>

      <!-- 自定义行样式 -->
      <template #item="{ item }">
        <tr class="custom-row">
          <td v-for="header in headers" :key="header.value">
            {{ item[header.value] }}
          </td>
        </tr>
      </template>
    </v-data-table>
  </v-app>
</template>

<script setup>
const headers = [
  { title: 'ID', value: 'id' },
  { title: 'NAME', value: 'name' },
  { title: 'ROLE', value: 'role' },
  { title: 'STATUS', value: 'status' },
];

const items = [
  { id: 1, name: 'John Doe', role: 'Developer', status: 'Active' },
  { id: 2, name: 'Jane Smith', role: 'Designer', status: 'Inactive' },
  { id: 3, name: 'Mike Johnson', role: 'Manager', status: 'Active' },
  // 更多数据...
];
</script>

<style>
/* 主色调定义 */
:root {
  --primary-color: #140a9a;
  --primary-light: #e8ebff;
  --primary-lighter: #f5f7ff;
}

/* 表格整体样式 */
.custom-data-table {
  border: 1px solid rgba(20, 10, 154, 0.2);
  border-radius: 4px;
  overflow: hidden;
}

/* 表头样式 */
.custom-header {
  background-color: var(--primary-color) !important;
}

.custom-header th {
  color: white !important;
  font-size: 0.875rem;
  letter-spacing: 0.5px;
}

/* 行样式 */
.custom-data-table .custom-row:nth-child(even) {
  background-color: var(--primary-lighter);
}

/* 悬停效果 */
.custom-data-table .custom-row:hover {
  background-color: var(--primary-light) !important;
  transition: background-color 0.2s;
}

/* 边框和分割线 */
.custom-data-table td,
.custom-data-table th {
  border-right: 1px solid #e0e0ff;
}

.custom-data-table td:last-child,
.custom-data-table th:last-child {
  border-right: none;
}

/* 分页器样式 */
.custom-data-table .v-data-table-footer {
  border-top: 1px solid #e0e0ff;
}
</style>
