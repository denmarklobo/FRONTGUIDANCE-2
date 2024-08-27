<template>
  <div>
    <v-toolbar flat>
      <v-btn to="/consultation" class="mb-2 rounded-l add-record-button mr-2" dark>Back</v-btn>
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
    :items="archivedConsultations"
    :sort-by="[{ key: 'student_id', order: 'asc' }]"
  >

     <template v-slot:item="{ item }">
          <tr>
            <td>{{ item.student_id || 'N/A' }}</td>
            <td>{{ item.full_name }}</td>
            <td>{{ item.con_title }}</td>
          <!--  <td>{{ item.con_notes }}</td> -->
            <td>{{ formatDate(item.con_date) }}</td>
            <td>
          <v-icon style="color: #2F3F64" @click="viewRecords(item)"><span class= "mdi mdi-eye-circle fs-5 mr-2"></span></v-icon>
          <v-icon size="small" style="color: #2F3F64" @click="unarchiveItem((item.con_id))"><span class="mdi mdi-reload fs-5"></span></v-icon>
        </td>
      </tr>
    </template>
  </v-data-table>
  <v-dialog v-model="viewingRecords" max-width="600px">
          <v-card>
            <v-card-title>Consultation Details</v-card-title>
            <v-card-text v-if="selectedConsultation">
              <p><strong>Student ID:</strong> {{ selectedConsultation.student_id || 'N/A' }}</p>
              <p><strong>Entry Title:</strong> {{ selectedConsultation.con_title }}</p>
              <p><strong>Important Notes:</strong> {{ selectedConsultation.con_notes }}</p>
              <p><strong>Entry Date:</strong> {{ formatDate(selectedConsultation.con_date) }}</p>
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
      archivedConsultations: [],
      search: '',
      headers: [
        { title: 'Student ID', value: 'student_id' },
        { title: 'Student Name', value: 'full_name' },
        { title: 'Entry Title', value: 'con_title' },
    //    { title: 'Important Notes', value: 'con_notes' },
        { title: 'Entry Date', value: 'con_date' },
        { title: 'Actions', sortable: false },
        ],
        viewingRecords: false,
        selectedConsultation: null,
      };
  },
  mounted() {
    this.fetchArchivedConsultations();
  },
  computed: {
    displayedArchives() {
      const searchTerm = this.search.toLowerCase();
      return this.archivedConsultations.filter((consultation) =>
        Object.values(consultation).some(
          (value) =>
            typeof value === 'string' && value.toLowerCase().includes(searchTerm)
        )
      );
    },
    editedItemWithValidStatus() {
      // You can add validation logic for consultation here if needed
      return this.editedItem;
    },
  },
  methods: {
     fetchArchivedConsultations() {
      axios.get('http://26.81.173.255:8000/api/consultations/archived')
        .then(response => {
          // Update the component's data with the fetched consultations
          this.archivedConsultations = response.data.consultations;
          console.log('Archived consultations fetched successfully:', this.archivedConsultations);
        })
        .catch(error => {
          // Handle any errors that occur during the request
          this.error = error.response ? error.response.data : error.message;
          console.error('Error fetching archived consultations:', this.error);
        });
    },
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString();
    },
    openDialog() {
      this.dialog = true;
      this.editedItem = {
        student_id: '',
        con_title: '',
        con_notes: '',
        con_date: this.getCurrentDate(),
      };
    },
    viewRecords(consultation) {
      this.selectedConsultation = { ...consultation }; // Ensure editedItem is a copy of the selected exam
      this.viewingRecords = true;
    },
    created() {
    this.fetchArchivedConsultations();
    },
    unarchiveItem(con_id) {
    console.log('Received ID for restoring:', con_id);
    Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to restore this record?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: '<span style="color: #ffffff;">Yes</span>',
        confirmButtonColor: "#4CAF50",
        cancelButtonText: '<span style="color: #ffffff;">No</span>',
        cancelButtonColor: "#F44336",
      }).then((result) => {
        if (result.isConfirmed) {

    // Confirm with the user before proceeding

        // Send a POST request to the server
        axios.put('http://26.81.173.255:8000/api/consultation/restore', { con_id })
            .then(response => {
                console.log('Record restored successfully:', response.data);
                this.fetchArchivedConsultations(); // Refresh the list of archived consultations
                Swal.fire({
                 title: 'Unarchived',
                 text: 'Consultation Restored Successfully!',
                 icon: 'success',
                 showConfirmButton: false,
                 timer: 3000,
                });
               })
            .catch(error => {
                // Log and handle the error
                console.error('Error restoring record:', error.response ? error.response.data : error.message);
                Swal.fire({
                 title: 'Error',
                 text: 'Error Restoring Record',
                 icon: 'error',
                 showConfirmButton: false, 
                 timer: 3000,          
                });
              });
             }
           });
          }
        }}
        
</script>

<style lang="scss" scoped>
  .main-content {
    display: flex;
    flex-direction: column;
    color: var(--dark);
  
    .header-title {
      display: flex;
      gap: 0.5rem;
  
      .material-icons {
        font-size: 2rem;
        position: relative;
        top: 3px;
      }
    }
  
    .archive {
      border-radius: 10px;
      background-color: #f0f0f0;
      padding: 0.5rem;
      max-height: 150vh;
    }
  }

  .bg-title{
    z-index: -1;
    position: absolute;
    opacity: 10%;
    margin-top: -40px;
    font-size: 100px;
    font-family: Impact, fantasy;
}
.top-container{
    display: flex;
    margin: 0.5rem;
    .inventory{
        flex: 1;
        
        .material-icons{
            color: var(--dark);
            font-size: 2.5rem;
        }
        .text{
            position: relative;
            color: var(--dark);
            font-size: 2rem;
            font-weight: 900;
            bottom: 0.6rem;
            left: 0.5rem;
        }
    }

} 

  </style>