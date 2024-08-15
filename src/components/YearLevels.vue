<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="violationsPerYear"
      class="violation-records-table"
    >
      <template v-slot:item="{ item }">
        <tr>
          <td>{{ item.grade_year }}</td>
          <td>{{ item.violations }}</td>
        </tr>
      </template>
    </v-data-table>
    <div class="total">Overall Total: {{ totalViolations }}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      violationsPerYear: [
        { grade_year: 'Elementary', violations: 10 },
        { grade_year: 'Middle School', violations: 15 },
        { grade_year: 'High School', violations: 20 }
      ],
      search: '',
      headers: [
        { title: 'Grade Year', key: 'grade_year' },
        { title: 'Violations', key: 'violations' }
      ]
    };
  },
  computed: {
    filteredViolations() {
      return this.violationsPerYear.filter(record => {
        const searchLower = this.search.toLowerCase();
        return (
          record.grade_year.toLowerCase().includes(searchLower) ||
          record.violations.toString().toLowerCase().includes(searchLower)
        );
      });
    },
    totalViolations() {
      return this.violationsPerYear.reduce((total, record) => total + record.violations, 0);
    }
  }
};
</script>

<style scoped>
.violation-records-table {
  max-height: 150vh;
}
.total {
  margin-top: 1rem;
  font-weight: bold;
}
</style>
