<template>
  <v-data-table
    :search="search"
    :headers="headers"
    :items="displayedConsultations"
    :sort-by="[{ key: 'student_id', order: 'asc' }]"
  >

<!-- Search Bar-->

    <template v-slot:top>
      <v-toolbar flat>
        <v-text-field
          v-model="search"
          class="w-auto mr-4"
          density="compact"
          label="Search Entry"
          prepend-inner-icon="mdi-magnify"
          variant="solo-filled"
          flatf
          hide-details
          single-line
          style="max-width: 500px;"
        ></v-text-field>

<!-- Add Record and Archive Button-->

        <v-dialog v-model="dialog" max-width="1000px">
          <template v-slot:activator="{ props }">
            <v-btn @click="openDialog" class="mb-2 rounded-l add-record-button mr-2" dark v-bind="props" prepend-icon="mdi-plus">Add Record</v-btn>
            <v-btn @click="openArchives" class="mb-2 rounded-l add-record-button mr-2" to="/consultationarchive" prepend-icon="mdi-archive">Archive</v-btn>
            <v-menu offset-y>
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" class="mb-2 rounded-l add-record-button" dark>
             <v-icon left>mdi-file-chart</v-icon>
              Generate Report
             <v-icon right>mdi-menu-down"></v-icon>
            </v-btn>
          </template>

<!-- generate Report-->

      <v-list>
            <v-list-item @click="generateDailyReport" class="mb-2 rounded-l add-record-button">
          <v-list-item-icon>
          </v-list-item-icon>
          <v-list-item-title>Generate Daily Report</v-list-item-title>
        </v-list-item>
        <v-list-item @click="generateWeeklyReport" class="mb-2 rounded-l add-record-button">
          <v-list-item-icon>
          </v-list-item-icon>
          <v-list-item-title>Generate Weekly Report</v-list-item-title>
        </v-list-item>
        <v-list-item @click="generateMonthlyReport" class="mb-2 rounded-l add-record-button">
          <v-list-item-icon>
          </v-list-item-icon>
          <v-list-item-title>Generate Monthly Report</v-list-item-title>
        </v-list-item>
        <v-list-item @click="generateYearlyReport" class="mb-2 rounded-l add-record-button">
          <v-list-item-icon>
          </v-list-item-icon>
          <v-list-item-title>Generate Yearly Report</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
</template>     

<!-- New Record -->

          <v-card>
            <v-card-title>New Consultation Record</v-card-title>
            <v-card-text>
              <v-container>
                <v-row dense>
                  <v-col cols="12">
                    <v-text-field
                      v-model="editedItem.student_id"
                      label="Student ID*"
                      prepend-icon="mdi-account"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="editedItem.con_title"
                      label="Entry Title*"
                      prepend-icon="mdi-book"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-textarea
                      v-model="editedItem.con_notes"
                      label="Entry Details*"
                      prepend-icon="mdi-note"
                      required
                    ></v-textarea>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="editedItem.con_date"
                      label="Entry Date*"
                      prepend-icon="mdi-calendar"
                      required
                      type="datetime-local" 
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

<!-- VIEW RECORDS -->

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
              <v-btn @click="editItem(selectedConsultation)" class="mb-2 rounded-l add-record-button" dark>Edit</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>

<!-- TABLE -->

    <template v-slot:item="{ item }">
      <tr>
        <td>{{ item.student_id || 'N/A' }}</td>
        <td>{{ item.con_title }}</td>
        <!-- <td>{{ item.con_notes }}</td> -->
        <td>{{ formatDate(item.con_date) }}</td>
        <td>
          <v-icon style="color: #2F3F64" @click="viewRecords(item)"><span class= "mdi mdi-eye-circle fs-5 mr-2"></span></v-icon>
          <v-icon size="small" style="color: #2F3F64" @click="archiveItem(item.con_id)" class="mdi mdi-archive fs-5"></v-icon>
        </td>
      </tr>
    </template>
  </v-data-table>

<!-- ARCHIVE RECORD-->

  <v-dialog v-model="archiveDialog" max-width="400px">
  <v-card>
    <v-card-title class="headline">Confirm Archive</v-card-title>
    <v-card-text>Are you sure you want to archive this consultation record?</v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn @click="archiveConfirmed" class="mb-2 rounded-l add-record-button" >Yes</v-btn>
      <v-btn @click="archiveDialog = false" class="mb-2 rounded-l add-record-button" >No</v-btn>
    </v-card-actions>
  </v-card>
  </v-dialog>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export default {
  data() {
    return {
      displayedConsultations: [],
      value: null,
      dialog: false,
      editedItem: {
        student_id: '',
        con_title: '',
        con_notes: '',
        con_date: this.getCurrentDate(), // Initialize with the current date
      },
      search: '',
      headers: [
        { title: 'Student ID', value: 'student_id' },
        { title: 'Student Name', value: 'full_name' },
        { title: 'Entry Title', value: 'con_title' },
        // { title: 'Important Notes', value: 'con_notes' },
        { title: 'Entry Date', value: 'con_date' },
        { title: 'Actions', sortable: false },
      ],
      viewingRecords: false,
      selectedConsultation: null,
      archiveDialog: false,
      selectedConsultationId: null,
    };
  },

  methods: {
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
    generateDailyReport() {
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      this.generateReport(startOfDay, endOfDay, 'Daily Report');
    },

    generateWeeklyReport() {
      const now = new Date();
      const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
      const endOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() + (6 - now.getDay()));
      this.generateReport(startOfWeek, endOfWeek, 'Weekly Report');
    },

    generateMonthlyReport() {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      this.generateReport(startOfMonth, endOfMonth, 'Monthly Report');
    },

    generateYearlyReport() {
      const now = new Date();
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      const endOfYear = new Date(now.getFullYear(), 11, 31);
      this.generateReport(startOfYear, endOfYear, 'Yearly Report');
    },

    generateReport(startDate, endDate, reportTitle) {
      const filteredConsultations = this.displayedConsultations.filter((consultation) => {
        const caseDate = new Date(consultation.con_date);
        return caseDate >= startDate && caseDate < endDate;
      });

      this.exportReport(filteredConsultations, reportTitle);
    },

    exportReport(consultations, title) {
      try {
        const data = consultations.map((c) => ({
          'Student ID': c.student_id,
          'Entry Title': c.con_title,
          'Important Notes': c.con_notes,
          'Entry Date': c.con_date,
        }));

        const ws = XLSX.utils.json_to_sheet(data);
        ws['!cols'] = Array(data[0] ? Object.keys(data[0]).length : 0).fill({ width: 18 });

        const centerStyle = {
          alignment: { horizontal: 'center', vertical: 'center' }
        };

        for (let cellAddress in ws) {
          if (cellAddress[0] === '!') continue;
          if (!ws[cellAddress].s) ws[cellAddress].s = {};
          Object.assign(ws[cellAddress].s, centerStyle);
        }

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, title);

        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

        saveAs(blob, `${title}.xlsx`);
      } catch (error) {
        console.error('Error exporting report:', error);
      }
  },
    fetchConsultations() {
    axios.get('http://26.81.173.255:8000/api/consultation')
    .then(response => {
      this.displayedConsultations = response.data.consultations;
    })
    .catch(error => {
      console.error('Error fetching consultations:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to fetch Consultations',
        icon: 'error',
        showConfirmButton: false, 
        timer: 3000, 

      });
    });
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
    closeDialog() {
      this.dialog = false;
      this.editedItem = {
        student_id: '',
        con_title: '',
        con_notes: '',
        con_date: '',
      };
    },
    viewRecords(consultation) {
      this.selectedConsultation = { ...consultation };
      this.viewingRecords = true;
    },
    editItem(consultation) {
      this.selectedConsultation = { ...consultation };
      this.editedItem = { ...consultation };
      this.dialog = true;
    },
    saveNewRecord() {
      this.viewingRecords = false;
      this.dialog= false; 
      Swal.fire({
        title: 'Are You Sure?',
        text: 'Do you want to save this Record?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: '<span style="color: #ffffff;">Yes</span>',
        confirmButtonColor: "#4CAF50",
        cancelButtonText: '<span style="color: #ffffff;">No</span>',
        cancelButtonColor: "#F44336",
      }).then((result) => {
        if (result.isConfirmed) {
          if (this.editedItem.con_id) {
            // Update existing record
            axios.put(`http://26.81.173.255:8000/api/consultation/${this.editedItem.con_id}, this.editedItem`)
              .then(response => {
                this.fetchConsultations();
                this.closeDialog();
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
          } else {
            // Add new record
            axios.post('http://26.81.173.255:8000/api/consultation', this.editedItem)
              .then(response => {
                console.log('Record saved successfully:', response.data);
                this.displayedConsultations.push(response.data.consultation);
                this.closeDialog();
                Swal.fire({
                 title: 'Saved',
                 text: 'Record saved successfully!',
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
            }
           });
    
      if (this.validateForm()) {
        axios.post('http://26.81.173.255:8000/api/consultations', this.editedItem)
          .then(response => {
            console.log('Record saved successfully:', response.data);
            this.displayedConsultations.push(response.data.consultation);
            this.closeDialog();
            Swal.fire({
             title: 'Updated',
             text: 'Record saved successfully!',
             icon: 'success',
             showConfirmButton: false, 
             timer: 3000, 
            });
           })
          .catch(error => {
            console.error('Error saving new record:', error.response ? error.response.data : error.message);
            Swal.fire({
             title: 'Error',
             text: 'Error saving new record',
             icon: 'error',
             showConfirmButton: false, 
             timer: 3000, 
            });
           });
          }
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
      axios
        .post(`http://26.81.173.255:8000/api/consultation/${id}/archive`)
        .then((response) => {
          this.fetchConsultations();
          Swal.fire({
            title: 'Archived',
            text: 'Record archived successfully!',
            icon: 'success',
            showConfirmButton: false,
            timer: 3000,
          });
        })
        .catch((error) => {
          console.error(error);
          Swal.fire({
            title: 'Error',
            text: 'Error archiving record',
            icon: 'error',
            showConfirmButton: false,
            timer: 3000,
          });
        });
    } else {
      // Handle the case where the user cancels the action
      Swal.fire({
        title: 'Cancelled',
        text: 'Your record was not archived',
        icon: 'info',
        showConfirmButton: false,
        timer: 3000,
      });
    }
  });
},

archiveConfirmed() {
  if (this.selectedConsultationId !== null) {
    axios
      .post(`http://26.81.173.255:8000/api/consultation/${this.selectedConsultationId}/archive`)
      .then((response) => {
        this.fetchConsultations();
        this.archiveDialog = false;
        Swal.fire({
          title: 'Archived',
          text: 'Record archived successfully!',
          icon: 'success',
          showConfirmButton: false,
          timer: 3000,
        });
      })
      .catch((error) => {
        console.error('Error archiving consultation:', error.response ? error.response.data : error.message);
        Swal.fire({
          title: 'Error',
          text: 'Error archiving record',
          icon: 'error',
          showConfirmButton: false,
          timer: 3000,
        });
      });
  } else {
    // Handle the case where no consultation is selected
    Swal.fire({
      title: 'Error',
      text: 'No record selected to archive',
      icon: 'error',
      showConfirmButton: false,
      timer: 3000,
    });
  }
},
  },
    // archiveConfirmed() {
    //   if (this.selectedConsultationId !== null) {
    //     axios.post('http://26.81.173.255:8000/api/consultation/${this.selectedConsultationId}/archive')
    //       .then(response => {
    //         console.log('Consultation archived successfully:', response.data);
    //         this.updateConsultations();
    //         this.archiveDialog = false; // Close the dialog
    //       })
    //       .catch(error => {
    //         console.error('Error archiving consultation:', error.response ? error.response.data : error.message);
    //       });
    //   }
    // },
//     updateConsultations() {
//       // Method to refresh the list of consultation or update the local state
//       axios.get('http://26.81.173.255:8000/api/consultation')
//         .then(response => {
//           this.consultations = response.data.consultations;
//         })
//         .catch(error => {
//           console.error('Error fetching consultations:', error.response ? error.response.data : error.message);
//         });
//     },
//     formatDate(dateString) {
//     const date = new Date(dateString);
//     // Format as YYYY-MM-DD HH:MM:SS
//     return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
//   },
//   },
  mounted() {
    this.fetchConsultations();
  }
};
</script>

<style>
.v-card:hover {
  background-color: #f0f0f0;
}

.v-card-title {
  text-align: center;
  background-color: #2F3F64;
  color: #f0f0f0;
}

.add-record-button {
  background-color: #2F3F64;
  border-radius: 5px;
  color: white;
}

.add-record-button:hover {
  background-color: var(--grey);
}
</style>
