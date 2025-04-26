import React, { useState } from 'react';
import PatientSummary from './PatientSummary';

function PatientForm() {
  const [formData, setFormData] = useState({
    // Patient Information
    name: '',
    dob: '',
    gender: 'Male',
    phone: '',
    email: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    // Medical History
    chronicDiseases: 'No',
    chronicDiseasesDetails: '',
    surgeries: 'No',
    surgeriesDetails: '',
    allergies: 'No',
    allergiesDetails: '',
    medications: 'No',
    medicationsDetails: '',
    skinConditions: 'No',
    skinConditionsDetails: '',
    // Current Routine
    dailySkincareProducts: '',
    exfoliationFrequency: '',
    prescriptionTreatments: 'No',
    prescriptionTreatmentsDetails: '',
    wearSunscreen: 'No',
    // Family History
    familySkinConditions: 'No',
    familySkinConditionsDetails: '',
    familyCancerHistory: 'No',
    familyCancerHistoryDetails: '',
    // Current Skin Issues
    primarySkinIssue: '',
    issueDuration: '',
    issueProgress: 'Staying the same',
    treatedBefore: 'No',
    treatedBeforeDetails: '',
    painIrritation: 'No',
    // Additional Information
    otherConditions: '',
    additionalNotes: ''
  });
  const [patientSummary, setPatientSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const backendUrl = process.env.NODE_ENV === 'production'
        ? '/api/generate-summary'
        : 'http://localhost:5002/api/generate-summary';
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!response.ok) throw new Error(`Server responded with ${response.status}`);
      const result = await response.json();
      setPatientSummary(result.text);
    } catch (err) {
      console.error(err);
      setError(`Error submitting form: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-2xl mt-8">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6">Dermatology Patient Intake Form</h2>

      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Patient Information */}
        <section className="space-y-4">
          <h3 className="text-2xl font-semibold text-gray-700">Patient Information</h3>
          <div>
            <label className="block text-gray-600 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div className="flex space-x-4">
            <div className="w-1/2">
              <label className="block text-gray-600 mb-1">Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                required
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div className="w-1/2">
              <label className="block text-gray-600 mb-1">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-400"
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Emergency Contact Name</label>
            <input
              type="text"
              name="emergencyContactName"
              value={formData.emergencyContactName}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Emergency Contact Phone</label>
            <input
              type="tel"
              name="emergencyContactPhone"
              value={formData.emergencyContactPhone}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-400"
            />
          </div>
        </section>

        {/* Medical History */}
        <section className="space-y-4">
          <h3 className="text-2xl font-semibold text-gray-700">1. Medical History</h3>
          {['chronicDiseases', 'surgeries', 'allergies', 'medications', 'skinConditions'].map((field, idx) => (
            <div key={idx} className="space-y-2">
              <p className="text-gray-600 capitalize">
                {field.replace(/([A-Z])/g, ' $1')}?
              </p>
              <div className="flex space-x-4">
                <label className="flex items-center space-x-1">
                  <input
                    type="radio"
                    name={field}
                    value="Yes"
                    checked={formData[field] === 'Yes'}
                    onChange={handleChange}
                    className="form-radio"
                  />
                  <span>Yes</span>
                </label>
                <label className="flex items-center space-x-1">
                  <input
                    type="radio"
                    name={field}
                    value="No"
                    checked={formData[field] === 'No'}
                    onChange={handleChange}
                    className="form-radio"
                  />
                  <span>No</span>
                </label>
              </div>
              <textarea
                name={`${field}Details`}
                value={formData[`${field}Details`]}
                onChange={handleChange}
                placeholder="If yes, please specify"
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 h-24"
              />
            </div>
          ))}
        </section>

        {/* Current Routine */}
        <section className="space-y-4">
          <h3 className="text-2xl font-semibold text-gray-700">2. Current Routine</h3>
          <div>
            <label className="block text-gray-600 mb-1">Daily Skincare Products</label>
            <textarea
              name="dailySkincareProducts"
              value={formData.dailySkincareProducts}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 h-24"
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Exfoliation Frequency</label>
            <input
              type="text"
              name="exfoliationFrequency"
              value={formData.exfoliationFrequency}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div className="space-y-2">
            <p className="text-gray-600">Prescription Treatments?</p>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-1">
                <input
                  type="radio"
                  name="prescriptionTreatments"
                  value="Yes"
                  checked={formData.prescriptionTreatments === 'Yes'}
                  onChange={handleChange}
                  className="form-radio"
                />
                <span>Yes</span>
              </label>
              <label className="flex items-center space-x-1">
                <input
                  type="radio"
                  name="prescriptionTreatments"
                  value="No"
                  checked={formData.prescriptionTreatments === 'No'}
                  onChange={handleChange}
                  className="form-radio"
                />
                <span>No</span>
              </label>
            </div>
            <textarea
              name="prescriptionTreatmentsDetails"
              value={formData.prescriptionTreatmentsDetails}
              onChange={handleChange}
              placeholder="If yes, please list them"
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 h-24"
            />
          </div>
          <div className="space-y-2">
            <p className="text-gray-600">Do you wear sunscreen daily?</p>
            <div className="flex space-x-4">
              {['Yes','No'].map(opt => (
                <label key={opt} className="flex items-center space-x-1">
                  <input
                    type="radio"
                    name="wearSunscreen"
                    value={opt}
                    checked={formData.wearSunscreen === opt}
                    onChange={handleChange}
                    className="form-radio"
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>
        </section>

        {/* Family History */}
        <section className="space-y-4">
          <h3 className="text-2xl font-semibold text-gray-700">3. Family History</h3>
          {['familySkinConditions','familyCancerHistory'].map(field => (
            <div key={field} className="space-y-2">
              <p className="text-gray-600">
                {field.replace(/([A-Z])/g,' $1')}?
              </p>
              <div className="flex space-x-4">
                <label className="flex items-center space-x-1">
                  <input
                    type="radio"
                    name={field}
                    value="Yes"
                    checked={formData[field] === 'Yes'}
                    onChange={handleChange}
                    className="form-radio"
                  />
                  <span>Yes</span>
                </label>
                <label className="flex items-center space-x-1">
                  <input
                    type="radio"
                    name={field}
                    value="No"
                    checked={formData[field] === 'No'}
                    onChange={handleChange}
                    className="form-radio"
                  />
                  <span>No</span>
                </label>
              </div>
              <textarea
                name={`${field}Details`}
                value={formData[`${field}Details`]}
                onChange={handleChange}
                placeholder="If yes, please specify"
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 h-24"
              />
            </div>
          ))}
        </section>

        {/* Current Skin Issues */}
        <section className="space-y-4">
          <h3 className="text-2xl font-semibold text-gray-700">4. Current Skin Issues</h3>
          <div>
            <label className="block text-gray-600 mb-1">Primary Skin Issue</label>
            <textarea
              name="primarySkinIssue"
              value={formData.primarySkinIssue}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 h-24"
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Issue Duration</label>
            <input
              type="text"
              name="issueDuration"
              value={formData.issueDuration}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div className="space-y-2">
            <p className="text-gray-600">Progress</p>
            <div className="flex space-x-4">
              {['Getting worse','Staying the same','Improving'].map(opt => (
                <label key={opt} className="flex items-center space-x-1">
                  <input
                    type="radio"
                    name="issueProgress"
                    value={opt}
                    checked={formData.issueProgress === opt}
                    onChange={handleChange}
                    className="form-radio"
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-gray-600">Treated Before?</p>
            <div className="flex space-x-4">
              {['Yes','No'].map(opt => (
                <label key={opt} className="flex items-center space-x-1">
                  <input
                    type="radio"
                    name="treatedBefore"
                    value={opt}
                    checked={formData.treatedBefore === opt}
                    onChange={handleChange}
                    className="form-radio"
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            <textarea
              name="treatedBeforeDetails"
              value={formData.treatedBeforeDetails}
              onChange={handleChange}
              placeholder="If yes, please describe"
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 h-24"
            />
          </div>
          <div className="space-y-2">
            <p className="text-gray-600">Pain/Irritation?</p>
            <div className="flex space-x-4">
              {['Yes','No'].map(opt => (
                <label key={opt} className="flex items-center space-x-1">
                  <input
                    type="radio"
                    name="painIrritation"
                    value={opt}
                    checked={formData.painIrritation === opt}
                    onChange={handleChange}
                    className="form-radio"
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>
        </section>

        {/* Additional Information */}
        <section className="space-y-4">
          <h3 className="text-2xl font-semibold text-gray-700">5. Additional Information</h3>
          <div>
            <label className="block text-gray-600 mb-1">Other Health Conditions</label>
            <textarea
              name="otherConditions"
              value={formData.otherConditions}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 h-24"
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Additional Notes</label>
            <textarea
              name="additionalNotes"
              value={formData.additionalNotes}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 h-24"
            />
          </div>
        </section>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 text-lg font-semibold text-white bg-indigo-600 rounded-2xl hover:bg-indigo-700 disabled:opacity-50 transition"
          >
            {isLoading ? 'Generating Summary...' : 'Submit Form'}
          </button>
        </div>
      </form>

      {patientSummary && <PatientSummary summary={patientSummary} />}
    </div>
  );
}

export default PatientForm;