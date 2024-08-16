<template>
    <v-data-table
      :headers="headers"
      :items="displayedViolations"
      :search="search"
      :sort-by="[{ key: 'case_date', order: 'desc' }]"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-text-field
            v-model="search"
            class="w-auto mr-4"
            density="compact"
            label="Search Violation"
            prepend-inner-icon="mdi-magnify"
            variant="solo-filled"
            flat
            hide-details
            single-line
            style="max-width: 500px;"
          ></v-text-field>
  
          <v-btn @click="openDialog" class="mb-2 rounded-l add-record-button mr-2" dark>
            <v-icon left>mdi-plus</v-icon>
            Add Violation
          </v-btn>
          <v-btn @click="navigateToArchive" class="mb-2 rounded-l add-record-button mr-2" dark>
            <v-icon left>mdi-archive</v-icon>
            Archive
          </v-btn>
          <v-btn @click="openPolicy" class="mb-2 rounded-l add-record-button mr-2">
            <v-icon left>mdi-lightbulb</v-icon>
            Policy
          </v-btn>
      <!-- Report Generation Dropdown -->
       
      <v-menu offset-y close-on-content-click="false">
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" class="mb-2 rounded-l add-record-button" dark>
            <v-icon left>mdi-file-chart</v-icon>
            Generate Report
            <v-icon right>mdi-menu-down"></v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item>
        <v-text-field
          v-model="studentIdForReport"
          label="Enter Student ID"
          prepend-icon="mdi-account"
          class="mt-4"
          hide-details
        ></v-text-field>
      </v-list-item>

      <v-list-item>
      <v-btn @click="generateReportByStudentId" class="mb-2 rounded-l add-record-button" dark>
        <v-icon left>mdi-file-chart</v-icon>
        Generate Report by Student ID
      </v-btn>
    </v-list-item>

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
        <v-list-item>
      <v-btn @click="generateReportByStudentId" class="mb-2 rounded-l add-record-button" dark>
        <v-icon left>mdi-file-chart</v-icon>
        Generate Report by Student ID
      </v-btn>
    </v-list-item>
</v-list>
    </v-menu>
  </v-toolbar>
  <v-dialog v-model="dialog" max-width="1000px">
        <v-card>
          <v-card-title>
            <span class="text-h6" style="color: #ffffff">New Violation Record</span>
          </v-card-title>
          <v-card-text>
                        <v-container>
              <v-row dense>
                <v-col cols="12">
                  <v-text-field
                    v-model="editedItem.student_id"
                    label="Student ID*"
                    prepend-icon="mdi-account"
                    required
                    type="number"
                    @input="handleInput"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="editedItem.case_title"
                    label="Title*"
                    prepend-icon="mdi-book"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="editedItem.case_description"
                    label="Detailed Description*"
                    prepend-icon="mdi-note"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-select
                    v-model="editedItem.case_sanction"
                    label="Sanction*"
                    prepend-icon="mdi-security"
                    required
                    placeholder="Select a sanction"
                    :items="[
                      'A - Oral warning/reprimand',
                      'A.1 - Item to be collected/ confiscated',
                      'B - Warning with written agreement',
                      'C - Suspension',
                      'D - Non-readmission'
                    ]"
                  ></v-select>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="white" variant="text" @click="saveNewRecord" class="add-record-button">Save</v-btn>
            <v-btn color="white" variant="text" @click="closeDialog" class="add-record-button">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Policy Dialog -->
      <v-dialog v-model="policyDialog" max-width="1000px">
        <v-card>
          <v-card-title>
            <span class="text-h6" style="color: #ffffff"><h2 >Violation Policy</h2></span>
          </v-card-title>
          <v-card-text>
            <p>CODE OF DISCIPLINE</p>
            <p>Discipline is a form of guidance and can help greatly in the development of a responsible and mature Christian. It is not equaled with punishment although certain disciplinary procedures carry with them sanctions.</p>
            <p>Legend:</p>
            <ul>
              <li>A - Oral warning/reprimand</li>
              <li>A.1 - Item to be collected/ confiscated</li>
              <li>B - Warning with written agreement</li>
              <li>C - Suspension</li>
              <li>D - Non-readmission</li>
            </ul>
            <p>TYPE OF OFFENSES</p>
            <p>1. Minor Offenses<br>
            The following are considered minor offenses which merit the teacher's attention and concern but which nevertheless deserve disciplinary action.</p>
            <p>A) Irregularities</p>
            <ul>
              <li>(1) Frequent tardiness - 3x Tardy = A<br>
              - 5x Tardy = B<br>
              - More than 10x Tardy = C (Major Offense)</li>
              <li>(2) Absenteeism = B</li>
              <li>(3) Littering = A</li>
              <li>(4) Loitering / Cutting Class 3x</li>
              <li>(5) Loud conversation and boisterous laughter in areas designated for silence = B</li>
              <li>(6) Quarrels among classmates like shouting, taunting/extreme teasing, etc. = B</li>
            </ul>
            <p>B) Improper Use of Uniform/ID</p>
            <ul>
              <li>(1) Incomplete Uniform = A</li>
              <li>(2) Use of colored socks (SHS - Black or White), Use of white socks only (JHS) = A</li>
              <li>(3) Short skirt (3 inches below the knee) = A</li>
              <li>(4) Use of P.E. uniform outside P.E. time = A</li>
              <li>(5) Use of rubber shoes outside P.E. time = A</li>
              <li>(6) Use of pants and shirt/blouse not according to the school model = A</li>
              <li>(7) Improper or non-use of ID = A</li>
              <li>(8) Using another's ID = B</li>
              <li>(9) Tampering ID Card = B</li>
            </ul>
            <p>C) Improper haircut and hair dyeing (boys) = A</p>
            <p>D) Wearing of multiple earrings for girls, ring with spikes and belt with big buckles (boys) = A.1</p>
            <p>E) Applying of make-up, using lipstick/liptin and hair dyeing (girls) = </p>
            <p>F) Wearing of nail polish and long nails = </p>
            <p>G) Sitting squatting on the tables or along stairways = A</p>
            <p>H) Use of vulgar, abusive, or disrespectful language = B</p>
            <p>I) Improper decorum during flag ceremony = A</p>
            <p>J) Unruly conduct during school assemblies in the Church/Chapel, Social Hall, Library, Corridors, Canteen, etc. = B</p>
            <p>K) Eating, giggling, screaming, boisterous laughter, etc. during class hours or during assemblies = B</p>
            <p>L) Bringing to school unnecessary items not needed for learning</p>
            <p>*Any minor offense committed habitually (3x) will be considered a major offense.</p>
            <p>2. Major Offenses<br>
            The following are considered major offenses and therefore merit the administration's reserved disciplinary actions.</p>
            <p>A) Forgery or any other fraudulent acts. = C<br>
            (1) Tampering of school form and credentials<br>
            (2) Falsifying signature of school authorities, teachers, parents or guardians.</p>
            <p>B) Vandalism = C</p>
            <p>C) Drinking any form of intoxicating liquor and/or coming to school drunk. = C</p>
            <p>D) Possessing, using, taking, and selling prohibited drugs. = D</p>
            <p>E) Smoking and using Vape within 50 meter radius outside the school campus. = C</p>
            <p>F) Insubordination<br>
            (1) Abusive behavior or discourtesy towards the teacher, any school authority, his representative, student, or any member of the staff. = C<br>
            (2) Open defiance of school rules and regulations and school authorities. = C</p>
            <p>G) Possession of pornographic materials<br>
            Circulating immoral/indecent literature in school. = C</p>
            <p>H) Possession of deadly weapon. = C</p>
            <p>I) Boycotting Classes<br>
            Instigating, threatening, coercing, intimidating another student from attending classes or participating in any unauthorized activity.</p>
            <p>J) Stealing, theft, or damage to other's property<br>
            (1) Failure to return borrowed materials after repeated reminders. = C<br>
            (2) Refusal to make necessary replacement of destroyed/borrowed materials = C</p>
            <p>K) Gambling of any form = B</p>
            <p>L) Indecency<br>
            (1) Participating in public shows if ill repute and committing acts that lead to public scandal = C<br>
            (2) Immoral conduct/display of intimacy and affection = C<br>
            (3) With live-in partner = D</p>
            <p>M) Cheating during examination = B</p>
            <p>N) Injury to others = C</p>
            <p>O) Leaving the school premises without permission</p>
            <p>P) Bullying (i.e. cyberbullying, social media, etc) = C</p>
          </v-card-text>
          <v-card-actions>
            <v-btn color="white" variant="text" @click="closePolicyDialog" class="mb-2 rounded-l add-record-button" dark>Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>

    <v-list>
      <v-list-item-group v-for="student in uniqueStudentIds" :key="student.student_id">
        <v-list-item @click="viewStudentViolations(student.student_id)">
          <v-list-item-content>
            <v-list-item-title>{{ student.student_id }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-data-table>

  <v-dialog v-model="viewingRecords" max-width="600px">
    <v-card>
        <v-card-title>Violation Details for Student ID: {{ selectedStudentId }}</v-card-title>
      <v-card-text v-if="selectedStudentViolations.length">
        <v-list>
            <v-list-item-group v-for="(caseItem, index) in selectedStudentViolations" :key="index">
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title><strong>Case Title:</strong> {{ caseItem.case_title }}</v-list-item-title>
                <v-list-item-subtitle><strong>Description:</strong> {{ caseItem.case_description }}</v-list-item-subtitle>
                <v-list-item-subtitle><strong>Sanction:</strong> {{ caseItem.case_sanction }}</v-list-item-subtitle>
                <v-list-item-subtitle><strong>Date:</strong> {{ formatDate(caseItem.case_date) }}</v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn @click="editCase(caseItem)" class="mr-2" small> Edit </v-btn>
                <v-btn @click="archiveCase(caseItem.cases_id)" small> Archive </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="viewingRecords = false" class="mb-2 rounded-l add-record-button" dark>Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

</template>
  
<script>
import axios from 'axios';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { format } from 'date-fns';
  
export default {
  data() {
    return {
      cases: [],
      uniqueStudentIds: [],
      selectedStudentId: null,
      selectedStudentViolations: [],
      viewingRecords: false,
      studentIdForReport: "",
      dialog: false,
      policyDialog: false,
      editedItems: [],
      editedItem: {
        id: null, // Field to track record ID
        student_id: null, // Nullable
        case_title: '',
        case_description: '',
        case_sanction: '',
        case_status: 0,
        case_date: ''
      },
      search: '',
      headers: [
        { title: 'Student ID', value: 'student_id' },
        { title: 'Student Name', value: 'full_name' },
        // { title: 'Title', value: 'case_title' },
        // { title: 'Sanction', value: 'case_sanction' },
        { title: 'Status', value: 'case_status' },
        { title: 'Date', value: 'case_date' },
        { title: 'Actions', value: 'actions', sortable: false }
      ],
      viewingRecords: false,
    };
  },
  
  
  mounted() {
    this.fetchViolations();
  },
  computed: {
    displayedViolations() {
        const searchTerm = this.search.toLowerCase();
      return this.cases.filter(violation =>
        violation.student_id.toLowerCase().includes(searchTerm)
      );
    },
    uniqueStudentIds() {
      const uniqueIds = new Set(this.cases.map(item => item.student_id));
      return Array.from(uniqueIds).map(id => ({ student_id: id }));
    }
  },
  methods: {

    viewRecords(item) {
      console.log('Viewing records for ID:', item.student_id);
      this.editedItems = item.all_cases || []; // Set to the array of cases for the student
      this.viewingRecords = true;
    },

    viewRecords(item) {
  console.log('Viewing records for ID:', item.student_id);
  this.editedItems = item.all_cases || []; // Set to the array of cases for the student
  this.viewingRecords = true;
},

    groupCasesByStudentId() {
    const grouped = {};

    this.cases.forEach((violation) => {
      if (!grouped[violation.student_id]) {
        grouped[violation.student_id] = {
          student_id: violation.student_id,
          full_name: violation.full_name,
          cases: []
        };
      }
      grouped[violation.student_id].cases.push(violation);
    });

    return Object.values(grouped).map((student) => ({
      student_id: student.student_id,
      full_name: student.full_name,
      case_title: student.cases.map((c) => c.case_title).join(', '),
      case_status: student.cases.some((c) => c.case_status === 0) ? 'Not-Cleared' : 'Cleared',
      case_date: student.cases[0].case_date,
      all_cases: student.cases
    }));
  },

    generateReportByStudentId() {
      if (!this.studentIdForReport) {
        Swal.fire({
          icon: "warning",
          title: "No Student ID Provided",
          text: "Please enter a student ID before generating the report.",
        });
        return;
      }

      const filteredViolations = this.cases.filter(
        (violation) => violation.student_id === this.studentIdForReport
      );

      if (filteredViolations.length === 0) {
        Swal.fire({
          icon: "info",
          title: "No Records Found",
          text: `No cases found for Student ID: ${this.studentIdForReport}.`,
        });
        return;
      }

      this.exportReport(filteredViolations, `Report for Student ID: ${this.studentIdForReport}`);
    },
    formatDate(dateString) {
  console.log('Input dateString:', dateString); // Log input for debugging

  if (!dateString || typeof dateString !== 'string') {
    return 'No Date Provided';
  }

  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    console.error('Invalid date:', dateString);
    return 'Invalid Date';
  }

  return format(date, 'MM/dd/yyyy HH:mm:ss');
},
    handleInput(event) {
      // Extract the value from the event
      const value = event.target.value;

      // Remove any non-digit characters
      const digitsOnly = value.replace(/\D/g, '');

      // Limit the value to a maximum of 12 digits
      this.editedItem.student_id = digitsOnly.slice(0, 12);
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
      const filteredViolations = this.cases.filter((violation) => {
        const caseDate = new Date(violation.case_date);
        return caseDate >= startDate && caseDate < endDate;
      });

      this.exportReport(filteredViolations, reportTitle);
    },

    exportReport(violations, title) {
  try {
    // Ensure sheet name does not exceed 31 characters
    const safeTitle = title.length > 31 ? title.substring(0, 31) : title || 'Report';

    const data = violations.map((v) => ({
      'Student ID': v.student_id,
      'Full Name': v.full_name,
      'Title': v.case_title,
      'Description': v.case_description,
      'Sanction': v.case_sanction,
      'Status': v.case_status === 0 ? 'Not-Cleared' : 'Cleared',
      'Date': v.case_date
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
    XLSX.utils.book_append_sheet(wb, ws, safeTitle); // Use safeTitle here

    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    saveAs(blob, `${title}.xlsx`);
  } catch (error) {
    console.error('Error exporting report:', error);
  }
},

    fetchViolations() {
      axios.get('http://26.81.173.255:8000/api/cases')
        .then(response => {
          console.log('Fetched violations:', response.data.cases);
          this.cases = response.data.cases.map((cases) => ({
            ...cases, 
            full_name: `${cases.student_profile.first_name} ${cases.student_profile.middle_name} ${cases.student_profile.last_name}`.trim(),
          }));
        })
        .catch(error => {
          console.error('Error fetching violations:', error.response ? error.response.data : error.message);
        });
    },
    viewStudentViolations(studentId) {
      this.selectedStudentId = studentId;
      this.selectedStudentViolations = this.cases.filter(caseItem => caseItem.student_id === studentId);
      this.viewingRecords = true;
    },
    formatDate(date) {
      // Implement your date formatting logic here
      return new Date(date).toLocaleDateString();
    },

    saveNewRecord() {
      const dataToSend = {
        student_id: this.editedItem.student_id || '',
        case_title: this.editedItem.case_title,
        case_description: this.editedItem.case_description,
        case_sanction: this.editedItem.case_sanction,
        case_status: 0
      };
      this.viewingRecords = false;
      this.dialog= false; 
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to save this record?',
        icon: 'question',
        showCancelButton: true,
        textcolor: "#ffffff",
        confirmButtonText: '<span style="color: #ffffff;">Yes</span>',
        confirmButtonColor: "#4CAF50",
        cancelButtonText: '<span style="color: #ffffff;">No</span>',
        cancelButtonColor: "#F44336",
      }).then((result) => {
        if (result.isConfirmed) {
      console.log('Data to send:', dataToSend);
      
      if (this.validateForm()) {
        axios.post('http://26.81.173.255:8000/api/cases', dataToSend)
          .then(response => {
            console.log('Record saved successfully:', response.data);
            this.cases.push(response.data.case);
            this.closeDialog();
            Swal.fire('Saved!', 'Record saved successfully!', 'success');
          })
          .catch(error => {
            console.error('Error saving new record:', error.response ? error.response.data : error.message);
            Swal.fire({
        title: 'Error',
        text: 'Failed to Save Violation record',
        icon: 'error',
        confirmButtonColor: '#F44336',
        confirmButtonText: '<span style="color: #ffffff;">OK</span>',

      });
          });
      } else {
        console.log('Form validation failed');
      }
    }
  });
},

 archiveCase(caseId) {
  this.dialog = false;
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to archive this record?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        confirmButtonColor: "#4CAF50",
        cancelButtonText: 'No',
        cancelButtonColor: "#F44336",
      }).then((result) => {
        if (result.isConfirmed) {
          console.log('Received ID for archiving:', caseId);
          axios.post('http://26.81.173.255:8000/api/cases/arch', { cases_id: caseId })
            .then(response => {
              console.log('Record archived successfully:', response.data);
              this.editedItems = this.editedItems.filter(record => record.cases_id !== caseId);
              Swal.fire('Archived!', 'Record archived successfully!', 'success');
            })
            .catch(error => {
              console.error('Error archiving record:', error.response ? error.response.data : error.message);
              Swal.fire('Error', 'Error archiving record', 'error');
            });
        }
      });
    },
    openDialog() {
      this.editedItem = {
        id: null,
        student_id: '',
        case_title: '',
        case_description: '',
        case_sanction: '',
        case_status: 0,
        case_date: ''
      };
      this.dialog = true;
    },

    closeDialog() {
      this.dialog = false;
    },

    openPolicy() {
      this.policyDialog = true;
    },

    closePolicyDialog() {
      this.policyDialog = false;
    },

    navigateToArchive() {
      this.$router.push('/violationarchive');
    },

    editRecord(item) {
      this.editedItem = item;
      console.log(this.editedItem);
      this.dialog = true;
    },

    validateForm() {
      return this.editedItem.case_title && this.editedItem.case_description && this.editedItem.case_sanction;
    },

    viewRecords(id) {
      console.log('Viewing records for ID:', id);
      this.editedItems= { ...id };
      this.viewingRecords = true;
    },
    },
  };
 
</script>

<style>
.v-card-title {
  text-align: center;
  background-color: #2F3F64;
  color: #f0f0f0;
}

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
</style>