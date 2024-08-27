<template>
  <v-data-table
    :search="search"
    :headers="headers"
    :items="examinations"
    :sort-by="[{ key: 'student_id', order: 'asc' }]"
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
          flatf
          hide-details
          single-line
          style="max-width: 500px;"
        ></v-text-field>

        <v-btn @click="openAddDialog" class="mb-2 rounded-l add-record-button mr-2" dark prepend-icon="mdi-plus">Add Record</v-btn>
        <v-btn @click="openArchives" class="mb-2 rounded-l add-record-button" to="/examarchive" prepend-icon="mdi-archive">View Archive</v-btn>
      </v-toolbar>
    </template>

    <template v-slot:item="{ item }">
      <tr>
        <td>{{ item.student_id }}</td>
        <td>{{ item.full_name }}</td>
        <td>{{ item.exam_title }}</td>
        <td>{{ item.exam_remarks }}</td>
        <td>{{ formatDate(item.exam_date) }}</td>
        <td>
          <v-icon style="color: #2F3F64" @click="viewRecords(item)"><span class="mdi mdi-eye-circle fs-5 mr-2"></span></v-icon>
          <v-icon size="small" style="color: #2F3F64" @click="archiveItem(item.exam_id)" class="mdi mdi-archive fs-5"></v-icon>
        </td>
      </tr>
    </template>
  </v-data-table>

  <!-- Add New Record Dialog -->
  <v-dialog v-model="addDialog" max-width="1000px">
    <v-card>
      <v-card-title>Add New Exam Record</v-card-title>
      <v-card-text>
        <v-container>
          <v-row dense>
            <v-col cols="12">
              <v-text-field
                v-model="editedItem.student_id"
                label="Student ID*"
                prepend-icon="mdi-account"
                required
                type="text"
                @keypress="onlyDigits($event)"
                @input="handleInput($event)"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field v-model="editedItem.exam_title" label="Exam Title*" prepend-icon="mdi-book" required></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-textarea v-model="editedItem.exam_remarks" label="Remarks*" prepend-icon="mdi-pencil" required></v-textarea>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="editedItem.exam_date"
                label="Exam Date*"
                prepend-icon="mdi-calendar"
                required
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="saveNewRecord" class="mb-2 rounded-l add-record-button" dark>Save</v-btn>
        <v-btn @click="closeAddDialog" class="mb-2 rounded-l add-record-button" dark>Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Edit Record Dialog -->
  <v-dialog v-model="editDialog" max-width="1000px">
    <v-card>
      <v-card-title>Edit Exam Record</v-card-title>
      <v-card-text>
        <v-container>
          <v-row dense>
            <v-col cols="12">
              <v-text-field
                v-model="editedItem.student_id"
                label="Student ID*"
                prepend-icon="mdi-account"
                required
                type="text"
                @keypress="onlyDigits($event)"
                @input="handleInput($event)"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field v-model="editedItem.exam_title" label="Exam Title*" prepend-icon="mdi-book" required></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-textarea v-model="editedItem.exam_remarks" label="Remarks*" prepend-icon="mdi-pencil" required></v-textarea>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="editedItem.exam_date"
                label="Exam Date*"
                prepend-icon="mdi-calendar"
                required
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="updateRecord" class="mb-2 rounded-l add-record-button" dark>Save</v-btn>
        <v-btn @click="closeEditDialog" class="mb-2 rounded-l add-record-button" dark>Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- View Record Dialog -->
  <v-dialog v-model="viewingRecords" max-width="600px">
    <v-card>
      <v-card-title>Exam Details</v-card-title>
      <v-card-text v-if="editedItem">
        <p><strong>Student ID:</strong> {{ editedItem.student_id || 'N/A' }}</p>
        <p><strong>Student Name:</strong> {{ editedItem.full_name }}</p>
        <p><strong>Exam Title:</strong> {{ editedItem.exam_title }}</p>
        <p><strong>Exam Remarks:</strong> {{ editedItem.exam_remarks }}</p>
        <p><strong>Exam Date:</strong> {{ formatDate(editedItem.exam_date) }}</p>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="viewingRecords = false" class="mb-2 rounded-l add-record-button" dark>Close</v-btn>
        <v-btn @click="openEditDialog(editedItem)" class="mb-2 rounded-l add-record-button" dark>Edit</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';

export default {
  data() {
    return {
      examinations: [],
      addDialog: false,
      editDialog: false,
      editedItem: {
        exam_id: null,
        student_id: '',
        exam_title: '',
        exam_remarks: '',
        exam_date: '', // This will be set when editing
      },
      search: '',
      headers: [
        { title: 'Student ID', key: 'student_id' },
        { title: 'Name', key: 'full_name' },
        { title: 'Exam Title', key: 'exam_title' },
        { title: 'Assessment', key: 'exam_remarks' },
        { title: 'Date', key: 'exam_date' },
        { title: 'Actions', sortable: false },
      ],
      viewingRecords: false,
    };
  },
  mounted() {
    this.fetchExam();
  },
  computed: {
    displayedExam() {
      const searchTerm = this.search.toLowerCase();
      return this.examinations.filter((exam) =>
        Object.values(exam).some(
          (value) =>
            typeof value === 'string' && value.toLowerCase().includes(searchTerm)
        )
      );
    },
  },
  methods: {
    onlyDigits(event) {
      if (!/^\d$/.test(event.key)) {
        event.preventDefault();
      }
    },
    handleInput(event) {
      const value = event.target.value.replace(/\D/g, '');
      this.editedItem.student_id = value.slice(0, 12);
    },
    fetchExam() {
      axios.get('http://127.0.0.1:8000/api/examinations')
        .then(response => {
          this.examinations = response.data.examinations;
        })
        .catch(error => {
          console.error('Error Fetching examinations', error);
        });
    },
    openAddDialog() {
      this.addDialog = true;
      this.editedItem = {
        exam_id: null,
        student_id: '',
        exam_title: '',
        exam_remarks: '',
        exam_date: this.getCurrentDate(),
      };
    },
    closeAddDialog() {
      this.addDialog = false;
    },
    openEditDialog(exam) {
      this.editedItem = {
        ...exam,  // Spread existing exam data
        exam_date: exam.exam_date // Preserve the existing exam_date
      };
      this.editDialog = true;
    },
    closeEditDialog() {
      this.editDialog = false;
    },
    viewRecords(exam) {
      this.editedItem = { ...exam };
      this.viewingRecords = true;
    },
    saveNewRecord() {
      this.dialog = false;
      this.addDialog = false;
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to save this record?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: '<span style="color: #ffffff;">Yes</span>',
        confirmButtonColor: "#4CAF50",
        cancelButtonText: '<span style="color: #ffffff;">No</span>',
        cancelButtonColor: "#F44336",
      }).then((result) => {
        if (result.isConfirmed) {
          axios.post('http://127.0.0.1:8000/api/examinations', this.editedItem)
            .then(response => {
              this.examinations.push(response.data);
              this.fetchExam();
              this.closeAddDialog();
              Swal.fire({
                title: 'Success',
                text: 'Record Saved Successfully!',
                icon: 'success',
                showConfirmButton: false,
                timer: 3000,
              });
            })
            .catch(error => {
              console.error('Error saving new record', error);
              Swal.fire({
                title: 'Error',
                text: 'Error saving new record',
                icon: 'error',
                showConfirmButton: false,
                timer: 3000,
              });
            });
        }
      });
    },
    updateRecord() {
      this.editDialog = false;
      this.viewingRecords = false;
  Swal.fire({
    title: 'Are you sure?',
    text: 'Do you want to update this record?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: '<span style="color: #ffffff;">Yes</span>',
    confirmButtonColor: "#4CAF50",
    cancelButtonText: '<span style="color: #ffffff;">No</span>',
    cancelButtonColor: "#F44336",
  }).then((result) => {
    if (result.isConfirmed) {
      axios.put(`http://127.0.0.1:8000/api/examinations/${this.editedItem.exam_id}`, {
        student_id: this.editedItem.student_id,
        exam_title: this.editedItem.exam_title,
        exam_remarks: this.editedItem.exam_remarks,
        // Do not send exam_date to keep it unchanged
      })
        .then(response => {
          this.fetchExam();
          this.closeEditDialog();
          Swal.fire({
            title: 'Updated',
            text: 'Record updated successfully!',
            icon: 'success',
            showConfirmButton: false,
            timer: 3000,
          });
        })
        .catch(error => {
          console.error('Error updating record', error);
          Swal.fire({
            title: 'Error',
            text: 'Error updating record',
            icon: 'error',
            showConfirmButton: false,
            timer: 3000,
          });
        });
    }
  });
},

    archiveItem(id) {
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to archive this record?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '<span style="color: #ffffff;">Yes</span>',
        confirmButtonColor: "#4CAF50",
        cancelButtonText: '<span style="color: #ffffff;">No</span>',
        cancelButtonColor: "#F44336",
      }).then((result) => {
        if (result.isConfirmed) {
          console.log(id);
          axios.post(`http://127.0.0.1:8000/api/examinations/${id}/archive`)
            .then(response => {
              this.fetchExam();
              Swal.fire({
                title: 'Archived',
                text: 'Record archived successfully!',
                icon: 'success',
                showConfirmButton: false,
                timer: 3000,
              });
            })
            .catch(error => {
              console.error('Error archiving record', error);
              Swal.fire({
                title: 'Error',
                text: 'Error archiving record',
                icon: 'error',
                showConfirmButton: false,
                timer: 3000,
              });
            });
        }
      });
    },
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString();
    },
    getCurrentDate() {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      const hh = String(today.getHours()).padStart(2, '0');
      const min = String(today.getMinutes()).padStart(2, '0');
      const ss = String(today.getSeconds()).padStart(2, '0');

      return `${yyyy}-${mm}-${dd}T${hh}:${min}:${ss}`;
    },
  },
};
</script>

<style>
.v-card:hover {
  background-color: #f0f0f0; /* Set the hover color here */
}

.v-card-title {
  text-align: center;
  background-color: #2F3F64;
  color: #f0f0f0;
}

.add-record-button {
  background-color: #2F3F64; /* Set your desired background color here */
  border-radius: 5px; /* Set the border radius here */
  color: white; /* Set the text color */
}

.add-record-button:hover {
  background-color: var(--grey); /* Set the hover background color */
}
</style>