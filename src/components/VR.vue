<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="filteredViolations"
      class="violation-records-table"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-text-field
            v-model="search"
            class="w-auto mr-4"
            density="compact"
            label="Search Record"
            prepend-inner-icon="mdi-magnify"
            variant="solo-filled"
            flat
            hide-details
            single-line
            style="max-width: 500px;"
          ></v-text-field>
        </v-toolbar>
      </template>
      <template v-slot:item="{ item }">
        <tr>
          <td>{{ item.student_id }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.violation }}</td>
          <td>
            <v-icon style="color: #2F3F64" @click="viewDetails(item)">mdi-eye-circle ml-3</v-icon>
          </td>
        </tr>
      </template>
    </v-data-table>

    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>Violation Details</v-card-title>
        <v-card-text>
          <p><strong>Student ID:</strong> {{ selectedItem.student_id }}</p>
          <p><strong>Name:</strong> {{ selectedItem.name }}</p>
          <p><strong>Violation:</strong> {{ selectedItem.violation }}</p>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="dialog = false" color="primary">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      violations: [
        {
          student_id: 'S1234',
          name: 'John Doe',
          violation: 'Late submission'
        }
      ],
      search: '',
      dialog: false,
      selectedItem: {},
      headers: [
        { title: 'Student ID', key: 'student_id' },
        { title: 'Name', key: 'name' },
        { title: 'Violation', key: 'violation' },
        { title: 'Actions', sortable: false }
      ]
    };
  },
  computed: {
    filteredViolations() {
      return this.violations.filter(violation => {
        const searchLower = this.search.toLowerCase();
        return (
          violation.student_id.toLowerCase().includes(searchLower) ||
          violation.name.toLowerCase().includes(searchLower)
        );
      });
    }
  },
  methods: {
    viewDetails(item) {
      this.selectedItem = item;
      this.dialog = true;
    }
  }
};
</script>

<style scoped>
.violation-records-table {
  max-height: 150vh;
}

.v-card-title {
  text-align: center;
  background-color: #2F3F64;
  color: #f0f0f0;
}
</style>
