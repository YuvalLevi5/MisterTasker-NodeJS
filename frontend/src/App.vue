<template>
  <div id="app">
    <header class="title">Mister Tasker</header>
    <div class="btns-container">
      <button class="btn" @click="generateTasks">Generate Tasks</button>
      <button class="btn" @click="clearTasks">Clear Tasks</button>
      <button class="btn" @click="showModal = true">Create new task</button>
      <button @click="toggleWorker" class="btn toggle">
        <span>{{ isRunning ? 'stop' : 'start' }}</span> task worker
      </button>
    </div>
    <div class="filters-container">
      <multi-checkbox :options="['1', '2', '3', '4']" @importance="addImportance" @change="filtersUpdated"
        v-model="filterBy.importance" :is-multi="true" name="importance">
        Importance
      </multi-checkbox>

      <label>
        Filter by text:
        <input type="text" v-model="filterBy.title" @change="filtersUpdated" placeholder="search for a title" />
      </label>


      <multi-checkbox :options="['new', 'done', 'fail']" @change="filtersUpdated" @input="addStatus"
        v-model="filterBy.status" :is-multi="true" name="status">
        Status
      </multi-checkbox>
    </div>
    <task-table :tasks="tasks" :sortTxt="filterBy.sortTxt" :sortDir="filterBy.sortDir" @performTask="performTask"
      @removeTask="removeTask" @addTask="addTask" @updateTask="updateTask" @sortChanged="updateSort"></task-table>

    <add-task-modal v-if="showModal" @save="addTask" @close="showModal = false" />
  </div>
</template>

<script>
import { taskService } from './services/task.service';
import { socketService } from './services/socket.service';

import taskTable from './cmps/task-table.vue';
import multiCheckbox from './cmps/multi-checkbox.vue';
import AddTaskModal from './cmps/add-task-modal.vue';
import console from 'console';

const socket = socketService.getSocket();

export default {
  name: 'App',
  data() {
    return {
      filterBy: {
        importance: [],
        status: [],
        title: '',
        sortTxt: 'title',
        sortDir: 1,
      },
      showModal: false,
      isRunning: false,
      tasks: [],
    };
  },
  components: {
    taskTable,
    multiCheckbox,
    AddTaskModal,
  },
  async created() {
    socket.on('taskUpdated', (task) => {
      this.tasks = this.tasks.map((t) => (t._id === task._id ? task : t));
    });

    socket.on('setToggleWorker', ({ isRunning }) => {
      this.isRunning = isRunning;
    });

    socket.on('setTasks', () => {
      this.loadTasks()
    });


    try {
      this.loadFilters();
      this.loadTasks();
    } catch {
      console.error("Couldn't load tasks");
    }
  },
  methods: {
    async loadTasks() {
      try {
        this.tasks = await taskService.getTasks(this.filterBy);
      } catch {
        console.error("Couldn't load tasks");
      }
    },
    updateSort(sortTxt) {
      if (this.filterBy.sortTxt === sortTxt) {
        this.filterBy.sortDir = this.filterBy.sortDir * -1;
      } else {
        this.filterBy.sortTxt = sortTxt;
        this.filterBy.sortDir = 1;
      }

      this.filtersUpdated();
    },
    filtersUpdated() {
      const queryParams = new URLSearchParams(this.filterBy);
      window.history.replaceState(null, null, '?' + queryParams.toString());
      this.loadTasks();
    },
    addStatus(selected) {
      this.filterBy.status = selected;
    },
    addImportance(selected) {
      this.filterBy.importance = selected;
    },
    async addTask(task) {
      const res = await taskService.save(task);
      this.tasks.push(res);
      this.showModal = false;
    },
    async clearTasks() {
      try {
        await taskService.clearTasks();
        this.tasks = await taskService.getTasks();
      } catch {
        console.error("Couldn't clear tasks");
      }
    },
    async toggleWorker() {
      taskService.toggleWorker();
    },
    isEmpty(val) {
      return typeof val == 'array' ? val.length === 0 : !!val;
    },
    async generateTasks() {
      try {
        var newTasks = await taskService.generateTasks();
        if (newTasks) this.tasks = await taskService.getTasks();
      } catch {
        console.error("Couldn't generate new tasks");
      }
    },
    async removeTask(taskId) {
      try {
        await taskService.remove(taskId);
        this.tasks = this.tasks.filter((task) => task._id !== taskId);
      } catch (err) {
        console.error(`could not remove task id ${taskId}`, err);
      }
    },
    performTask(task) {
      taskService.startTask(task);
    },
    loadFilters() {
      const queryParams = new URLSearchParams(window.location.search);
      queryParams.forEach((value, param) => {
        if (!this.isEmpty(value)) return;
        if (value.includes(',')) {
          this.filterBy[param] = value.split(',');
          return;
        }

        if (param === 'importance' || param === 'status') {
          this.filterBy[param] = [value];
        } else if (param === 'sortDir') {
          this.filterBy[param] = parseInt(value);
        } else {
          this.filterBy[param] = value;
        }
      });
    },
    updateTask(task) {
      taskService.save(task);
    },
  },
};
</script>
