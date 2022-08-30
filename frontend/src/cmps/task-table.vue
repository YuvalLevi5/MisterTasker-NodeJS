<template>
  <div class="table-container">
    <table class="task-table">
      <thead>
        <tr>
          <th @click="$emit('sortChanged', 'title')">
            Title
            <span class="sort-icon" v-if="sortTxt === 'title'">{{
                sortDirArrow
            }}</span>
          </th>
          <th @click="$emit('sortChanged', 'importance')">
            Importance
            <span class="sort-icon" v-if="sortTxt === 'importance'">{{
                sortDirArrow
            }}</span>
          </th>
          <th @click="$emit('sortChanged', 'status')">
            Status
            <span class="sort-icon" v-if="sortTxt === 'status'">{{
                sortDirArrow
            }}</span>
          </th>
          <th @click="$emit('sortChanged', 'triesCount')">
            Tries Count
            <span class="sort-icon" v-if="sortTxt === 'triesCount'">{{
                sortDirArrow
            }}</span>
          </th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody v-if="tasks">
        <template v-for="task in tasks" :key="task._id">
          <task-table-row :task="task" @performTask="performTask" @click.native="toggleDescription(task._id)"
            @removeTask="removeTask"></task-table-row>
          <tr class="opened-tr" :key="task._id + '1'" v-if="opened.includes(task._id)">
            <td colspan="5">
              <div>
                <h4>Description:</h4>
                <p contenteditable @blur="descriptionChanged(task._id, $event.target.innerText)">
                  {{ task.description }}
                </p>
              </div>
              <div v-if="task.errors.length">
                <h4>Errors:</h4>
                <span v-for="(err, idx) in task.errors" :key="idx">{{ err }} <span
                    v-if="idx < task.errors.length - 1">,</span>
                </span>
              </div>
              <div class="more-info">
                Last tried at: {{ task.updatedAt || 'N/A' }} | Created at:
                {{ task.createdAt }} | Done at: {{ task.doneAt || 'N/A' }}
              </div>
              <button v-if="!task.doneAt" class="btn delete details" @click="removeTask(task._id)">
                Delete
              </button>
            </td>
          </tr>
        </template>
        <tr>
          <td>
            <label>Task title: <input type="text" v-model="newTask.title" /></label>
          </td>
          <td colspan="3">
            <label>Importance:
              <input v-model="newTask.importance" type="number" min="1" max="4" /></label>
          </td>
          <td class="save-task-btn"><button class="btn save" @click="addTask">Save</button></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import taskTableRow from './task-table-row.vue';
import { taskService } from '../services/task.service.js';
export default {
  components: {
    taskTableRow,
  },
  props: {
    tasks: {
      type: Array,
      required: true,
    },
    sortTxt: {
      type: String,
      default: 'title',
    },
    sortDir: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      newTask: taskService.getEmptyTask(),
      opened: [],
    };
  },
  computed: {
    sortDirArrow() {
      return this.sortDir === 1 ? '↓' : '↑';
    },
  },
  methods: {
    descriptionChanged(taskId, desc) {
      const task = this.tasks.find((task) => task._id === taskId);
      if (task.description === desc) return;
      task.description = desc;
      this.$emit('updateTask', task);
    },
    toggleDescription(id) {
      const index = this.opened.indexOf(id);
      if (index > -1) {
        this.opened.splice(index, 1);
      } else {
        this.opened.push(id);
      }
    },
    performTask(task) {
      this.$emit('performTask', task);
    },
    removeTask(taskId) {
      this.$emit('removeTask', taskId);
    },
    addTask() {
      if (!this.newTask.title) {
        alert('Title can not be empty');
        return;
      }

      this.$emit('addTask', { ...this.newTask });
      this.newTask = taskService.getEmptyTask();
    },
  },
};
</script>
