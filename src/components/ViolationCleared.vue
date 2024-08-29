<template>
    <div>
      <v-toolbar flat>
        <v-btn @click="goBack" class="mb-2 rounded-l add-record-button mr-2" dark>Back</v-btn>
          <v-text-field
              v-model="search"
              class="w-auto mr-4"
              density="compact"
              label="Search Archived Violation"
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
        :items="displayedViolations"
        :sort-by="[{ key: 'case_date', order: 'desc' }]"
      >
  
      <template v-slot:item="{ item }">
        <tr>
          <td>{{ item.student_id }}</td>
          <td>{{ item.full_name }}</td>
          <td>{{ item.case_title }}</td>
          <td>{{ item.case_description }}</td>
          <td class="{{ item.case_status === 0 ? 'status-not-cleared' : 'status-cleared' }}">
            {{ item.case_status === 0 ? 'Not-Cleared' : 'Cleared' }}
          </td>
          <td>{{ item.case_date }}</td>
          <td>
            <v-icon size="small" style="color: #2F3F64" @click="restoreItem(item.cases_id)">mdi-restore</v-icon>
          </td>
        </tr>
      </template>
      </v-data-table>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import Swal from 'sweetalert2';
  
  export default {
    data() {
      return {
        archivedViolations: [], // Initialize as empty array
        search: '',
        headers: [
          { title: 'Student ID', value: 'student_id' },
          { title: 'Student Name', value: 'full_name' },
          { title: 'Title', value: 'case_title' },
          { title: 'Description', value: 'case_description' },
          { title: 'Status', value: 'case_status' },
          { title: 'Date', value: 'case_date' },
          { title: 'Actions', value: 'actions', sortable: false }
        ]
      };
    },
    mounted() {
      this.fetchArchivedViolations();
    },
    computed: {
      displayedViolations() {
        const searchTerm = this.search.toLowerCase();
        return this.archivedViolations.filter((violation) =>
          Object.values(violation).some(
            (value) => {
              if (typeof value === 'string') {
                return value.toLowerCase().includes(searchTerm);
              } else if (typeof value === 'number') {
                return value.toString().toLowerCase().includes(searchTerm);
              }
              return false;
            }
          )
        );
      },
    },
    methods: {
      fetchArchivedViolations() {
      axios.get('http://26.11.249.89:8000/api/archived')
        .then(response => {
          this.archivedViolations = response.data.archivedViolations.map(violation => {
            const student_profile = violation.student_profile || {};
            const full_name = `${student_profile.first_name || ''} ${student_profile.middle_name ? student_profile.middle_name + ' ' : ''}${student_profile.last_name || ''}`.trim();
            return {
              ...violation,
              full_name
            };
          });
          console.log('Archived violations fetched successfully:', this.archivedViolations);
        })
        .catch(error => {
          console.error('Error fetching archived violations', error);
        });
    },
      goBack() {
        this.$router.push('/violation');
      },
      restoreItem(cases_id) {
        Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to retrieve this record?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '<span style="color: #ffffff;">Yes</span>',
      confirmButtonColor: "#4CAF50",
      cancelButtonText: '<span style="color: #ffffff;">No</span>',
      cancelButtonColor: "#F44336",
    }).then((result) => {
      if (result.isConfirmed) {
          axios.post('http://26.11.249.89:8000/api/cases/restore', { cases_id })
            .then(response => {
              console.log('Record restored successfully:', response.data);
              this.fetchArchivedViolations(); // Refresh the list of archived violations
              Swal.fire(
              'Retrieved!',
              'The record has been retrieved successfully.',
              'success'
            );
            })
            .catch(error => {
              console.error('Error restoring record:', error.response ? error.response.data : error.message);
              Swal.fire(
              'Error!',
              'There was an issue retrieving the record.',
              'error'
            );
            });
      }
    })
    }
  }}
  </script>
  
  <style scoped>
  .v-card:hover {
    background-color: #f0f0f0;
  }
  
  .add-record-button {
    background-color: #2F3F64;
    border-radius: 5px;
    color: white;
  }
  
  .add-record-button:hover {
    background-color: var(--grey);
  }
  
  .status-cleared {
    color: green;
  }
  
  .status-not-cleared {
    color: red;
  }
  </style>
  