<template>
  <tr>
    <td>
      {{ task.title }}
    </td>
    <td class="importance-td">{{ task.importance }}</td>
    <td :class="statusClass" class="status-td">{{ status }}</td>
    <td class="tries-td">{{ task.triesCount }}</td>
    <td class="action-td">
      <button v-if="showBtn" class="btn action" @click.stop="performTask(task)">{{ actionTxt }}</button>
      <button v-if="task.status === 'done'" class="btn delete" @click.stop="removeTask(task._id)">Delete</button>
    </td>
  </tr>
</template>

<script>
  const statusMap = {
    'done': 'Done',
    'fail': 'Fail',
    'running': 'Running'
  }
export default {
  props: {
    task: Object,
  },
  computed: {
    status() {
      return statusMap[this.task.status]
    },
    statusClass() {
      return this.status && this.status.toLocaleLowerCase()
    },
    actionTxt() {
      var status = this.task.status;
      return status === "fail" ? "Retry" : "Start";
    },
    showBtn() {
      return this.task.status !== "done" && this.task.status !== "running";
    },
  },
  methods: {
    performTask(task) {
      this.$emit("performTask", task);
    },
    removeTask(taskId){
      this.$emit('removeTask',taskId)
    }
  },
};
</script>
