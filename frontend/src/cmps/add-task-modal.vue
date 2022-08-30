<template>
  <div class="add-task-modal">
    <button class="close-btn" @click="$emit('close')">✖</button>
    <h4>New Task</h4>
    <label>
      Task Title:
      <input type="text" placeholder="Task name" v-model="task.title" />
    </label>
    <label>
      Task Description:
      <input
        type="text"
        placeholder="Task description"
        v-model="task.description"
      />
    </label>
    <label>
      Task Importance:
      <input
        type="number"
        min="1"
        max="4"
        placeholder="importance"
        v-model="task.importance"
      />
    </label>
    <button class="btn" @click="$emit('save', task)">Add</button>
  </div>
</template>

<script>
import { taskService } from "@/services/task.service";



export default {
  data() {
    return {
      task: taskService.getEmptyTask(),
    }
  }
}
</script>