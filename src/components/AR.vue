<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="filteredAdmissions"
      class="admission-results-table"
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
          <td>{{ item.admission_result }}</td>
          <td>
            <v-icon style="color: #2F3F64" @click="viewDetails(item)">mdi-eye-circle ml-3</v-icon>
          </td>
        </tr>
      </template>
    </v-data-table>

    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>Student Details</v-card-title>
        <v-card-text>
          <p><strong>Student ID:</strong> {{ selectedItem.student_id }}</p>
          <p><strong>Name:</strong> {{ selectedItem.name }}</p>
          <p><strong>Admission Result:</strong> {{ selectedItem.admission_result }}</p>
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
      admissions: [
        {
          student_id: 'S1234',
          name: 'John Doe',
          admission_result: 'Passed'
        }
      ],
      search: '',
      dialog: false,
      selectedItem: {},
      headers: [
        { title: 'Student ID', key: 'student_id' },
        { title: 'Name', key: 'name' },
        { title: 'Admission Result', key: 'admission_result' },
        { title: 'Actions', sortable: false }
      ]
    };
  },
  computed: {
    filteredAdmissions() {
      return this.admissions.filter(admission => {
        const searchLower = this.search.toLowerCase();
        return (
          admission.student_id.toLowerCase().includes(searchLower) ||
          admission.name.toLowerCase().includes(searchLower)
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
.admission-results-table {
  max-height: 150vh;
}

.v-card-title {
  text-align: center;
  background-color: #2F3F64;
  color: #f0f0f0;
}
</style>
