function compareFn(a, b) {
  // Convert the latest_status_end fields to Date objects
  const dateA = new Date(a[1].split('/').reverse().join('-'));
  const dateB = new Date(b[1].split('/').reverse().join('-'));

  // Compare the dates
  if (dateA < dateB) {
    return -1;
  } else if (dateA > dateB) {
    return 1;
  } else {
    return 0;
  }
}

const words = ['lorem', 'dolor', 'default'];

// Fetch data from the API
fetch('https://operations-api.access-ci.org/wh2/cider/v1/access-allocated/')
  .then(response => response.json())
  .then(data => {
    console.log(data);
    // Extract the fields from the data
    const projects = data.results.map(project => ({
      resource_descriptive_name: project.resource_descriptive_name,
      latest_status_begin: project.latest_status_begin,
      latest_status_end: project.latest_status_end
    }));

    // Create an array of timesheet data
    const timesheetData = projects
      .filter(project => project.latest_status_begin && project.latest_status_end)
      .map(project => {
        // Calculate the time difference between the end date and current date
        const endDate = new Date(project.latest_status_end);
        const currentDate = new Date();
        const timeDiff = endDate.getTime() - currentDate.getTime();
        const diffDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Convert to days

        // Choose an element from the words array based on the time difference
        let word;
        if (diffDays <= 365) {
          word = 'default';
        } else if (diffDays <= 730) {
          word = 'dolor';
        } else {
          word = 'lorem';
        }

        return [
          project.latest_status_begin.slice(5, 7) + '/' + project.latest_status_begin.slice(0, 4),
          project.latest_status_end.slice(5, 7) + '/' + project.latest_status_end.slice(0, 4),
          project.resource_descriptive_name,
          word
        ];
      });

    timesheetData.sort(compareFn);

    // Initialize the timesheet
    new Timesheet('timesheet', 2012, 2050, timesheetData);
    console.log(timesheetData)
  });
