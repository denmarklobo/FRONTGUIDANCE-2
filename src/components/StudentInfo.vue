<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="filteredStudents"
      class="student-info-table"
    >
      <template v-slot:top>
        <v-toolbar flat class="toolbar-header">
          <v-text-field
          v-model="search"
            class="w-auto mr-4"
            density="compact"
            label="Search Student"
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
          <td>{{ item.profile_status }}</td>
          <td>
            <v-icon size="small" style="color: #2F3F64" @click="viewStudent(item)"><span class="mdi mdi-eye-circle fs-5 ml-8"></span></v-icon>
          </td>
        </tr>
      </template>
    </v-data-table>

    <v-dialog v-model="viewingStudent" max-width="1000px">
      <v-card>
        <v-card-title><h2>Recent Activities</h2></v-card-title>
        <v-card-text>
          <div v-if="selectedStudent">
            <p><strong>Student ID:</strong> {{ selectedStudent.student_id }}</p>
            <p><strong>Name:</strong> {{ selectedStudent.name }}</p>
            <hr>
            <h4>Pending Violations</h4>
            <v-list two-line subheader style="max-height: 200px; overflow-y: auto;">
              <v-list-item-group>
                <v-list-item
                  v-for="violation in selectedStudent.violations"
                  :key="violation.id"
                  @click="viewViolationDetails(violation)"
                >
                  <v-list-item-content>
                    <v-list-item-title>{{ violation.description }}</v-list-item-title>
                    <v-list-item-subtitle>{{ violation.date }}</v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-icon>
                    <v-icon>mdi-chevron-right</v-icon>
                  </v-list-item-icon>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="black" @click="viewingStudent = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="viewingViolation" max-width="600px">
      <v-card>
        <v-card-title><h2>Violation Details</h2></v-card-title>
        <v-card-text>
          <div v-if="selectedViolation">
            <p><strong>ID:</strong> {{ selectedViolation.id }}</p>
            <p><strong>Description:</strong> {{ selectedViolation.description }}</p>
            <p><strong>Status:</strong> {{ selectedViolation.status }}</p>
            <p><strong>Date:</strong> {{ selectedViolation.date }}</p>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="black" @click="viewingViolation = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      students: [
        {
          student_id: 'S1234',
          name: 'John Doe',
          profile_status: 'Active',
          examinations: [
            {
              id: 'E1',
              title: 'Math Test',
              score: 95,
              date: '2024-05-18',
              description: 'This was a difficult math test.'
            },
            {
              id: 'E2',
              title: 'Science Test',
              score: 88,
              date: '2024-05-20',
              description: 'Science test covering physics and chemistry.'
            },
            {
              id: 'E3',
              title: 'History Test',
              score: 90,
              date: '2024-05-22',
              description: 'History test on world wars.'
            },
            {
              id: 'E4',
              title: 'English Test',
              score: 85,
              date: '2024-05-24',
              description: 'English grammar and literature test.'
            }
          ],
          violations: [
            {
              id: 'V5678',
              description: 'Late submission of assignment',
              status: 'Pending',
              date: '2024-05-18'
            },
            {
              id: 'V5679',
              description: 'Unexcused absence',
              status: 'Pending',
              date: '2024-05-20'
            },
            {
              id: 'V5680',
              description: 'Disruptive behavior',
              status: 'Pending',
              date: '2024-05-22'
            },
            {
              : 'V5681',
              description: 'Incomplete homework',
              status: 'Pending',
              date: '2024-05-24'
            }
          ]
        }
      ],
      search: '',
      headers: [
        { title: 'Student ID', key: 'student_id' },
        { title: 'Name', key: 'name' },
        { title: 'Profile Status', key: 'profile_status' },
        { title: 'Actions', sortable: false }
      ],
      viewingStudent: false,
      selectedStudent: null,
      viewingExam: false,
      selectedExam: null,
      viewingViolation: false,
      selectedViolation: null
    };
  },
  computed: {
    filteredStudents() {
      return this.students.filter(student => {
        const searchLower = this.search.toLowerCase();
        return (
          student.student_id.toLowerCase().includes(searchLower) ||
          student.name.toLowerCase().includes(searchLower)
        );
      });
    }
  },
  methods: {
    viewStudent(student) {
      this.selectedStudent = student;
      this.viewingStudent = true;
    },
    viewViolationDetails(violation) {
      this.selectedViolation = violation;
      this.viewingViolation = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.student-info-table {
  max-height: 150vh;
}

.v-card-title {
  text-align: center;
  background-color: #2F3F64;
  color: #f0f0f0;
}


</style>
