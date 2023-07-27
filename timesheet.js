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
    const randomWord = words[Math.floor(Math.random() * words.length)]
    return[
    project.latest_status_begin.slice(5, 7) + '/' + project.latest_status_begin.slice(0, 4),
    project.latest_status_end.slice(5, 7) + '/' + project.latest_status_end.slice(0, 4),
    project.resource_descriptive_name,randomWord
  ]
  
});
    timesheetData.sort(compareFn);

    // Initialize the timesheet
    new Timesheet('timesheet', 2012, 2050, timesheetData);
    console.log(timesheetData)
  });
