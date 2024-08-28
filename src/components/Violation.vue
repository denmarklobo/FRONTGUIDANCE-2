<template>
  <v-data-table
    :headers="headers"
    :items="displayedViolations"
    :search="search"
    :sort-by="[{ key: 'case_date', order: 'desc' }]"
    class="no-pagination"
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
        <v-btn @click="navigateToCleared" class="mb-2 rounded-l add-record-button mr-2" to="/violationarchive" dark>
          <v-icon left>mdi-check</v-icon>
          Cleared
        </v-btn>
        <v-btn @click="navigateToArchive" class="mb-2 rounded-l add-record-button mr-2" to="/violationarchive" dark>
          <v-icon left>mdi-archive</v-icon>
          Archived
        </v-btn>

        <v-btn @click="openPolicy" class="mb-2 rounded-l add-record-button mr-2">
          <v-icon left>mdi-lightbulb</v-icon>
          Policy
        </v-btn>

        <!-- Report Generation Dropdown -->
        <v-menu
          offset-y
          :close-on-content-click="false"
          ref="menu"
          @click:outside="handleClickOutside"
          v-model="menuVisible"
        >
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" class="mb-2 rounded-l add-record-button" dark>
              <v-icon left>mdi-file-chart</v-icon>
              Generate Report
              <v-icon right>mdi-menu-down</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item>
              <v-btn @click="selectFormat('Excel')" class="m-2" dark>Generate as Excel</v-btn>
              <v-btn @click="selectFormat('PDF')" class="m-2" dark>Generate as PDF</v-btn>
            </v-list-item>
            <template v-if="showReportOptions">
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
                  Generate Report by Student ID ({{ reportFormat }})
                </v-btn>
              </v-list-item>
              <v-list-item @click="generateDailyReport" class="mb-2 rounded-l add-record-button">
                <v-list-item-icon></v-list-item-icon>
                <v-list-item-title>Generate Daily Report ({{ reportFormat }})</v-list-item-title>
              </v-list-item>
              <v-list-item @click="generateWeeklyReport" class="mb-2 rounded-l add-record-button">
                <v-list-item-icon></v-list-item-icon>
                <v-list-item-title>Generate Weekly Report ({{ reportFormat }})</v-list-item-title>
              </v-list-item>
              <v-list-item @click="generateMonthlyReport" class="mb-2 rounded-l add-record-button">
                <v-list-item-icon></v-list-item-icon>
                <v-list-item-title>Generate Monthly Report ({{ reportFormat }})</v-list-item-title>
              </v-list-item>
              <v-list-item @click="generateYearlyReport" class="mb-2 rounded-l add-record-button">
                <v-list-item-icon></v-list-item-icon>
                <v-list-item-title>Generate Yearly Report ({{ reportFormat }})</v-list-item-title>
              </v-list-item>
            </template>
          </v-list>
        </v-menu>
      </v-toolbar>
    </template>

    <!-- New Violation Dialog -->
    <v-dialog v-model="dialog" max-width="1000px">
      <v-card>
        <v-card-title>
          <span class="text-h6" style="color: #ffffff">New Violation Record</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row dense>
              <v-col cols="12">
                <!-- <v-text-field -->
                <v-autocomplete
                  v-model="editedItem.student_id"
                  label="Student ID*"
                  prepend-icon="mdi-account"
                  required
                  type="number"
                  @input="handleInput"
                ></v-autocomplete>
                <!-- ></v-text-field> -->
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

    <!-- Edit Violation Dialog -->
    <v-dialog v-model="editRecordDialog" max-width="1000px">
  <v-card>
    <v-card-title>
      <span class="text-h6" style="color: #ffffff">Edit Violation Record</span>
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
          <v-col cols="12">
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="white" variant="text" @click="saveEditedRecord" class="add-record-button">Save</v-btn>
      <v-btn color="white" variant="text" @click="closeEditRecordDialog" class="add-record-button">Cancel</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>


    <!-- Policy Dialog -->
    <v-dialog v-model="policyDialog" max-width="1000px">
      <v-card>
        <v-card-title>
          <span class="text-h6" style="color: #ffffff"><h2>Violation Policy</h2></span>
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

    <v-card>
  <v-card-title class="text-h6 font-weight-bold">
    <span>Students With Active Violations</span>
  </v-card-title>
  <v-divider></v-divider>
  <v-card-text>
    <v-row class="font-weight-bold">
      <v-col cols="2">Student ID</v-col>
      <v-col cols="3">Student Name</v-col>
      <v-col cols="2">Grade Level</v-col>
      <v-col cols="2">Guardian Mobile No.</v-col>
      <v-col cols="2">Student Guidance Status</v-col>
    </v-row>
    <v-divider></v-divider>
    <!-- List of unique student IDs for Violations -->
    <v-list>
      <v-list-item-group v-for="student in uniqueStudentIds" :key="student.student_id">
        <v-list-item
          @click="viewStudentViolations(student.student_id)"
          class="list-item"
        >
          <v-list-item-content>
            <v-row>
              <v-col cols="2">{{ student.student_id }}</v-col>
              <v-col cols="3">{{ student.full_name }}</v-col>
              <v-col cols="2">{{ student.grade_level }}</v-col>
              <v-col cols="2">{{ student.guardian_mobileno }}</v-col>
              <v-col cols="2" :class="caseStatusClass(student.student_id)">
                {{ caseStatus(student.student_id) }}
              </v-col>
            </v-row>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-card-text>
</v-card>

    
<!-- Dialog for viewing all violations of the selected student -->
<v-dialog v-model="viewingRecords" max-width="900px" @click:outside="viewingRecords = false">
    <v-card>
      <v-card-title>
        Violation Details for Student ID: {{ selectedStudentId }}
      </v-card-title>
      <v-card-text>
        <v-row>
          <!-- Active Violations Column -->
          <v-col cols="6">
            <v-card-title>
              Active Violations
            </v-card-title>
            <v-list v-if="selectedStudentViolations.length">
              <v-list-item-group v-for="(caseItem, index) in selectedStudentViolations" :key="index">
                <v-list-item :class="caseStatusClass(caseItem)">
                  <v-list-item-content>
                    <v-list-item-title style="padding: 0.3rem;">
                      <strong>Case Title:</strong> {{ caseItem.case_title }}
                    </v-list-item-title>
                    <v-list-item-subtitle style="padding: 0.3rem;">
                      <strong>Description:</strong> {{ caseItem.case_description }}
                    </v-list-item-subtitle>
                    <v-list-item-subtitle style="padding: 0.3rem;">
                      <strong>Sanction:</strong> {{ caseItem.case_sanction }}
                    </v-list-item-subtitle>
                    <v-list-item-subtitle style="padding: 0.3rem;">
                      <strong>Date and Time:</strong> {{ formatDateTime(caseItem.case_date) }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action style="padding: 0.3rem;">
                    <v-btn @click="editRecord(caseItem)" class="mr-2" small>
                      <v-icon>mdi-pencil</v-icon>Edit
                    </v-btn>
                    <v-btn @click="clearCase(caseItem.cases_id)" class="mr-2" small>
                      <v-icon>mdi-check</v-icon>Clear
                    </v-btn>
                    <v-btn @click="archiveCase(caseItem.cases_id)" class="mr-2" small>
                      <v-icon>mdi-archive</v-icon>Archive
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
                <hr>
              </v-list-item-group>
            </v-list>
            <v-alert v-else>No active violations found.</v-alert>
          </v-col>
          
          <!-- Violation History Column -->
          <v-col cols="6">
            <v-card-title>
      Violation History
    </v-card-title>
    <v-list v-if="filteredViolations.length">
      <v-list-item-group>
        <v-list-item v-for="historyItem in filteredViolations" :key="historyItem.cases_id">
          <v-list-item-content>
            <v-list-item-title style="padding: 0.3rem;">
              <strong>Case Title:</strong> {{ historyItem.case_title }}
            </v-list-item-title>
            <v-list-item-subtitle style="padding: 0.3rem;">
              <strong>Description:</strong> {{ historyItem.case_description }}
            </v-list-item-subtitle>
            <v-list-item-subtitle style="padding: 0.3rem;">
              <strong>Sanction:</strong> {{ historyItem.case_sanction }}
            </v-list-item-subtitle>
            <v-list-item-subtitle style="padding: 0.3rem;">
              <strong>Date and Time:</strong> {{ formatDateTime(historyItem.case_date) }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <hr>
      </v-list-item-group>
    </v-list>
    <v-alert v-else>No Violation history found.</v-alert>
  </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="viewingRecords = false" class="mb-2 rounded-l add-record-button" dark>Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  </v-data-table>
</template>


<script>
import axios from 'axios';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default {
  data() {
    return {
      menuVisible: false,
      showReportOptions: false,
      reportFormat: '',
      studentIdForReport: '',
      cases: [],
      violations: [],
      uniqueStudentIds: [],
      selectedStudentId: null,
      selectedStudentViolations: [],
      archivedViolations: [],
      viewingRecords: false,
      studentIdForReport: "",
      dialog: false,
      editRecordDialog: false,
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
    this.fetchArchivedViolations();
  },
  computed: {
    displayedViolations() {
      const searchTerm = this.search.toLowerCase();
      return this.cases.filter(violation =>
        violation.student_id.toLowerCase().includes(searchTerm)
      );
    },
    uniqueStudentIds() {
    const uniqueStudents = {};

    this.cases.forEach(cases => {
      const studentId = cases.student_profile.student_id;
      const fullName = `${cases.student_profile.first_name} ${cases.student_profile.middle_name} ${cases.student_profile.last_name}`.trim();
      const guardianMobileno = cases.student_profile.guardian_mobileno; // Add this line

      if (!uniqueStudents[studentId]) {
        // Determine case status: "Not-Cleared" if any case is not cleared (case_status === 0)
        const caseStatus = this.cases.some(c => c.student_profile.student_id === studentId && c.case_status === 0) 
                          ? 'Not-Cleared' 
                          : 'Cleared';

        uniqueStudents[studentId] = { 
          student_id: studentId, 
          full_name: fullName, 
          grade_level: cases.student_profile.grade_level,
          guardian_mobileno: guardianMobileno, // Add this line
          case_status: caseStatus 
        };
      }
    });

    return Object.values(uniqueStudents);
  },
  
    groupedCases() {
        return this.groupCasesByStudentId();
      },
    
      filteredViolations() {
      return this.archivedViolations.filter(item => item.student_id === this.selectedStudentId);
    }

    },

  methods: {
    async fetchArchivedViolations() {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/archived', {
        params: {
          student_id: this.selectedStudentId
        }
      });
      console.log("Full Response Data:", response.data);
      
      // Verify data structure
      if (response.data && response.data.archivedViolations) {
        this.archivedViolations = response.data.archivedViolations;
      } else {
        this.archivedViolations = [];
      }
    } catch (error) {
      console.error("Error fetching archived violations:", error);
      this.archivedViolations = [];
    }
    },
    watch: {
    selectedStudentId() {
      if (this.viewingRecords) {
        this.fetchArchivedViolations();
      }
    }
    },
    getStudentViolations(student_id) {
    // Filter violations by student_id
    return this.cases.filter(v => v.student_id === student_id);
  },

      getStudentViolations(student_id) {
    // Filter violations by student_id
    return this.cases.filter(v => v.student_id === student_id);
  },

    caseStatus(studentId) {
      return this.cases.some(c => c.student_profile.student_id === studentId && c.case_status === 0)
        ? 'Not-Cleared'
        : 'Cleared';
    },

    caseStatusClass(studentId) {
      return this.cases.some(c => c.student_profile.student_id === studentId && c.case_status === 0)
        ? 'not-cleared'
        : 'cleared';
    },
    editRecord(item) {
    this.editedItem = { ...item }; // Clone the selected item to avoid direct mutations
    this.editRecordDialog = true; // Open the edit dialog
  },
  saveEditedRecord() {
  if (!this.editedItem.cases_id) {
    Swal.fire('Error', 'Invalid case ID.', 'error');
    return;
  }

  axios.put(`http://127.0.0.1:8000/api/cases/${this.editedItem.cases_id}`, this.editedItem)
    .then(response => {
      console.log('Update response:', response.data);

      const index = this.violations.findIndex(violation => violation.cases_id === this.editedItem.cases_id);
      if (index !== -1) {
        this.violations[index] = response.data; 
      }

      console.log('Dialog closing');
      this.closeEditRecordDialog();
      this.closeViewingRecordsDialog();
      Swal.fire('Success!', 'Violation updated successfully!', 'success');
    })
    .catch(error => {
      console.error('Error updating record:', error.response ? error.response.data : error.message);
      Swal.fire('Error', 'Failed to update violation. Please try again.', 'error');
    });
},


  closeEditRecordDialog() {
    this.editRecordDialog = false; // Close the edit dialog
    this.editedItem = {}; // Reset the edited item
  },
    

  closeViewingRecordsDialog(){
    this.viewingRecords = false;
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

formatDateTime(dateTimeString) {
  if (!dateTimeString) return '';
  const date = new Date(dateTimeString);
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false // Use 24-hour time format
  };
  return date.toLocaleString('en-US', options); // Ensure correct formatting
},
selectFormat(format) {
      this.reportFormat = format;
      this.showReportOptions = true;
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

      this.reportFormat === 'PDF'
        ? this.exportPDF(filteredViolations, `Report for Student ID: ${this.studentIdForReport}`)
        : this.exportExcel(filteredViolations, `Report for Student ID: ${this.studentIdForReport}`);
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

      this.reportFormat === 'PDF'
        ? this.exportPDF(filteredViolations, reportTitle)
        : this.exportExcel(filteredViolations, reportTitle);
    },

    exportExcel(violations, title) {
      try {
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
        XLSX.utils.book_append_sheet(wb, ws, safeTitle);

        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

        saveAs(blob, `${title}.xlsx`);
      } catch (error) {
        console.error('Error exporting report:', error);
      }
    },

    exportPDF(violations, title) {
      try {
        const doc = new jsPDF();
        doc.text(title, 10, 10);

        const data = violations.map((v) => [
          v.student_id,
          v.full_name,
          v.case_title,
          v.case_description,
          v.case_sanction,
          v.case_status === 0 ? 'Not-Cleared' : 'Cleared',
          v.case_date
        ]);

        doc.autoTable({
          head: [['Student ID', 'Full Name', 'Title', 'Description', 'Sanction', 'Status', 'Date']],
          body: data,
          startY: 20
        });

        doc.save(`${title}.pdf`);
      } catch (error) {
        console.error('Error exporting PDF:', error);
      }
    },

    fetchViolations() {
      axios.get('http://127.0.0.1:8000/api/cases')
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
      this.archiveViolation = this.cases.filter(historyItem => historyItem.student_id === studentId);
      this.viewingRecords = true;
    },
    formatDate(date) {
      // Implement your date formatting logic here
      return new Date(date).toLocaleDateString();
    },

    getStudentViolations(student_id) {
    return this.cases.filter(v => v.student_id === student_id);
  },
  saveNewRecord() {
  if (!this.editedItem.student_id) {
    Swal.fire('Error', 'Student ID is required.', 'error');
    return;
  }

  // Fetch existing violations for the student
  const violationsForStudent = this.getStudentViolations(this.editedItem.student_id);

  // Check if the student already has 3 violations
  if (violationsForStudent.length >= 3) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'This student already has 3 violations.',
      confirmButtonText: 'OK'
    });
    return;
  }

  // Format the current date and time to 'YYYY-MM-DD HH:mm:ss'
  const formatDateTime = (date) => {
    const pad = (num) => num.toString().padStart(2, '0');
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  // Add the current date and time to the editedItem
  this.editedItem.case_date = formatDateTime(new Date());

  // Add the new record
  axios.post('http://127.0.0.1:8000/api/cases', this.editedItem)
    .then(response => {
      // Successfully saved
      this.cases.push(response.data); // Add the new violation to the list
      Swal.fire('Success!', 'New violation record saved successfully!', 'success')
        .then(() => {
          // Close the dialog after showing the success message
          this.closeDialog();
        });
    })
    .catch(error => {
      // Handle errors
      console.error('Error saving new record:', error.response ? error.response.data : error.message);
      Swal.fire('Error', 'Failed to save new record. Please try again.', 'error');
    });
},

archiveCase(caseId) {
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
            axios
                .post(`http://127.0.0.1:8000/api/cases/delete/${caseId}`) // Ensure the URL matches the route definition
                .then(response => {
                    // Handle successful response
                    console.log('Archived case response:', response.data);
                    this.fetchViolations(); // Refresh the list of violations
                    Swal.fire({
                        title: 'Archived',
                        text: 'Record Archived Successfully!',
                        icon: 'success',
                        showConfirmButton: false,
                        timer: 3000,
                    });
                })
                .catch(error => {
                    // Handle error response
                    console.error('Error archiving record:', error.response ? error.response.data : error.message);
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
                text: 'Archiving record was not performed',
                icon: 'info',
                showConfirmButton: false,
                timer: 3000,
            });
        }
    });
},

// formatDateTime = (date) => {
//   const pad = (num) => num.toString().padStart(2, '0');
//   const year = date.getFullYear();
//   const month = pad(date.getMonth() + 1);
//   const day = pad(date.getDate());
//   const hours = pad(date.getHours());
//   const minutes = pad(date.getMinutes());
//   const seconds = pad(date.getSeconds());
//   return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
// },

// this.editedItem.case_date = formatDateTime(new Date());

// // Add the new record
// axios.post(`http://127.0.0.1:8000/api/cases`, this.editedItem)
//   .then(response => {                                         
//     // Successfully saved
//     this.cases.push(response.data); // Add the new violation to the list
//     Swal.fire('Success!', 'New violation record saved successfully!', 'success')
//       .then(() => {
//         // Close the dialog after showing the success message
//         this.closeDialog();
//       });
//   })
//   .catch(error => {
//     // Handle errors
//     console.error('Error saving new record:', error.response ? error.response.data : error.message);
//     Swal.fire('Error', 'Failed to save new record. Please try again.', 'error');
//   });

// Method to create a new record
// createRecord() {
//   const dataToSend = {
//     student_id: this.editedItem.student_id,
//     case_title: this.editedItem.case_title,
//     case_description: this.editedItem.case_description,
//     case_sanction: this.editedItem.case_sanction,
//     case_status: 0
//   };

//   axios.post('http://your-api-url/cases', dataToSend)
//     .then(response => {
//       this.cases.push(response.data.case);
//       this.closeDialog();
//       Swal.fire('Saved!', 'Record saved successfully!', 'success');
//     })
//     .catch(error => {
//       console.error('Error saving new record:', error);
//     });
// },

clearCase(caseId) {
    this.viewingRecords = false;  // Close the dialog after action
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
        console.log(caseId);
        axios
          .post(`http://127.0.0.1:8000/api/cases/arch`, null, { params: { cases_id: caseId } }) // Use query parameters
          .then(response => {
            this.selectedStudentViolations = this.selectedStudentViolations.filter(record => record.cases_id !== caseId);
            Swal.fire({
              title: 'Archived',
              text: 'Record Archived Successfully!',
              icon: 'success',
              showConfirmButton: false,
              timer: 3000,
            });
          })
          .catch(error => {
            console.error('Error archiving record:', error.response ? error.response.data : error.message);
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
          text: 'Archiving record was not archived',
          icon: 'info',
          showConfirmButton: false,
          timer: 3000,
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

    navigateToCleared() {
      this.$router.push('/violationcleared');
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


<style scoped>
  .v-card-title {
    background-color: #2F3F64;
    color: white;
    padding: 16px;
    border-radius: 4px 4px 0 0;
    text-align: center;
  }
  .v-divider {
    margin: 8px 0;
  }
  .font-weight-bold {
    font-weight: bold;
  }
  .list-item {
    background-color: #f5f5f5; /* Grey background */
    border-radius: 4px;
    transition: background-color 0.3s ease;
  }
  .list-item:hover {
    background-color: #e3f2fd; /* Light blue background on hover */
  }
</style>
