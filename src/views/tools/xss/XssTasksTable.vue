<template>
  <div>
    <Spin size="large" fix v-if="spinShow"></Spin>
    <table class="table mb-0">
      <thead class="bg-light">
      <tr>
        <th scope="col" class="border-0 text-center"><font size="2">#</font></th>
        <th scope="col" class="border-0"><font size="2">Name</font></th>
        <th scope="col" class="border-0"><font size="2">Type</font></th>
        <th scope="col" class="border-0"><font size="2">Author</font></th>
        <th scope="col" class="border-0"><font size="2">Date</font></th>
        <th scope="col" class="border-0 text-center"><font size="2">Actions</font></th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(item, index) in xssTaskItems">
        <td class="text-center">{{ index + 1 }}</td>
        <td>{{ item.name }}</td>
        <td>{{ item.type }}</td>
        <td>{{ item.author }}</td>
        <td>{{ item.date }}</td>
        <td class="text-center">
          <Tooltip placement="top" content="Trash" theme="light">
            <Icon title="delete poc" size="21" type="md-trash" />
          </Tooltip>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  export default {
    name: "XssTasksTable",
    data() {
      return {
        spinShow: true,
        items: [],
        xssTaskItems: [],
        pageSize: 10,
        pageCurrent: 1,
      }
    },
    mounted() {
      let _start = ( this.pageCurrent - 1 ) * this.pageSize;
      let _end = this.pageCurrent * this.pageSize;
      this.xssTaskItems = this.items.slice(_start,_end);
      this.spinShow = false;
    }
  }
</script>

<style scoped>

</style>
