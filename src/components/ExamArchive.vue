<template>
  <div>
    <v-toolbar flat>
      <v-btn @click="goBack" class="mb-2 rounded-l add-record-button mr-2" dark>Back</v-btn>
      <v-text-field
          v-model="search"
          class="w-auto mr-4"
          density="compact"
          label="Search Entry"
          prepend-inner-icon="mdi-magnify"
          variant="solo-filled"
          flat
          hide-details
          single-line
          style="max-width: 500px;"
      ></v-text-field>
    </v-toolbar>

    <v-data-table
      :search="search"
      :headers="headers"
      :items="examinations"
      :sort-by="[{ key: 'student_id', order: 'asc' }]"
>
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
            <v-icon size="small" style="color: #2F3F64" @click="unarchiveItem(item)"><span class="mdi mdi-reload fs-5"></span></v-icon>
          </td>
        </tr>
      </template>
    </v-data-table>

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
            </v-card-actions>
          </v-card>
        </v-dialog>

  </div>
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
      selectedExamId: null,
    };
  },
  mounted() {
    this.fetchexam();
  },
  computed: {
    displayedexam() {
      const searchTerm = this.search.toLowerCase();
      return this.examination.filter((exam) =>
        Object.values(exam).some(
          (value) =>
            typeof value === 'string' && value.toLowerCase().includes(searchTerm)
        )
      );
    },
  },
  methods: {
    fetchexam() {
      axios.get('http://192.168.16.165:8000/api/examinations/arch')
        .then(response => {
          console.log(response.data);
            this.examinations = response.data.examinations;
          })
          .catch(error => {
            console.error('Error Fetching violations', error);
          });
    },
    goBack() {
      this.$router.go(-1); // Go back to the previous route
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
    unarchiveItem(exam) {
    const examId = exam.exam_id; // Use exam.exam_id here
    Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to unarchive this record?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: '<span style="color: #ffffff;">Yes</span>',
        confirmButtonColor: "#4CAF50",
        cancelButtonText: '<span style="color: #ffffff;">No</span>',
        cancelButtonColor: "#F44336",
    }).then((result) => {
        if (result.isConfirmed) {
            axios.post(`http://192.168.16.165:8000/api/examinations/${examId}/restore`) // Use examId here
                .then(() => {
                    this.examinations = this.examinations.filter(e => e.exam_id !== examId); // Use examId here
                    Swal.fire({
                        title: 'Unarchived',
                        text: 'The record has been unarchived successfully',
                        icon: 'success',
                        showConfirmButton: false,
                        timer: 3000,
                    });
                })
                .catch(error => {
                    console.error('Error un-archiving record:', error);
                    Swal.fire({
                      title: 'Error',
                        text: 'There was an Issue restoring the record',
                        icon: 'error',
                        showConfirmButton: false,
                        timer: 3000,
                      });
                });
        }
    });
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
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString();
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
</style>
