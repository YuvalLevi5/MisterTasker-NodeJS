<template>
  <div class="multi-checkbox" :name="name">
    <span class="multi-checkbox-title"><slot /></span>
    <label class="checkbox-label" v-for="opt in options" :key="opt">
      <input
        type="checkbox"
        :checked="value.includes(opt)"
        :name="name"
        @input="onChange(opt, $event.target.checked)"
      />
      {{ capitalize(opt) }}
    </label>
  </div>
</template>

<script>
  export default {
    props: {
      options: {
        type: Array,
        default: [],
      },
      name: {
        type: String,
        required: true,
      },
      value: {
        type: Array,
        default: [],
      },
    },
    emits: ['change', 'input', 'importance'],
    methods: {
      onChange(opt, checked) {
        let selected;
        console.log('im changed', checked, opt);
        if (checked) {
          selected = this.value.map((option) => option);
          selected.push(opt);
        } else {
          selected = this.value.filter((option) => option !== opt);
        }

        this.$emit('input', [...selected]);
        this.$emit('importance', [...selected]);
        this.$emit('change');
      },
      capitalize(value) {
        if (!value) return '';
        value = value.toString();
        return value.charAt(0).toUpperCase() + value.slice(1);
      },
    },
  };
</script>
