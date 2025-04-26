import React from 'react';

function PatientSummary({ summary }) {
  return (
    <div className="summary">
      {/* <h3>Patient Summary:</h3> */}
      <div dangerouslySetInnerHTML={{ __html: summary.replace(/\n/g, '<br>') }} />
    </div>
  );
}

export default PatientSummary;