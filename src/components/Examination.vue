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

        <v-dialog v-model="dialog" max-width="1000px">
          <template v-slot:activator="{ props }">
            <v-btn @click="openDialog" class="mb-2 rounded-l add-record-button mr-2" dark v-bind="props" prepend-icon="mdi-plus">Add Record</v-btn>
            <v-btn @click="openArchives" class="mb-2 rounded-l add-record-button" to="/examarchive" prepend-icon="mdi-archive">View Archive</v-btn>
          </template>

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
                    <v-text-field v-model="editedItem.exam_score" label="Exam Score*" prepend-icon="mdi-format-list-numbered" required></v-text-field>
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
              <v-btn @click="closeDialog" class="mb-2 rounded-l add-record-button" dark>Cancel</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>

        <v-dialog v-model="viewingRecords" max-width="600px">
          <v-card>
            <v-card-title>Exam Details</v-card-title>
            <v-card-text v-if="editedItem">
              <p><strong>Student ID:</strong> {{ editedItem.student_id || 'N/A' }}</p>
              <!-- <p><strong>Student Name:</strong> {{ editedItem.student_name }}</p> -->
              <p><strong>Exam Title:</strong> {{ editedItem.exam_title }}</p>
              <p><strong>Exam Score:</strong> {{ editedItem.exam_score }}</p> <!-- Corrected -->
              <p><strong>Exam Remarks:</strong> {{ editedItem.exam_remarks }}</p> <!-- Corrected -->
              <p><strong>Exam Date:</strong> {{ formatDate(editedItem.exam_date) }}</p>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn @click="viewingRecords = false" class="mb-2 rounded-l add-record-button" dark>Close</v-btn>
              <v-btn @click="editItem(editedItem)" class="mb-2 rounded-l add-record-button" dark>Edit</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

    </template>

    <template v-slot:item="{ item }">
      <tr>
        <td>{{ item.student_id }}</td>
        <!-- <td>{{ item.student_name }}</td> -->
        <td>{{ item.exam_title }}</td>
        <td>{{ item.exam_score }}</td>
        <td>{{ item.exam_remarks }}</td>
        <td>{{ formatDate(item.exam_date) }}</td>
        <td>
          <v-icon style="color: #2F3F64" @click="viewRecords(item)"><span class= "mdi mdi-eye-circle fs-5 mr-2"></span></v-icon>
          <v-icon size="small" style="color: #2F3F64" @click="archiveItem(item.exam_id)" class="mdi mdi-archive fs-5"></v-icon>
        </td>
      </tr>
    </template>
  </v-data-table>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';
  
export default {
  data() {
    return {
      examinations: [],
      value: null,
      dialog: false,
      editedItem: {
        student_id: '',
        // student_name: '',
        exam_title: '',
        exam_score: '',
        exam_remarks: '',
        exam_date: this.getCurrentDate(),
      },
      search: '',
      headers: [
        { title: 'Student ID', key: 'student_id' },
        // { title: 'Name', key: 'student_name' },
        { title: 'Exam Title', key: 'exam_title' },
        { title: 'Score', key: 'exam_score' },
        { title: 'Assessment', key: 'exam_remarks' },
        { title: 'Date', key: 'exam_date' },
        { title: 'Actions', sortable: false },
      ],
      viewingRecords: false,
      selectedExam: null,
      archiveDialog: false,
      selectedExamId: null,
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
      // Prevent any non-digit characters
      if (!/^\d$/.test(event.key)) {
        event.preventDefault();
      }
    },
    handleInput(event) {
      // Remove any non-digit characters and limit the length to 12
      const value = event.target.value.replace(/\D/g, '');
      this.editedItem.student_id = value.slice(0, 12);
    },
    fetchExam() {
      axios.get('http://127.0.0.1:8000/api/examinations')
        .then(response => {
          console.log(response.data);
          this.examinations = response.data.examinations;
        })
        .catch(error => {
          console.error('Error Fetching violations', error);
        });
    },
    openDialog() {
      this.dialog = true;
      this.editedItem = {
        student_id: '',
        exam_title: '',
        exam_score: '',
        exam_remarks: '',
        exam_date: this.getCurrentDate(),
      };
      this.selectedExam = null; // Reset selectedExam when adding a new record
    },
    closeDialog() {
      this.dialog = false;
    },
    viewRecords(exam) {
      this.editedItem = { ...exam }; // Ensure editedItem is a copy of the selected exam
      this.viewingRecords = true;
    },
    editItem(exam) {
      this.selectedExam = { ...exam }; // Store the selected exam in selectedExam
      this.editedItem = { ...exam }; // Load the selected exam's details into editedItem
      this.dialog = true;
    },
    saveNewRecord() {
      this.viewingRecords = false;
      this.dialog= false; 
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
          if (this.editedItem.exam_id) {
            // Update existing record
            axios.put(`http://127.0.0.1:8000/api/examinations/${this.editedItem.exam_id}`, this.editedItem)
              .then(response => {
                this.fetchExam();
                this.closeDialog();
                Swal.fire({
        title: 'Updated',
        text: 'Record Updated Successfully!',
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
          } else {
            // Add new record
            axios.post('http://127.0.0.1:8000/api/examinations', this.editedItem)
              .then(response => {
                this.examinations.push(response.data);
                this.fetchExam();
                this.closeDialog();
                Swal.fire({
        title: 'Success',
        text: 'Record Saved Successfully!',
        icon: 'success',
        showConfirmButton: false,
        timer: 3000,

      });
              })
              .catch(error => {
                console.error('Error fetching record', error);
                Swal.fire({
        title: 'Error',
        text: 'Error saving new record',
        icon: 'error',
        showConfirmButton: false,
        timer: 3000,

      });
              });
          }
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
          axios.post(`http://127.0.0.1:8000/api/examinations/${id}/archive`)
            .then(response => {
              console.log('Examination archived successfully:', response.data);
              this.updateExaminations();
              Swal.fire({
        title: 'Archived',
        text: 'Record Archived Successfully!',
        icon: 'success',
        showConfirmButton: false,
        timer: 3000,

      });
            })
            .catch(error => {
              console.error('Error archiving examination:', error.response ? error.response.data : error.message);
              Swal.fire({
        title: 'Error',
        text: 'Error Archiving record',
        icon: 'error',
        showConfirmButton: false,
        timer: 3000,

      });
            });
        }
      });
    },
    archiveConfirmed() {
      if (this.selectedExamId !== null) {
        axios.post(`http://127.0.0.1:8000/api/examinations/${this.selectedExamId}/archive`)
          .then(response => {
            console.log('Examination archived successfully:', response.data);
            this.updateExaminations();
            this.archiveDialog = false;
            Swal.fire({
        title: 'Archived',
        text: 'Record Archived Successfully!',
        icon: 'success',
        showConfirmButton: false,
        timer: 3000,

      });
          })
          .catch(error => {
            console.error('Error archiving examination:', error.response ? error.response.data : error.message);
            Swal.fire({
        title: 'Error',
        text: 'Error archiving record',
        icon: 'error',
        showConfirmButton: false,
        timer: 3000,

      });
          });
      }
    },
    updateExaminations() {
      // Method to refresh the list of examinations or update the local state
      axios.get('http://127.0.0.1:8000/api/examinations')
        .then(response => {
          this.examinations = response.data.examinations;
        })
        .catch(error => {
          console.error('Error fetching examinations:', error.response ? error.response.data : error.message);
          Swal.fire({
        title: 'Error',
        text: 'Error fetching examination',
        icon: 'error',
        showConfirmButton: false,
        timer: 3000,

      });
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